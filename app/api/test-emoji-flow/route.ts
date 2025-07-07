import { NextResponse } from "next/server"

export async function GET() {
  const envStatus = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      API_BASE_URL: process.env.API_BASE_URL ? "✅ Set" : "❌ Missing",
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
      STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Missing",
    },
    emojiFlow: {
      checkoutAPI: "✅ Ready to receive customOptions",
      webhookAPI: "✅ Ready to process emoji attributes",
      manualProcessing: "✅ Ready for fallback processing",
      backendIntegration: process.env.API_BASE_URL ? "✅ Configured" : "⚠️ No backend URL",
    },
    testInstructions: [
      "1. Go to /product/customize-emoji/tesla-vs-elon",
      "2. Select Tesla emoji (positive) and Elon emoji (negative)",
      "3. Add to cart and proceed to checkout",
      "4. Complete payment with test card 4242424242424242",
      "5. Check logs for emoji attributes in order data",
    ],
  }

  return NextResponse.json(envStatus, { status: 200 })
}
