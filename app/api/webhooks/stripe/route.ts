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

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ No webhook secret configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
      console.log("✅ Webhook signature verified")
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("📨 Webhook event type:", event.type)

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      console.log("🎉 Checkout session completed:", session.id)

      // Retrieve full session details with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product", "payment_intent"],
      })

      console.log("📋 Full session retrieved for webhook processing")
      console.log("💰 Payment Intent ID:", fullSession.payment_intent)
      console.log("💰 Session metadata:", JSON.stringify(fullSession.metadata, null, 2))

      // Build order data for Ed's backend
      const paymentIntentId =
        typeof fullSession.payment_intent === "string"
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id || fullSession.id

      const orderData = {
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
        payment_id: paymentIntentId,
        products:
          fullSession.line_items?.data.map((item, itemIndex) => {
            const product_id =
              typeof item.price?.product === "string" ? item.price.product : item.price?.product?.id || ""

            // Check for emoji attributes in metadata
            const emojiGood = fullSession.metadata?.[`item_${itemIndex}_emoji_good`]
            const emojiBad = fullSession.metadata?.[`item_${itemIndex}_emoji_bad`]

            if (emojiGood && emojiBad) {
              console.log(`🎭 Webhook: Found emoji attributes for item ${itemIndex}`)
              return {
                product_id,
                quantity: item.quantity || 1,
                attributes: [
                  { name: "emoji_good", value: emojiGood },
                  { name: "emoji_bad", value: emojiBad },
                ],
              }
            }

            return {
              product_id,
              quantity: item.quantity || 1,
            }
          }) || [],
        shipping: 0,
        tax: 0,
      }

      console.log("📤 Webhook: Sending order to Ed's backend")

      // Send to Ed's backend
      try {
        let baseUrl: string
        if (process.env.PUBLIC_URL) {
          baseUrl = process.env.PUBLIC_URL
        } else if (process.env.VERCEL_URL) {
          baseUrl = `https://${process.env.VERCEL_URL}`
        } else {
          baseUrl = "https://elonmustgo.com"
        }

        const apiUrl = `${baseUrl}/api/orders`
        const backendResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (backendResponse.ok) {
          const result = await backendResponse.json()
          console.log("✅ Webhook: Order successfully sent to Ed's backend")
        } else {
          console.error("❌ Webhook: Failed to send order to backend")
        }
      } catch (error) {
        console.error("💥 Webhook: Error sending to backend:", error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("💥 === WEBHOOK ERROR ===", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
