"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TestEmojiCheckoutPage() {
  const [envData, setEnvData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/test-emoji-flow")
      .then((res) => res.json())
      .then((data) => {
        setEnvData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching environment data:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Loading Environment Check...</CardTitle>
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
            <CardDescription>Check if everything is configured correctly for emoji attributes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {envData?.environment &&
                Object.entries(envData.environment).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{key}:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(value as string)}
                      <span className="text-sm">{value as string}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
            <CardDescription>Follow these steps to test the emoji attribute flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Go to the emoji customization page</p>
                  <Link href="/product/customize-emoji/tesla-vs-elon">
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Customize Tesla vs Elon Emoji
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Select your Tesla emoji (positive) and Elon emoji (negative)</p>
                  <p className="text-sm text-gray-600">Choose different emojis to test the customization</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Add to cart and proceed to checkout</p>
                  <p className="text-sm text-gray-600">Use test card: 4242424242424242</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Check the Vercel function logs</p>
                  <p className="text-sm text-gray-600">
                    Look for "🎭 Item emoji choices" in checkout logs and "✅ Added emoji attribute" in webhook logs
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expected Log Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono bg-gray-100 p-4 rounded">
              <div className="text-green-600">✅ Checkout API should show:</div>
              <div className="ml-4">
                🎭 Item 0 emoji choices: {"{"}"teslaEmoji": ..., "elonEmoji": ...{"}"}
              </div>
              <div className="ml-4">✅ Added Tesla emoji: happy_face_heart_eyes</div>
              <div className="ml-4">✅ Added Elon emoji: angry_smiley_face</div>
              <div className="text-green-600 mt-4">✅ Webhook should show:</div>
              <div className="ml-4">
                📋 Session metadata: {"{"}"item_0_emoji_good": "...", "item_0_emoji_bad": "..."{"}"}
              </div>
              <div className="ml-4">🎯 Final product attributes: [...]</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
