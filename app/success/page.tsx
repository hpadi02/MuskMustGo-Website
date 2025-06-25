"use client"

import { useEffect, useState, useRef, Suspense } from "react"
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
  const { clearCart } = useCart()
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    if (!sessionId) {
      console.error("No session ID found")
      setOrderStatus("error")
      return
    }

    const processOrder = async () => {
      try {
        console.log("=== PROCESSING ORDER ===")
        console.log("Session ID:", sessionId)

        // Clear cart once
        clearCart()

        // Clear localStorage once
        try {
          localStorage.removeItem("cart")
          localStorage.removeItem("cart-storage")
          console.log("✅ Cart cleared")
        } catch (e) {
          console.log("Note: Could not clear localStorage")
        }

        // Try to get session details
        let sessionData = null
        try {
          console.log("Fetching session details from API...")
          const sessionResponse = await fetch(`/api/stripe/session/${sessionId}`)

          if (sessionResponse.ok) {
            sessionData = await sessionResponse.json()
            console.log("✅ Session data retrieved successfully:", sessionData)

            // Set order details with actual data
            setOrderDetails({
              email: sessionData.customer_details?.email || "No email provided",
              total: sessionData.amount_total ? (sessionData.amount_total / 100).toFixed(2) : "0.00",
              customerName: sessionData.customer_details?.name || null,
              paymentStatus: sessionData.payment_status || "unknown",
              sessionData,
            })
          } else {
            const errorData = await sessionResponse.json()
            console.error("❌ Session API error:", errorData)

            // Set fallback order details
            setOrderDetails({
              email: "Order confirmed",
              total: "Payment processed",
              customerName: null,
              paymentStatus: "completed",
              sessionData: null,
            })
          }
        } catch (sessionError) {
          console.error("❌ Session fetch failed:", sessionError)

          // Set fallback order details
          setOrderDetails({
            email: "Order confirmed",
            total: "Payment processed",
            customerName: null,
            paymentStatus: "completed",
            sessionData: null,
          })
        }

        setOrderStatus("success")

        // Background order processing
        setTimeout(async () => {
          try {
            console.log("=== BACKGROUND ORDER PROCESSING ===")

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
        }, 1000)
      } catch (criticalError) {
        console.error("Critical error:", criticalError)
        setOrderDetails({
          email: "Order confirmed",
          total: "Payment processed",
          customerName: null,
          paymentStatus: "completed",
          sessionData: null,
        })
        setOrderStatus("success")
      }
    }

    processOrder()
  }, [sessionId])

  if (orderStatus === "processing") {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Processing your order...</h2>
          <p className="text-white/70 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            <span className="text-red-500">Musk</span>MustGo
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/shop/all" className="text-white/80 hover:text-white">
              SHOP
            </Link>
            <Link href="/stories" className="text-white/80 hover:text-white">
              STORIES
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white">
              ABOUT
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white">
              CONTACT
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 border border-white/30 rounded"></div>
          <Link href="/shop/all">
            <Button className="bg-white text-black hover:bg-white/90 font-medium px-6">SHOP NOW</Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold mb-6">Order Confirmed!</h1>

          {/* Subtitle */}
          <p className="text-xl text-white/70 mb-16">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {/* Order Details Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <Package className="h-6 w-6 mr-3 text-white/70" />
              <h2 className="text-2xl font-semibold">Order Details</h2>
            </div>

            <div className="space-y-6 text-lg">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Email:</span>
                <span className="font-medium">{orderDetails?.email || "Processing..."}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total:</span>
                <span className="font-medium">${orderDetails?.total || "Processing..."}</span>
              </div>
            </div>
          </div>

          {/* Email Confirmation Text */}
          <p className="text-white/70 mb-12 text-lg leading-relaxed">
            You'll receive an email confirmation shortly with your order details and tracking information.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-base font-medium"
              >
                View Orders
              </Button>
            </Link>
            <Link href="/shop/all">
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-3 text-base font-medium">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
