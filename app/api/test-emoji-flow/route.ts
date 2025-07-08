import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test data with emoji attributes
    const testOrderData = {
      sessionId: "cs_test_example123",
      payment_id: "pi_test_example123",
      customer: {
        email: "test@example.com",
        firstname: "John",
        lastname: "Doe",
        address: {
          line1: "123 Test St",
          line2: "",
          city: "Test City",
          state: "CA",
          postal_code: "12345",
          country: "US",
        },
      },
      products: [
        {
          product_id: "prod_test123",
          name: "Tesla vs Elon Emoji Magnet",
          quantity: 1,
          price: "14.99",
          attributes: [
            {
              name: "emoji_good",
              value: "cowboy",
            },
            {
              name: "emoji_bad",
              value: "crazy_shit",
            },
          ],
        },
        {
          product_id: "prod_test456",
          name: "Tesla vs Elon Emoji Sticker",
          quantity: 1,
          price: "12.99",
          attributes: [
            {
              name: "emoji_good",
              value: "heart",
            },
            {
              name: "emoji_bad",
              value: "orange_sad_face",
            },
          ],
        },
      ],
      total: "27.98",
      currency: "usd",
      status: "paid",
    }

    console.log("🧪 Test emoji flow data:", JSON.stringify(testOrderData, null, 2))

    // Send to backend if configured
    const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL

    if (backendUrl) {
      try {
        console.log("🚀 Test sending to backend:", backendUrl)

        const backendResponse = await fetch(`${backendUrl}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testOrderData),
        })

        const responseText = await backendResponse.text()

        return NextResponse.json({
          success: true,
          message: "Test emoji flow completed",
          testData: testOrderData,
          backendResponse: {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            body: responseText,
          },
        })
      } catch (backendError) {
        console.error("❌ Test backend error:", backendError)
        return NextResponse.json({
          success: false,
          message: "Backend connection failed",
          testData: testOrderData,
          error: String(backendError),
        })
      }
    } else {
      return NextResponse.json({
        success: true,
        message: "Test emoji flow completed (no backend configured)",
        testData: testOrderData,
      })
    }
  } catch (error) {
    console.error("❌ Test emoji flow error:", error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}
