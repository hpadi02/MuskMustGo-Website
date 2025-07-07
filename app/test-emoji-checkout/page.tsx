"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestEmojiCheckout() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-emoji-flow")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: "Failed to run test", details: error })
    } finally {
      setLoading(false)
    }
  }

  const testCheckout = async () => {
    setLoading(true)
    try {
      // Simulate emoji product checkout
      const checkoutData = {
        items: [
          {
            price: "price_1234567890", // This will need to be a real Stripe price ID
            quantity: 1,
            id: "tesla-vs-elon-emoji",
            customOptions: {
              teslaEmoji: {
                name: "happy_face_heart_eyes",
                src: "/emojis/positives/03_happy_face_heart_eyes.png",
              },
              elonEmoji: {
                name: "angry_smiley_face",
                src: "/emojis/negatives/04_angry_smiley_face.png",
              },
            },
          },
        ],
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      })

      const result = await response.json()
      setTestResult({ checkoutTest: result })

      if (result.url) {
        // Open Stripe checkout in new tab
        window.open(result.url, "_blank")
      }
    } catch (error) {
      setTestResult({ error: "Checkout test failed", details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>🧪 Emoji Checkout Test Suite</CardTitle>
          <CardDescription>Test the emoji attributes flow on Vercel before deploying to nginx</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button onClick={runTest} disabled={loading}>
              {loading ? "Testing..." : "Check Environment"}
            </Button>
            <Button onClick={testCheckout} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Test Checkout Flow"}
            </Button>
          </div>

          {testResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>

              {testResult.environment && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Environment Status:</h4>
                    <div className="space-y-1">
                      <Badge variant={testResult.environment.hasStripeKey ? "default" : "destructive"}>
                        Stripe Key: {testResult.environment.hasStripeKey ? "✅" : "❌"}
                      </Badge>
                      <Badge variant={testResult.environment.hasWebhookSecret ? "default" : "secondary"}>
                        Webhook Secret: {testResult.environment.hasWebhookSecret ? "✅" : "⚠️ Optional"}
                      </Badge>
                      <Badge variant={testResult.environment.VERCEL ? "default" : "secondary"}>
                        Platform: {testResult.environment.VERCEL ? "Vercel" : "Local/Nginx"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Manual Test Steps:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Go to customize emoji page</li>
                      <li>Select emojis</li>
                      <li>Add to cart & checkout</li>
                      <li>Use test card: 4242424242424242</li>
                      <li>Check function logs</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🎯 What to Look For:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>
                <strong>Checkout logs:</strong> "🎭 Item emoji choices" and "✅ Added Tesla/Elon emoji"
              </li>
              <li>
                <strong>Webhook logs:</strong> "📋 Session metadata" with emoji data
              </li>
              <li>
                <strong>Backend logs:</strong> Order data with "attributes" array
              </li>
              <li>
                <strong>Success:</strong> "✅ Order successfully sent to backend with emoji attributes"
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
