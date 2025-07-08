import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log("🔄 Processing order for session:", sessionId)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    console.log("📋 Session retrieved:", {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      metadata: session.metadata,
    })

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Extract customer information
    const customer = {
      email: session.customer_details?.email || "",
      firstname: session.customer_details?.name?.split(" ")[0] || "",
      lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
      address: session.customer_details?.address
        ? {
            line1: session.customer_details.address.line1 || "",
            line2: session.customer_details.address.line2 || "",
            city: session.customer_details.address.city || "",
            state: session.customer_details.address.state || "",
            postal_code: session.customer_details.address.postal_code || "",
            country: session.customer_details.address.country || "",
          }
        : {},
    }

    // Process line items and extract emoji attributes from metadata
    const products = []
    const lineItems = session.line_items?.data || []

    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i]
      const product = item.price?.product as Stripe.Product

      // Extract emoji attributes from session metadata
      const emojiGood = session.metadata?.[`item_${i}_emoji_good`]
      const emojiBad = session.metadata?.[`item_${i}_emoji_bad`]
      const productId = session.metadata?.[`item_${i}_product_id`]

      const attributes = []
      if (emojiGood) {
        attributes.push({ name: "emoji_good", value: emojiGood })
      }
      if (emojiBad) {
        attributes.push({ name: "emoji_bad", value: emojiBad })
      }

      products.push({
        product_id: typeof product === "string" ? product : product?.id || "",
        name: typeof product === "string" ? "Product" : product?.name || "Unknown Product",
        quantity: item.quantity || 1,
        price: ((item.amount_total || 0) / 100).toFixed(2),
        attributes: attributes.length > 0 ? attributes : undefined,
      })
    }

    // Prepare order data for backend
    const orderData = {
      sessionId: session.id,
      payment_id: session.payment_intent as string,
      customer,
      products,
      total: ((session.amount_total || 0) / 100).toFixed(2),
      currency: session.currency || "usd",
      created_at: new Date().toISOString(),
    }

    console.log("📤 Sending order data to backend:", JSON.stringify(orderData, null, 2))

    // Send to backend
    const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL

    if (!API_BASE_URL) {
      console.warn("⚠️ No API_BASE_URL configured, skipping backend submission")
      return NextResponse.json({
        success: true,
        message: "Order processed locally (no backend configured)",
        orderData,
      })
    }

    const backendResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (backendResponse.ok) {
      const backendResult = await backendResponse.json()
      console.log("✅ Backend response:", backendResult)

      return NextResponse.json({
        success: true,
        message: "Order processed successfully",
        orderData,
        backendResponse: backendResult,
      })
    } else {
      const errorText = await backendResponse.text()
      console.error("❌ Backend error:", errorText)

      return NextResponse.json({
        success: false,
        error: `Backend error: ${backendResponse.status}`,
        orderData, // Still return order data for display
      })
    }
  } catch (error) {
    console.error("❌ Error processing order:", error)
    return NextResponse.json(
      {
        error: "Failed to process order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
