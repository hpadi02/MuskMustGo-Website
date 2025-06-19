"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TestResult {
  status: string
  message: string
  productCount?: number
  products?: any[]
  keys?: {
    secretKey: string
    publishableKey: string
  }
  error?: string
}

export default function TestStripePage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testStripe = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-stripe")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        status: "error",
        message: "Failed to test Stripe connection",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testStripe()
  }, [])

  return (
    <div className="min-h-screen bg-dark-400 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stripe Integration Test</h1>

        <Card className="bg-dark-300 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Testing Stripe connection...</p>
            ) : result ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded ${
                    result.status === "success"
                      ? "bg-green-900/20 border border-green-700 text-green-200"
                      : "bg-red-900/20 border border-red-700 text-red-200"
                  }`}
                >
                  <p className="font-medium">Status: {result.status}</p>
                  <p>{result.message}</p>
                </div>

                {result.keys && (
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="font-medium mb-2">Environment Variables:</h3>
                    <p className="text-sm">Secret Key: {result.keys.secretKey}</p>
                    <p className="text-sm">Publishable Key: {result.keys.publishableKey}</p>
                  </div>
                )}

                {result.productCount !== undefined && (
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="font-medium mb-2">Products Found: {result.productCount}</h3>
                    {result.products && result.products.length > 0 && (
                      <div className="space-y-2">
                        {result.products.map((product, index) => (
                          <div key={index} className="text-sm bg-gray-700 p-2 rounded">
                            <p>
                              <strong>Name:</strong> {product.baseName}
                            </p>
                            <p>
                              <strong>Price:</strong> ${product.price}
                            </p>
                            <p>
                              <strong>Type:</strong> {product.medium_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {result.error && (
                  <div className="bg-red-900/20 border border-red-700 p-4 rounded">
                    <h3 className="font-medium mb-2 text-red-200">Error Details:</h3>
                    <pre className="text-sm text-red-300 whitespace-pre-wrap">{result.error}</pre>
                  </div>
                )}
              </div>
            ) : (
              <p>No results yet</p>
            )}

            <Button onClick={testStripe} disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700">
              {loading ? "Testing..." : "Test Again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
