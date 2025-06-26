import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("=== STRIPE WEBHOOK: CHECKOUT COMPLETED ===")
    console.log("Session ID:", session.id)
    console.log("Payment Status:", session.payment_status)
    console.log("Customer Email:", session.customer_details?.email)

    try {
      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
      })

      console.log("Line Items:", JSON.stringify(lineItems.data, null, 2))

      // Transform line items to our order format
      const orderItems = lineItems.data.map((item) => {
        const product = item.price?.product as Stripe.Product
        const productId = product?.metadata?.product_id || product?.id || "unknown"

        // Base product data
        const orderItem: any = {
          product_id: productId,
          quantity: item.quantity || 1,
        }

        // Check if this is a Tesla vs Elon emoji product and add attributes
        if (productId.includes("tesla_vs_elon_emoji")) {
          // Try to get emoji choices from product metadata or session metadata
          // Since we can't access the cart data directly in the webhook,
          // we'll need to store this information in the Stripe session metadata
          const sessionMetadata = session.metadata || {}

          // Look for emoji data in session metadata
          const emojiData = sessionMetadata.emoji_choices
          if (emojiData) {
            try {
              const parsedEmojis = JSON.parse(emojiData)
              const attributes = []

              // Add Tesla emoji (positive/good)
              if (parsedEmojis.tesla?.name) {
                // Remove file extension and path prefix to get clean name
                const cleanTeslaName = parsedEmojis.tesla.name.replace(/^\d+_/, "").replace(/\.png$/, "")
                attributes.push({
                  name: "emoji_good",
                  value: cleanTeslaName,
                })
              }

              // Add Elon emoji (negative/bad)
              if (parsedEmojis.elon?.name) {
                // Remove file extension and path prefix to get clean name
                const cleanElonName = parsedEmojis.elon.name.replace(/^\d+_/, "").replace(/\.png$/, "")
                attributes.push({
                  name: "emoji_bad",
                  value: cleanElonName,
                })
              }

              if (attributes.length > 0) {
                orderItem.attributes = attributes
                console.log("Added emoji attributes:", attributes)
              }
            } catch (parseError) {
              console.error("Failed to parse emoji data:", parseError)
            }
          } else {
            console.log("No emoji choices found in session metadata for Tesla vs Elon product")
          }
        }

        return orderItem
      })

      // Prepare order data for Ed's backend
      const orderData = {
        customer: {
          email: session.customer_details?.email || "customer@example.com",
          firstname: session.customer_details?.name?.split(" ")[0] || "Customer",
          lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "User",
          addr1: session.shipping_details?.address?.line1 || "",
          addr2: session.shipping_details?.address?.line2 || "",
          city: session.shipping_details?.address?.city || "",
          state_prov: session.shipping_details?.address?.state || "",
          postal_code: session.shipping_details?.address?.postal_code || "",
          country: session.shipping_details?.address?.country || "US",
        },
        payment_id: session.id,
        products: orderItems, // Now includes attributes for emoji products
        shipping: (session.shipping_cost?.amount_total || 0) / 100, // Convert from cents
        tax: (session.total_details?.amount_tax || 0) / 100, // Convert from cents
      }

      console.log("Order data for backend:", JSON.stringify(orderData, null, 2))

      // POST to Ed's backend API - UPDATED to use localhost as default
      const backendUrl = process.env.API_BASE_URL || "http://localhost:5000"

      const backendResponse = await fetch(`${backendUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (backendResponse.ok) {
        const result = await backendResponse.text()
        console.log("✅ Successfully posted order to Ed's backend:", result)

        // Store successful order data for success page
        // We'll use a different approach since we can't access localStorage from webhook
        // The success page will fetch this data using the session ID
      } else {
        console.error("❌ Failed to post to Ed's backend:", backendResponse.status, await backendResponse.text())
      }
    } catch (error) {
      console.error("Error processing webhook:", error)
      // Don't return error - we don't want to cause Stripe to retry
    }
  }

  return NextResponse.json({ received: true })
}
