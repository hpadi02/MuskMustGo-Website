import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== CHECKOUT API STARTED ===")

    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("No items provided")
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    console.log("Processing", items.length, "items")

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const metadata: Record<string, string> = {}

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      console.log(`Processing item ${i}:`, item)

      if (!item.stripeId) {
        console.error(`Item ${i} missing stripeId:`, item)
        continue
      }

      // Add line item
      lineItems.push({
        price: item.stripeId,
        quantity: item.quantity || 1,
      })

      // Add customizations to metadata
      if (item.customizations) {
        console.log(`Adding customizations for item ${i}:`, item.customizations)

        if (item.customizations.selectedEmoji) {
          metadata[`item_${i}_emoji`] = item.customizations.selectedEmoji
        }
        if (item.customizations.customId) {
          metadata[`item_${i}_custom_id`] = item.customizations.customId
        }
        if (item.customizations.emojiType) {
          metadata[`item_${i}_emoji_type`] = item.customizations.emojiType
        }
      }
    }

    if (lineItems.length === 0) {
      console.error("No valid line items created")
      return NextResponse.json({ error: "No valid items for checkout" }, { status: 400 })
    }

    console.log("Line items:", JSON.stringify(lineItems, null, 2))
    console.log("Metadata:", JSON.stringify(metadata, null, 2))

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES"],
      },
      billing_address_collection: "required",
    }

    // Only add metadata if it exists
    if (Object.keys(metadata).length > 0) {
      sessionParams.metadata = metadata
    }

    console.log("Creating Stripe session with params:", JSON.stringify(sessionParams, null, 2))

    const session = await stripe.checkout.sessions.create(sessionParams)

    console.log("Stripe session created successfully:", session.id)
    console.log("Session URL:", session.url)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("=== CHECKOUT API ERROR ===")
    console.error("Error:", error)

    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
