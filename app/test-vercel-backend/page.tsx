"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestVercelBackend() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Mock session data for testing
  const mockSession = {
    user: {
      email: "test@example.com",
      name: "Test User",
    },
  }

  // Mock customer data for testing
  const mockCustomerData = {
    email: "test@example.com",
    firstname: "John",
    lastname: "Doe",
    addr1: "123 Test Street",
    addr2: "Apt 4B",
    city: "Test City",
    state: "CA",
    zip: "90210",
    country: "US",
    phone: "555-123-4567",
  }

  const addResult = (result: any) => {
    setResults((prev) => [result, ...prev])
  }

  const testApiHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/mock-eds-backend/orders", {
        method: "GET",
      })

      const data = await response.json()

      addResult({
        test: "API Health Check",
        status: response.ok ? "SUCCESS" : "FAILED",
        response: data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      addResult({
        test: "API Health Check",
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    }
    setLoading(false)
  }

  const testMockBackend = async () => {
    setLoading(true)
    try {
      // Create mock order data
      const orderData = {
        customer: mockCustomerData,
        payment_id: "cs_test_mock_session_id_12345",
        products: [
          {
            product_id: "prod_SMP5jwQujuz3CI",
            price_id: "price_1RRgH0HXKGu0DvSUb9ggZcDF",
            quantity: 1,
            attributes: [
              { name: "Type", value: "bumper sticker" },
              { name: "Message", value: "Say No to Elon!" },
            ],
          },
        ],
        shipping: 0,
        tax: 0,
        total: 1299, // $12.99 in cents
      }

      console.log("=== TESTING MOCK BACKEND ===")
      console.log("Order Data:", orderData)

      const response = await fetch("/api/mock-eds-backend/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      addResult({
        test: "Mock Backend Test",
        status: response.ok ? "SUCCESS" : "FAILED",
        orderData,
        response: data,
        timestamp: new Date().toISOString(),
      })

      console.log("Mock Backend Response:", data)
    } catch (error) {
      addResult({
        test: "Mock Backend Test",
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Vercel Backend</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>🏥 API Health Check</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Test if the mock backend API is running on Vercel</p>
            <Button onClick={testApiHealth} disabled={loading}>
              {loading ? "Testing..." : "Check API Health"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧪 Mock Backend Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Test complete order flow with mock Ed's backend</p>
            <Button onClick={testMockBackend} disabled={loading}>
              {loading ? "Testing..." : "Test Mock Backend on Vercel"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{result.test}</h3>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        result.status === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : result.status === "FAILED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{result.timestamp}</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
