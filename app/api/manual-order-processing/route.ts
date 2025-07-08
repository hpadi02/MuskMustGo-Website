import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 === MANUAL ORDER PROCESSING STARTED ===")
    console.log("⏰ Timestamp:", new Date().toISOString())

    const { sessionId } = await request.json()
    console.log("🔑 Processing session ID:", sessionId)

    if (!sessionId) {
      console.error("❌ No session ID provided")
      return NextResponse.json({ success: false, error: "No session ID provided" }, { status: 400 })
    }

    // Retrieve the Stripe session with all details
    console.log("💳 Retrieving Stripe session...")
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    })

    if (!session) {
      console.error("❌ No session found for ID:", sessionId)
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    console.log("✅ Stripe session retrieved successfully")
    console.log("📋 Session metadata:", JSON.stringify(session.metadata, null, 2))

    // Get payment intent ID
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || session.id

    console.log("💰 Payment Intent ID:", paymentIntentId)

    // Build order data for Ed's backend
    const orderData = {
      sessionId: session.id,
      payment_id: paymentIntentId,
      customer: {
        email: session.customer_details?.email || "",
        firstname: session.customer_details?.name?.split(" ")[0] || "",
        lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
        addr1: session.customer_details?.address?.line1 || "",
        addr2: session.customer_details?.address?.line2 || "",
        city: session.customer_details?.address?.city || "",
        state_prov: session.customer_details?.address?.state || "",
        postal_code: session.customer_details?.address?.postal_code || "",
        country: session.customer_details?.address?.country || "",
      },
      products:
        session.line_items?.data.map((item, itemIndex) => {
          const product_id =
            typeof item.price?.product === "string" ? item.price.product : item.price?.product?.id || ""

          console.log(`🎭 Processing product ${itemIndex + 1}: ${product_id}`)

          // Check for emoji attributes in metadata
          const emojiGood = session.metadata?.[`item_${itemIndex}_emoji_good`]
          const emojiBad = session.metadata?.[`item_${itemIndex}_emoji_bad`]

          if (emojiGood && emojiBad) {
            console.log(`🎭 Found emoji attributes for item ${itemIndex}:`)
            console.log(`  - emoji_good: ${emojiGood}`)
            console.log(`  - emoji_bad: ${emojiBad}`)

            return {
              product_id,
              name: item.description || "Unknown Product",
              quantity: item.quantity || 1,
              price: ((item.amount_total || 0) / 100).toFixed(2),
              attributes: [
                { name: "emoji_good", value: emojiGood },
                { name: "emoji_bad", value: emojiBad },
              ],
            }
          }

          // For non-emoji products
          return {
            product_id,
            name: item.description || "Unknown Product",
            quantity: item.quantity || 1,
            price: ((item.amount_total || 0) / 100).toFixed(2),
          }
        }) || [],
      total: ((session.amount_total || 0) / 100).toFixed(2),
      currency: session.currency || "usd",
      status: session.payment_status,
      created_at: new Date().toISOString(),
    }

    console.log("📤 Manual processing: Order data built")
    console.log("📤 Order data:", JSON.stringify(orderData, null, 2))

    // Send to Ed's backend
    const API_BASE_URL = process.env.API_BASE_URL || "https://elonmustgo.com"
    const backendUrl = `${API_BASE_URL}/api/orders`

    console.log("🌐 Sending to backend URL:", backendUrl)

    try {
      const backendResponse = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      console.log("📡 Backend response status:", backendResponse.status)

      if (backendResponse.ok) {
        const result = await backendResponse.json()
        console.log("✅ Manual processing: Order sent to backend successfully")
        console.log("✅ Backend response:", result)

        return NextResponse.json({
          success: true,
          message: "Order processed successfully",
          orderData: orderData,
          backendResponse: result,
        })
      } else {
        const errorText = await backendResponse.text()
        console.error("❌ Manual processing: Backend error:", errorText)

        return NextResponse.json({
          success: false,
          error: "Backend processing failed",
          orderData: orderData,
          backendError: errorText,
        })
      }
    } catch (backendError) {
      console.error("❌ Manual processing: Network error:", backendError)

      return NextResponse.json({
        success: false,
        error: "Network error sending to backend",
        orderData: orderData,
        networkError: backendError instanceof Error ? backendError.message : "Unknown error",
      })
    }
  } catch (error) {
    console.error("💥 Manual processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Manual order processing endpoint is running",
    timestamp: new Date().toISOString(),
  })
}
