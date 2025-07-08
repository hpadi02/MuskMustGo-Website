import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock order data with emoji attributes
    const mockOrderData = {
      sessionId: "cs_test_mock_session_id",
      customer: {
        email: "test@example.com",
        name: "Test Customer",
      },
      products: [
        {
          product_id: "prod_SMOn24zhjeCmXm",
          name: "Tesla vs Elon Emoji (magnet)",
          quantity: 1,
          price: "14.99",
          attributes: [
            { name: "emoji_good", value: "cowboy" },
            { name: "emoji_bad", value: "crazy_shit" },
          ],
        },
        {
          product_id: "prod_SMOquwq3mLZSDE",
          name: "Tesla vs Elon Emoji (sticker)",
          quantity: 1,
          price: "12.99",
          attributes: [
            { name: "emoji_good", value: "heart" },
            { name: "emoji_bad", value: "orange_sad_face" },
          ],
        },
      ],
      total: "27.98",
      currency: "usd",
    }

    console.log("🧪 Testing emoji flow with mock data:", JSON.stringify(mockOrderData, null, 2))

    // Send to backend
    const backendUrl = process.env.API_BASE_URL || "https://api.muskmustgo.com"

    try {
      console.log("🚀 Sending test order to backend:", `${backendUrl}/orders`)

      const backendResponse = await fetch(`${backendUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockOrderData),
      })

      if (backendResponse.ok) {
        const backendResult = await backendResponse.json()
        console.log("✅ Test backend response:", backendResult)

        return NextResponse.json({
          success: true,
          message: "Test emoji flow completed successfully",
          mockOrderData,
          backendResponse: backendResult,
        })
      } else {
        const errorText = await backendResponse.text()
        console.error("❌ Test backend error:", errorText)

        return NextResponse.json(
          {
            success: false,
            error: "Test backend processing failed",
            mockOrderData,
            backendError: errorText,
          },
          { status: 500 },
        )
      }
    } catch (backendError) {
      console.error("❌ Test backend request failed:", backendError)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to connect to test backend",
          mockOrderData,
          backendError: backendError instanceof Error ? backendError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Test emoji flow error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
