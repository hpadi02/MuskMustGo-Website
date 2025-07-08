import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 === MANUAL ORDER PROCESSING STARTED ===")
    console.log("⏰ Timestamp:", new Date().toISOString())

    const { sessionId } = await request.json()
    console.log("🔑 Session ID received:", sessionId)

    if (!sessionId) {
      console.error("❌ No session ID provided")
      return NextResponse.json({ success: false, error: "No session ID provided" }, { status: 400 })
    }

    // Retrieve the Stripe session with payment intent
    console.log("💳 Retrieving Stripe session...")
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    })

    if (!session) {
      console.error("❌ No session found for ID:", sessionId)
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    console.log("✅ Stripe session retrieved successfully")
    console.log("📋 Session details:")
    console.log("  - Session ID:", session.id)
    console.log("  - Payment status:", session.payment_status)
    console.log("  - Amount total:", session.amount_total)
    console.log("  - Currency:", session.currency)
    console.log("  - Customer email:", session.customer_details?.email)
    console.log("  - Customer name:", session.customer_details?.name)

    // Get the payment intent ID
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || session.id

    console.log("💰 Payment Intent ID:", paymentIntentId)
    console.log("💰 Session metadata:", JSON.stringify(session.metadata, null, 2))

    // Build order data for Ed's backend
    console.log("🏗️ === BUILDING ORDER DATA ===")
    const orderData = {
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
      payment_id: paymentIntentId,
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
              quantity: item.quantity || 1,
              attributes: [
                { name: "emoji_good", value: emojiGood },
                { name: "emoji_bad", value: emojiBad },
              ],
            }
          }

          return {
            product_id,
            quantity: item.quantity || 1,
          }
        }) || [],
      total: ((session.amount_total || 0) / 100).toFixed(2),
      currency: session.currency || "usd",
      shipping: 0,
      tax: 0,
    }

    console.log("📤 === SENDING ORDER TO ED'S BACKEND ===")
    console.log("📤 Order data:", JSON.stringify(orderData, null, 2))

    // Send to Ed's backend
    const API_BASE_URL = process.env.API_BASE_URL || "https://elonmustgo.com"
    const backendUrl = `${API_BASE_URL}/api/orders`

    console.log("🎯 Backend URL:", backendUrl)

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    console.log("📡 Backend response status:", backendResponse.status)

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("❌ Failed to send order to backend:")
      console.error("❌ Status:", backendResponse.status)
      console.error("❌ Error text:", errorText)
      return NextResponse.json(
        { success: false, error: "Failed to process order with backend", orderData },
        { status: 500 },
      )
    }

    const result = await backendResponse.json()
    console.log("✅ Order successfully sent to Ed's backend:")
    console.log("✅ Backend response:", JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      orderData: {
        sessionId: session.id,
        customer: orderData.customer,
        products: orderData.products,
        total: orderData.total,
        currency: orderData.currency,
      },
    })
  } catch (error) {
    console.error("💥 === ORDER PROCESSING ERROR ===")
    console.error("💥 Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
