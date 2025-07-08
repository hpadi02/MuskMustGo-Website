import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock order data with emoji attributes
    const mockOrderData = {
      sessionId: "cs_test_mock_session_id",
      payment_id: "pi_mock_payment_intent",
      customer: {
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        address: {
          line1: "123 Test St",
          city: "Test City",
          state: "TS",
          postal_code: "12345",
          country: "US",
        },
      },
      products: [
        {
          product_id: "prod_test_magnet",
          name: "Tesla vs Elon Emoji (magnet)",
          quantity: 1,
          price: "14.99",
          attributes: [
            { name: "emoji_good", value: "cowboy" },
            { name: "emoji_bad", value: "crazy_shit" },
          ],
        },
        {
          product_id: "prod_test_sticker",
          name: "Tesla vs Elon Emoji (sticker)",
          quantity: 1,
          price: "9.99",
          attributes: [
            { name: "emoji_good", value: "heart" },
            { name: "emoji_bad", value: "orange_sad_face" },
          ],
        },
      ],
      total: "24.98",
      currency: "usd",
      created_at: new Date().toISOString(),
    }

    console.log("🧪 Test emoji flow - Mock order data:", JSON.stringify(mockOrderData, null, 2))

    // Test backend submission
    const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL

    if (!API_BASE_URL) {
      return NextResponse.json({
        success: true,
        message: "Test completed (no backend configured)",
        mockData: mockOrderData,
      })
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockOrderData),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Test backend response:", result)

      return NextResponse.json({
        success: true,
        message: "Test completed successfully",
        mockData: mockOrderData,
        backendResponse: result,
      })
    } else {
      const errorText = await response.text()
      console.error("❌ Test backend error:", errorText)

      return NextResponse.json({
        success: false,
        error: `Backend error: ${response.status}`,
        mockData: mockOrderData,
      })
    }
  } catch (error) {
    console.error("❌ Test error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
