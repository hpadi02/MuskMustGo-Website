"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestEmojiCheckout() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEmojiFlow = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-emoji-flow")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to test emoji flow" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-4xl mx-auto">
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
              <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
