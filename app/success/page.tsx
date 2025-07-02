"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, CreditCard, AlertCircle } from "lucide-react"

interface OrderResponse {
  customer_id: string
  order_number: string
  product_cost: number
  total_cost: number
}

interface ProcessingState {
  loading: boolean
  success: boolean
  error: string | null
  orderData: OrderResponse | null
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [state, setState] = useState<ProcessingState>({
    loading: true,
    success: false,
    error: null,
    orderData: null,
  })

  useEffect(() => {
    if (!sessionId) {
      setState({
        loading: false,
        success: false,
        error: "No session ID provided",
        orderData: null,
      })
      return
    }

    processOrder()
  }, [sessionId])

  const processOrder = async () => {
    try {
      console.log("🎉 Processing successful order, session:", sessionId)

      // Fetch session data from our API
      const response = await fetch(`/api/stripe/session/${sessionId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.status}`)
      }

      const session = await response.json()
      console.log("📋 Session data received:", {
        id: session.id,
        payment_status: session.payment_status,
        metadata_keys: Object.keys(session.metadata || {}),
        line_items_count: session.line_items?.data?.length || 0,
      })

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

      console.log("👤 Customer data extracted:", customer.email)

      // ✅ Enhanced product processing with emoji attributes
      const products =
        session.line_items?.data?.map((item: any, index: number) => {
          const baseProduct = {
            product_id: item.price?.product || "unknown",
            quantity: item.quantity || 1,
          }

          console.log(`📦 Processing product ${index}:`, baseProduct.product_id)

          // Check for emoji metadata for this specific item
          const teslaEmojiKey = `item_${index}_tesla_emoji`
          const elonEmojiKey = `item_${index}_elon_emoji`
          const variantKey = `item_${index}_variant`

          if (session.metadata?.[teslaEmojiKey] && session.metadata?.[elonEmojiKey]) {
            try {
              console.log(`🎭 Found emoji metadata for item ${index}`)

              const teslaEmojiData = JSON.parse(session.metadata[teslaEmojiKey])
              const elonEmojiData = JSON.parse(session.metadata[elonEmojiKey])
              const variant = session.metadata[variantKey] || "magnet"

              console.log(`🎭 Emoji data for item ${index}:`, {
                tesla: teslaEmojiData.name,
                elon: elonEmojiData.name,
                variant,
              })

              // Extract filename from path (remove .png extension)
              const getTeslaEmojiName = (path: string) => {
                const filename = path.split("/").pop() || ""
                return filename.replace(".png", "")
              }

              const getElonEmojiName = (path: string) => {
                const filename = path.split("/").pop() || ""
                return filename.replace(".png", "")
              }

              const teslaEmojiName = getTeslaEmojiName(teslaEmojiData.path || teslaEmojiData.name)
              const elonEmojiName = getElonEmojiName(elonEmojiData.path || elonEmojiData.name)

              console.log(`✅ Formatted emoji names for item ${index}:`, {
                emoji_good: teslaEmojiName,
                emoji_bad: elonEmojiName,
              })

              return {
                ...baseProduct,
                attributes: [
                  { name: "emoji_good", value: teslaEmojiName },
                  { name: "emoji_bad", value: elonEmojiName },
                ],
              }
            } catch (error) {
              console.error(`❌ Error parsing emoji metadata for item ${index}:`, error)
              return baseProduct
            }
          }

          console.log(`📦 No emoji data for item ${index}, using base product`)
          return baseProduct
        }) || []

      console.log(
        "📋 Final products array:",
        products.map((p) => ({
          id: p.product_id,
          hasAttributes: !!p.attributes,
        })),
      )

      // Prepare order data for backend
      const orderData = {
        customer,
        products,
        payment_id: session.payment_intent?.id || session.id,
        shipping: 0,
        tax: 0,
      }

      console.log("📤 Sending order to backend:", {
        customer_email: orderData.customer.email,
        products_count: orderData.products.length,
        has_emoji_products: orderData.products.some((p) => p.attributes),
      })

      // Send to backend
      const backendResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text()
        throw new Error(`Backend error: ${backendResponse.status} - ${errorText}`)
      }

      const result: OrderResponse = await backendResponse.json()
      console.log("✅ Backend response received:", {
        order_number: result.order_number,
        customer_id: result.customer_id,
        total_cost: result.total_cost,
      })

      setState({
        loading: false,
        success: true,
        error: null,
        orderData: result,
      })
    } catch (error) {
      console.error("❌ Error processing order:", error)
      setState({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        orderData: null,
      })
    }
  }

  if (state.loading) {
    return (
      <div className="min-h-screen bg-dark-400 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Processing Your Order</h2>
          <p className="text-white/70">Please wait while we confirm your purchase...</p>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-dark-400 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Order Processing Error</h2>
          <p className="text-white/70 mb-6">{state.error}</p>
          <div className="space-y-3">
            <Button onClick={processOrder} className="w-full bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
            <Link href="/shop/all">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-400 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-white/80 mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {/* ✅ Order Number Display */}
          {state.orderData?.order_number && (
            <div className="bg-dark-300 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-xl font-semibold">Order Details</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Order Number:</span>
                  <span className="font-mono text-lg font-bold text-red-400">{state.orderData.order_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Amount:</span>
                  <span className="text-lg font-semibold">${state.orderData.total_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Customer ID:</span>
                  <span className="font-mono text-sm text-white/60">{state.orderData.customer_id}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-dark-300 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
              <CreditCard className="h-5 w-5 mr-2" />
              What's Next?
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <div className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-white/70">
                    You'll receive an order confirmation email with your order number shortly.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Processing & Shipping</p>
                  <p className="text-sm text-white/70">
                    Your order will be processed and shipped within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Tracking Information</p>
                  <p className="text-sm text-white/70">You'll receive tracking details once your order ships.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/all">
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-3">Continue Shopping</Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="outline" className="px-8 py-3 bg-transparent">
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
