"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const INSTRUCTIONS = `
🧪 BACKEND TESTING WALKTHROUGH

1. MOCK BACKEND TEST (Always works):
   - Click "Test Mock Backend" 
   - Check browser console (F12 → Console tab)
   - See detailed logs of what data would be sent to Ed

2. REAL BACKEND TEST (Only when Ed's server is running):
   - Make sure Ed's backend is running on port 5000
   - Click "Test Ed's Backend"
   - See if the real API accepts our data format

3. ENVIRONMENT SETUP:
   - NEXT_PUBLIC_API_BASE_URL=http://localhost:5000 (for Ed's local backend)
   - Or leave empty to use default http://localhost:5000
`

export default function TestBackendPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock Stripe session data for testing
  const mockStripeSession = {
    id: "cs_test_mock_session_id_12345",
    payment_status: "paid",
    amount_total: 2500, // $25.00 in cents
    customer_details: {
      email: "test@example.com",
      name: "John Doe",
      address: {
        line1: "123 Test Street",
        line2: "Apt 4B",
        city: "Test City",
        state: "CA",
        postal_code: "90210",
        country: "US",
      },
    },
    line_items: {
      data: [
        {
          quantity: 1,
          price: {
            unit_amount: 1500, // $15.00 in cents
            product: {
              id: "prod_SMP5jwQujuz3CI",
              name: "Say No to Elon! - bumper sticker",
              images: ["/images/no-elon-musk.png"],
              metadata: {
                custom_emoji: "angry_face",
                custom_text: "Custom message",
              },
            },
          },
        },
        {
          quantity: 2,
          price: {
            unit_amount: 500, // $5.00 in cents
            product: {
              id: "prod_SMOquwq3mLZSDE",
              name: "Tesla vs. Elon Emoji Bumper Sticker",
              images: ["/images/emoji-musk.png"],
            },
          },
        },
      ],
    },
    shipping_cost: {
      amount_total: 0, // Free shipping
    },
    total_details: {
      amount_tax: 0,
    },
  }

  const testMockBackend = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("Testing with mock Stripe session:", mockStripeSession)

      // Transform mock Stripe data to Ed's backend format (same logic as success page)
      const orderData = {
        customer: {
          email: mockStripeSession.customer_details?.email || "customer@example.com",
          firstname: mockStripeSession.customer_details?.name?.split(" ")[0] || "Customer",
          lastname: mockStripeSession.customer_details?.name?.split(" ").slice(1).join(" ") || "User",
          addr1: mockStripeSession.customer_details?.address?.line1 || "",
          addr2: mockStripeSession.customer_details?.address?.line2 || "",
          city: mockStripeSession.customer_details?.address?.city || "",
          state_prov: mockStripeSession.customer_details?.address?.state || "",
          postal_code: mockStripeSession.customer_details?.address?.postal_code || "",
          country: mockStripeSession.customer_details?.address?.country || "US",
        },
        payment_id: mockStripeSession.id,
        products: mockStripeSession.line_items.data.map((item: any) => ({
          product_id: item.price.product.id,
          quantity: item.quantity,
          attributes: item.price.product.metadata
            ? Object.entries(item.price.product.metadata).map(([name, value]) => ({
                name,
                value: String(value),
              }))
            : undefined,
        })),
        shipping: (mockStripeSession.shipping_cost?.amount_total || 0) / 100,
        tax: (mockStripeSession.total_details?.amount_tax || 0) / 100,
      }

      console.log("Sending order data to mock backend:", orderData)

      // Send to our mock backend
      const response = await fetch("/api/mock-backend/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseData.error || "Unknown error"}`)
      }

      setResult(responseData)
      console.log("Mock backend response:", responseData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Test failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const testRealBackend = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Same order data as mock test
      const orderData = {
        customer: {
          email: mockStripeSession.customer_details?.email || "customer@example.com",
          firstname: mockStripeSession.customer_details?.name?.split(" ")[0] || "Customer",
          lastname: mockStripeSession.customer_details?.name?.split(" ").slice(1).join(" ") || "User",
          addr1: mockStripeSession.customer_details?.address?.line1 || "",
          addr2: mockStripeSession.customer_details?.address?.line2 || "",
          city: mockStripeSession.customer_details?.address?.city || "",
          state_prov: mockStripeSession.customer_details?.address?.state || "",
          postal_code: mockStripeSession.customer_details?.address?.postal_code || "",
          country: mockStripeSession.customer_details?.address?.country || "US",
        },
        payment_id: mockStripeSession.id,
        products: mockStripeSession.line_items.data.map((item: any) => ({
          product_id: item.price.product.id,
          quantity: item.quantity,
          attributes: item.price.product.metadata
            ? Object.entries(item.price.product.metadata).map(([name, value]) => ({
                name,
                value: String(value),
              }))
            : undefined,
        })),
        shipping: (mockStripeSession.shipping_cost?.amount_total || 0) / 100,
        tax: (mockStripeSession.total_details?.amount_tax || 0) / 100,
      }

      console.log("Testing Ed's real backend with order data:", orderData)

      // Use the same URL logic as the success page
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      const response = await fetch(`${backendUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const responseText = await response.text()
      console.log("Real backend response status:", response.status)
      console.log("Real backend response body:", responseText)

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = { message: responseText, raw_response: responseText }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`)
      }

      setResult({
        ...responseData,
        backend_url: `${backendUrl}/orders`,
        response_status: response.status,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Real backend test failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  console.log("🧪 Backend Test Page Instructions:", INSTRUCTIONS)

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Backend API Testing</h1>

        <Card className="bg-blue-900/20 border-blue-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-400">📋 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-300 space-y-2 text-sm">
              <p>
                <strong>Step 1:</strong> Click "Test Mock Backend" first - this always works and shows you the data
                structure
              </p>
              <p>
                <strong>Step 2:</strong> Open browser console (F12 → Console) to see detailed logs
              </p>
              <p>
                <strong>Step 3:</strong> When Ed's backend is ready, click "Test Ed's Backend"
              </p>
              <p>
                <strong>Current API URL:</strong>{" "}
                <code className="bg-black px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}
                </code>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 mb-8">
          <Card className="bg-dark-300 border-dark-200">
            <CardHeader>
              <CardTitle className="text-white">Test Mock Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">
                Test the order processing logic with our mock backend that logs all data.
              </p>
              <Button onClick={testMockBackend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Testing..." : "Test Mock Backend"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-dark-300 border-dark-200">
            <CardHeader>
              <CardTitle className="text-white">Test Real Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Test with Ed's actual backend API (make sure it's running first).</p>
              <Button onClick={testRealBackend} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Testing..." : "Test Ed's Backend"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mock Data Preview */}
        <Card className="bg-dark-300 border-dark-200 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Mock Test Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-white/80 bg-black p-4 rounded overflow-auto">
              {JSON.stringify(mockStripeSession, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/30 mb-6">
            <CardHeader>
              <CardTitle className="text-red-400">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="bg-green-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                Success Response
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {result.response_status || 200}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-green-300 bg-black p-4 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
