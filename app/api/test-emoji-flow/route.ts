import { NextResponse } from "next/server"

export async function GET() {
  console.log("🧪 === EMOJI FLOW TEST ENDPOINT ===")

  // Test data that matches what your checkout sends
  const testOrderData = {
    sessionId: "cs_test_example123",
    payment_id: "pi_test_example123",
    customer: {
      email: "test@example.com",
      firstname: "Test",
      lastname: "User",
      addr1: "123 Test St",
      addr2: "",
      city: "Test City",
      state_prov: "CA",
      postal_code: "12345",
      country: "US",
    },
    products: [
      {
        product_id: "prod_SMOn24zhjeCmXm",
        name: "Tesla vs Elon Emoji Magnet",
        quantity: 1,
        price: "14.99",
        attributes: [
          { name: "emoji_good", value: "cowboy" },
          { name: "emoji_bad", value: "crazy_shit" },
        ],
      },
      {
        product_id: "prod_SMOquwq3mLZSDE",
        name: "Tesla vs Elon Emoji Sticker",
        quantity: 1,
        price: "13.99",
        attributes: [
          { name: "emoji_good", value: "heart" },
          { name: "emoji_bad", value: "orange_sad_face" },
        ],
      },
    ],
    total: "28.98",
    currency: "usd",
    status: "paid",
    shipping: 0,
    tax: 0,
  }

  console.log("📤 Test data:", JSON.stringify(testOrderData, null, 2))

  // Send to Ed's backend
  const API_BASE_URL = process.env.API_BASE_URL || "https://elonmustgo.com"
  const backendUrl = `${API_BASE_URL}/api/orders`

  console.log("🌐 Testing backend URL:", backendUrl)

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testOrderData),
    })

    console.log("📡 Backend response status:", response.status)

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Test successful!")
      console.log("✅ Backend response:", result)

      return NextResponse.json({
        success: true,
        message: "Emoji flow test successful",
        testData: testOrderData,
        backendResponse: result,
      })
    } else {
      const errorText = await response.text()
      console.error("❌ Test failed - Backend error:", errorText)

      return NextResponse.json({
        success: false,
        message: "Backend returned error",
        testData: testOrderData,
        error: errorText,
        status: response.status,
      })
    }
  } catch (error) {
    console.error("❌ Test failed - Network error:", error)

    return NextResponse.json({
      success: false,
      message: "Network error",
      testData: testOrderData,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
