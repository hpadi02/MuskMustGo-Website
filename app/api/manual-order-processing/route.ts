import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    console.log("🔄 Processing order for session:", sessionId)

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Extract order data
    const orderData = {
      sessionId: session.id,
      customer: {
        email: session.customer_details?.email || "unknown@email.com",
        name: session.customer_details?.name || "Unknown Customer",
      },
      products: [],
      total: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00",
      currency: session.currency || "usd",
      metadata: session.metadata || {},
    }

    // Process line items and extract emoji data from metadata
    if (session.line_items?.data) {
      session.line_items.data.forEach((item: any, index: number) => {
        const product = item.price?.product
        const productData: any = {
          product_id: product?.id || `unknown_${index}`,
          name: product?.name || item.description || "Unknown Product",
          quantity: item.quantity || 1,
          price: item.price?.unit_amount ? (item.price.unit_amount / 100).toFixed(2) : "0.00",
        }

        // Extract emoji attributes from session metadata
        const emojiGoodKey = `item_${index}_emoji_good`
        const emojiBadKey = `item_${index}_emoji_bad`

        if (session.metadata?.[emojiGoodKey] || session.metadata?.[emojiBadKey]) {
          productData.attributes = []

          if (session.metadata[emojiGoodKey]) {
            productData.attributes.push({
              name: "emoji_good",
              value: session.metadata[emojiGoodKey],
            })
          }

          if (session.metadata[emojiBadKey]) {
            productData.attributes.push({
              name: "emoji_bad",
              value: session.metadata[emojiBadKey],
            })
          }
        }

        orderData.products.push(productData)
      })
    }

    console.log("📦 Processed order data:", JSON.stringify(orderData, null, 2))

    // Send to backend
    const backendUrl = process.env.API_BASE_URL || "https://api.muskmustgo.com"

    try {
      console.log("🚀 Sending order to backend:", `${backendUrl}/orders`)

      const backendResponse = await fetch(`${backendUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (backendResponse.ok) {
        const backendResult = await backendResponse.json()
        console.log("✅ Backend response:", backendResult)

        return NextResponse.json({
          success: true,
          message: "Order processed successfully",
          orderData,
          backendResponse: backendResult,
        })
      } else {
        const errorText = await backendResponse.text()
        console.error("❌ Backend error:", errorText)

        return NextResponse.json(
          {
            success: false,
            error: "Backend processing failed",
            orderData,
            backendError: errorText,
          },
          { status: 500 },
        )
      }
    } catch (backendError) {
      console.error("❌ Backend request failed:", backendError)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to connect to backend",
          orderData,
          backendError: backendError instanceof Error ? backendError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Order processing error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
