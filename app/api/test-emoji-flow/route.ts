import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 Testing emoji flow environment")

    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      API_BASE_URL: process.env.API_BASE_URL,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Missing",
      BACKEND_API_KEY: process.env.BACKEND_API_KEY ? "✅ Set" : "❌ Missing",
      timestamp: new Date().toISOString(),
    }

    console.log("🔧 Environment check:", environment)

    return NextResponse.json({
      success: true,
      message: "Emoji flow test endpoint working",
      environment,
      instructions: [
        "1. Go to /product/customize-emoji/tesla-vs-elon",
        "2. Select Tesla emoji (positive) and Elon emoji (negative)",
        "3. Add to cart and checkout",
        "4. Complete payment with test card 4242424242424242",
        "5. Check logs for emoji attributes in checkout and webhook",
      ],
    })
  } catch (error) {
    console.error("❌ Test endpoint error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Test failed" }, { status: 500 })
  }
}
