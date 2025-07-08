import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("🎣 Webhook received:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("🎉 Checkout session completed:", session.id)

      // Extract customer info
      const customerEmail = session.customer_details?.email || "Unknown"

      // Retrieve line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // Build products array with emoji attributes
      const products = []

      for (let i = 0; i < lineItems.data.length; i++) {
        const item = lineItems.data[i]
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
        sessionId: session.id,
        payment_id: session.payment_intent,
        customer: {
          email: customerEmail,
          firstname: session.customer_details?.name?.split(" ")[0] || "Unknown",
          lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
          address: session.customer_details?.address || {},
        },
        products: products,
        total: ((session.amount_total || 0) / 100).toFixed(2),
        currency: session.currency || "usd",
        status: session.payment_status,
      }

      console.log("📦 Webhook order data:", JSON.stringify(orderData, null, 2))

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
          console.log("✅ Successfully sent to backend via webhook")
        } else {
          console.log("⚠️ Backend response not OK via webhook")
        }
      } catch (backendError) {
        console.log("⚠️ Backend error via webhook:", backendError)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
