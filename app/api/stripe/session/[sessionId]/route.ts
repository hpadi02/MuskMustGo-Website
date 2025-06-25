import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      console.error("No session ID provided")
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log("Fetching Stripe session:", sessionId)

    // Check if we have Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured")
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.price.product", "payment_intent"],
    })

    console.log("Retrieved session:", {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      customer_email: session.customer_details?.email,
    })

    // Return simplified session data
    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      customer_details: session.customer_details,
      shipping_details: session.shipping_details,
      line_items:
        session.line_items?.data?.map((item) => ({
          quantity: item.quantity,
          price: {
            unit_amount: item.price?.unit_amount,
            product: {
              id: (item.price?.product as Stripe.Product)?.id,
              name: (item.price?.product as Stripe.Product)?.name,
              images: (item.price?.product as Stripe.Product)?.images,
              metadata: (item.price?.product as Stripe.Product)?.metadata,
            },
          },
        })) || [],
    })
  } catch (error) {
    console.error("Error fetching Stripe session:", error)

    // Return more specific error information
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: "Stripe error",
          message: error.message,
          type: error.type,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to fetch session details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
