"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface EnvStatus {
  timestamp: string
  environment: Record<string, string>
  emojiFlow: Record<string, string>
  testInstructions: string[]
}

export default function TestEmojiCheckout() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/test-emoji-flow")
      .then((res) => res.json())
      .then((data) => {
        setEnvStatus(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch environment status:", error)
        setLoading(false)
      })
  }, [])

  const getStatusIcon = (status: string) => {
    if (status.includes("✅")) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status.includes("❌")) return <XCircle className="h-4 w-4 text-red-500" />
    if (status.includes("⚠️")) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return null
  }

  const getStatusColor = (status: string) => {
    if (status.includes("✅")) return "bg-green-100 text-green-800"
    if (status.includes("❌")) return "bg-red-100 text-red-800"
    if (status.includes("⚠️")) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading environment status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Emoji Checkout Test Environment</CardTitle>
            <CardDescription>Test the emoji attribute flow from customization to backend delivery</CardDescription>
          </CardHeader>
        </Card>

        {envStatus && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(envStatus.environment).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-mono text-sm">{key}</span>
                      <Badge className={getStatusColor(value)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(value)}
                          {value}
                        </div>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emoji Flow Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(envStatus.emojiFlow).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <Badge className={getStatusColor(value)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(value)}
                          {value}
                        </div>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {envStatus.testInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/product/customize-emoji/tesla-vs-elon">Start Emoji Test</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/test-stripe">Test Stripe Connection</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
