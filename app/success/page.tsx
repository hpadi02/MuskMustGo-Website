"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderStatus, setOrderStatus] = useState<"processing" | "success" | "error">("processing")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const { items, clearCart } = useCart()

  useEffect(() => {
    if (!sessionId) {
      setOrderStatus("error")
      return
    }

    const processOrder = async () => {
      try {
        console.log("=== PROCESSING ORDER ON SUCCESS PAGE ===")
        console.log("Session ID:", sessionId)
        console.log("Cart items:", items)

        // Get session details from Stripe
        const sessionResponse = await fetch(`/api/stripe/session/${sessionId}`)
        if (!sessionResponse.ok) {
          throw new Error("Failed to fetch session details")
        }

        const sessionData = await sessionResponse.json()
        console.log("Session data:", sessionData)

        // Prepare order data with emoji customizations
        const orderData = {
          sessionId,
          paymentIntentId: sessionData.payment_intent,
          customerEmail: sessionData.customer_details?.email,
          customerName: sessionData.customer_details?.name,
          shippingAddress: sessionData.shipping_details?.address,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            stripeId: item.stripeId,
            productId: item.productId,
            // ✅ INCLUDE EMOJI CUSTOMIZATIONS
            customOptions: item.customOptions,
            customId: item.customId,
            // ✅ EXTRACT EMOJI DETAILS FOR ED
            ...(item.customOptions && {
              teslaEmoji: item.customOptions.tesla?.name,
              teslaEmojiPath: item.customOptions.tesla?.path,
              elonEmoji: item.customOptions.elon?.name,
              elonEmojiPath: item.customOptions.elon?.path,
            }),
          })),
          totalAmount: sessionData.amount_total / 100, // Convert from cents
          currency: sessionData.currency,
          timestamp: new Date().toISOString(),
        }

        console.log("=== ORDER DATA BEING SENT TO ED ===")
        console.log("Full order data:", JSON.stringify(orderData, null, 2))

        // Send order to Ed's backend
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json()
          console.error("Order API error:", errorData)
          throw new Error(`Order processing failed: ${errorData.error}`)
        }

        const orderResult = await orderResponse.json()
        console.log("Order sent to Ed successfully:", orderResult)

        setOrderDetails(orderData)
        setOrderStatus("success")

        // Clear cart after successful order
        clearCart()
      } catch (error) {
        console.error("Order processing error:", error)
        setOrderStatus("error")
      }
    }

    processOrder()
  }, [sessionId, items, clearCart])

  if (orderStatus === "processing") {
    return (
      <div className="bg-dark-400 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Processing your order...</h2>
          <p className="text-white/70 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    )
  }

  if (orderStatus === "error") {
    return (
      <div className="bg-dark-400 text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Processing Error</h2>
          <p className="text-white/70 mb-6">
            There was an issue processing your order. Please contact support if you were charged.
          </p>
          <Link href="/contact">
            <Button className="bg-red-600 hover:bg-red-700">Contact Support</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-green-500 mb-6">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-white/70 mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {orderDetails && (
            <div className="bg-dark-300 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-medium mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-white/60">Order ID:</span> {orderDetails.sessionId}
                </p>
                {orderDetails.customerEmail && (
                  <p>
                    <span className="text-white/60">Email:</span> {orderDetails.customerEmail}
                  </p>
                )}
                <p>
                  <span className="text-white/60">Total:</span> ${orderDetails.totalAmount?.toFixed(2)}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Items Ordered:</h4>
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="bg-dark-400 rounded p-3 mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-white/60">Quantity: {item.quantity}</p>
                        {/* ✅ SHOW EMOJI CUSTOMIZATIONS */}
                        {item.teslaEmoji && item.elonEmoji && (
                          <div className="mt-2 text-sm">
                            <p className="text-green-400">✅ Custom Emoji Selection:</p>
                            <p className="text-white/70">Tesla: {item.teslaEmoji}</p>
                            <p className="text-white/70">Elon: {item.elonEmoji}</p>
                          </div>
                        )}
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-white/70">
              You will receive an email confirmation shortly. Your order will be processed and shipped within 3-5
              business days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop/all">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-dark-400 text-white min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
