import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function createCheckoutSession(cartItems: any[]) {
  try {
    console.log("🛒 Creating checkout session for items:", cartItems)

    const lineItems = cartItems.map((item) => ({
      price: item.stripeId,
      quantity: item.quantity,
    }))

    // ✅ Enhanced metadata extraction with item indexing
    const metadata: Record<string, string> = {}

    cartItems.forEach((item, index) => {
      console.log(`🎭 Processing item ${index}:`, item)

      // Check if this item has emoji customizations
      if (item.customOptions?.teslaEmoji && item.customOptions?.elonEmoji) {
        console.log(`🎭 Found emoji customizations for item ${index}:`, item.customOptions)

        try {
          // Store emoji data with item index for multiple emoji products
          metadata[`item_${index}_tesla_emoji`] = JSON.stringify(item.customOptions.teslaEmoji)
          metadata[`item_${index}_elon_emoji`] = JSON.stringify(item.customOptions.elonEmoji)
          metadata[`item_${index}_variant`] = item.customOptions.variant || "magnet"
          metadata[`item_${index}_product_id`] = item.id

          console.log(`✅ Stored emoji metadata for item ${index}:`, {
            tesla: metadata[`item_${index}_tesla_emoji`],
            elon: metadata[`item_${index}_elon_emoji`],
            variant: metadata[`item_${index}_variant`],
            productId: metadata[`item_${index}_product_id`],
          })
        } catch (error) {
          console.error(`❌ Error storing emoji metadata for item ${index}:`, error)
        }
      } else {
        console.log(`📦 Item ${index} has no emoji customizations`)
      }
    })

    console.log("🔄 Final metadata for Stripe session:", metadata)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.PUBLIC_URL || "http://localhost:3000"}/cart`,
      metadata,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    })

    console.log("✅ Checkout session created successfully:", session.id)
    return { sessionId: session.id }
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    throw error
  }
}
