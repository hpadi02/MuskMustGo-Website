import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    console.log("🎣 === STRIPE WEBHOOK RECEIVED ===")
    console.log("⏰ Timestamp:", new Date().toISOString())

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("❌ No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("❌ No webhook secret configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log("✅ Webhook signature verified")
      console.log("📋 Event type:", event.type)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      console.log("💳 Checkout session completed:", session.id)

      // Retrieve full session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product", "payment_intent"],
      })

      // Get payment intent ID
      const paymentIntentId =
        typeof fullSession.payment_intent === "string"
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id || fullSession.id

      console.log("💰 Payment Intent ID:", paymentIntentId)
      console.log("💰 Session metadata:", JSON.stringify(fullSession.metadata, null, 2))

      // Build order data with emoji attributes
      const orderData = {
        sessionId: fullSession.id,
        payment_id: paymentIntentId,
        customer: {
          email: fullSession.customer_details?.email || "",
          firstname: fullSession.customer_details?.name?.split(" ")[0] || "",
          lastname: fullSession.customer_details?.name?.split(" ").slice(1).join(" ") || "",
          addr1: fullSession.customer_details?.address?.line1 || "",
          addr2: fullSession.customer_details?.address?.line2 || "",
          city: fullSession.customer_details?.address?.city || "",
          state_prov: fullSession.customer_details?.address?.state || "",
          postal_code: fullSession.customer_details?.address?.postal_code || "",
          country: fullSession.customer_details?.address?.country || "",
        },
        products:
          fullSession.line_items?.data.map((item, itemIndex) => {
            const product_id =
              typeof item.price?.product === "string" ? item.price.product : item.price?.product?.id || ""

            console.log(`🎭 Webhook processing product ${itemIndex + 1}: ${product_id}`)

            // Check for emoji attributes
            const emojiGood = fullSession.metadata?.[`item_${itemIndex}_emoji_good`]
            const emojiBad = fullSession.metadata?.[`item_${itemIndex}_emoji_bad`]

            if (emojiGood && emojiBad) {
              console.log(`🎭 Webhook found emoji attributes for item ${itemIndex}:`)
              console.log(`  - emoji_good: ${emojiGood}`)
              console.log(`  - emoji_bad: ${emojiBad}`)

              return {
                product_id,
                name: item.description || "Unknown Product",
                quantity: item.quantity || 1,
                price: ((item.amount_total || 0) / 100).toFixed(2),
                attributes: [
                  { name: "emoji_good", value: emojiGood },
                  { name: "emoji_bad", value: emojiBad },
                ],
              }
            }

            // For non-emoji products
            return {
              product_id,
              name: item.description || "Unknown Product",
              quantity: item.quantity || 1,
              price: ((item.amount_total || 0) / 100).toFixed(2),
            }
          }) || [],
        total: ((fullSession.amount_total || 0) / 100).toFixed(2),
        currency: fullSession.currency || "usd",
        status: fullSession.payment_status,
        shipping: 0,
        tax: 0,
      }

      console.log("📤 Webhook sending order to Ed's backend...")
      console.log("📤 Order data:", JSON.stringify(orderData, null, 2))

      // Send to Ed's backend
      const API_BASE_URL = process.env.API_BASE_URL || "https://elonmustgo.com"
      const backendUrl = `${API_BASE_URL}/api/orders`

      try {
        const backendResponse = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (backendResponse.ok) {
          const result = await backendResponse.json()
          console.log("✅ Webhook: Order sent to backend successfully")
          console.log("✅ Backend response:", result)
        } else {
          const errorText = await backendResponse.text()
          console.error("❌ Webhook: Failed to send order to backend:", backendResponse.status)
          console.error("❌ Error:", errorText)
        }
      } catch (error) {
        console.error("❌ Webhook: Error sending to backend:", error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("💥 Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
