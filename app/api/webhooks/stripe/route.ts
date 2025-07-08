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

      console.log("✅ Checkout session completed:", session.id)

      // Extract order data
      const orderData = {
        sessionId: session.id,
        customer: {
          email: session.customer_details?.email || "unknown@email.com",
          name: session.customer_details?.name || "Unknown Customer",
        },
        products: [],
        total: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00",
        currency: session.currency || "usd",
        metadata: session.metadata || {},
      }

      // Get line items to extract product details
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ["data.price.product"],
        })

        lineItems.data.forEach((item: any, index: number) => {
          const product = item.price?.product
          const productData: any = {
            product_id: product?.id || `unknown_${index}`,
            name: product?.name || item.description || "Unknown Product",
            quantity: item.quantity || 1,
            price: item.price?.unit_amount ? (item.price.unit_amount / 100).toFixed(2) : "0.00",
          }

          // Extract emoji attributes from session metadata
          const emojiGoodKey = `item_${index}_emoji_good`
          const emojiBadKey = `item_${index}_emoji_bad`

          if (session.metadata?.[emojiGoodKey] || session.metadata?.[emojiBadKey]) {
            productData.attributes = []

            if (session.metadata[emojiGoodKey]) {
              productData.attributes.push({
                name: "emoji_good",
                value: session.metadata[emojiGoodKey],
              })
            }

            if (session.metadata[emojiBadKey]) {
              productData.attributes.push({
                name: "emoji_bad",
                value: session.metadata[emojiBadKey],
              })
            }
          }

          orderData.products.push(productData)
        })
      } catch (lineItemError) {
        console.error("❌ Error fetching line items:", lineItemError)
      }

      console.log("📦 Webhook order data:", JSON.stringify(orderData, null, 2))

      // Send to backend
      const backendUrl = process.env.API_BASE_URL || "https://api.muskmustgo.com"

      try {
        console.log("🚀 Webhook sending order to backend:", `${backendUrl}/orders`)

        const backendResponse = await fetch(`${backendUrl}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (backendResponse.ok) {
          const backendResult = await backendResponse.json()
          console.log("✅ Webhook backend response:", backendResult)
        } else {
          const errorText = await backendResponse.text()
          console.error("❌ Webhook backend error:", errorText)
        }
      } catch (backendError) {
        console.error("❌ Webhook backend request failed:", backendError)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
