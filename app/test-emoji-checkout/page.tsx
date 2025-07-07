"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"

interface EnvStatus {
  timestamp: string
  environment: Record<string, string>
  emojiFlow: {
    status: string
    description: string
    flow: string[]
  }
  testInstructions: Record<string, string>
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emoji Checkout Test Environment</h1>
          <p className="text-gray-600">Test the emoji attributes flow before deploying to production</p>
        </div>

        {envStatus && (
          <>
            {/* Environment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Environment Status
                </CardTitle>
                <CardDescription>Current environment configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(envStatus.environment).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{key}:</span>
                      <span className={value.includes("✅") ? "text-green-600" : "text-red-600"}>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emoji Flow Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Emoji Attributes Flow
                </CardTitle>
                <CardDescription>{envStatus.emojiFlow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {envStatus.emojiFlow.flow.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Test Instructions
                </CardTitle>
                <CardDescription>Follow these steps to test the emoji attributes flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(envStatus.testInstructions).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full min-w-[60px] text-center">
                        {key.replace("step", "Step ")}
                      </span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/product/customize-emoji/tesla-vs-elon">Start Emoji Test</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
