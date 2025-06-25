"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderStatus, setOrderStatus] = useState<"processing" | "success" | "error">("processing")
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    if (!sessionId) {
      console.error("No session ID found")
      setOrderStatus("error")
      return
    }

    const processOrder = async () => {
      try {
        console.log("=== PROCESSING ORDER ===")
        console.log("Session ID:", sessionId)

        // Always show success for now - we'll handle backend processing separately
        setOrderDetails({
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
        })
        setOrderStatus("success")

        // Try to process order in background (don't let it fail the success page)
        try {
          // Get cart items from localStorage
          const cartStorage = localStorage.getItem("cart-storage")
          let cartItems = []

          if (cartStorage) {
            const parsedCart = JSON.parse(cartStorage)
            cartItems = parsedCart.state?.items || []
          }

          console.log("Cart items from localStorage:", cartItems)

          // Get session details from Stripe
          const sessionResponse = await fetch(`/api/stripe/session/${sessionId}`)
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json()
            console.log("Session data retrieved:", sessionData)

            // Prepare order data
            const orderData = {
              customer: {
                email: sessionData.customer_details?.email || "",
                firstname: sessionData.customer_details?.name?.split(" ")[0] || "",
                lastname: sessionData.customer_details?.name?.split(" ").slice(1).join(" ") || "",
                addr1:
                  sessionData.shipping_details?.address?.line1 || sessionData.customer_details?.address?.line1 || "",
                addr2:
                  sessionData.shipping_details?.address?.line2 || sessionData.customer_details?.address?.line2 || "",
                city: sessionData.shipping_details?.address?.city || sessionData.customer_details?.address?.city || "",
                state_prov:
                  sessionData.shipping_details?.address?.state || sessionData.customer_details?.address?.state || "",
                postal_code:
                  sessionData.shipping_details?.address?.postal_code ||
                  sessionData.customer_details?.address?.postal_code ||
                  "",
                country:
                  sessionData.shipping_details?.address?.country ||
                  sessionData.customer_details?.address?.country ||
                  "",
              },
              payment_id: sessionData.payment_intent,
              products: cartItems.map((item: any) => {
                const product = {
                  product_id: item.stripeId || item.productId || item.id,
                  quantity: item.quantity || 1,
                }

                // Add emoji attributes for customized products
                if (item.customOptions?.tesla && item.customOptions?.elon) {
                  const teslaEmojiName =
                    item.customOptions.tesla.path?.split("/").pop()?.replace(".png", "") ||
                    item.customOptions.tesla.name ||
                    "unknown"
                  const elonEmojiName =
                    item.customOptions.elon.path?.split("/").pop()?.replace(".png", "") ||
                    item.customOptions.elon.name ||
                    "unknown"

                  product.attributes = [
                    { name: "emoji_good", value: teslaEmojiName },
                    { name: "emoji_bad", value: elonEmojiName },
                  ]

                  console.log(`✅ Added emoji attributes:`, { emoji_good: teslaEmojiName, emoji_bad: elonEmojiName })
                }

                return product
              }),
              shipping: 0,
              tax: 0,
            }

            console.log("=== SENDING ORDER TO BACKEND ===")
            console.log("Order data:", JSON.stringify(orderData, null, 2))

            // Send to backend (don't let this fail the success page)
            const orderResponse = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            })

            if (orderResponse.ok) {
              const result = await orderResponse.json()
              console.log("✅ Order sent to backend successfully:", result)
            } else {
              console.error("❌ Backend order failed:", orderResponse.status)
            }

            // Update order details with more info
            setOrderDetails({
              ...orderDetails,
              sessionData,
              orderData,
              cartItems,
            })
          } else {
            console.error("Failed to fetch session details:", sessionResponse.status)
          }

          // Clear cart after processing
          localStorage.removeItem("cart-storage")
          console.log("✅ Cart cleared")
        } catch (backgroundError) {
          console.error("Background processing error (not critical):", backgroundError)
          // Don't fail the success page for background errors
        }
      } catch (criticalError) {
        console.error("Critical error:", criticalError)
        setOrderStatus("error")
      }
    }

    processOrder()
  }, [sessionId])

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
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          <div className="bg-dark-300 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-medium mb-4">Order Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-white/60">Session ID:</span> {orderDetails?.sessionId}
              </p>
              {orderDetails?.sessionData?.customer_details?.email && (
                <p>
                  <span className="text-white/60">Email:</span> {orderDetails.sessionData.customer_details.email}
                </p>
              )}
              {orderDetails?.sessionData?.amount_total && (
                <p>
                  <span className="text-white/60">Total:</span> $
                  {(orderDetails.sessionData.amount_total / 100).toFixed(2)}
                </p>
              )}
            </div>

            {orderDetails?.cartItems && orderDetails.cartItems.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Items Ordered:</h4>
                {orderDetails.cartItems.map((item: any, index: number) => (
                  <div key={index} className="bg-dark-400 rounded p-3 mb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-white/60">Quantity: {item.quantity}</p>
                      {item.customOptions?.tesla && item.customOptions?.elon && (
                        <div className="mt-2 text-sm">
                          <p className="text-green-400">✅ Custom Emoji Selection:</p>
                          <p className="text-white/70">Tesla: {item.customOptions.tesla.name}</p>
                          <p className="text-white/70">Elon: {item.customOptions.elon.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
