"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TestEmojiCheckout() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/test-emoji-flow")
      .then((res) => res.json())
      .then((data) => {
        setEnvStatus(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching environment status:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Checking environment...</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    if (status.includes("✅")) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status.includes("❌")) return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Emoji Checkout Test Environment</CardTitle>
            <CardDescription>Environment status for emoji attribute testing</CardDescription>
          </CardHeader>
          <CardContent>
            {envStatus && (
              <div className="space-y-3">
                {Object.entries(envStatus.environment).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{key}:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(value as string)}
                      <span className="text-sm">{value as string}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Test Flow</CardTitle>
            <CardDescription>Follow these steps to test emoji attributes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Step 1: Customize Emoji Product</h4>
              <Button asChild>
                <Link href="/product/customize-emoji/tesla-vs-elon">Go to Tesla vs Elon Emoji Product</Link>
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Step 2: Select Your Emojis</h4>
              <p className="text-sm text-gray-600">Choose a Tesla emoji (positive) and an Elon emoji (negative)</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Step 3: Add to Cart & Checkout</h4>
              <p className="text-sm text-gray-600">Use test card: 4242424242424242</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Step 4: Check Success Page</h4>
              <p className="text-sm text-gray-600">You should see confirmation that emoji attributes were processed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔍 What to Look For</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✅ Checkout logs should show: "Added Tesla emoji" and "Added Elon emoji"</p>
              <p>✅ Webhook logs should show: "Session metadata" with emoji data</p>
              <p>✅ Success page should confirm emoji attributes were processed</p>
              <p>⚠️ Backend integration will show "No backend URL configured" on Vercel (this is normal)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
