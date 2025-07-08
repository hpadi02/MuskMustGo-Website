"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestEmojiCheckout() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEmojiFlow = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-emoji-flow", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Test failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Emoji Flow</CardTitle>
          <CardDescription>Test the emoji attributes flow to Ed's backend</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testEmojiFlow} disabled={loading}>
            {loading ? "Testing..." : "Test Emoji Flow"}
          </Button>

          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Test Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
