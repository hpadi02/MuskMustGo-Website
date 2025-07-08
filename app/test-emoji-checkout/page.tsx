"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestEmojiCheckout() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-emoji-flow")
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Test request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Emoji Checkout Flow</CardTitle>
            <CardDescription>Test the complete emoji attribute flow from cart to backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runTest} disabled={isLoading}>
              {isLoading ? "Running Test..." : "Run Emoji Flow Test"}
            </Button>

            {testResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
