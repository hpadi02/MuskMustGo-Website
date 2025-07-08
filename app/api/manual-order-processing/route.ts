import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    console.log("🔄 Manual processing for session:", sessionId)

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    })

    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    // Extract customer info
    const customer = session.customer as Stripe.Customer
    const customerEmail = customer?.email || session.customer_details?.email || "Unknown"

    // Extract line items
    const lineItems = session.line_items?.data || []

    // Build products array with emoji attributes
    const products = []

    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i]
      const product: any = {
        product_id: session.metadata?.[`item_${i}_product_id`] || item.price?.product || "unknown",
        name: item.description || "Unknown Product",
        quantity: item.quantity || 1,
        price: ((item.amount_total || 0) / 100).toFixed(2),
        attributes: [],
      }

      // Add emoji attributes if they exist
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
      customer: {
        email: customerEmail,
        firstname: customer?.name?.split(" ")[0] || "Unknown",
        lastname: customer?.name?.split(" ").slice(1).join(" ") || "",
        address: session.customer_details?.address || {},
      },
      products: products,
      total: ((session.amount_total || 0) / 100).toFixed(2),
      currency: session.currency || "usd",
      status: session.payment_status,
    }

    console.log("📦 Prepared order data:", JSON.stringify(orderData, null, 2))

    // Send to backend
    const API_BASE_URL = process.env.API_BASE_URL || "https://your-backend-api.com"

    try {
      const backendResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (backendResponse.ok) {
        console.log("✅ Successfully sent to backend")
      } else {
        console.log("⚠️ Backend response not OK, but continuing...")
      }
    } catch (backendError) {
      console.log("⚠️ Backend error, but continuing:", backendError)
    }

    return NextResponse.json({
      success: true,
      orderData: orderData,
    })
  } catch (error) {
    console.error("❌ Manual processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process order",
      },
      { status: 500 },
    )
  }
}
