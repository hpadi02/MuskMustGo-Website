// lib/stripe-checkout.ts

import type Stripe from "stripe"
import { stripe } from "./stripe"
import type { CartItem } from "@/hooks/use-cart"

export async function createStripeCheckout(cartItems: CartItem[], successUrl: string, cancelUrl: string) {
  try {
    console.log("🛒 Creating Stripe checkout with cart items:", JSON.stringify(cartItems, null, 2))

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const metadata: Record<string, string> = {}

    cartItems.forEach((item, index) => {
      console.log(`📦 Processing cart item ${index}:`, item)

      // Add line item
      lineItems.push({
        price: item.stripeId,
        quantity: item.quantity,
      })

      // ✅ Enhanced emoji metadata extraction with item indexing
      if (item.customOptions?.teslaEmoji && item.customOptions?.elonEmoji) {
        console.log(`🎨 Found emoji customization for item ${index}:`, {
          tesla: item.customOptions.teslaEmoji,
          elon: item.customOptions.elonEmoji,
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

          metadata[`item_${index}_variant`] = item.variant || "sticker"
          metadata[`item_${index}_product_id`] = item.productId || ""

          console.log(`✅ Stored emoji metadata for item ${index}`)
        } catch (error) {
          console.error(`❌ Error storing emoji metadata for item ${index}:`, error)
        }
      }
    })

    console.log("📋 Final Stripe session metadata:", JSON.stringify(metadata, null, 2))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
    })

    console.log("✅ Stripe session created successfully:", session.id)
    return { url: session.url }
  } catch (error) {
    console.error("❌ Error creating Stripe checkout:", error)
    throw error
  }
}
