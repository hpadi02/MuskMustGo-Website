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

    // Extract payment information
    const paymentIntent = session.payment_intent as any
    const payment_id = typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id || ""

    // Process line items and add emoji attributes from metadata
    const products: any[] = []

    if (session.line_items?.data) {
      session.line_items.data.forEach((lineItem, index) => {
        const product: any = {
          product_id: lineItem.price?.product || "",
          quantity: lineItem.quantity || 1,
        }

        // Check for emoji attributes in session metadata
        const emojiGood = session.metadata?.[`item_${index}_emoji_good`]
        const emojiBad = session.metadata?.[`item_${index}_emoji_bad`]

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

        products.push(product)
      })
    }

    // Create order data
    const orderData = {
      customer,
      payment_id,
      products,
      shipping: 0,
      tax: 0,
    }

    console.log("📋 Order data with attributes:", JSON.stringify(orderData, null, 2))

    // Send to backend if configured
    const backendUrl = process.env.API_BASE_URL
    if (backendUrl) {
      try {
        console.log("📤 Sending to backend:", `${backendUrl}/orders`)

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
          console.log("✅ Successfully sent to backend")
        } else {
          console.error("❌ Backend response error:", backendResponse.status)
          const errorText = await backendResponse.text()
          console.error("❌ Backend error details:", errorText)
        }
      } catch (backendError) {
        console.error("❌ Backend request failed:", backendError)
      }
    } else {
      console.log("⚠️ No backend URL configured")
    }

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      orderData,
    })
  } catch (error) {
    console.error("❌ Manual processing error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Processing failed",
      },
      { status: 500 },
    )
  }
}
