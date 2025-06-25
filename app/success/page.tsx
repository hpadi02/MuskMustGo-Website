"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderStatus, setOrderStatus] = useState<"processing" | "success" | "error">("processing")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const { clearCart } = useCart()

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

        // Clear cart immediately - don't wait for API calls
        clearCart()

        // Clear localStorage
        try {
          localStorage.removeItem("cart")
          localStorage.removeItem("cart-storage")
          console.log("✅ Cart cleared")
        } catch (e) {
          console.log("Note: Could not clear localStorage")
        }

        // Try to get session details, but don't fail if it doesn't work
        let sessionData = null
        try {
          console.log("Fetching session details...")
          const sessionResponse = await fetch(`/api/stripe/session/${sessionId}`)

          if (sessionResponse.ok) {
            sessionData = await sessionResponse.json()
            console.log("✅ Session data retrieved:", sessionData)
          } else {
            const errorData = await sessionResponse.json()
            console.error("❌ Session API error:", errorData)
            // Don't fail - just proceed without session data
          }
        } catch (sessionError) {
          console.error("❌ Session fetch failed:", sessionError)
          // Don't fail - just proceed without session data
        }

        // Always show success - payment was completed if we got here
        setOrderDetails({
          email: sessionData?.customer_details?.email || "Order confirmed",
          total: sessionData?.amount_total ? (sessionData.amount_total / 100).toFixed(2) : "Payment processed",
          sessionData,
        })
        setOrderStatus("success")

        // Background order processing (completely separate from success display)
        setTimeout(async () => {
          try {
            console.log("=== BACKGROUND ORDER PROCESSING ===")

            // Try to get cart items for backend
            let cartItems = []
            try {
              const cartStorage = localStorage.getItem("cart-storage")
              if (cartStorage) {
                const parsedCart = JSON.parse(cartStorage)
                cartItems = parsedCart.state?.items || []
              }
            } catch (e) {
              console.log("Could not retrieve cart items for backend")
            }

            if (sessionData && cartItems.length > 0) {
              const orderData = {
                customer: {
                  email: sessionData.customer_details?.email || "",
                  firstname: sessionData.customer_details?.name?.split(" ")[0] || "",
                  lastname: sessionData.customer_details?.name?.split(" ").slice(1).join(" ") || "",
                  addr1:
                    sessionData.shipping_details?.address?.line1 || sessionData.customer_details?.address?.line1 || "",
                  addr2:
                    sessionData.shipping_details?.address?.line2 || sessionData.customer_details?.address?.line2 || "",
                  city:
                    sessionData.shipping_details?.address?.city || sessionData.customer_details?.address?.city || "",
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
                payment_id: sessionData.payment_intent || sessionId,
                products: cartItems.map((item: any) => {
                  const product = {
                    product_id: item.stripeId || item.productId || item.id,
                    quantity: item.quantity || 1,
                  }

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

              console.log("Sending order to backend:", JSON.stringify(orderData, null, 2))

              const orderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
              })

              if (orderResponse.ok) {
                console.log("✅ Order sent to backend successfully")
              } else {
                console.error("❌ Backend order failed:", orderResponse.status)
              }
            } else {
              console.log("⚠️ Skipping backend order - missing session data or cart items")
            }
          } catch (backgroundError) {
            console.error("Background processing error:", backgroundError)
          }
        }, 1000) // Delay background processing
      } catch (criticalError) {
        console.error("Critical error:", criticalError)
        // Even if there's an error, show success since payment was processed
        setOrderDetails({
          email: "Order confirmed",
          total: "Payment processed",
        })
        setOrderStatus("success")
        clearCart()
      }
    }

    processOrder()
  }, [sessionId, clearCart])

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
                <span className="text-white/60">Email:</span> {orderDetails?.email || "Order confirmed"}
              </p>
              <p>
                <span className="text-white/60">Total:</span> ${orderDetails?.total || "Payment processed"}
              </p>
            </div>
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
