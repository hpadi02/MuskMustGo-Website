import Stripe from "stripe"
import type { CartItem } from "@/hooks/use-cart"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function createCheckoutSession(cartItems: CartItem[]) {
  try {
    console.log("🛒 Creating checkout session for items:", cartItems.length)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const metadata: Record<string, string> = {}

    // Process each cart item
    cartItems.forEach((item, index) => {
      console.log(`📦 Processing item ${index}:`, {
        productId: item.productId,
        variant: item.variant,
        hasCustomOptions: !!item.customOptions,
      })

      // Add line item
      lineItems.push({
        price: item.stripeId,
        quantity: item.quantity,
      })

      // ✅ Enhanced emoji metadata extraction with item indexing
      if (item.customOptions?.teslaEmoji && item.customOptions?.elonEmoji) {
        console.log(`🎭 Extracting emoji data for item ${index}:`, {
          tesla: item.customOptions.teslaEmoji.name,
          elon: item.customOptions.elonEmoji.name,
          variant: item.variant,
        })

        try {
          // Store emoji data with item index for multiple emoji products
          metadata[`item_${index}_tesla_emoji`] = JSON.stringify({
            name: item.customOptions.teslaEmoji.name,
            path: item.customOptions.teslaEmoji.path,
          })

          metadata[`item_${index}_elon_emoji`] = JSON.stringify({
            name: item.customOptions.elonEmoji.name,
            path: item.customOptions.elonEmoji.path,
          })

          metadata[`item_${index}_variant`] = item.variant || "magnet"
          metadata[`item_${index}_product_id`] = item.productId

          console.log(`✅ Stored emoji metadata for item ${index}`)
        } catch (error) {
          console.error(`❌ Error storing emoji metadata for item ${index}:`, error)
        }
      }
    })

    // Store total item count for easier processing
    metadata["total_items"] = cartItems.length.toString()

    console.log("📋 Final metadata keys:", Object.keys(metadata))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cart`,
      metadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
    })

    console.log("✅ Checkout session created:", session.id)
    return { url: session.url }
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    throw error
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    console.log("🔍 Retrieving checkout session:", sessionId)

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent", "customer"],
    })

    console.log("✅ Session retrieved with metadata keys:", Object.keys(session.metadata || {}))
    return session
  } catch (error) {
    console.error("❌ Error retrieving checkout session:", error)
    throw error
  }
}
