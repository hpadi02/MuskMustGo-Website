"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"
import { CartClearer } from "@/components/cart-clearer"

interface OrderDetails {
  id: string
  amount: number
  currency: string
  status: string
  customer_email?: string
  customer_name?: string
  line_items?: any[]
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("\n🎉 === SUCCESS PAGE STARTED ===")
    console.log("🕐 Timestamp:", new Date().toISOString())
    console.log("🔗 Session ID from URL:", sessionId)
    console.log("🌐 Current URL:", window.location.href)
    console.log("📋 All URL params:", Object.fromEntries(searchParams.entries()))

    if (!sessionId) {
      console.log("❌ No session ID found in URL")
      setError("No session ID found")
      setLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      try {
        console.log("\n💳 === RETRIEVING STRIPE SESSION ===")
        console.log("📞 Calling API with session ID:", sessionId)

        const response = await fetch(`/api/stripe/session/${sessionId}`)
        console.log("📡 API Response status:", response.status)
        console.log("📡 API Response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const errorText = await response.text()
          console.log("❌ API Error response:", errorText)
          throw new Error(`Failed to fetch session: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        console.log("✅ Session data received:", JSON.stringify(data, null, 2))

        setOrderDetails(data)

        // Send order to Ed's backend
        console.log("\n📤 === SENDING ORDER TO ED'S BACKEND ===")
        try {
          const orderPayload = {
            stripe_session_id: sessionId,
            amount: data.amount,
            currency: data.currency,
            customer_email: data.customer_email,
            customer_name: data.customer_name,
            status: data.status,
            line_items: data.line_items,
            timestamp: new Date().toISOString(),
            source: "success-page",
          }

          console.log("📦 Order payload:", JSON.stringify(orderPayload, null, 2))

          const orderResponse = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
          })

          console.log("📡 Order API response status:", orderResponse.status)

          if (orderResponse.ok) {
            const orderResult = await orderResponse.json()
            console.log("✅ Order sent successfully:", orderResult)
          } else {
            const orderError = await orderResponse.text()
            console.log("⚠️ Order API error (non-critical):", orderError)
          }
        } catch (orderError) {
          console.log("⚠️ Failed to send order to backend (non-critical):", orderError)
        }

        console.log("\n🎊 === SUCCESS PAGE PROCESSING COMPLETE ===")
      } catch (err) {
        console.error("\n❌ === SUCCESS PAGE ERROR ===")
        console.error("Error details:", err)
        console.error("Stack trace:", err instanceof Error ? err.stack : "No stack trace")
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
        console.log("🔚 === SUCCESS PAGE LOADING FINISHED ===\n")
      }
    }

    fetchOrderDetails()
  }, [sessionId, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <CartClearer />
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p>Processing your order...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <CartClearer />
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your order. Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderDetails && (
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <p className="font-mono text-xs">{orderDetails.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <p className="font-semibold">
                    ${(orderDetails.amount / 100).toFixed(2)} {orderDetails.currency.toUpperCase()}
                  </p>
                </div>
                {orderDetails.customer_email && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Email:</span>
                    <p>{orderDetails.customer_email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold">Processing</h4>
              <p className="text-sm text-gray-600">Your order is being prepared</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold">Shipping</h4>
              <p className="text-sm text-gray-600">We'll send tracking info soon</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Updates</h4>
              <p className="text-sm text-gray-600">Check your email for updates</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              A confirmation email has been sent to your email address with order details and tracking information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop/all">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
