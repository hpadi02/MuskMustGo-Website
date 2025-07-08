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
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>🧪 Emoji Flow Test</CardTitle>
              <CardDescription>Test the complete emoji attribute flow to Ed's backend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={runTest} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Run Emoji Flow Test"}
              </Button>

              {testResult && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={testResult.success ? "default" : "destructive"}>
                      {testResult.success ? "✅ SUCCESS" : "❌ FAILED"}
                    </Badge>
                    {testResult.message && <span className="text-sm text-gray-600">{testResult.message}</span>}
                  </div>

                  {testResult.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Error:</h4>
                      <p className="text-red-700">{testResult.error}</p>
                    </div>
                  )}

                  {testResult.testData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Test Data Sent:</h4>
                      <pre className="text-sm text-blue-700 overflow-auto">
                        {JSON.stringify(testResult.testData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {testResult.backendResponse && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Backend Response:</h4>
                      <pre className="text-sm text-green-700 overflow-auto">{testResult.backendResponse}</pre>
                    </div>
                  )}

                  {testResult.backendError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Backend Error:</h4>
                      <pre className="text-sm text-red-700 overflow-auto">{testResult.backendError}</pre>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Expected Format for Ed's Backend:</h4>
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(
                    {
                      customer: {
                        email: "customer@example.com",
                        firstname: "John",
                        lastname: "Doe",
                        // ... address fields
                      },
                      payment_id: "pi_stripe_payment_id",
                      products: [
                        {
                          product_id: "prod_stripe_product_id",
                          quantity: 1,
                          attributes: [
                            { name: "emoji_good", value: "cowboy" },
                            { name: "emoji_bad", value: "crazy_shit" },
                          ],
                        },
                      ],
                      shipping: 0,
                      tax: 0,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
