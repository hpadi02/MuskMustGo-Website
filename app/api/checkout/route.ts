import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    console.log("=== CHECKOUT API CALLED ===")

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set")
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 })
    }

    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items provided:", items)
      return NextResponse.json({ error: "Invalid items provided" }, { status: 400 })
    }

    console.log("Processing items for Stripe...")

    // Create line items for Stripe
    const lineItems = []
    const sessionMetadata: Record<string, string> = {}

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      console.log(`Processing item ${i + 1}:`, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        stripeId: item.stripeId,
        customOptions: item.customOptions,
      })

      if (!item.stripeId) {
        console.error(`Item ${item.name} is missing stripeId`)
        return NextResponse.json({ error: `Item ${item.name} is missing Stripe price ID` }, { status: 400 })
      }

      // Add line item
      lineItems.push({
        price: item.stripeId,
        quantity: item.quantity,
      })

      // Add custom options to metadata if they exist
      if (item.customOptions) {
        console.log(`Adding custom options for item ${i + 1}:`, item.customOptions)
        sessionMetadata[`item_${i + 1}_custom_options`] = JSON.stringify(item.customOptions)
      }
    }

    console.log("Final line items:", JSON.stringify(lineItems, null, 2))
    console.log("Final session metadata:", JSON.stringify(sessionMetadata, null, 2))

    // Create Stripe checkout session
    console.log("Creating Stripe checkout session...")

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      metadata: sessionMetadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "BE"],
      },
      billing_address_collection: "required",
    })

    console.log("Stripe session created successfully:", {
      id: session.id,
      url: session.url,
      metadata: session.metadata,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Checkout API error:", error)

    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
