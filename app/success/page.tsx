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
  customer_email: string
  items: any[]
}

export default function SuccessPage() {
  console.log("\n🎉 === SUCCESS PAGE STARTED ===")

  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log(`🔍 Session ID from URL: ${sessionId}`)

  useEffect(() => {
    if (!sessionId) {
      console.log("❌ No session ID found in URL")
      setError("No session ID found")
      setLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      try {
        console.log("💳 Retrieving Stripe session...")

        const response = await fetch(`/api/stripe/session/${sessionId}`)
        console.log(`📡 API response status: ${response.status}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.status}`)
        }

        const data = await response.json()
        console.log("📦 Session data received:", JSON.stringify(data, null, 2))

        setOrderDetails(data)

        // Send order to Ed's backend
        console.log("\n📤 === SENDING ORDER TO ED'S BACKEND ===")

        const orderPayload = {
          stripe_session_id: sessionId,
          customer_email: data.customer_email,
          amount: data.amount,
          currency: data.currency,
          items: data.items,
          status: "completed",
          created_at: new Date().toISOString(),
        }

        console.log("📋 Order payload:", JSON.stringify(orderPayload, null, 2))

        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        })

        console.log(`📡 Order API response status: ${orderResponse.status}`)

        if (orderResponse.ok) {
          const orderResult = await orderResponse.json()
          console.log("✅ Order sent successfully:", orderResult)
        } else {
          const errorText = await orderResponse.text()
          console.log("⚠️ Order API error:", errorText)
        }
      } catch (err) {
        console.error("❌ Error processing order:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
        console.log("🏁 === SUCCESS PAGE PROCESSING COMPLETE ===\n")
      }
    }

    fetchOrderDetails()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <CartClearer />
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
                <Mail className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">Order Processing Error</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Link href="/contact">
                <Button variant="outline">Contact Support</Button>
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
          <div className="mx-auto mb-4 text-green-600">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your order. We've received your payment and will process your order shortly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderDetails && (
            <>
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono">{orderDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>
                      ${(orderDetails.amount / 100).toFixed(2)} {orderDetails.currency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{orderDetails.customer_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 font-semibold">{orderDetails.status}</span>
                  </div>
                </div>
              </div>

              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold mb-2">Items Ordered</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.customOptions && (
                            <div className="text-sm text-gray-600">Custom: {JSON.stringify(item.customOptions)}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div>
                            ${item.price} × {item.quantity}
                          </div>
                          <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">Processing</h4>
              <p className="text-sm text-gray-600">We're preparing your order</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Truck className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-semibold">Shipping</h4>
              <p className="text-sm text-gray-600">We'll send tracking info</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Mail className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold">Updates</h4>
              <p className="text-sm text-gray-600">Check your email</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/all">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/account/orders">
              <Button className="w-full sm:w-auto">View Orders</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
