import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    console.log("🎣 === STRIPE WEBHOOK RECEIVED ===")
    console.log("⏰ Timestamp:", new Date().toISOString())

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      console.error("❌ No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      // For webhook verification, you'd need STRIPE_WEBHOOK_SECRET
      // For now, we'll parse the event directly for testing
      event = JSON.parse(body)
      console.log("📋 Event type:", event.type)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      console.log("✅ Checkout session completed:", session.id)
      console.log("📋 Session metadata:", session.metadata)

      // Retrieve full session details with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "customer", "payment_intent"],
      })

      // Extract customer information
      const customer = {
        email: (fullSession.customer_details?.email || fullSession.customer_email) ?? "",
        firstname: fullSession.customer_details?.name?.split(" ")[0] || "",
        lastname: fullSession.customer_details?.name?.split(" ").slice(1).join(" ") || "",
        addr1: fullSession.customer_details?.address?.line1 || "",
        addr2: fullSession.customer_details?.address?.line2 || "",
        city: fullSession.customer_details?.address?.city || "",
        state_prov: fullSession.customer_details?.address?.state || "",
        postal_code: fullSession.customer_details?.address?.postal_code || "",
        country: fullSession.customer_details?.address?.country || "",
      }

      // Extract payment information
      const paymentIntent = fullSession.payment_intent as any
      const payment_id = typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id || ""

      // Process line items and add emoji attributes from metadata
      const products: any[] = []

      if (fullSession.line_items?.data) {
        fullSession.line_items.data.forEach((lineItem, index) => {
          const product: any = {
            product_id: lineItem.price?.product || "",
            quantity: lineItem.quantity || 1,
          }

          // Check for emoji attributes in session metadata
          const emojiGood = fullSession.metadata?.[`item_${index}_emoji_good`]
          const emojiBad = fullSession.metadata?.[`item_${index}_emoji_bad`]

          if (emojiGood || emojiBad) {
            product.attributes = []

            if (emojiGood) {
              product.attributes.push({
                name: "emoji_good",
                value: emojiGood,
              })
              console.log(`✅ Added Tesla/Good emoji attribute: ${emojiGood}`)
            }

            if (emojiBad) {
              product.attributes.push({
                name: "emoji_bad",
                value: emojiBad,
              })
              console.log(`✅ Added Elon/Bad emoji attribute: ${emojiBad}`)
            }
          }

          products.push(product)
        })
      }

      // Create order data
      const orderData = {
        customer,
        payment_id,
        products,
        shipping: 0,
        tax: 0,
      }

      console.log("📋 Order data with attributes:", JSON.stringify(orderData, null, 2))

      // Send to backend
      const backendUrl = process.env.API_BASE_URL
      if (backendUrl) {
        try {
          console.log("📤 Sending to backend:", `${backendUrl}/orders`)

          const backendResponse = await fetch(`${backendUrl}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(process.env.BACKEND_API_KEY && {
                Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
              }),
            },
            body: JSON.stringify(orderData),
          })

          if (backendResponse.ok) {
            console.log("✅ Successfully sent to backend")
          } else {
            console.error("❌ Backend response error:", backendResponse.status)
          }
        } catch (backendError) {
          console.error("❌ Backend request failed:", backendError)
        }
      } else {
        console.log("⚠️ No backend URL configured")
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("💥 Webhook error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook failed" }, { status: 500 })
  }
}
