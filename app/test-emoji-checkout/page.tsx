"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestEmojiCheckout() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmojiFlow = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-emoji-flow")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to run test",
        details: error instanceof Error ? error.message : "Unknown error",
      })
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
            <Button onClick={testEmojiFlow} disabled={loading} className="w-full">
              {loading ? "Testing..." : "Run Emoji Flow Test"}
            </Button>

            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
