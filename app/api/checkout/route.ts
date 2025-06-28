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

    // Parse request body
    const body = await request.json()
    console.log("\n📦 === REQUEST BODY ===")
    console.log("Body:", JSON.stringify(body, null, 2))

    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ No items provided")
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // === URL DETECTION WITH MULTIPLE FALLBACKS ===
    console.log("\n🔍 === URL DETECTION METHODS ===")

    let baseUrl = ""
    let detectionMethod = ""

    // Method 1: PUBLIC_URL environment variable (highest priority)
    if (process.env.PUBLIC_URL) {
      baseUrl = process.env.PUBLIC_URL
      detectionMethod = "Method 1: PUBLIC_URL env var"
      console.log("✅ Method 1 - PUBLIC_URL:", baseUrl)
    }
    // Method 2: Nginx proxy headers (should work for your setup)
    else if (request.headers.get("host") && request.headers.get("x-forwarded-proto")) {
      const host = request.headers.get("host")
      const protocol = request.headers.get("x-forwarded-proto")
      baseUrl = `${protocol}://${host}`
      detectionMethod = "Method 2: Nginx proxy headers"
      console.log("✅ Method 2 - Nginx headers:", { host, protocol, baseUrl })
    }
    // Method 3: Vercel URL
    else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
      detectionMethod = "Method 3: Vercel URL"
      console.log("✅ Method 3 - Vercel URL:", baseUrl)
    }
    // Method 4: API_BASE_URL if properly formatted
    else if (process.env.API_BASE_URL && process.env.API_BASE_URL.startsWith("http")) {
      baseUrl = process.env.API_BASE_URL
      detectionMethod = "Method 4: API_BASE_URL"
      console.log("✅ Method 4 - API_BASE_URL:", baseUrl)
    }
    // Method 5: Alternative headers
    else if (request.headers.get("x-forwarded-host")) {
      const host = request.headers.get("x-forwarded-host")
      const protocol = request.headers.get("x-forwarded-proto") || "https"
      baseUrl = `${protocol}://${host}`
      detectionMethod = "Method 5: Alternative headers"
      console.log("✅ Method 5 - Alternative headers:", { host, protocol, baseUrl })
    }
    // Method 6: Environment-based fallback
    else {
      baseUrl = process.env.NODE_ENV === "production" ? "https://elonmustgo.com" : "http://localhost:3000"
      detectionMethod = "Method 6: Environment fallback"
      console.log("✅ Method 6 - Environment fallback:", baseUrl)
    }

    console.log("\n🎯 === FINAL URL DETECTION ===")
    console.log("Detection method:", detectionMethod)
    console.log("Base URL:", baseUrl)
    console.log("Success URL will be:", `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`)
    console.log("Cancel URL will be:", `${baseUrl}/cart`)

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      console.log("\n📝 Processing item:", item.name)

      // Handle custom options (emoji metadata)
      const metadata: any = {}
      if (item.customOptions) {
        console.log("🎨 Custom options found:", item.customOptions)

        // Handle different customOptions structures
        if (typeof item.customOptions === "object") {
          if (item.customOptions.selectedEmoji) {
            metadata.selectedEmoji = item.customOptions.selectedEmoji
            console.log("😀 Selected emoji:", metadata.selectedEmoji)
          }
          if (item.customOptions.emojiType) {
            metadata.emojiType = item.customOptions.emojiType
            console.log("🎭 Emoji type:", metadata.emojiType)
          }
          // Handle any other custom options
          Object.keys(item.customOptions).forEach((key) => {
            if (key !== "selectedEmoji" && key !== "emojiType") {
              metadata[key] = item.customOptions[key]
              console.log(`🔧 Custom option ${key}:`, metadata[key])
            }
          })
        }
      }

      const lineItem = {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
            metadata: metadata,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      }

      console.log("💰 Line item created:", JSON.stringify(lineItem, null, 2))
      return lineItem
    })

    // Create Stripe checkout session
    console.log("\n💳 === CREATING STRIPE SESSION ===")
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        source: "muskmustgo-website",
        timestamp: new Date().toISOString(),
        detectionMethod: detectionMethod,
      },
    })

    console.log("✅ Stripe session created successfully!")
    console.log("Session ID:", session.id)
    console.log("Session URL:", session.url)
    console.log("Success URL configured:", session.success_url)
    console.log("Cancel URL configured:", session.cancel_url)

    console.log("\n🎉 === CHECKOUT API COMPLETED ===\n")

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("\n❌ === CHECKOUT API ERROR ===")
    console.error("Error details:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")
    console.log("🔚 === CHECKOUT API FAILED ===\n")

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
