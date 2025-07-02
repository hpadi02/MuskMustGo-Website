"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, CreditCard } from "lucide-react"
import CartClearer from "@/components/cart-clearer"

interface OrderResponse {
  customer_id: string
  order_number: string
  product_cost: number
  total_cost: number
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderData, setOrderData] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found")
      setLoading(false)
      return
    }

    const processOrder = async () => {
      try {
        console.log("🎉 Processing successful order with session ID:", sessionId)

        // Retrieve the Stripe session
        const sessionResponse = await fetch(`/api/stripe/session/${sessionId}`)
        if (!sessionResponse.ok) {
          throw new Error("Failed to retrieve session")
        }

        const session = await sessionResponse.json()
        console.log("📦 Retrieved Stripe session:", session)
        console.log("🎭 Session metadata:", session.metadata)

        // Extract customer information
        const customer = {
          firstname: session.customer_details?.name?.split(" ")[0] || "",
          lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
          email: session.customer_details?.email || "",
          addr1: session.customer_details?.address?.line1 || "",
          addr2: session.customer_details?.address?.line2 || "",
          city: session.customer_details?.address?.city || "",
          state_prov: session.customer_details?.address?.state || "",
          postal_code: session.customer_details?.address?.postal_code || "",
          country: session.customer_details?.address?.country || "US",
        }

        // ✅ Enhanced product processing with emoji attributes
        const products =
          session.line_items?.data.map((item: any, index: number) => {
            console.log(`📦 Processing line item ${index}:`, item)

            const baseProduct = {
              product_id: item.price.product,
              quantity: item.quantity || 1,
            }

            // ✅ Check for emoji customizations in metadata
            const teslaEmojiKey = `item_${index}_tesla_emoji`
            const elonEmojiKey = `item_${index}_elon_emoji`
            const variantKey = `item_${index}_variant`

            if (session.metadata?.[teslaEmojiKey] || session.metadata?.[elonEmojiKey]) {
              console.log(`🎭 Found emoji metadata for item ${index}`)

              try {
                const attributes = []

                // Extract Tesla emoji (positive)
                if (session.metadata[teslaEmojiKey]) {
                  const teslaEmoji = JSON.parse(session.metadata[teslaEmojiKey])
                  console.log(`🎭 Tesla emoji for item ${index}:`, teslaEmoji)

                  // Extract filename without .png extension
                  const teslaFilename = teslaEmoji.path
                    ? teslaEmoji.path.split("/").pop()?.replace(".png", "")
                    : teslaEmoji.name

                  if (teslaFilename) {
                    attributes.push({
                      name: "emoji_good",
                      value: teslaFilename,
                    })
                    console.log(`✅ Added Tesla emoji attribute: ${teslaFilename}`)
                  }
                }

                // Extract Elon emoji (negative)
                if (session.metadata[elonEmojiKey]) {
                  const elonEmoji = JSON.parse(session.metadata[elonEmojiKey])
                  console.log(`🎭 Elon emoji for item ${index}:`, elonEmoji)

                  // Extract filename without .png extension
                  const elonFilename = elonEmoji.path
                    ? elonEmoji.path.split("/").pop()?.replace(".png", "")
                    : elonEmoji.name

                  if (elonFilename) {
                    attributes.push({
                      name: "emoji_bad",
                      value: elonFilename,
                    })
                    console.log(`✅ Added Elon emoji attribute: ${elonFilename}`)
                  }
                }

                // Add attributes to product if we have any
                if (attributes.length > 0) {
                  console.log(`🎭 Final attributes for item ${index}:`, attributes)
                  return {
                    ...baseProduct,
                    attributes,
                  }
                }
              } catch (error) {
                console.error(`❌ Error parsing emoji metadata for item ${index}:`, error)
              }
            }

            return baseProduct
          }) || []

        // Prepare order data for backend
        const orderData = {
          customer,
          products,
          payment_id: session.payment_intent,
          shipping: 0,
          tax: 0,
        }

        console.log("📤 Sending order to backend:", orderData)

        // Send to Ed's backend
        const backendResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (!backendResponse.ok) {
          throw new Error(`Backend responded with ${backendResponse.status}`)
        }

        const result = await backendResponse.json()
        console.log("✅ Backend response:", result)

        setOrderData(result)
      } catch (error) {
        console.error("❌ Error processing order:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    processOrder()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-400 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-400 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Processing Error</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <Link href="/shop/all">
            <Button className="bg-red-600 hover:bg-red-700">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-400 text-white">
      <CartClearer />
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-white/70 text-lg">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>

          {/* ✅ Order Number Display */}
          {orderData?.order_number && (
            <div className="bg-dark-300 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-red-500 mr-2" />
                <h2 className="text-xl font-semibold">Order Details</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Order Number:</span>
                  <span className="font-mono text-lg font-bold text-red-400">{orderData.order_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Amount:</span>
                  <span className="font-semibold">${orderData.total_cost?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-dark-300 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              What's Next?
            </h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <span className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                <span>You'll receive a confirmation email shortly with your order details</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                <span>Your order will be processed and shipped within 1-2 business days</span>
              </li>
              <li className="flex items-start">
                <span className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                <span>You'll receive tracking information once your order ships</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/all">
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-3">Continue Shopping</Button>
            </Link>
            <Link href="/account/orders">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
              >
                View Orders
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 text-center text-white/60">
            <p className="mb-2">Need help with your order?</p>
            <Link href="/contact" className="text-red-400 hover:text-red-300 underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
