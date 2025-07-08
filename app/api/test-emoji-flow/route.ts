import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 === EMOJI FLOW TEST STARTED ===")

    const testOrderData = {
      customer: {
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        addr1: "123 Test St",
        city: "Test City",
        state_prov: "TS",
        postal_code: "12345",
        country: "US",
      },
      payment_id: "pi_test_1234567890",
      products: [
        {
          product_id: "prod_test_emoji_magnet",
          quantity: 1,
          attributes: [
            { name: "emoji_good", value: "cowboy" },
            { name: "emoji_bad", value: "crazy_shit" },
          ],
        },
        {
          product_id: "prod_test_emoji_sticker",
          quantity: 1,
          attributes: [
            { name: "emoji_good", value: "heart" },
            { name: "emoji_bad", value: "orange_sad_face" },
          ],
        },
      ],
      shipping: 0,
      tax: 0,
    }

    console.log("📤 Test order data:", JSON.stringify(testOrderData, null, 2))

    // Send to Ed's backend
    let baseUrl: string
    if (process.env.PUBLIC_URL) {
      baseUrl = process.env.PUBLIC_URL
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else if (process.env.NODE_ENV === "production") {
      baseUrl = "https://elonmustgo.com"
    } else {
      baseUrl = "http://localhost:3000"
    }

    const apiUrl = `${baseUrl}/api/orders`
    console.log("🎯 Sending to:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testOrderData),
    })

    const result = await response.json()
    console.log("📡 Backend response:", result)

    return NextResponse.json({
      success: true,
      testData: testOrderData,
      backendResponse: result,
      status: response.status,
    })
  } catch (error) {
    console.error("💥 Test error:", error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}
