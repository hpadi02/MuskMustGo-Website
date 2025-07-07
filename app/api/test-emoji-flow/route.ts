import { NextResponse } from "next/server"

export async function GET() {
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
  }

  return NextResponse.json({
    message: "Emoji Flow Test Endpoint",
    environment: envStatus,
    timestamp: new Date().toISOString(),
    instructions: {
      step1: "Go to /product/customize-emoji/tesla-vs-elon",
      step2: "Select Tesla and Elon emojis",
      step3: "Add to cart and checkout",
      step4: "Check logs for emoji attributes",
    },
  })
}
