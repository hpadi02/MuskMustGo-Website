import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    console.log("🧪 === EMOJI FLOW TEST ENDPOINT ===")
    console.log("⏰ Timestamp:", new Date().toISOString())

    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      API_BASE_URL: process.env.API_BASE_URL || "Not set",
      BACKEND_API_KEY: !!process.env.BACKEND_API_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL || "Not on Vercel",
    }

    console.log("🔧 Environment check:", envCheck)

    // Test data structure that would be sent to backend
    const testOrderData = {
      customer: {
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
        addr1: "123 Test St",
        addr2: "",
        city: "Test City",
        state_prov: "TX",
        postal_code: "12345",
        country: "US",
      },
      payment_id: "pi_test_12345",
      products: [
        {
          product_id: "prod_tesla_emoji_test",
          quantity: 1,
          attributes: [
            {
              name: "emoji_good",
              value: "happy_face_heart_eyes",
            },
            {
              name: "emoji_bad",
              value: "angry_smiley_face",
            },
          ],
        },
      ],
      shipping: 0,
      tax: 0,
    }

    console.log("📋 Test order data structure:", JSON.stringify(testOrderData, null, 2))

    return NextResponse.json({
      success: true,
      message: "Emoji flow test endpoint working",
      environment: envCheck,
      testOrderStructure: testOrderData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Test endpoint error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Test failed",
      },
      { status: 500 },
    )
  }
}
