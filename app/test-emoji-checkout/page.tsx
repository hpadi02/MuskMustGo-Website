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
        setEnvStatus(data.environment)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch environment status:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Loading Environment Status...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Emoji Checkout Flow Test</CardTitle>
            <CardDescription>Environment status and testing instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Environment Variables</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {envStatus?.stripe_secret ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Stripe Secret Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {envStatus?.stripe_public ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Stripe Public Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {envStatus?.api_base_url && envStatus.api_base_url !== "Not set" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span>Backend URL: {envStatus?.api_base_url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {envStatus?.webhook_secret ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span>Webhook Secret</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Test Instructions</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to Tesla vs Elon emoji product</li>
                  <li>Select Tesla emoji (positive)</li>
                  <li>Select Elon emoji (negative)</li>
                  <li>Add to cart</li>
                  <li>Complete checkout with test card</li>
                  <li>Check logs for emoji attributes</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <Link href="/product/customize-emoji/tesla-vs-elon">Start Emoji Test</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
