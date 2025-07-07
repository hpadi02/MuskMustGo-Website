"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TestEmojiCheckout() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/test-emoji-flow")
      .then((res) => res.json())
      .then((data) => {
        setEnvStatus(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching environment status:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Loading Environment Status...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    if (status.includes("✅")) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status.includes("❌")) return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Emoji Flow Test Environment</CardTitle>
            <CardDescription>
              Check your environment configuration and test the emoji customization flow
            </CardDescription>
          </CardHeader>
        </Card>

        {envStatus && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Environment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Stripe Configuration</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(envStatus.environment.stripe?.secret_key)}
                      <span>Secret Key: {envStatus.environment.stripe?.secret_key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(envStatus.environment.stripe?.publishable_key)}
                      <span>Publishable Key: {envStatus.environment.stripe?.publishable_key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(envStatus.environment.stripe?.webhook_secret)}
                      <span>Webhook Secret: {envStatus.environment.stripe?.webhook_secret}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Backend Configuration</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(envStatus.environment.backend?.api_base_url)}
                      <span>API Base URL: {envStatus.environment.backend?.api_base_url}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Environment Info</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(envStatus.environment.environment?.vercel)}
                      <span>{envStatus.environment.environment?.vercel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                      <span>Node Environment: {envStatus.environment.environment?.node_env}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Step-by-Step Testing:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to the emoji customization page</li>
                    <li>Select your Tesla emoji (positive) and Elon emoji (negative)</li>
                    <li>Add to cart and proceed to checkout</li>
                    <li>Use test card: 4242424242424242</li>
                    <li>Complete the payment</li>
                    <li>Check Vercel function logs for emoji data</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/product/customize-emoji/tesla-vs-elon">Start Emoji Test</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/cart">View Cart</Link>
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
