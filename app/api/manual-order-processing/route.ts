import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { readFileSync, unlinkSync, existsSync } from "fs"
import { join } from "path"

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

    // Get the session with line items
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    // Try to retrieve saved cart data - nginx specific path
    let savedCartData = null
    try {
      const tempDir = join(process.cwd(), "temp")
      const cartFilePath = join(tempDir, `cart-${sessionId}.json`)

      console.log(`🔍 Looking for cart data at: ${cartFilePath}`)

      if (existsSync(cartFilePath)) {
        const cartDataString = readFileSync(cartFilePath, "utf8")
        savedCartData = JSON.parse(cartDataString)
        console.log("📋 Retrieved saved cart data:", savedCartData)

        // Clean up the temporary file
        unlinkSync(cartFilePath)
        console.log("🗑️ Cleaned up cart data file")
      }
    } catch (error) {
      console.warn("⚠️ Could not retrieve saved cart data:", error)
    }

    // Extract customer information
    const customer = {
      email: sessionWithLineItems.customer_details?.email || "",
      firstname: sessionWithLineItems.customer_details?.name?.split(" ")[0] || "",
      lastname: sessionWithLineItems.customer_details?.name?.split(" ").slice(1).join(" ") || "",
      addr1: sessionWithLineItems.customer_details?.address?.line1 || "",
      addr2: sessionWithLineItems.customer_details?.address?.line2 || "",
      city: sessionWithLineItems.customer_details?.address?.city || "",
      state_prov: sessionWithLineItems.customer_details?.address?.state || "",
      postal_code: sessionWithLineItems.customer_details?.address?.postal_code || "",
      country: sessionWithLineItems.customer_details?.address?.country || "",
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
      payment_id: sessionWithLineItems.payment_intent as string,
      products,
      shipping: sessionWithLineItems.shipping_cost?.amount_total || 0,
      tax: sessionWithLineItems.total_details?.amount_tax || 0,
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
          return NextResponse.json({
            success: true,
            message: "Order processed and sent to backend successfully",
            orderData,
            backendResponse: responseData,
          })
        } else {
          const errorText = await response.text()
          console.error("❌ Failed to send order to Ed's backend:", response.status, errorText)
          return NextResponse.json(
            {
              success: false,
              error: `Backend error: ${response.status}`,
              orderData,
            },
            { status: 500 },
          )
        }
      } catch (error) {
        console.error("❌ Error sending order to Ed's backend:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to connect to backend",
            orderData,
          },
          { status: 500 },
        )
      }
    } else {
      console.warn("⚠️ No API_BASE_URL configured")
      return NextResponse.json(
        {
          success: false,
          error: "No backend URL configured",
          orderData,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Error in manual order processing:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
