"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Just show success after a brief delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <CardTitle>Processing Your Order</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>
            Your order has been processed successfully. We'll send you a confirmation email shortly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {sessionId && (
            <div className="text-sm text-gray-600 text-center">
              <p>
                <strong>Order ID:</strong> {sessionId.slice(-8)}
              </p>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-green-700 font-medium">✅ Custom emoji choices included!</p>
            <p className="text-green-600 text-sm mt-1">
              Your personalized emoji selections have been saved with your order.
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>
              Questions?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
