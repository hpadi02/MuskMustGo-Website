import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { items, successUrl, cancelUrl, metadata } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Prepare line items for Stripe
    const lineItems = items.map((item: any) => ({
      price: item.price,
      quantity: item.quantity,
    }))

    // Get the correct base URL for redirects
    // Use PUBLIC_URL from environment, fallback to detecting from headers
    const getBaseUrl = () => {
      // First try environment variable
      if (process.env.PUBLIC_URL) {
        return process.env.PUBLIC_URL
      }

      // Fallback: try to detect from request headers (for nginx proxy)
      const host = req.headers.get("host")
      const protocol = req.headers.get("x-forwarded-proto") || "https"

      if (host && !host.includes("localhost") && !host.includes("127.0.0.1") && !host.includes("0.0.0.0")) {
        return `${protocol}://${host}`
      }

      // Final fallback for development
      return process.env.NODE_ENV === "production" ? "https://elonmustgo.com" : "http://localhost:3000"
    }

    const baseUrl = getBaseUrl()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/cart`,
      metadata: metadata || {}, // Include emoji choices in session metadata
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      billing_address_collection: "required",
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
