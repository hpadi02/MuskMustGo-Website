import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const envStatus = {
    stripe_secret: !!process.env.STRIPE_SECRET_KEY,
    stripe_public: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    api_base_url: process.env.API_BASE_URL || "Not set",
    backend_api_key: !!process.env.BACKEND_API_KEY,
    webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
    node_env: process.env.NODE_ENV,
  }

  return NextResponse.json({
    message: "Emoji flow test endpoint",
    environment: envStatus,
    timestamp: new Date().toISOString(),
  })
}
