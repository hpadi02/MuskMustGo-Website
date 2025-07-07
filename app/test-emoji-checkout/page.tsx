"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TestEmojiCheckoutPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestResults()
  }, [])

  const fetchTestResults = async () => {
    try {
      const response = await fetch("/api/test-emoji-flow")
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      console.error("Failed to fetch test results:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading test environment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🧪 Emoji Checkout Test Environment</h1>
          <p className="text-gray-600">Verify the emoji attributes flow is working correctly</p>
        </div>

        {/* Environment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Environment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults?.environment &&
                Object.entries(testResults.environment).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{key}:</span>
                    <Badge
                      variant={
                        key.includes("STRIPE") && value === true
                          ? "default"
                          : key.includes("URL") && value !== "Not set"
                            ? "default"
                            : value === true || (typeof value === "string" && value !== "Not set")
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {typeof value === "boolean" ? (value ? "✅ Set" : "❌ Missing") : String(value)}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Flow */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Test Flow Steps</CardTitle>
            <CardDescription>Follow these steps to test the emoji attributes feature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults?.nextSteps?.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expected Data Flow */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Expected Data Flow</CardTitle>
            <CardDescription>What the system should process at each step</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Frontend Input:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(testResults?.testData?.inputFromFrontend, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Stripe Metadata:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(testResults?.testData?.stripeMetadata, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Final Order Data:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(testResults?.testData?.finalOrderData, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/product/customize-emoji/tesla-vs-elon">🎭 Start Emoji Test</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/test-stripe">💳 Test Stripe Integration</Link>
          </Button>

          <Button variant="outline" onClick={fetchTestResults}>
            🔄 Refresh Test Data
          </Button>
        </div>

        {/* Backend Status Warning */}
        {testResults?.environment?.API_BASE_URL === "Not set" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                Backend URL Not Configured
              </CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-700">
              <p className="mb-2">No backend URL is configured. This is normal for Vercel testing.</p>
              <p className="text-sm">
                The emoji attributes will be processed and logged, but won't be sent to Ed's backend until you deploy to
                your nginx server with the proper API_BASE_URL.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
