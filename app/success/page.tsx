"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {orderStatus === "processing" && (
            <>
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
              <CardTitle>Processing Your Order</CardTitle>
              <CardDescription>Please wait while we process your payment and prepare your order...</CardDescription>
            </>
          )}

          {orderStatus === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Payment Successful!</CardTitle>
              <CardDescription>Your order has been processed and sent to our fulfillment center.</CardDescription>
            </>
          )}

          {orderStatus === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Processing Issue</CardTitle>
              <CardDescription>There was an issue processing your order. Your payment was successful.</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {sessionId && (
            <div className="text-sm text-gray-600">
              <p>
                <strong>Session ID:</strong> {sessionId}
              </p>
            </div>
          )}

          {orderStatus === "success" && orderData && (
            <div className="space-y-2">
              <h4 className="font-semibold">Order Details:</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Email:</strong> {orderData.customer.email}
                </p>
                <p>
                  <strong>Products:</strong> {orderData.products.length} item(s)
                </p>
                {orderData.products.some((p: any) => p.attributes) && (
                  <div className="mt-2 p-2 bg-green-50 rounded">
                    <p className="text-green-700 font-medium">✅ Custom emoji choices included!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {orderStatus === "error" && (
            <div className="space-y-2">
              <p className="text-red-600 text-sm">{error}</p>
              <Button onClick={retryProcessing} variant="outline" className="w-full bg-transparent">
                Retry Processing
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
            {orderStatus === "success" && (
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/account/orders">View Orders</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
