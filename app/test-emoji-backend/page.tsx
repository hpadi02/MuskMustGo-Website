"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestEmojiBackend() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEmojiOrder = async () => {
    setLoading(true)

    // Simulate the exact data structure that would be sent to your backend
    const testOrderData = {
      customer_email: "test@example.com",
      items: [
        {
          product_id: "tesla_vs_elon_emoji_magnet",
          name: "Tesla vs Elon Emoji (magnet)",
          price: 12.99,
          quantity: 1,
          attributes: [
            {
              name: "emoji_good",
              value: "01_love_stickers",
            },
            {
              name: "emoji_bad",
              value: "03_vomit_face",
            },
          ],
        },
        {
          product_id: "regular_product",
          name: "Regular Product (no emojis)",
          price: 9.99,
          quantity: 1,
          // No attributes - this shows the difference
        },
      ],
      total_amount: 22.98,
      payment_status: "completed",
      stripe_session_id: "cs_test_123456789",
    }

    try {
      const response = await fetch("/api/test-emoji-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testOrderData),
      })

      const result = await response.json()
      setTestResult(result)
      console.log("Test result:", result)
    } catch (error) {
      console.error("Test failed:", error)
      setTestResult({ error: "Test failed" })
    } finally {
      setLoading(false)
    }
  }

  const testRealCartData = async () => {
    setLoading(true)

    // Get actual cart data from localStorage to see what's really stored
    try {
      const cartData = localStorage.getItem("cart")
      const parsedCart = cartData ? JSON.parse(cartData) : []

      console.log("=== ACTUAL CART DATA ===")
      console.log("Raw cart data:", cartData)
      console.log("Parsed cart:", parsedCart)

      // Simulate what sendOrderToBackend would send
      const simulatedOrderData = {
        customer_email: "real-test@example.com",
        items: parsedCart.map((item: any) => {
          const baseItem = {
            product_id: item.productId || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }

          // Add emoji attributes if present
          if (item.emojiChoices && (item.emojiChoices.emoji_good || item.emojiChoices.emoji_bad)) {
            baseItem.attributes = []

            if (item.emojiChoices.emoji_good) {
              baseItem.attributes.push({
                name: "emoji_good",
                value: item.emojiChoices.emoji_good,
              })
            }

            if (item.emojiChoices.emoji_bad) {
              baseItem.attributes.push({
                name: "emoji_bad",
                value: item.emojiChoices.emoji_bad,
              })
            }
          }

          return baseItem
        }),
        total_amount: parsedCart.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
        payment_status: "test",
        stripe_session_id: "test_session_from_cart",
      }

      const response = await fetch("/api/test-emoji-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simulatedOrderData),
      })

      const result = await response.json()
      setTestResult({
        ...result,
        cartData: parsedCart,
        simulatedOrder: simulatedOrderData,
      })
    } catch (error) {
      console.error("Real cart test failed:", error)
      setTestResult({ error: "Real cart test failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Emoji Backend Data</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Emoji Order Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This simulates exactly what would be sent to your backend when someone purchases a Tesla emoji product.
            </p>
            <Button onClick={testEmojiOrder} disabled={loading}>
              {loading ? "Testing..." : "Test Simulated Emoji Order"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Real Cart Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This tests your actual cart data. First add a Tesla emoji product to your cart, then click this button.
            </p>
            <Button onClick={testRealCartData} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Test Real Cart Data"}
            </Button>
          </CardContent>
        </Card>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Test Simulated Emoji Order" to see the expected data format</li>
          <li>Go customize a Tesla emoji product and add it to your cart</li>
          <li>Come back and click "Test Real Cart Data" to see your actual cart data</li>
          <li>Check the browser console for detailed logs</li>
          <li>Look for emoji attributes in the results</li>
        </ol>
      </div>
    </div>
  )
}
