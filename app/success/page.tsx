"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"

interface OrderData {
  sessionId: string
  customer: {
    email: string
    name: string
  }
  products: Array<{
    name: string
    quantity: number
    price: string
    attributes?: Array<{
      name: string
      value: string
    }>
  }>
  total: string
  currency: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      processOrder(sessionId)
    } else {
      setError("No session ID found")
      setLoading(false)
    }
  }, [sessionId])

  const processOrder = async (sessionId: string) => {
    try {
      console.log("🔄 Processing order for session:", sessionId)

      const response = await fetch("/api/manual-order-processing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()

      if (result.success && result.orderData) {
        const transformedData: OrderData = {
          sessionId: result.orderData.sessionId || sessionId,
          customer: {
            email: result.orderData.customer?.email || "Unknown",
            name:
              `${result.orderData.customer?.firstname || ""} ${result.orderData.customer?.lastname || ""}`.trim() ||
              "Unknown Customer",
          },
          products:
            result.orderData.products?.map((product: any) => ({
              name: product.name || "Unknown Product",
              quantity: product.quantity || 1,
              price: product.price || "0.00",
              attributes: product.attributes || [],
            })) || [],
          total: result.orderData.total || "0.00",
          currency: result.orderData.currency || "usd",
        }

        setOrderData(transformedData)
        console.log("✅ Order processed successfully:", transformedData)
      } else {
        console.error("❌ Order processing failed:", result)
        setError(result.error || "Failed to process order")
      }
    } catch (error) {
      console.error("❌ Error processing order:", error)
      setError("Failed to process order")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Clean Navbar */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-red-500">Musk</span>
                <span className="text-white">MustGo</span>
              </Link>
              <div className="flex items-center space-x-8">
                <Link href="/shop" className="hover:text-red-500 transition-colors">
                  SHOP
                </Link>
                <Link href="/community" className="hover:text-red-500 transition-colors">
                  COMMUNITY
                </Link>
                <Link href="/about" className="hover:text-red-500 transition-colors">
                  ABOUT
                </Link>
                <Link href="/contact" className="hover:text-red-500 transition-colors">
                  CONTACT
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-8"></div>
            <h1 className="text-4xl font-bold mb-4">Processing Your Order...</h1>
            <p className="text-gray-400">Please wait while we confirm your purchase.</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Clean Navbar */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-red-500">Musk</span>
                <span className="text-white">MustGo</span>
              </Link>
              <div className="flex items-center space-x-8">
                <Link href="/shop" className="hover:text-red-500 transition-colors">
                  SHOP
                </Link>
                <Link href="/community" className="hover:text-red-500 transition-colors">
                  COMMUNITY
                </Link>
                <Link href="/about" className="hover:text-red-500 transition-colors">
                  ABOUT
                </Link>
                <Link href="/contact" className="hover:text-red-500 transition-colors">
                  CONTACT
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-red-500 text-6xl mb-8">⚠️</div>
            <h1 className="text-4xl font-bold mb-4">Order Processing Error</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  Back to Cart
                </Button>
              </Link>
              <Link href="/shop">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Clean Navbar - No Duplication */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-red-500">Musk</span>
              <span className="text-white">MustGo</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/shop" className="hover:text-red-500 transition-colors">
                SHOP
              </Link>
              <Link href="/community" className="hover:text-red-500 transition-colors">
                COMMUNITY
              </Link>
              <Link href="/about" className="hover:text-red-500 transition-colors">
                ABOUT
              </Link>
              <Link href="/contact" className="hover:text-red-500 transition-colors">
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold mb-6">Order Confirmed!</h1>
          <p className="text-xl text-gray-400 mb-12">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {/* Order Details */}
          <div className="bg-gray-900 rounded-lg p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Package className="mr-3 h-6 w-6" />
                Order Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Email:</h3>
                <p className="text-white">{orderData?.customer.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Products:</h3>
                <p className="text-white">{orderData?.products.length} item(s)</p>
                {orderData?.products.map((product, index) => (
                  <div key={index} className="text-sm text-gray-400 mt-1">
                    {product.name} (x{product.quantity})
                    {product.attributes && product.attributes.length > 0 && (
                      <div className="ml-2 text-xs text-green-400">
                        {product.attributes.map((attr, attrIndex) => (
                          <div key={attrIndex}>
                            {attr.name === "emoji_good" && `✅ Tesla: ${attr.value}`}
                            {attr.name === "emoji_bad" && `❌ Elon: ${attr.value}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Total:</h3>
                <p className="text-white text-xl font-bold">
                  ${orderData?.total} {orderData?.currency?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-gray-400 mb-8">
            You'll receive an email confirmation shortly with your order details and tracking information.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/account/orders">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                View Orders
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
