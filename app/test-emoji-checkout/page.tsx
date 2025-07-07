"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function TestEmojiCheckoutPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    try {
      setLoading(true)
      console.log("🧪 Running emoji flow tests...")

      const response = await fetch("/api/test-emoji-flow")
      if (response.ok) {
        const results = await response.json()
        setTestResults(results)
        console.log("✅ Test results:", results)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Test failed")
      }
    } catch (err) {
      console.error("❌ Test error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Emoji Checkout Flow Test</h1>

        <div className="grid gap-6">
          {/* Test Results Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {!loading && !error && <CheckCircle className="h-5 w-5 text-green-500" />}
                {error && <AlertCircle className="h-5 w-5 text-red-500" />}
                Environment Test Results
              </CardTitle>
              <CardDescription>Testing emoji flow configuration and environment</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <p>Running tests...</p>}

              {error && (
                <div className="text-red-600">
                  <p>Error: {error}</p>
                  <Button onClick={runTests} className="mt-2">
                    Retry Tests
                  </Button>
                </div>
              )}

              {testResults && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Environment Variables:</h3>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {Object.entries(testResults.environment).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span
                            className={typeof value === "boolean" ? (value ? "text-green-600" : "text-red-600") : ""}
                          >
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Test Order Structure:</h3>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-auto max-h-64">
                      <pre>{JSON.stringify(testResults.testOrderStructure, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Flow Card */}
          <Card>
            <CardHeader>
              <CardTitle>Test the Complete Flow</CardTitle>
              <CardDescription>Follow these steps to test emoji attributes end-to-end</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Step 1: Customize Emoji Product</h4>
                <Button asChild>
                  <Link href="/product/customize-emoji/tesla-vs-elon">Go to Tesla vs Elon Emoji Product</Link>
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Step 2: Add to Cart & Checkout</h4>
                <p className="text-sm text-gray-600">
                  Select your Tesla emoji (positive) and Elon emoji (negative), add to cart, then checkout with test
                  card: 4242424242424242
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Step 3: Check Logs</h4>
                <p className="text-sm text-gray-600">
                  After checkout, check the browser console and Vercel function logs for emoji attribute processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
