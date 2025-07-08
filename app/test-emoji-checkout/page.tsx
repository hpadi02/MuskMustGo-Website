"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestEmojiCheckout() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmojiFlow = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-emoji-flow")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const testManualProcessing = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/manual-order-processing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: "cs_test_example_session_id",
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Emoji Checkout Flow</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Test Emoji Flow</CardTitle>
              <CardDescription>Test sending emoji attributes to Ed's backend</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testEmojiFlow} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test Emoji Flow"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Manual Processing</CardTitle>
              <CardDescription>Test manual order processing endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={testManualProcessing}
                disabled={loading}
                variant="outline"
                className="w-full bg-transparent"
              >
                {loading ? "Testing..." : "Test Manual Processing"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
