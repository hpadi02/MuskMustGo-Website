"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function TestEmojiCheckoutPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testEnvironment()
  }, [])

  const testEnvironment = async () => {
    try {
      const response = await fetch("/api/test-emoji-flow")
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({ error: "Failed to test environment" })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <CardTitle>Testing Environment</CardTitle>
            <CardDescription>Checking emoji flow configuration...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          {testResult?.success ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Emoji Flow Test Ready</CardTitle>
              <CardDescription>Environment configured for emoji attribute testing</CardDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Configuration Issues</CardTitle>
              <CardDescription>Some environment variables may be missing</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {testResult?.environment && (
            <div className="space-y-2">
              <h4 className="font-semibold">Environment Status:</h4>
              <div className="text-sm space-y-1 font-mono bg-gray-100 p-3 rounded">
                <p>NODE_ENV: {testResult.environment.NODE_ENV}</p>
                <p>API_BASE_URL: {testResult.environment.API_BASE_URL || "Not set"}</p>
                <p>STRIPE_SECRET_KEY: {testResult.environment.STRIPE_SECRET_KEY}</p>
                <p>STRIPE_PUBLISHABLE_KEY: {testResult.environment.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}</p>
                <p>STRIPE_WEBHOOK_SECRET: {testResult.environment.STRIPE_WEBHOOK_SECRET}</p>
                <p>BACKEND_API_KEY: {testResult.environment.BACKEND_API_KEY}</p>
              </div>
            </div>
          )}

          {testResult?.instructions && (
            <div className="space-y-2">
              <h4 className="font-semibold">Test Instructions:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                {testResult.instructions.map((instruction: string, index: number) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/product/customize-emoji/tesla-vs-elon">Start Emoji Test</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/cart">View Cart</Link>
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Check Vercel function logs during the test to see emoji attributes being processed.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
