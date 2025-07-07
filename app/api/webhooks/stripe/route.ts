import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { readFileSync, unlinkSync } from "fs"
import { join } from "path"

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

      // Try to retrieve saved cart data
      let savedCartData = null
      try {
        // Use /tmp for Vercel, temp for nginx
        const isVercel = process.env.VERCEL === "1"
        const tempDir = isVercel ? require("os").tmpdir() : join(process.cwd(), "temp")
        const cartFilePath = join(tempDir, `cart-${session.id}.json`)

        console.log(`🔍 Looking for cart data at: ${cartFilePath}`)
        const cartDataString = readFileSync(cartFilePath, "utf8")
        savedCartData = JSON.parse(cartDataString)
        console.log("📋 Retrieved saved cart data:", savedCartData)

        // Clean up the temporary file
        unlinkSync(cartFilePath)
        console.log("🗑️ Cleaned up cart data file")
      } catch (error) {
        console.warn("⚠️ Could not retrieve saved cart data:", error)
        console.warn("⚠️ This might be normal if no customizations were made")
      }

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

      // Extract products with emoji attributes
      const products =
        sessionWithLineItems.line_items?.data.map((item) => {
          const product = item.price?.product as Stripe.Product
          const productData: any = {
            product_id: product.id,
            quantity: item.quantity || 1,
          }

          // Find matching cart item with customizations
          if (savedCartData) {
            const cartItem = savedCartData.find(
              (cartItem: any) => cartItem.stripeId === item.price?.id || cartItem.productId === product.id,
            )

            if (cartItem && cartItem.customOptions) {
              console.log("🎨 Found cart item with customizations:", cartItem.customOptions)

              // Check if this is a Tesla vs Elon emoji product
              const productName = product.name?.toLowerCase() || ""
              if (productName.includes("tesla") && productName.includes("emoji")) {
                const attributes = []

                // Add Tesla emoji as 'emoji_good'
                if (cartItem.customOptions.teslaEmoji && cartItem.customOptions.teslaEmoji.name) {
                  attributes.push({
                    name: "emoji_good",
                    value: cartItem.customOptions.teslaEmoji.name,
                  })
                  console.log("✅ Added Tesla emoji attribute:", cartItem.customOptions.teslaEmoji.name)
                }

                // Add Elon emoji as 'emoji_bad'
                if (cartItem.customOptions.elonEmoji && cartItem.customOptions.elonEmoji.name) {
                  attributes.push({
                    name: "emoji_bad",
                    value: cartItem.customOptions.elonEmoji.name,
                  })
                  console.log("✅ Added Elon emoji attribute:", cartItem.customOptions.elonEmoji.name)
                }

                if (attributes.length > 0) {
                  productData.attributes = attributes
                  console.log("🎯 Final product attributes:", productData.attributes)
                }
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

      console.log("📋 Order data with attributes:", JSON.stringify(orderData, null, 2))

      // Send to Ed's backend API
      const backendUrl = process.env.API_BASE_URL
      if (backendUrl) {
        try {
          // Build complete URL - handle different backend URL formats
          let fullBackendUrl = backendUrl
          if (!backendUrl.includes("/orders")) {
            fullBackendUrl = backendUrl.endsWith("/") ? `${backendUrl}orders` : `${backendUrl}/orders`
          }

          console.log("🌐 Sending to backend URL:", fullBackendUrl)

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          }

          // Add authentication if provided
          if (process.env.BACKEND_API_KEY) {
            headers["Authorization"] = `Bearer ${process.env.BACKEND_API_KEY}`
          }

          const response = await fetch(fullBackendUrl, {
            method: "POST",
            headers,
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
        console.warn("⚠️ Please set API_BASE_URL in your environment variables")
      }
    } catch (error) {
      console.error("❌ Error processing webhook:", error)
      return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
