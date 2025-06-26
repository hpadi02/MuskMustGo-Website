import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
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

      // Extract products with potential emoji attributes
      const products =
        sessionWithLineItems.line_items?.data.map((item) => {
          const product = item.price?.product as Stripe.Product
          const productData: any = {
            product_id: product.id,
            quantity: item.quantity || 1,
          }

          // Check if this is a Tesla vs Elon emoji product and extract emoji choices
          const productName = product.name?.toLowerCase() || ""
          if (productName.includes("tesla") && productName.includes("emoji")) {
            // Extract emoji choices from session metadata
            const metadata = session.metadata || {}
            const teslaEmoji = metadata.tesla_emoji
            const elonEmoji = metadata.elon_emoji

            if (teslaEmoji || elonEmoji) {
              productData.attributes = []

              if (teslaEmoji) {
                // Remove .png extension and path if present
                const cleanTeslaEmoji = teslaEmoji.replace(/^.*\//, "").replace(/\.png$/, "")
                productData.attributes.push({
                  name: "emoji_good",
                  value: cleanTeslaEmoji,
                })
              }

              if (elonEmoji) {
                // Remove .png extension and path if present
                const cleanElonEmoji = elonEmoji.replace(/^.*\//, "").replace(/\.png$/, "")
                productData.attributes.push({
                  name: "emoji_bad",
                  value: cleanElonEmoji,
                })
              }
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

      console.log("📋 Order data:", JSON.stringify(orderData, null, 2))

      // Send to backend API
      const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
      if (backendUrl) {
        try {
          const response = await fetch(`${backendUrl}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
            },
            body: JSON.stringify(orderData),
          })

          if (response.ok) {
            console.log("✅ Order successfully sent to backend")
          } else {
            console.error("❌ Failed to send order to backend:", response.status, response.statusText)
          }
        } catch (error) {
          console.error("❌ Error sending order to backend:", error)
        }
      } else {
        console.warn("⚠️ No backend URL configured, order not sent")
      }
    } catch (error) {
      console.error("❌ Error processing webhook:", error)
      return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
