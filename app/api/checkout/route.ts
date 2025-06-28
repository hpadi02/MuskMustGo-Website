import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  console.log("\n🚀 === CHECKOUT API STARTED ===")

  try {
    const body = await request.json()
    console.log("📦 Request body:", JSON.stringify(body, null, 2))

    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ No items provided")
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // === EXTENSIVE URL DETECTION WITH 6 FALLBACK METHODS ===
    console.log("\n🔍 === URL DETECTION STARTED ===")

    // Log all headers for debugging
    console.log("📋 All request headers:")
    request.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`)
    })

    let baseUrl = ""
    let detectionMethod = ""

    // Method 1: PUBLIC_URL environment variable (highest priority)
    if (process.env.PUBLIC_URL) {
      baseUrl = process.env.PUBLIC_URL
      detectionMethod = "Method 1: PUBLIC_URL env var"
      console.log(`✅ ${detectionMethod}: ${baseUrl}`)
    }
    // Method 2: Nginx proxy headers (should work for your setup)
    else if (request.headers.get("host") && request.headers.get("x-forwarded-proto")) {
      const host = request.headers.get("host")
      const protocol = request.headers.get("x-forwarded-proto")
      baseUrl = `${protocol}://${host}`
      detectionMethod = "Method 2: Nginx proxy headers"
      console.log(`✅ ${detectionMethod}: ${baseUrl}`)
    }
    // Method 3: Vercel URL
    else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
      detectionMethod = "Method 3: Vercel URL"
      console.log(`✅ ${detectionMethod}: ${baseUrl}`)
    }
    // Method 4: API_BASE_URL if properly formatted
    else if (process.env.API_BASE_URL && process.env.API_BASE_URL.startsWith("http")) {
      baseUrl = process.env.API_BASE_URL
      detectionMethod = "Method 4: API_BASE_URL"
      console.log(`✅ ${detectionMethod}: ${baseUrl}`)
    }
    // Method 5: Alternative headers
    else if (request.headers.get("x-forwarded-host")) {
      const host = request.headers.get("x-forwarded-host")
      const protocol = request.headers.get("x-forwarded-proto") || "https"
      baseUrl = `${protocol}://${host}`
      detectionMethod = "Method 5: Alternative headers"
      console.log(`✅ ${detectionMethod}: ${baseUrl}`)
    }
    // Method 6: Environment-based fallback
    else {
      baseUrl = process.env.NODE_ENV === "production" ? "https://elonmustgo.com" : "http://localhost:3000"
      detectionMethod = "Method 6: Environment fallback"
      console.log(`✅ ${detectionMethod}: ${baseUrl}`)
    }

    console.log(`🎯 Final base URL: ${baseUrl}`)
    console.log(`📍 Detection method: ${detectionMethod}`)

    // Build URLs
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/cart`

    console.log(`✅ Success URL: ${successUrl}`)
    console.log(`❌ Cancel URL: ${cancelUrl}`)

    // Process line items
    console.log("\n📦 === PROCESSING LINE ITEMS ===")
    const lineItems = items.map((item: any) => {
      console.log(`Processing item:`, JSON.stringify(item, null, 2))

      const lineItem: any = {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }

      // Add custom options as metadata
      if (item.customOptions) {
        console.log("🎨 Adding custom options:", item.customOptions)
        lineItem.price_data.product_data.metadata = {
          customOptions: JSON.stringify(item.customOptions),
        }
      }

      console.log("✅ Line item created:", JSON.stringify(lineItem, null, 2))
      return lineItem
    })

    // Create Stripe session
    console.log("\n💳 === CREATING STRIPE SESSION ===")
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        items: JSON.stringify(items),
      },
    })

    console.log(`✅ Stripe session created: ${session.id}`)
    console.log(`🔗 Checkout URL: ${session.url}`)
    console.log("🚀 === CHECKOUT API COMPLETED ===\n")

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("❌ === CHECKOUT API ERROR ===")
    console.error("Error details:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
