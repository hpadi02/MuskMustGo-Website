import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    console.log("=== STRIPE SESSION API DEBUG ===")
    console.log("1. Session ID received:", sessionId)
    console.log("2. STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY)
    console.log("3. STRIPE_SECRET_KEY starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 7))

    if (!sessionId) {
      console.error("❌ No session ID provided")
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY not configured")
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    // Initialize Stripe with proper API version
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20", // Use the same version as in lib/stripe.ts
    })

    console.log("4. Stripe client initialized successfully")
    console.log("5. Attempting to retrieve session:", sessionId)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.price.product", "payment_intent", "customer"],
    })

    console.log("6. ✅ Session retrieved successfully!")
    console.log("7. Session details:", {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      payment_intent_type: typeof session.payment_intent,
      payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    })

    // Extract payment intent ID properly
    let paymentIntentId = null
    if (typeof session.payment_intent === "string") {
      paymentIntentId = session.payment_intent
    } else if (session.payment_intent && typeof session.payment_intent === "object") {
      paymentIntentId = session.payment_intent.id
    }

    // Build comprehensive response
    const responseData = {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      payment_intent: paymentIntentId,
      customer_details: {
        email: session.customer_details?.email || null,
        name: session.customer_details?.name || null,
        phone: session.customer_details?.phone || null,
        address: session.customer_details?.address || null,
      },
      shipping_details: {
        address: session.shipping_details?.address || null,
        name: session.shipping_details?.name || null,
      },
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
    }

    console.log("8. ✅ Returning response data:", responseData)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("❌ STRIPE SESSION API ERROR:")
    console.error("Error type:", error?.constructor?.name)
    console.error("Error message:", error?.message)

    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripe error details:", {
        type: error.type,
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      })

      return NextResponse.json(
        {
          error: "Stripe API error",
          message: error.message,
          type: error.type,
          code: error.code,
          statusCode: error.statusCode,
        },
        { status: error.statusCode || 500 },
      )
    }

    console.error("Full error object:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch session details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
