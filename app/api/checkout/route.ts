import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { groupProducts } from "@/lib/stripe-products"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== STARTING CHECKOUT ===")

    const body = await request.json()
    const { items } = body

    console.log("All cart items:", items)

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Group products by their Stripe product ID
    const groupedProducts = groupProducts(items)
    console.log("Grouped products:", groupedProducts)

    // Filter items that have Stripe IDs
    const stripeItems = groupedProducts.filter((item) => item.hasStripeId)
    console.log("Stripe items after filtering:", stripeItems)
    console.log("Number of Stripe items:", stripeItems.length)
    console.log("Number of total items:", groupedProducts.length)

    if (stripeItems.length === 0) {
      return NextResponse.json({ error: "No valid Stripe products found" }, { status: 400 })
    }

    console.log("Proceeding with Stripe checkout...")

    // Create line items for Stripe
    const lineItems = stripeItems.map((item) => {
      console.log(`Processing item: ${item.name}`)
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }
    })

    console.log("Creating checkout session with items:", lineItems)

    // Prepare session metadata
    const sessionMetadata: Record<string, string> = {}

    // Add emoji attributes to metadata if they exist
    stripeItems.forEach((item, index) => {
      if (item.customizations?.selectedEmoji) {
        sessionMetadata[`item_${index}_emoji`] = item.customizations.selectedEmoji
        console.log(`Added emoji metadata for item ${index}:`, item.customizations.selectedEmoji)
      }
      if (item.customizations?.emojiType) {
        sessionMetadata[`item_${index}_emoji_type`] = item.customizations.emojiType
        console.log(`Added emoji type metadata for item ${index}:`, item.customizations.emojiType)
      }
    })

    console.log("Session metadata:", sessionMetadata)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      metadata: sessionMetadata,
    })

    console.log("Checkout session created successfully:", session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Checkout error:", error)

    // More detailed error logging
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
