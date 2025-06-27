import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getProductById } from "@/lib/product-data"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== STARTING CHECKOUT ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("No items provided")
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    console.log("All cart items:", items)

    // Filter items that have Stripe IDs
    const stripeItems = items.filter((item: any) => {
      const product = getProductById(item.id)
      const hasStripeId = product && product.stripeId
      console.log(`Filtering item "${product?.name}": hasStripeId = ${hasStripeId}`)
      return hasStripeId
    })

    console.log("Stripe items after filtering:", stripeItems)
    console.log("Number of Stripe items:", stripeItems.length)
    console.log("Number of total items:", items.length)

    if (stripeItems.length === 0) {
      console.error("No items with Stripe IDs found")
      return NextResponse.json({ error: "No purchasable items found" }, { status: 400 })
    }

    console.log("Proceeding with Stripe checkout...")

    // Create line items for Stripe
    const lineItems = stripeItems.map((item: any) => {
      const product = getProductById(item.id)
      console.log(`Creating line item for: ${product?.name}`)

      return {
        price: product!.stripeId,
        quantity: item.quantity || 1,
      }
    })

    console.log("Creating checkout session with items:", lineItems)

    // Prepare metadata
    const metadata: Record<string, string> = {}

    // Add emoji customizations to metadata
    stripeItems.forEach((item: any, index: number) => {
      if (item.customizations) {
        console.log(`Adding customizations for item ${index}:`, item.customizations)

        if (item.customizations.selectedEmoji) {
          metadata[`item_${index}_emoji`] = item.customizations.selectedEmoji
        }
        if (item.customizations.customId) {
          metadata[`item_${index}_custom_id`] = item.customizations.customId
        }
        if (item.customizations.emojiType) {
          metadata[`item_${index}_emoji_type`] = item.customizations.emojiType
        }
      }
    })

    console.log("Session metadata:", metadata)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      metadata,
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "BE",
          "AT",
          "CH",
          "SE",
          "NO",
          "DK",
          "FI",
        ],
      },
    })

    console.log("Checkout session created successfully:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Checkout error:", error)

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
