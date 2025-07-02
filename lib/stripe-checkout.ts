import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function createCheckoutSession(cartItems: any[]) {
  try {
    console.log("🛒 Creating Stripe checkout session for items:", cartItems)

    const lineItems = cartItems.map((item, index) => {
      console.log(`🛒 Processing cart item ${index}:`, item)

      return {
        price: item.stripeId,
        quantity: item.quantity,
      }
    })

    // ✅ Enhanced metadata creation with item indexing for emoji products
    const metadata: Record<string, string> = {}

    cartItems.forEach((item, index) => {
      console.log(`🎭 Processing metadata for item ${index}:`, item)

      // Check if this item has emoji customizations
      if (item.customOptions && (item.customOptions.teslaEmoji || item.customOptions.elonEmoji)) {
        console.log(`🎭 Found emoji customizations for item ${index}:`, item.customOptions)

        try {
          // Store emoji data with item index for multiple emoji products
          if (item.customOptions.teslaEmoji) {
            metadata[`item_${index}_tesla_emoji`] = JSON.stringify(item.customOptions.teslaEmoji)
            console.log(`🎭 Stored Tesla emoji for item ${index}:`, item.customOptions.teslaEmoji)
          }

          if (item.customOptions.elonEmoji) {
            metadata[`item_${index}_elon_emoji`] = JSON.stringify(item.customOptions.elonEmoji)
            console.log(`🎭 Stored Elon emoji for item ${index}:`, item.customOptions.elonEmoji)
          }

          if (item.customOptions.variant) {
            metadata[`item_${index}_variant`] = item.customOptions.variant
            console.log(`🎭 Stored variant for item ${index}:`, item.customOptions.variant)
          }
        } catch (error) {
          console.error(`❌ Error storing emoji metadata for item ${index}:`, error)
        }
      }

      // Store basic product info for all items
      metadata[`item_${index}_product_id`] = item.productId || item.id
      metadata[`item_${index}_custom_id`] = item.customId || item.id
    })

    console.log("🎭 Final metadata for Stripe session:", metadata)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/cart`,
      metadata,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    })

    console.log("✅ Stripe checkout session created:", session.id)
    return { sessionId: session.id }
  } catch (error) {
    console.error("❌ Error creating Stripe checkout session:", error)
    throw error
  }
}
