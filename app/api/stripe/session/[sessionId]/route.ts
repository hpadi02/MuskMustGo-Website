import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log("Retrieving Stripe session:", sessionId)

    // Retrieve the session with expanded line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    console.log("Session retrieved successfully")

    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        payment_intent:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        customer_details: session.customer_details,
        amount_total: session.amount_total,
      },
      lineItems: session.line_items?.data || [],
    })
  } catch (error) {
    console.error("Error retrieving session:", error)
    return NextResponse.json(
      {
        error: "Failed to retrieve session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
