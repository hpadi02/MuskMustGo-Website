import { type NextRequest, NextResponse } from "next/server"
import { readFileSync, unlinkSync } from "fs"
import { join } from "path"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    console.log("🔄 Manual processing for session:", sessionId)

    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    // Try to retrieve saved cart data
    let savedCartData = null
    try {
      const isVercel = process.env.VERCEL === "1"
      const tempDir = isVercel ? require("os").tmpdir() : join(process.cwd(), "temp")
      const cartFilePath = join(tempDir, `cart-${sessionId}.json`)

      console.log(`🔍 Looking for cart data at: ${cartFilePath}`)
      const cartDataString = readFileSync(cartFilePath, "utf8")
      savedCartData = JSON.parse(cartDataString)
      console.log("📋 Retrieved saved cart data:", savedCartData)

      // Clean up the temporary file
      unlinkSync(cartFilePath)
      console.log("🗑️ Cleaned up cart data file")
    } catch (error) {
      console.warn("⚠️ Could not retrieve saved cart data:", error)
      return NextResponse.json({ error: "Cart data not found" }, { status: 404 })
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
      session.line_items?.data.map((item) => {
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
          console.log("✅ Order successfully sent to backend with emoji attributes")
          return NextResponse.json({
            success: true,
            message: "Order processed and sent to backend",
            orderData,
          })
        } else {
          console.error("❌ Failed to send order to backend:", response.status, response.statusText)
          return NextResponse.json({ error: "Failed to send to backend" }, { status: 500 })
        }
      } catch (error) {
        console.error("❌ Error sending order to backend:", error)
        return NextResponse.json({ error: "Backend communication failed" }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: "No backend URL configured" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error processing manual order:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
