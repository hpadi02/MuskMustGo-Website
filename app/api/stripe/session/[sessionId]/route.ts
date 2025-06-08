import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log("Fetching Stripe session:", sessionId)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.price.product"],
    })

    console.log("Retrieved session:", {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      line_items_count: session.line_items?.data?.length || 0,
    })

    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      shipping_cost: session.shipping_cost,
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
    return NextResponse.json({ error: "Failed to fetch session details" }, { status: 500 })
  }
}
