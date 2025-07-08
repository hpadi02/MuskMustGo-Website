"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2, Package } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderStatus, setOrderStatus] = useState<"processing" | "success" | "error">("processing")
  const [orderData, setOrderData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (sessionId) {
      processOrder(sessionId)
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

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Order processed successfully:", result)
        setOrderData(result.orderData)
        setOrderStatus("success")
      } else {
        const errorResult = await response.json()
        console.error("❌ Order processing failed:", errorResult)
        setError(errorResult.error || "Order processing failed")
        setOrderStatus("error")
      }
    } catch (error) {
      console.error("❌ Error processing order:", error)
      setError("Network error occurred")
      setOrderStatus("error")
    }
  }

  const retryProcessing = () => {
    if (sessionId) {
      setOrderStatus("processing")
      setError("")
      processOrder(sessionId)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="text-red-500 text-xl font-bold">Musk</span>
          <span className="text-white text-xl font-bold">MustGo</span>
        </div>
        <div className="flex items-center space-x-8">
          <Link href="/shop" className="text-white hover:text-gray-300">
            SHOP
          </Link>
          <div className="relative">
            <Link href="/community" className="text-white hover:text-gray-300">
              COMMUNITY
            </Link>
          </div>
          <Link href="/about" className="text-white hover:text-gray-300">
            ABOUT
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300">
            CONTACT
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {orderStatus === "processing" && (
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto mb-8" />
            <h1 className="text-4xl font-bold mb-4">Processing Your Order</h1>
            <p className="text-gray-400 text-lg">Please wait while we process your payment and prepare your order...</p>
          </div>
        )}

        {orderStatus === "success" && (
          <div className="text-center max-w-4xl">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-8" />
            <h1 className="text-5xl font-bold mb-6">Order Confirmed!</h1>
            <p className="text-gray-400 text-lg mb-12">
              Thank you for your purchase. Your order has been successfully processed.
            </p>

            {/* Order Details */}
            <div className="bg-gray-900 rounded-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Order Details</h2>
                <Package className="h-8 w-8 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                  <p className="text-gray-400 mb-2">Email:</p>
                  <p className="text-white text-lg">{orderData?.customer?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Products:</p>
                  <p className="text-white text-lg">{orderData?.products?.length || 0} item(s)</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Total:</p>
                  <p className="text-white text-lg">${orderData?.total || "0.00"}</p>
                </div>
              </div>

              {orderData?.products?.some((p: any) => p.attributes) && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-medium">✅ Custom emoji choices included!</p>
                </div>
              )}

              {sessionId && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">Session ID: {sessionId}</p>
                </div>
              )}
            </div>

            <p className="text-gray-400 mb-8">
              You'll receive an email confirmation shortly with your order details and tracking information.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800 px-8 py-3"
              >
                <Link href="/account/orders">View Orders</Link>
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                <Link href="/">Continue Shopping →</Link>
              </Button>
            </div>
          </div>
        )}

        {orderStatus === "error" && (
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-8" />
            <h1 className="text-4xl font-bold mb-4">Processing Issue</h1>
            <p className="text-gray-400 text-lg mb-6">
              There was an issue processing your order. Your payment was successful.
            </p>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {sessionId && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm">Session ID: {sessionId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={retryProcessing}
                variant="outline"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                Retry Processing
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
