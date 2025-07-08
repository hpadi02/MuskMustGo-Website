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

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Extract customer information
    const customer = {
      email: session.customer_details?.email || "",
      firstname: session.customer_details?.name?.split(" ")[0] || "",
      lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
      address: {
        line1: session.customer_details?.address?.line1 || "",
        line2: session.customer_details?.address?.line2 || "",
        city: session.customer_details?.address?.city || "",
        state: session.customer_details?.address?.state || "",
        postal_code: session.customer_details?.address?.postal_code || "",
        country: session.customer_details?.address?.country || "",
      },
    }

    // Process products with emoji attributes
    const products = []
    const lineItems = session.line_items?.data || []

    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i]
      const product: any = {
        product_id: item.price?.product?.id || "",
        name: item.description || "",
        quantity: item.quantity || 1,
        price: ((item.amount_total || 0) / 100).toFixed(2),
        attributes: [],
      }

      // Extract emoji attributes from session metadata
      const emojiGood = session.metadata?.[`item_${i}_emoji_good`]
      const emojiBad = session.metadata?.[`item_${i}_emoji_bad`]

      if (emojiGood) {
        product.attributes.push({
          name: "emoji_good",
          value: emojiGood,
        })
      }

      if (emojiBad) {
        product.attributes.push({
          name: "emoji_bad",
          value: emojiBad,
        })
      }

      products.push(product)
    }

    // Prepare order data for backend
    const orderData = {
      sessionId: sessionId,
      payment_id: session.payment_intent,
      customer: customer,
      products: products,
      total: ((session.amount_total || 0) / 100).toFixed(2),
      currency: session.currency || "usd",
      status: session.payment_status,
    }

    console.log("📦 Order data prepared:", JSON.stringify(orderData, null, 2))

    // Send to backend
    const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL

    if (backendUrl) {
      try {
        console.log("🚀 Sending to backend:", backendUrl)

        const backendResponse = await fetch(`${backendUrl}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (backendResponse.ok) {
          console.log("✅ Successfully sent to backend")
        } else {
          console.error("❌ Backend response error:", await backendResponse.text())
        }
      } catch (backendError) {
        console.error("❌ Error sending to backend:", backendError)
      }
    }

    return NextResponse.json({
      success: true,
      orderData: orderData,
    })
  } catch (error) {
    console.error("❌ Error processing order:", error)
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
  }
}
