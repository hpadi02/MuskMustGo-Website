import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { items, successUrl, cancelUrl } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Prepare line items for Stripe
    const lineItems = items.map((item: any) => ({
      price: item.stripeId,
      quantity: item.quantity,
    }))

    // Extract emoji metadata from Tesla vs Elon emoji products
    const metadata: Record<string, string> = {}

    items.forEach((item: any) => {
      if (item.baseId === "tesla_vs_elon_emoji" && item.customOptions) {
        if (item.customOptions.teslaEmoji) {
          metadata.tesla_emoji = item.customOptions.teslaEmoji
        }
        if (item.customOptions.elonEmoji) {
          metadata.elon_emoji = item.customOptions.elonEmoji
        }
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/cart`,
      metadata, // Include emoji choices in session metadata
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
