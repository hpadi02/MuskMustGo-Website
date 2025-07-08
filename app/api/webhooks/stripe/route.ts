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

      console.log("💳 Processing completed checkout session:", session.id)

      // Retrieve full session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      })

      // Extract customer information
      const customer = {
        email: fullSession.customer_details?.email || "",
        firstname: fullSession.customer_details?.name?.split(" ")[0] || "",
        lastname: fullSession.customer_details?.name?.split(" ").slice(1).join(" ") || "",
        address: {
          line1: fullSession.customer_details?.address?.line1 || "",
          line2: fullSession.customer_details?.address?.line2 || "",
          city: fullSession.customer_details?.address?.city || "",
          state: fullSession.customer_details?.address?.state || "",
          postal_code: fullSession.customer_details?.address?.postal_code || "",
          country: fullSession.customer_details?.address?.country || "",
        },
      }

      // Process products with emoji attributes
      const products = []
      const lineItems = fullSession.line_items?.data || []

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
        const emojiGood = fullSession.metadata?.[`item_${i}_emoji_good`]
        const emojiBad = fullSession.metadata?.[`item_${i}_emoji_bad`]

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
        sessionId: fullSession.id,
        payment_id: fullSession.payment_intent,
        customer: customer,
        products: products,
        total: ((fullSession.amount_total || 0) / 100).toFixed(2),
        currency: fullSession.currency || "usd",
        status: fullSession.payment_status,
      }

      console.log("📦 Webhook order data:", JSON.stringify(orderData, null, 2))

      // Send to backend
      const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL

      if (backendUrl) {
        try {
          console.log("🚀 Webhook sending to backend:", backendUrl)

          const backendResponse = await fetch(`${backendUrl}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          })

          if (backendResponse.ok) {
            console.log("✅ Webhook successfully sent to backend")
          } else {
            console.error("❌ Webhook backend response error:", await backendResponse.text())
          }
        } catch (backendError) {
          console.error("❌ Webhook error sending to backend:", backendError)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
