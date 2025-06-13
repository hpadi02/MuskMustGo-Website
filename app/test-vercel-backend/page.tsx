"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TestVercelBackendPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState("")

  // Mock Stripe session data for testing
  const mockStripeSession = {
    id: "cs_test_vercel_session_12345",
    payment_status: "paid",
    amount_total: 3500, // $35.00 in cents
    customer_details: {
      email: "vercel-test@example.com",
      name: "Vercel Tester",
      address: {
        line1: "123 Vercel Street",
        line2: "Suite 100",
        city: "San Francisco",
        state: "CA",
        postal_code: "94105",
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
                custom_text: "Test from Vercel",
              },
            },
          },
        },
        {
          quantity: 1,
          price: {
            unit_amount: 1200, // $12.00 in cents
            product: {
              id: "prod_SMOquwq3mLZSDE",
              name: "Tesla vs. Elon Emoji Bumper Sticker",
              images: ["/images/emoji-musk.png"],
            },
          },
        },
        {
          quantity: 2,
          price: {
            unit_amount: 400, // $4.00 in cents
            product: {
              id: "prod_SMP21kBsg5qxRM",
              name: "Love the Car, NOT the CEO! - magnet",
              images: ["/images/no-elon-musk.png"],
            },
          },
        },
      ],
    },
    shipping_cost: {
      amount_total: 500, // $5.00 shipping
    },
    total_details: {
      amount_tax: 200, // $2.00 tax
    },
  }

  const transformOrderData = (stripeSession: any) => {
    return {
      customer: {
        email: stripeSession.customer_details?.email || "customer@example.com",
        firstname: stripeSession.customer_details?.name?.split(" ")[0] || "Customer",
        lastname: stripeSession.customer_details?.name?.split(" ").slice(1).join(" ") || "User",
        addr1: stripeSession.customer_details?.address?.line1 || "",
        addr2: stripeSession.customer_details?.address?.line2 || "",
        city: stripeSession.customer_details?.address?.city || "",
        state_prov: stripeSession.customer_details?.address?.state || "",
        postal_code: stripeSession.customer_details?.address?.postal_code || "",
        country: stripeSession.customer_details?.address?.country || "US",
      },
      payment_id: stripeSession.id,
      products: stripeSession.line_items.data.map((item: any) => ({
        product_id: item.price.product.id,
        quantity: item.quantity,
        attributes: item.price.product.metadata
          ? Object.entries(item.price.product.metadata).map(([name, value]) => ({
              name,
              value: String(value),
            }))
          : undefined,
      })),
      shipping: (stripeSession.shipping_cost?.amount_total || 0) / 100,
      tax: (stripeSession.total_details?.amount_tax || 0) / 100,
    }
  }

  const testMockBackend = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const orderData = transformOrderData(mockStripeSession)
      const testUrl = `${window.location.origin}/api/mock-eds-backend/orders`
      setCurrentUrl(testUrl)

      console.log("Testing mock Ed's backend on Vercel:", testUrl)
      console.log("Order data:", orderData)

      const response = await fetch(testUrl, {
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

      setResult({
        ...responseData,
        test_url: testUrl,
        response_status: response.status,
        test_environment: "vercel-mock",
      })

      console.log("Mock backend response:", responseData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Test failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const testRealBackendFromVercel = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const orderData = transformOrderData(mockStripeSession)
      // This would be Ed's actual backend URL
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      const testUrl = `${backendUrl}/orders`
      setCurrentUrl(testUrl)

      console.log("Testing Ed's real backend from Vercel:", testUrl)
      console.log("Order data:", orderData)

      const response = await fetch(testUrl, {
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
        test_url: testUrl,
        response_status: response.status,
        test_environment: "vercel-to-real-backend",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Real backend test failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const testHealthCheck = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const testUrl = `${window.location.origin}/api/mock-eds-backend/orders`
      setCurrentUrl(testUrl)

      const response = await fetch(testUrl, {
        method: "GET",
      })

      const responseData = await response.json()
      setResult({
        ...responseData,
        test_url: testUrl,
        response_status: response.status,
        test_type: "health-check",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const testServerConnectivity = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      const pingUrl = `${backendUrl}/ping`
      setCurrentUrl(pingUrl)

      console.log("Testing server connectivity:", pingUrl)

      const response = await fetch(pingUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const responseText = await response.text()
      console.log("Ping response:", responseText)

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = { message: responseText, raw_response: responseText }
      }

      setResult({
        ...responseData,
        test_url: pingUrl,
        response_status: response.status,
        test_type: "connectivity-check",
        server_reachable: response.ok,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Server connectivity failed: ${errorMessage}`)
      console.error("Connectivity test failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">🚀 Vercel Backend Testing</h1>

        <Card className="bg-blue-900/20 border-blue-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-400">🎯 Testing Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-300 space-y-2 text-sm">
              <p>
                <strong>Phase 1:</strong> Test mock backend on Vercel (simulates Ed's API)
              </p>
              <p>
                <strong>Phase 2:</strong> Test real backend from Vercel (when Ed's server is ready)
              </p>
              <p>
                <strong>Current Domain:</strong>{" "}
                <code className="bg-black px-2 py-1 rounded">{window.location?.origin || "Loading..."}</code>
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mock" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ping">Ping Test</TabsTrigger>
            <TabsTrigger value="health">Health Check</TabsTrigger>
            <TabsTrigger value="mock">Mock Backend</TabsTrigger>
            <TabsTrigger value="real">Real Backend</TabsTrigger>
          </TabsList>

          <TabsContent value="ping">
            <Card className="bg-dark-300 border-dark-200">
              <CardHeader>
                <CardTitle className="text-white">🏓 Server Connectivity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">Test if Ed's server is reachable and responding to requests.</p>
                <Button
                  onClick={testServerConnectivity}
                  disabled={isLoading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? "Pinging..." : "Ping Ed's Server"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card className="bg-dark-300 border-dark-200">
              <CardHeader>
                <CardTitle className="text-white">🏥 Health Check</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">Check if the mock backend API is running on Vercel.</p>
                <Button onClick={testHealthCheck} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                  {isLoading ? "Checking..." : "Check API Health"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mock">
            <Card className="bg-dark-300 border-dark-200">
              <CardHeader>
                <CardTitle className="text-white">🧪 Mock Ed's Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">
                  Test the complete order flow using our mock backend that simulates Ed's API responses.
                </p>
                <Button onClick={testMockBackend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? "Testing..." : "Test Mock Backend on Vercel"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="real">
            <Card className="bg-dark-300 border-dark-200">
              <CardHeader>
                <CardTitle className="text-white">🎯 Real Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">
                  Test Ed's actual backend from your Vercel deployment (requires Ed's server to be running and
                  accessible).
                </p>
                <Button
                  onClick={testRealBackendFromVercel}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Testing..." : "Test Ed's Backend from Vercel"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Current Test URL */}
        {currentUrl && (
          <Card className="bg-gray-900/20 border-gray-500/30 mb-6">
            <CardHeader>
              <CardTitle className="text-gray-400">🔗 Current Test URL</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-gray-300 bg-black p-2 rounded block break-all">{currentUrl}</code>
            </CardContent>
          </Card>
        )}

        {/* Mock Data Preview */}
        <Card className="bg-dark-300 border-dark-200 mb-6">
          <CardHeader>
            <CardTitle className="text-white">📋 Test Order Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-white/80 bg-black p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(transformOrderData(mockStripeSession), null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/30 mb-6">
            <CardHeader>
              <CardTitle className="text-red-400">❌ Error</CardTitle>
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
                ✅ Success Response
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {result.response_status || 200}
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {result.test_environment || result.test_type}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-green-300 bg-black p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
