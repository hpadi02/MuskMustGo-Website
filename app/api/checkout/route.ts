import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const { items, successUrl, cancelUrl } = await request.json()

    console.log("=== CHECKOUT API ===")
    console.log("Received items:", JSON.stringify(items, null, 2))

    if (!items || items.length === 0) {
      console.error("No items provided")
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Extract emoji metadata from Tesla vs Elon emoji products
    const metadata: Record<string, string> = {}

    items.forEach((item: any, index: number) => {
      console.log(`Processing item ${index}:`, item)

      // Check if this is a Tesla vs Elon emoji product
      if (
        item.baseId === "tesla_vs_elon_emoji" ||
        item.product_name?.includes("tesla_vs_elon_emoji") ||
        item.name?.includes("Tesla vs Elon Emoji")
      ) {
        console.log("Found Tesla vs Elon emoji product, checking for custom options...")

        if (item.customOptions) {
          console.log("Custom options found:", item.customOptions)

          if (item.customOptions.teslaEmoji) {
            metadata.tesla_emoji = item.customOptions.teslaEmoji
            console.log("Added Tesla emoji to metadata:", item.customOptions.teslaEmoji)
          }

          if (item.customOptions.elonEmoji) {
            metadata.elon_emoji = item.customOptions.elonEmoji
            console.log("Added Elon emoji to metadata:", item.customOptions.elonEmoji)
          }
        }
      }
    })

    console.log("Final metadata:", metadata)

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const lineItem = {
        price: item.stripeId,
        quantity: item.quantity || 1,
      }
      console.log("Created line item:", lineItem)
      return lineItem
    })

    console.log("All line items:", lineItems)

    // Create Stripe checkout session
    const sessionData = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      billing_address_collection: "required",
      ...(Object.keys(metadata).length > 0 && { metadata }), // Only add metadata if it exists
    }

    console.log("Creating Stripe session with data:", JSON.stringify(sessionData, null, 2))

    const session = await stripe.checkout.sessions.create(sessionData)

    console.log("Stripe session created successfully:", session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("=== CHECKOUT API ERROR ===")
    console.error("Error details:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
