"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"
import { CartClearer } from "@/components/cart-clearer"

interface OrderData {
  sessionId: string
  customerEmail: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    price: number
    customOptions?: any
  }>
  totalAmount: number
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("\n🎉 === SUCCESS PAGE STARTED ===")
    console.log("🕐 Timestamp:", new Date().toISOString())
    console.log("📋 Session ID from URL:", sessionId)
    console.log("🌐 Current URL:", window.location.href)
    console.log("🔍 All URL params:", Object.fromEntries(searchParams.entries()))

    if (!sessionId) {
      console.log("❌ No session ID found in URL")
      setError("No session ID found")
      setLoading(false)
      return
    }

    const processOrder = async () => {
      try {
        console.log("\n💳 === RETRIEVING STRIPE SESSION ===")
        console.log("Fetching session:", sessionId)

        // Get session details from Stripe
        const response = await fetch(`/api/stripe/session/${sessionId}`)
        console.log("📡 Stripe API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.log("❌ Stripe API error response:", errorText)
          throw new Error(`Failed to retrieve session: ${response.status}`)
        }

        const sessionData = await response.json()
        console.log("✅ Stripe session data received:", JSON.stringify(sessionData, null, 2))

        // Extract order information
        const orderInfo: OrderData = {
          sessionId: sessionData.id,
          customerEmail: sessionData.customer_details?.email || "Unknown",
          customerName: sessionData.customer_details?.name || "Unknown",
          items:
            sessionData.line_items?.data?.map((item: any) => {
              console.log("🏷️ Processing line item:", JSON.stringify(item, null, 2))

              const customOptions = item.price?.product?.metadata || {}
              console.log("📝 Item metadata/customOptions:", JSON.stringify(customOptions, null, 2))

              return {
                name: item.price?.product?.name || "Unknown Product",
                quantity: item.quantity || 1,
                price: (item.amount_total || 0) / 100,
                customOptions: Object.keys(customOptions).length > 0 ? customOptions : undefined,
              }
            }) || [],
          totalAmount: (sessionData.amount_total || 0) / 100,
          shippingAddress: sessionData.shipping_details?.address,
        }

        console.log("\n📦 === PROCESSED ORDER INFO ===")
        console.log("Order details:", JSON.stringify(orderInfo, null, 2))

        setOrderData(orderInfo)

        // Send order to Ed's backend
        console.log("\n📤 === SENDING ORDER TO ED'S BACKEND ===")
        console.log("Preparing order data for backend...")

        const backendPayload = {
          sessionId: orderInfo.sessionId,
          customerEmail: orderInfo.customerEmail,
          customerName: orderInfo.customerName,
          items: orderInfo.items,
          totalAmount: orderInfo.totalAmount,
          shippingAddress: orderInfo.shippingAddress,
          timestamp: new Date().toISOString(),
          source: "stripe-checkout",
        }

        console.log("📋 Backend payload:", JSON.stringify(backendPayload, null, 2))

        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(backendPayload),
        })

        console.log("📡 Backend response status:", orderResponse.status)

        if (orderResponse.ok) {
          const backendResult = await orderResponse.json()
          console.log("✅ Backend response:", JSON.stringify(backendResult, null, 2))
          console.log("🎉 Order successfully sent to Ed's backend!")
        } else {
          const errorText = await orderResponse.text()
          console.log("⚠️ Backend error response:", errorText)
          console.log("⚠️ Order processing completed but backend notification failed")
        }
      } catch (err) {
        console.error("\n❌ === SUCCESS PAGE ERROR ===")
        console.error("Error details:", err)
        console.error("Error stack:", err instanceof Error ? err.stack : "No stack trace")
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
        console.log("\n✅ === SUCCESS PAGE PROCESSING COMPLETE ===")
      }
    }

    processOrder()
  }, [sessionId, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Processing your order...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
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
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <CartClearer />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your order. We've received your payment and will process your order shortly.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {orderData && (
              <>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-xs">{orderData.sessionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{orderData.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{orderData.customerName}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-600">Total:</span>
                      <span>${orderData.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          {item.customOptions && (
                            <div className="text-xs text-gray-500 mt-1">
                              {Object.entries(item.customOptions).map(([key, value]) => (
                                <div key={key}>
                                  <strong>{key}:</strong> {typeof value === "string" ? value : JSON.stringify(value)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Confirmation Email</h4>
                <p className="text-sm text-gray-600">Check your email for order confirmation</p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg border">
                <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Processing</h4>
                <p className="text-sm text-gray-600">We'll prepare your order within 1-2 business days</p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg border">
                <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Shipping</h4>
                <p className="text-sm text-gray-600">You'll receive tracking information soon</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account/orders" className="flex-1">
                <Button className="w-full">View Orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
