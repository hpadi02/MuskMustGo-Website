"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Clear the cart immediately when success page loads
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
      localStorage.removeItem("checkoutId")

      // Also clear any cart state in session storage
      sessionStorage.removeItem("cart")
      sessionStorage.removeItem("cartItems")
    }

    if (sessionId) {
      processOrder(sessionId)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const processOrder = async (sessionId: string) => {
    try {
      const response = await fetch("/api/manual-order-processing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()
      if (result.success) {
        setOrderData(result.orderData)
      }
    } catch (error) {
      console.error("Error processing order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Clean Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-red-500">Musk</span>
              <span className="text-white">MustGo</span>
            </Link>

            <div className="flex items-center space-x-8">
              <Link href="/shop" className="text-white hover:text-red-500 transition-colors">
                SHOP
              </Link>
              <div className="relative">
                <Link href="/community" className="text-white hover:text-red-500 transition-colors">
                  COMMUNITY
                </Link>
              </div>
              <Link href="/about" className="text-white hover:text-red-500 transition-colors">
                ABOUT
              </Link>
              <Link href="/contact" className="text-white hover:text-red-500 transition-colors">
                CONTACT
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ShoppingBag className="h-5 w-5 text-white" />
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                <Link href="/shop">SHOP NOW</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Success Icon */}
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />

          {/* Main Heading */}
          <h1 className="text-5xl font-bold mb-6">Order Confirmed!</h1>
          <p className="text-xl text-gray-400 mb-16">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {/* Order Details */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Order Details</h2>
              <Package className="h-6 w-6 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
              <div>
                <p className="text-gray-400 mb-2">Email:</p>
                <p className="text-white text-lg">{orderData?.customer?.email || "Processing..."}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Total:</p>
                <p className="text-white text-lg font-bold">${orderData?.total || "0.00"}</p>
              </div>
            </div>
          </div>

          {/* Email Confirmation Message */}
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            You'll receive an email confirmation shortly with your order details and tracking information.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent px-8 py-3"
            >
              <Link href="/account/orders">View Orders</Link>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              <Link href="/shop">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
