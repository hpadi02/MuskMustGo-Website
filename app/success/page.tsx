"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowLeft, AlertCircle } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  customOptions?: any
  stripeId?: string
  productId?: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCart()

  useEffect(() => {
    const processOrder = async () => {
      try {
        if (!sessionId) {
          // Handle non-Stripe orders (like demo/fallback)
          const lastOrder = localStorage.getItem("lastOrder")
          if (lastOrder) {
            setOrderDetails(JSON.parse(lastOrder))
          }
          setLoading(false)
          return
        }

        console.log("=== PROCESSING STRIPE SUCCESS ===")
        console.log("Session ID:", sessionId)

        // Get session details from Stripe
        const sessionResponse = await fetch(`/api/stripe/session/${sessionId}`)
        const sessionData = await sessionResponse.json()

        console.log("Session data:", sessionData)

        if (!sessionData.success) {
          throw new Error(sessionData.error || "Failed to retrieve session")
        }

        const session = sessionData.session
        const paymentIntentId = session.payment_intent

        console.log("Payment Intent ID:", paymentIntentId)

        // Get cart items from localStorage (they should still be there)
        const cartItems = JSON.parse(localStorage.getItem("cart-storage") || '{"state":{"items":[]}}')
        const items = cartItems.state?.items || []

        console.log("Cart items for order:", items)

        // Prepare order data for Ed's backend
        const orderData = {
          customer_id: session.customer_details?.email || "unknown@example.com",
          payment_id: paymentIntentId,
          products: items.map((item: OrderItem) => {
            const product: any = {
              product_id: item.productId || item.id,
              quantity: item.quantity,
            }

            // ADD EMOJI ATTRIBUTES FOR CUSTOMIZED PRODUCTS
            if (item.customOptions) {
              product.attributes = []

              // Handle emoji customizations
              if (item.customOptions.tesla && item.customOptions.elon) {
                // Extract filename without extension for emoji_good (Tesla)
                const teslaEmojiName =
                  item.customOptions.tesla.name ||
                  item.customOptions.tesla.path?.split("/").pop()?.replace(".png", "") ||
                  "unknown"

                // Extract filename without extension for emoji_bad (Elon)
                const elonEmojiName =
                  item.customOptions.elon.name ||
                  item.customOptions.elon.path?.split("/").pop()?.replace(".png", "") ||
                  "unknown"

                product.attributes.push(
                  { name: "emoji_good", value: teslaEmojiName },
                  { name: "emoji_bad", value: elonEmojiName },
                )

                console.log(`Added emoji attributes for ${item.name}:`, {
                  emoji_good: teslaEmojiName,
                  emoji_bad: elonEmojiName,
                })
              }
            }

            return product
          }),
          total_cost: session.amount_total / 100, // Convert from cents
        }

        console.log("=== SENDING ORDER TO ED'S BACKEND ===")
        console.log("Order data:", JSON.stringify(orderData, null, 2))

        // Send order to Ed's backend
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        const orderResult = await orderResponse.json()
        console.log("Ed's backend response:", orderResult)

        if (!orderResponse.ok) {
          throw new Error(orderResult.error || "Failed to process order")
        }

        // Clear cart after successful order
        clearCart()

        // Set order details for display
        setOrderDetails({
          id: orderResult.customer_id || sessionId,
          email: session.customer_details?.email,
          total: session.amount_total / 100,
          items: items,
          payment_id: paymentIntentId,
          backend_response: orderResult,
        })
      } catch (err) {
        console.error("Order processing error:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")

        // Redirect to contact page with error details
        const errorMessage = encodeURIComponent(err instanceof Error ? err.message : "Unknown error occurred")
        window.location.href = `/contact?error=${errorMessage}`
      } finally {
        setLoading(false)
      }
    }

    processOrder()
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Order Processing Error</h1>
          <p className="text-white/70 mb-8">{error}</p>
          <Link href="/contact">
            <Button className="bg-red-600 hover:bg-red-700">Contact Support</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Order Confirmed!</h1>

          <p className="text-xl text-white/70 mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {orderDetails && (
            <div className="bg-dark-300 p-8 rounded-lg text-left mb-8">
              <div className="flex items-center mb-6">
                <Package className="h-6 w-6 text-red-500 mr-3" />
                <h2 className="text-xl font-medium">Order Details</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Order ID:</span>
                  <span className="font-mono">{orderDetails.id}</span>
                </div>

                {orderDetails.email && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Email:</span>
                    <span>{orderDetails.email}</span>
                  </div>
                )}

                {orderDetails.payment_id && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Payment ID:</span>
                    <span className="font-mono text-xs">{orderDetails.payment_id}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium text-lg pt-4 border-t border-white/20">
                  <span>Total:</span>
                  <span>${orderDetails.total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Show items with emoji customizations */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <h3 className="font-medium mb-4">Items Ordered:</h3>
                  <div className="space-y-3">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                          {/* Show emoji selections */}
                          {item.customOptions?.tesla && item.customOptions?.elon && (
                            <div className="text-white/60 text-xs mt-1">
                              <p>Tesla: {item.customOptions.tesla.name}</p>
                              <p>Elon: {item.customOptions.elon.name}</p>
                            </div>
                          )}
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-white/60">You'll receive an email confirmation shortly with tracking information.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop/all">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Continue Shopping
                </Button>
              </Link>

              <Link href="/">
                <Button className="bg-white hover:bg-white/90 text-black">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
