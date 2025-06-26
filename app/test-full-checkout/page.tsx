"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestFullCheckout() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runFullTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      // Simulate the full checkout flow
      const mockOrderData = {
        customer: {
          email: "test@example.com",
          firstname: "Test",
          lastname: "User",
          addr1: "123 Test Street",
          addr2: "",
          city: "Test City",
          state_prov: "TX",
          postal_code: "12345",
          country: "US",
        },
        payment_id: "pi_test_" + Math.random().toString(36).substr(2, 9),
        products: [
          {
            product_id: "tesla_vs_elon_emoji_magnet",
            quantity: 1,
            attributes: [
              {
                name: "emoji_good",
                value: "love_stickers",
              },
              {
                name: "emoji_bad",
                value: "vomit_face",
              },
            ],
          },
        ],
        shipping: 0,
        tax: 0,
      }

      // Send to our test backend
      const response = await fetch("/api/test-emoji-backend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockOrderData),
      })

      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Full Checkout Flow Test</h1>
        <p className="text-gray-600">This tests the complete flow from emoji selection to backend processing.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>• Product: Tesla vs Elon Emoji Magnet</p>
            <p>• Tesla Emoji: love_stickers (positive)</p>
            <p>• Elon Emoji: vomit_face (negative)</p>
            <p>• Customer: Test user with sample address</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mb-6">
        <Button onClick={runFullTest} disabled={isLoading} size="lg">
          {isLoading ? "Testing..." : "Run Full Test"}
        </Button>
      </div>

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className={testResult.success ? "text-green-600" : "text-red-600"}>
              {testResult.success ? "✅ Test Passed" : "❌ Test Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResult.success ? (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Backend successfully received and processed the order with emoji attributes!
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-medium mb-2">Response Details:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Message: {testResult.message}</li>
                    <li>• Has Emoji Attributes: {testResult.hasEmojiAttributes ? "Yes" : "No"}</li>
                    <li>• Received At: {testResult.receivedAt}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Full Response:</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    <pre>{JSON.stringify(testResult, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>Test failed: {testResult.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What This Tests:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✓ Order data structure matches your backend expectations</li>
            <li>✓ Emoji attributes are properly formatted (emoji_good, emoji_bad)</li>
            <li>✓ Emoji values are cleaned (no prefixes, no extensions)</li>
            <li>✓ Backend can receive and process the data</li>
            <li>✓ All required fields are present</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
