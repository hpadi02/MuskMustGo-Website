import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("\n🚀 === CHECKOUT API STARTED ===")
    console.log("🕐 Timestamp:", new Date().toISOString())

    // Log all headers for debugging
    console.log("\n📋 === REQUEST HEADERS ===")
    const headers = Object.fromEntries(request.headers.entries())
    console.log("All headers:", JSON.stringify(headers, null, 2))

    // Multiple methods to detect the correct base URL
    console.log("\n🔍 === URL DETECTION METHODS ===")

    // Method 1: PUBLIC_URL environment variable (highest priority)
    const publicUrl = process.env.PUBLIC_URL
    console.log("Method 1 - PUBLIC_URL:", publicUrl)

    // Method 2: Nginx proxy headers (should work for your setup)
    const host = request.headers.get("host")
    const forwardedProto = request.headers.get("x-forwarded-proto")
    const nginxUrl = forwardedProto && host ? `${forwardedProto}://${host}` : null
    console.log("Method 2 - Nginx headers:", { host, forwardedProto, nginxUrl })

    // Method 3: Vercel URL
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    console.log("Method 3 - Vercel URL:", vercelUrl)

    // Method 4: API_BASE_URL (if properly formatted)
    const apiBaseUrl = process.env.API_BASE_URL
    console.log("Method 4 - API_BASE_URL:", apiBaseUrl)

    // Method 5: Alternative headers
    const xForwardedHost = request.headers.get("x-forwarded-host")
    const xForwardedProto = request.headers.get("x-forwarded-proto")
    const altUrl = xForwardedProto && xForwardedHost ? `${xForwardedProto}://${xForwardedHost}` : null
    console.log("Method 5 - Alternative headers:", { xForwardedHost, xForwardedProto, altUrl })

    // Method 6: Environment-based fallback
    const envFallback = process.env.NODE_ENV === "production" ? "https://elonmustgo.com" : "http://localhost:3000"
    console.log("Method 6 - Environment fallback:", envFallback)

    // Determine the best URL (priority order)
    const baseUrl = publicUrl || nginxUrl || vercelUrl || apiBaseUrl || altUrl || envFallback
    console.log("\n✅ === SELECTED BASE URL ===")
    console.log("Final baseUrl:", baseUrl)

    const body = await request.json()
    console.log("\n📦 === REQUEST BODY ===")
    console.log("Cart items:", JSON.stringify(body.items, null, 2))

    if (!body.items || body.items.length === 0) {
      console.log("❌ No items in cart")
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Build line items for Stripe
    const lineItems = body.items.map((item: any) => {
      console.log(`\n🏷️ Processing item: ${item.name}`)
      console.log("Item details:", JSON.stringify(item, null, 2))

      const lineItem: any = {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      }

      // Add custom options as metadata
      if (item.customOptions) {
        console.log("📝 Adding custom options:", JSON.stringify(item.customOptions, null, 2))
        lineItem.price_data.product_data.metadata = {}

        // Handle different types of custom options
        Object.entries(item.customOptions).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            lineItem.price_data.product_data.metadata[key] = JSON.stringify(value)
          } else {
            lineItem.price_data.product_data.metadata[key] = String(value)
          }
        })

        console.log("✅ Final metadata:", JSON.stringify(lineItem.price_data.product_data.metadata, null, 2))
      }

      return lineItem
    })

    console.log("\n💳 === CREATING STRIPE SESSION ===")
    console.log("Line items for Stripe:", JSON.stringify(lineItems, null, 2))

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/cart`

    console.log("Success URL:", successUrl)
    console.log("Cancel URL:", cancelUrl)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        source: "muskmustgo-website",
        timestamp: new Date().toISOString(),
      },
    })

    console.log("\n🎉 === STRIPE SESSION CREATED ===")
    console.log("Session ID:", session.id)
    console.log("Session URL:", session.url)
    console.log("Session metadata:", JSON.stringify(session.metadata, null, 2))

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("\n❌ === CHECKOUT ERROR ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
