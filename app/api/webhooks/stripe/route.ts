import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Make webhook secret optional for testing
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get("stripe-signature") as string

  let event: Stripe.Event

  // Only verify webhook signature if secret is provided
  if (endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: any) {
      console.error(`❌ Webhook signature verification failed.`, err.message)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }
  } else {
    console.warn("⚠️ No webhook secret provided, skipping signature verification")
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error("❌ Failed to parse webhook body:", err)
      return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 })
    }
  }

  console.log(`✅ Webhook received: ${event.type}`)

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Get the session with line items
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      })

      console.log("📦 Processing completed checkout session:", session.id)
      console.log("📋 Session metadata:", JSON.stringify(session.metadata, null, 2))

      // Extract customer information
      const customer = {
        email: session.customer_details?.email || "",
        firstname: session.customer_details?.name?.split(" ")[0] || "",
        lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
        addr1: session.customer_details?.address?.line1 || "",
        addr2: session.customer_details?.address?.line2 || "",
        city: session.customer_details?.address?.city || "",
        state_prov: session.customer_details?.address?.state || "",
        postal_code: session.customer_details?.address?.postal_code || "",
        country: session.customer_details?.address?.country || "",
      }

      // Extract products with emoji attributes from Stripe metadata
      const products =
        sessionWithLineItems.line_items?.data.map((item, index) => {
          const product = item.price?.product as Stripe.Product
          const productData: any = {
            product_id: product.id,
            quantity: item.quantity || 1,
          }

          // Check for emoji attributes in metadata
          const emojiGood = session.metadata?.[`item_${index}_emoji_good`]
          const emojiBad = session.metadata?.[`item_${index}_emoji_bad`]

          if (emojiGood || emojiBad) {
            const attributes = []

            if (emojiGood) {
              attributes.push({
                name: "emoji_good",
                value: emojiGood,
              })
              console.log(`✅ Added Tesla emoji attribute: ${emojiGood}`)
            }

            if (emojiBad) {
              attributes.push({
                name: "emoji_bad",
                value: emojiBad,
              })
              console.log(`✅ Added Elon emoji attribute: ${emojiBad}`)
            }

            if (attributes.length > 0) {
              productData.attributes = attributes
              console.log("🎯 Final product attributes:", productData.attributes)
            }
          }

          return productData
        }) || []

      // Prepare order data for backend
      const orderData = {
        customer,
        payment_id: session.payment_intent as string,
        products,
        shipping: session.shipping_cost?.amount_total || 0,
        tax: session.total_details?.amount_tax || 0,
      }

      console.log("📋 Order data with attributes:", JSON.stringify(orderData, null, 2))

      // Send to Ed's backend API using your existing working configuration
      const backendUrl = process.env.API_BASE_URL
      if (backendUrl) {
        try {
          const fullBackendUrl = `${backendUrl}/orders`
          console.log("🌐 Sending to backend URL:", fullBackendUrl)

          const response = await fetch(fullBackendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          })

          if (response.ok) {
            const responseData = await response.text()
            console.log("✅ Order successfully sent to Ed's backend with emoji attributes")
            console.log("✅ Backend response:", responseData)
          } else {
            const errorText = await response.text()
            console.error("❌ Failed to send order to Ed's backend:")
            console.error("❌ Status:", response.status)
            console.error("❌ Error:", errorText)
          }
        } catch (error) {
          console.error("❌ Error sending order to Ed's backend:", error)
        }
      } else {
        console.warn("⚠️ No API_BASE_URL configured, order not sent to backend")
      }
    } catch (error) {
      console.error("❌ Error processing webhook:", error)
      return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
