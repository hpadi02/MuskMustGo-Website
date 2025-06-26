import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { items, successUrl, cancelUrl } = await request.json()

    console.log("=== CHECKOUT API CALLED ===")
    console.log("Items received:", items)
    console.log("Success URL:", successUrl)
    console.log("Cancel URL:", cancelUrl)
    console.log("Stripe Secret Key exists:", !!process.env.STRIPE_SECRET_KEY)
    console.log("Stripe Secret Key length:", process.env.STRIPE_SECRET_KEY?.length)

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set")
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 })
    }

    if (!items || items.length === 0) {
      console.error("No items provided")
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Validate that all items have price_id
    for (const item of items) {
      if (!item.price_id) {
        console.error("Item missing price_id:", item)
        return NextResponse.json({ error: `Item missing price_id: ${JSON.stringify(item)}` }, { status: 400 })
      }
    }

    console.log("Creating Stripe checkout session...")
    console.log("Stripe object type:", typeof stripe)
    console.log("Stripe object has checkout:", !!stripe.checkout)
    console.log("Stripe object has sessions:", !!stripe.checkout?.sessions)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => {
        console.log("Creating line item:", {
          price: item.price_id,
          quantity: item.quantity,
        })

        return {
          price: item.price_id,
          quantity: item.quantity || 1,
        }
      }),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      billing_address_collection: "required",
    })

    console.log("Stripe session created:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorDetails = error instanceof Error && "type" in error ? error : null

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        message: errorMessage,
        details: errorDetails,
        stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      },
      { status: 500 },
    )
  }
}
