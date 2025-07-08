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
      setResult({ error: "Test failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Emoji Checkout Flow</CardTitle>
            <CardDescription>Test the complete emoji attribute flow to Ed's backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testEmojiFlow} disabled={loading}>
              {loading ? "Testing..." : "Test Emoji Flow"}
            </Button>

            {result && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Test Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
