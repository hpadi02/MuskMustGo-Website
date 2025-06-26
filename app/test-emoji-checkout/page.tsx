"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock emoji data
const POSITIVE_EMOJIS = [
  { name: "01_love_stickers", path: "/emojis/positives/01_love_stickers.png" },
  { name: "02_smile_sly", path: "/emojis/positives/02_smile_sly.png" },
  { name: "03_happy_face_heart_eyes", path: "/emojis/positives/03_happy_face_heart_eyes.png" },
  { name: "04_laughing_clipart", path: "/emojis/positives/04_laughing_clipart.png" },
  { name: "05_thumbs_up_face", path: "/emojis/positives/05_thumbs_up_face.png" },
]

const NEGATIVE_EMOJIS = [
  { name: "01_orange_sad_face", path: "/emojis/negatives/01_orange_sad_face.png" },
  { name: "02_gradient_angry", path: "/emojis/negatives/02_gradient_angry.png" },
  { name: "03_vomit_face", path: "/emojis/negatives/03_vomit_face.png" },
  { name: "04_angry_smiley_face", path: "/emojis/negatives/04_angry_smiley_face.png" },
  { name: "05_middle_finger", path: "/emojis/negatives/05_middle_finger.png" },
]

export default function TestEmojiCheckout() {
  const [selectedTeslaEmoji, setSelectedTeslaEmoji] = useState<string>("")
  const [selectedElonEmoji, setSelectedElonEmoji] = useState<string>("")
  const [orderData, setOrderData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const simulateCheckout = async () => {
    setIsProcessing(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create mock order data that would be sent to your backend
    const mockOrderData = {
      customer: {
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        addr1: "123 Test Street",
        addr2: "",
        city: "Test City",
        state_prov: "TX",
        postal_code: "12345",
        country: "US",
      },
      payment_id: "pi_test_" + Math.random().toString(36).substr(2, 9),
      products: [
        {
          product_id: "tesla_vs_elon_emoji_magnet",
          quantity: 1,
          ...(selectedTeslaEmoji || selectedElonEmoji
            ? {
                attributes: [
                  ...(selectedTeslaEmoji
                    ? [
                        {
                          name: "emoji_good",
                          value: selectedTeslaEmoji.replace(/^\d+_/, "").replace(/\.png$/, ""),
                        },
                      ]
                    : []),
                  ...(selectedElonEmoji
                    ? [
                        {
                          name: "emoji_bad",
                          value: selectedElonEmoji.replace(/^\d+_/, "").replace(/\.png$/, ""),
                        },
                      ]
                    : []),
                ],
              }
            : {}),
        },
      ],
      shipping: 0,
      tax: 0,
    }

    setOrderData(mockOrderData)
    setIsProcessing(false)
  }

  const resetTest = () => {
    setSelectedTeslaEmoji("")
    setSelectedElonEmoji("")
    setOrderData(null)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Emoji Checkout System</h1>
        <p className="text-gray-600">
          This page simulates the Tesla vs Elon emoji checkout process and shows the exact data that would be sent to
          your backend.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tesla Emoji Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Tesla Emoji (Positive)
              {selectedTeslaEmoji && <Badge variant="secondary">Selected</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {POSITIVE_EMOJIS.map((emoji) => (
                <button
                  key={emoji.name}
                  onClick={() => setSelectedTeslaEmoji(emoji.name)}
                  className={`p-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedTeslaEmoji === emoji.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <img src={emoji.path || "/placeholder.svg"} alt={emoji.name} className="w-12 h-12 mx-auto" />
                  <p className="text-xs mt-1 text-center truncate">
                    {emoji.name.replace(/^\d+_/, "").replace(/\.png$/, "")}
                  </p>
                </button>
              ))}
            </div>
            {selectedTeslaEmoji && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-800">Selected Tesla Emoji:</p>
                <p className="text-sm text-green-600">
                  {selectedTeslaEmoji.replace(/^\d+_/, "").replace(/\.png$/, "")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Elon Emoji Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Elon Emoji (Negative)
              {selectedElonEmoji && <Badge variant="secondary">Selected</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {NEGATIVE_EMOJIS.map((emoji) => (
                <button
                  key={emoji.name}
                  onClick={() => setSelectedElonEmoji(emoji.name)}
                  className={`p-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedElonEmoji === emoji.name ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <img src={emoji.path || "/placeholder.svg"} alt={emoji.name} className="w-12 h-12 mx-auto" />
                  <p className="text-xs mt-1 text-center truncate">
                    {emoji.name.replace(/^\d+_/, "").replace(/\.png$/, "")}
                  </p>
                </button>
              ))}
            </div>
            {selectedElonEmoji && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm font-medium text-red-800">Selected Elon Emoji:</p>
                <p className="text-sm text-red-600">{selectedElonEmoji.replace(/^\d+_/, "").replace(/\.png$/, "")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-center">
        <Button
          onClick={simulateCheckout}
          disabled={isProcessing || (!selectedTeslaEmoji && !selectedElonEmoji)}
          size="lg"
        >
          {isProcessing ? "Processing..." : "Simulate Checkout"}
        </Button>
        <Button onClick={resetTest} variant="outline" size="lg">
          Reset Test
        </Button>
      </div>

      {/* Order Data Display */}
      {orderData && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-green-600">✅ Order Data Generated</CardTitle>
            <p className="text-sm text-gray-600">
              This is the exact JSON that would be sent to your backend API at <code>/orders</code>
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
              <pre className="text-sm">{JSON.stringify(orderData, null, 2)}</pre>
            </div>

            {/* Highlight the attributes */}
            {orderData.products[0].attributes && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-medium text-blue-800 mb-2">🎯 Emoji Attributes Detected:</h4>
                {orderData.products[0].attributes.map((attr: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant={attr.name === "emoji_good" ? "default" : "destructive"}>{attr.name}</Badge>
                    <span className="font-mono">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Test:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. Select a Tesla emoji (positive) from the left grid</p>
          <p>2. Select an Elon emoji (negative) from the right grid</p>
          <p>3. Click "Simulate Checkout" to see the order data</p>
          <p>4. Check the generated JSON - it shows exactly what your backend will receive</p>
          <p className="text-sm text-gray-600 mt-4">
            <strong>Note:</strong> The emoji values are cleaned (no numbers prefix, no .png extension) as requested.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
