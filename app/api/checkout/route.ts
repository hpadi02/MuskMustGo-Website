import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 === CHECKOUT API STARTED ===")
    console.log("⏰ Timestamp:", new Date().toISOString())

    const body = await request.json()
    console.log("📥 Request body:", JSON.stringify(body, null, 2))

    const { items, successUrl, cancelUrl, metadata } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ Invalid items:", items)
      return NextResponse.json({ error: "Invalid items provided" }, { status: 400 })
    }

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY not found")
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 })
    }

    console.log("✅ Processing", items.length, "items for checkout")

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      console.log("🔍 Processing item:", JSON.stringify(item, null, 2))
      if (!item.price) {
        throw new Error(`Missing price ID for item: ${JSON.stringify(item)}`)
      }
      return {
        price: item.price,
        quantity: item.quantity || 1,
      }
    })

    console.log("📋 Line items for Stripe:", JSON.stringify(lineItems, null, 2))

    // Create metadata for custom options (emoji choices)
    const sessionMetadata: Record<string, string> = {}

    // Add any metadata passed from the frontend
    if (metadata) {
      Object.assign(sessionMetadata, metadata)
      console.log("📝 Frontend metadata added:", JSON.stringify(metadata, null, 2))
    }

    // Process item-specific metadata
    items.forEach((item: any, index: number) => {
      if (item.metadata?.customOptions) {
        sessionMetadata[`item_${index}_custom_options`] = item.metadata.customOptions
        console.log(`📝 Item ${index} custom options:`, item.metadata.customOptions)
      }

      // Handle emoji choices specifically
      if (item.customOptions) {
        console.log(`🎭 Item ${index} emoji choices:`, JSON.stringify(item.customOptions, null, 2))
        sessionMetadata[`item_${index}_emoji_choices`] = JSON.stringify(item.customOptions)
      }
    })

    console.log("📋 Final session metadata:", JSON.stringify(sessionMetadata, null, 2))

    // ===== COMPREHENSIVE URL DETECTION WITH EXTENSIVE DEBUGGING =====
    console.log("🌐 === URL DETECTION DEBUG ===")

    // Log the problematic original method
    console.log("❌ request.nextUrl.origin (problematic):", request.nextUrl.origin)
    console.log("🔍 request.nextUrl.href:", request.nextUrl.href)
    console.log("🔍 request.nextUrl.host:", request.nextUrl.host)
    console.log("🔍 request.nextUrl.hostname:", request.nextUrl.hostname)
    console.log("🔍 request.nextUrl.protocol:", request.nextUrl.protocol)

    // Log all request headers for debugging
    console.log("📋 === ALL REQUEST HEADERS ===")
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
      console.log(`  ${key}: ${value}`)
    })

    // Log environment variables
    console.log("🔧 === ENVIRONMENT VARIABLES ===")
    console.log("  NODE_ENV:", process.env.NODE_ENV)
    console.log("  API_BASE_URL:", process.env.API_BASE_URL)
    console.log("  PUBLIC_URL:", process.env.PUBLIC_URL)
    console.log("  VERCEL_URL:", process.env.VERCEL_URL)
    console.log("  HOSTNAME:", process.env.HOSTNAME)
    console.log("  PORT:", process.env.PORT)

    // Comprehensive URL detection with multiple fallback methods
    const getBaseUrl = () => {
      console.log("🧪 === TESTING URL DETECTION METHODS ===")

      // Method 1: Environment variable PUBLIC_URL (highest priority)
      if (process.env.PUBLIC_URL) {
        console.log("✅ Method 1 - PUBLIC_URL found:", process.env.PUBLIC_URL)
        return process.env.PUBLIC_URL
      }
      console.log("❌ Method 1 - PUBLIC_URL not set")

      // Method 2: Nginx proxy headers (most reliable for production)
      const host = request.headers.get("host")
      const forwardedProto = request.headers.get("x-forwarded-proto")
      const forwardedProtocol = request.headers.get("x-forwarded-protocol")
      const protocol = forwardedProto || forwardedProtocol || "https"

      console.log("🔍 Method 2 - Nginx headers:")
      console.log("  host:", host)
      console.log("  x-forwarded-proto:", forwardedProto)
      console.log("  x-forwarded-protocol:", forwardedProtocol)
      console.log("  chosen protocol:", protocol)

      if (host && !host.includes("localhost") && !host.includes("127.0.0.1") && !host.includes("0.0.0.0")) {
        const detectedUrl = `${protocol}://${host}`
        console.log("✅ Method 2 - Detected from nginx headers:", detectedUrl)
        return detectedUrl
      }
      console.log("❌ Method 2 - Host header not suitable:", host)

      // Method 3: Vercel environment
      if (process.env.VERCEL_URL) {
        const vercelUrl = `https://${process.env.VERCEL_URL}`
        console.log("✅ Method 3 - Vercel URL:", vercelUrl)
        return vercelUrl
      }
      console.log("❌ Method 3 - VERCEL_URL not set")

      // Method 4: API_BASE_URL (if properly formatted)
      if (process.env.API_BASE_URL && process.env.API_BASE_URL.startsWith("http")) {
        console.log("✅ Method 4 - API_BASE_URL:", process.env.API_BASE_URL)
        return process.env.API_BASE_URL
      }
      console.log("❌ Method 4 - API_BASE_URL not suitable:", process.env.API_BASE_URL)

      // Method 5: Try to construct from other headers
      const xForwardedHost = request.headers.get("x-forwarded-host")
      const xOriginalHost = request.headers.get("x-original-host")
      const alternativeHost = xForwardedHost || xOriginalHost

      if (alternativeHost && !alternativeHost.includes("localhost") && !alternativeHost.includes("127.0.0.1")) {
        const alternativeUrl = `${protocol}://${alternativeHost}`
        console.log("✅ Method 5 - Alternative headers:", alternativeUrl)
        return alternativeUrl
      }
      console.log("❌ Method 5 - Alternative headers not suitable")

      // Method 6: Environment-based fallback
      if (process.env.NODE_ENV === "production") {
        console.log("✅ Method 6 - Production fallback: https://elonmustgo.com")
        return "https://elonmustgo.com"
      } else {
        console.log("✅ Method 6 - Development fallback: http://localhost:3000")
        return "http://localhost:3000"
      }
    }

    const baseUrl = getBaseUrl()
    console.log("🎯 === FINAL SELECTED BASE URL ===")
    console.log("🎯 Base URL:", baseUrl)

    // Construct the final URLs
    const finalSuccessUrl = successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
    const finalCancelUrl = cancelUrl || `${baseUrl}/cart`

    console.log("📤 === STRIPE SESSION URLS ===")
    console.log("📤 Success URL:", finalSuccessUrl)
    console.log("📤 Cancel URL:", finalCancelUrl)

    // Create Stripe checkout session
    console.log("💳 Creating Stripe checkout session...")
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: sessionMetadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      billing_address_collection: "required",
    })

    console.log("✅ === STRIPE SESSION CREATED SUCCESSFULLY ===")
    console.log("✅ Session ID:", session.id)
    console.log("✅ Session URL:", session.url)
    console.log("✅ Success URL sent to Stripe:", finalSuccessUrl)
    console.log("✅ Cancel URL sent to Stripe:", finalCancelUrl)
    console.log("✅ Metadata sent to Stripe:", JSON.stringify(sessionMetadata, null, 2))

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      debug: {
        baseUrl,
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("💥 === CHECKOUT API ERROR ===")
    console.error("💥 Error:", error)
    if (error instanceof Error) {
      console.error("💥 Error message:", error.message)
      console.error("💥 Error stack:", error.stack)
    }
    console.error("💥 Timestamp:", new Date().toISOString())

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
