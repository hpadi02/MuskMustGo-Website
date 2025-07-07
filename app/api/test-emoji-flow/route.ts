import { NextResponse } from "next/server"

export async function GET() {
  const envStatus = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      API_BASE_URL: process.env.API_BASE_URL ? "✅ Set" : "❌ Not set",
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Not set",
      STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Not set",
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Not set",
    },
    emojiFlow: {
      status: "✅ Ready",
      description: "Emoji attributes will be captured and sent to backend",
      flow: [
        "1. User customizes emoji product",
        "2. Cart stores customOptions with teslaEmoji/elonEmoji",
        "3. Checkout API extracts emoji data and stores in Stripe metadata",
        "4. Webhook reads metadata and converts to product attributes",
        "5. Backend receives order with emoji_good/emoji_bad attributes",
      ],
    },
    testInstructions: {
      step1: "Go to /product/customize-emoji/tesla-vs-elon",
      step2: "Select Tesla emoji (positive) and Elon emoji (negative)",
      step3: "Add to cart and complete checkout",
      step4: "Check logs for emoji attributes in order data",
    },
  }

  return NextResponse.json(envStatus, { status: 200 })
}
