import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== CHECKOUT API CALLED ===")

    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items:", items)
      return NextResponse.json({ error: "Invalid items provided" }, { status: 400 })
    }

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not found")
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 })
    }

    console.log("Creating Stripe session with items:", items)

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      console.log("Processing item:", item)
      if (!item.price) {
        throw new Error(`Missing price ID for item: ${JSON.stringify(item)}`)
      }
      return {
        price: item.price,
        quantity: item.quantity || 1,
      }
    })

    console.log("Line items for Stripe:", lineItems)

    // Create metadata for custom options
    const metadata: Record<string, string> = {}
    items.forEach((item: any, index: number) => {
      if (item.metadata?.customOptions) {
        metadata[`item_${index}_custom_options`] = item.metadata.customOptions
      }
    })

    console.log("Session metadata:", metadata)

    // Get the correct base URL for redirects
    // This is the key fix - use nginx proxy headers instead of request.nextUrl.origin
    const getBaseUrl = () => {
      // Method 1: Use headers from nginx proxy (this should work)
      const host = request.headers.get("host")
      const protocol =
        request.headers.get("x-forwarded-proto") || request.headers.get("x-forwarded-protocol") || "https"

      if (host && !host.includes("localhost") && !host.includes("127.0.0.1") && !host.includes("0.0.0.0")) {
        return `${protocol}://${host}`
      }

      // Method 2: Fallback to environment variable if available
      if (process.env.PUBLIC_URL) {
        return process.env.PUBLIC_URL
      }

      // Method 3: Final fallback based on environment
      return process.env.NODE_ENV === "production" ? "https://elonmustgo.com" : "http://localhost:3000"
    }

    const baseUrl = getBaseUrl()
    console.log("Using base URL:", baseUrl)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
    })

    console.log("Stripe session created:", session.id)
    console.log("Success URL:", `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Checkout API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
