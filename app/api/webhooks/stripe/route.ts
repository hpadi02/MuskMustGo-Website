import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

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
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        console.log("✅ Webhook signature verified")
      } else {
        console.log("⚠️ No webhook secret configured, parsing without verification")
        event = JSON.parse(body)
      }
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("📋 Event type:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.CheckoutSession
      console.log("💳 Processing completed checkout session:", session.id)
      console.log("📋 Session metadata:", session.metadata)

      // Retrieve full session details with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "payment_intent"],
      })

      // Extract customer information
      const customer = {
        email: fullSession.customer_details?.email || "",
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
      const paymentIntent = fullSession.payment_intent as Stripe.PaymentIntent
      const payment_id = paymentIntent?.id || ""

      // Process line items and add emoji attributes from metadata
      const products =
        fullSession.line_items?.data.map((lineItem, index) => {
          const product: any = {
            product_id: lineItem.price?.product as string,
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

          return product
        }) || []

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
          console.log("📤 Sending order to backend:", backendUrl)

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
            console.log("✅ Order sent to backend successfully")
          } else {
            console.error("❌ Backend response error:", backendResponse.status)
            const errorText = await backendResponse.text()
            console.error("❌ Backend error details:", errorText)
          }
        } catch (backendError) {
          console.error("❌ Failed to send to backend:", backendError)
        }
      } else {
        console.log("⚠️ No backend URL configured, skipping backend send")
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("💥 === WEBHOOK ERROR ===")
    console.error("💥 Error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
