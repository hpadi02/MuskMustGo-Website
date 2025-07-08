import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 Testing emoji flow...")

    // Mock order data that matches what we send to Ed's backend
    const testOrderData = {
      customer: {
        email: "test@example.com",
        firstname: "John",
        lastname: "Doe",
        addr1: "123 Test St",
        addr2: "",
        city: "Test City",
        state_prov: "CA",
        postal_code: "12345",
        country: "US",
      },
      payment_id: "pi_test_123456789",
      products: [
        {
          product_id: "prod_SMOn24zhjeCmXm",
          quantity: 1,
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
          product_id: "prod_SMOquwq3mLZSDE",
          quantity: 1,
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
      shipping: 0,
      tax: 0,
    }

    console.log("📋 Test order data:", JSON.stringify(testOrderData, null, 2))

    // Test sending to backend
    const backendUrl = process.env.API_BASE_URL
    if (backendUrl) {
      try {
        console.log("📤 Testing backend connection:", `${backendUrl}/orders`)

        const response = await fetch(`${backendUrl}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.BACKEND_API_KEY && {
              Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
            }),
          },
          body: JSON.stringify(testOrderData),
        })

        if (response.ok) {
          const result = await response.text()
          console.log("✅ Backend test successful:", result)
          return NextResponse.json({
            success: true,
            message: "Backend connection test successful",
            testData: testOrderData,
            backendResponse: result,
          })
        } else {
          const errorText = await response.text()
          console.error("❌ Backend test failed:", response.status, errorText)
          return NextResponse.json({
            success: false,
            error: `Backend returned ${response.status}`,
            testData: testOrderData,
            backendError: errorText,
          })
        }
      } catch (error) {
        console.error("❌ Backend connection failed:", error)
        return NextResponse.json({
          success: false,
          error: "Failed to connect to backend",
          testData: testOrderData,
          connectionError: error instanceof Error ? error.message : "Unknown error",
        })
      }
    } else {
      return NextResponse.json({
        success: false,
        error: "No backend URL configured",
        testData: testOrderData,
        note: "Set API_BASE_URL environment variable",
      })
    }
  } catch (error) {
    console.error("❌ Test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Test failed",
    })
  }
}
