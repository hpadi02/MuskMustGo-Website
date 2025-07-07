import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    console.log("🔄 Manual processing for session:", sessionId)

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    })

    console.log("📋 Session metadata:", session.metadata)

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

    // Extract products with emoji attributes from metadata
    const products =
      session.line_items?.data.map((item, index) => {
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

    // Send to backend API if configured
    const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    if (backendUrl) {
      try {
        const fullBackendUrl = `${backendUrl}/orders`
        console.log("🌐 Sending to backend URL:", fullBackendUrl)

        const response = await fetch(fullBackendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.BACKEND_API_KEY && {
              Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
            }),
          },
          body: JSON.stringify(orderData),
        })

        if (response.ok) {
          const responseData = await response.text()
          console.log("✅ Order successfully sent to backend with emoji attributes")
          console.log("✅ Backend response:", responseData)
        } else {
          const errorText = await response.text()
          console.error("❌ Failed to send order to backend:")
          console.error("❌ Status:", response.status)
          console.error("❌ Error:", errorText)
        }
      } catch (error) {
        console.error("❌ Error sending order to backend:", error)
      }
    } else {
      console.warn("⚠️ No backend URL configured, order not sent to backend")
    }

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      orderData,
    })
  } catch (error) {
    console.error("❌ Error in manual order processing:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
