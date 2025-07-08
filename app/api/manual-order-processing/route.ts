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
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the Stripe session
    console.log("💳 Retrieving Stripe session...")
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    })

    if (!session) {
      console.error("❌ No session found for ID:", sessionId)
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    console.log("✅ Stripe session retrieved successfully")
    console.log("📋 Session details:")
    console.log("  - Session ID:", session.id)
    console.log("  - Payment status:", session.payment_status)
    console.log("  - Amount total:", session.amount_total)
    console.log("  - Customer email:", session.customer_details?.email)

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
            console.log(`✅ Found emoji attributes for item ${itemIndex}:`)
            console.log(`  - Tesla emoji: ${emojiGood}`)
            console.log(`  - Elon emoji: ${emojiBad}`)

            return {
              product_id,
              quantity: item.quantity || 1,
              attributes: [
                { name: "emoji_good", value: emojiGood },
                { name: "emoji_bad", value: emojiBad },
              ],
            }
          }

          // Regular product without attributes
          return {
            product_id,
            quantity: item.quantity || 1,
          }
        }) || [],
      shipping: 0,
      tax: 0,
      total: ((session.amount_total || 0) / 100).toFixed(2),
      currency: session.currency || "usd",
      sessionId: session.id,
    }

    console.log("📤 === SENDING ORDER TO ED'S BACKEND ===")
    console.log("📤 Order data:", JSON.stringify(orderData, null, 2))

    // Determine API URL
    let baseUrl: string
    if (process.env.PUBLIC_URL) {
      baseUrl = process.env.PUBLIC_URL
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else if (process.env.NODE_ENV === "production") {
      baseUrl = "https://elonmustgo.com"
    } else {
      baseUrl = "http://localhost:3000"
    }

    const apiUrl = `${baseUrl}/api/orders`
    console.log("🎯 Final API URL:", apiUrl)

    // Send to Ed's backend
    const backendResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    console.log("📡 Backend response status:", backendResponse.status)

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("❌ Failed to send order to backend:", errorText)
      return NextResponse.json({ error: "Failed to process order", details: errorText }, { status: 500 })
    }

    const result = await backendResponse.json()
    console.log("✅ Order successfully sent to Ed's backend:", result)

    return NextResponse.json({
      success: true,
      orderData,
      backendResponse: result,
    })
  } catch (error) {
    console.error("💥 === ORDER PROCESSING ERROR ===", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
