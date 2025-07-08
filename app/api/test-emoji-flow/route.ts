import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 === EMOJI FLOW TEST STARTED ===")

    // Test data with emoji attributes
    const testOrderData = {
      customer: {
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        addr1: "123 Test St",
        addr2: "",
        city: "Test City",
        state_prov: "TS",
        postal_code: "12345",
        country: "US",
      },
      payment_id: "pi_test_12345",
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
      total: "28.98",
      currency: "usd",
      shipping: 0,
      tax: 0,
    }

    console.log("📤 Test order data:", JSON.stringify(testOrderData, null, 2))

    // Send to Ed's backend
    const API_BASE_URL = process.env.API_BASE_URL || "https://elonmustgo.com"
    const backendUrl = `${API_BASE_URL}/api/orders`

    console.log("🎯 Backend URL:", backendUrl)

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
      console.log("✅ Test successful:", result)
      return NextResponse.json({
        success: true,
        message: "Emoji flow test completed successfully",
        testData: testOrderData,
        backendResponse: result,
      })
    } else {
      const errorText = await response.text()
      console.error("❌ Test failed:", errorText)
      return NextResponse.json({
        success: false,
        error: "Backend request failed",
        status: response.status,
        errorText,
      })
    }
  } catch (error) {
    console.error("💥 Test error:", error)
    return NextResponse.json({
      success: false,
      error: "Test failed with exception",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
