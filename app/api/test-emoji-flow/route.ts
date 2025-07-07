import { NextResponse } from "next/server"

export async function GET() {
  const envStatus = {
    stripe: {
      secret_key: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
      publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Missing",
    },
    backend: {
      api_base_url: process.env.API_BASE_URL || "❌ Not set",
      public_api_base_url: process.env.NEXT_PUBLIC_API_BASE_URL || "❌ Not set",
    },
    environment: {
      node_env: process.env.NODE_ENV || "unknown",
      vercel: process.env.VERCEL ? "✅ Running on Vercel" : "❌ Not on Vercel",
    },
  }

  return NextResponse.json({
    status: "Emoji flow test endpoint",
    timestamp: new Date().toISOString(),
    environment: envStatus,
    instructions: {
      "1": "Check environment variables above",
      "2": "Go to /product/customize-emoji/tesla-vs-elon to test emoji selection",
      "3": "Complete checkout with test card 4242424242424242",
      "4": "Check Vercel function logs for emoji data",
      "5": "Look for 'Added Tesla emoji' and 'Added Elon emoji' in logs",
    },
  })
}
