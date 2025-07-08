"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestEmojiCheckout() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      console.log("🧪 Running emoji flow test...")

      const response = await fetch("/api/test-emoji-flow")
      const result = await response.json()

      console.log("🧪 Test result:", result)
      setTestResult(result)
    } catch (error) {
      console.error("🧪 Test error:", error)
      setTestResult({
        success: false,
        message: "Test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">🧪 Emoji Flow Test</CardTitle>
            <CardDescription className="text-gray-400">
              Test the complete emoji attribute flow to Ed's backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runTest} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Running Test..." : "Run Emoji Flow Test"}
            </Button>

            {testResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Test Result:</h3>
                <div
                  className={`p-4 rounded-lg ${
                    testResult.success ? "bg-green-900 border-green-600" : "bg-red-900 border-red-600"
                  } border`}
                >
                  <p className={`font-medium ${testResult.success ? "text-green-200" : "text-red-200"}`}>
                    {testResult.success ? "✅ Test Passed!" : "❌ Test Failed!"}
                  </p>
                  <p className="text-gray-300 mt-2">{testResult.message}</p>

                  {testResult.testData && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-gray-300 hover:text-white">View Test Data Sent</summary>
                      <pre className="mt-2 p-2 bg-black rounded text-xs overflow-auto text-gray-300">
                        {JSON.stringify(testResult.testData, null, 2)}
                      </pre>
                    </details>
                  )}

                  {testResult.backendResponse && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-gray-300 hover:text-white">View Backend Response</summary>
                      <pre className="mt-2 p-2 bg-black rounded text-xs overflow-auto text-gray-300">
                        {JSON.stringify(testResult.backendResponse, null, 2)}
                      </pre>
                    </details>
                  )}

                  {testResult.error && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-red-300 hover:text-red-200">View Error</summary>
                      <pre className="mt-2 p-2 bg-black rounded text-xs overflow-auto text-red-300">
                        {typeof testResult.error === "string"
                          ? testResult.error
                          : JSON.stringify(testResult.error, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-white mb-2">What this test does:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Sends sample order data with emoji attributes to Ed's backend</li>
                <li>• Tests the exact format your checkout will send</li>
                <li>• Verifies emoji_good and emoji_bad attributes are included</li>
                <li>• Shows the backend response</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
