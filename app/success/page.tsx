"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
          <p>Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Clean Single Navbar */}
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />

          {/* Main Heading */}
          <h1 className="text-5xl font-bold mb-6">Order Confirmed!</h1>
          <p className="text-xl text-gray-400 mb-12">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {/* Order Details - Black with White Border */}
          <div className="bg-black border-2 border-white rounded-lg p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Email:</h3>
                <p className="text-white">{orderData?.customer?.email || "Processing..."}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Total:</h3>
                <p className="text-white text-xl font-bold">${orderData?.total || "0.00"} USD</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Status:</h3>
                <p className="text-green-400 font-semibold">Confirmed</p>
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
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                View Orders
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Continue Shopping →</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
