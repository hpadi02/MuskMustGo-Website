// lib/stripe-checkout.ts

import type { CartItem } from "@/types/CartItem"

export async function createStripeCheckoutSession(cartItems: CartItem[]) {
  // Enhanced metadata creation with item indexing for emoji products
  const metadata: Record<string, string> = {}

  // Add item-indexed metadata for each cart item
  cartItems.forEach((item, index) => {
    console.log(`🔍 Processing cart item ${index}:`, item)

    if (item.customOptions?.teslaEmoji && item.customOptions?.elonEmoji) {
      console.log(`📝 Adding emoji metadata for item ${index}`)

      try {
        metadata[`item_${index}_tesla_emoji`] = JSON.stringify({
          name: item.customOptions.teslaEmoji.name,
          path: item.customOptions.teslaEmoji.path,
        })

        metadata[`item_${index}_elon_emoji`] = JSON.stringify({
          name: item.customOptions.elonEmoji.name,
          path: item.customOptions.elonEmoji.path,
        })

        metadata[`item_${index}_variant`] = item.customOptions.variant || "sticker"
        metadata[`item_${index}_product_id`] = item.productId

        console.log(`✅ Emoji metadata added for item ${index}:`, {
          tesla: item.customOptions.teslaEmoji.name,
          elon: item.customOptions.elonEmoji.name,
          variant: item.customOptions.variant,
        })
      } catch (error) {
        console.error(`❌ Error creating emoji metadata for item ${index}:`, error)
      }
    } else {
      console.log(`ℹ️ Item ${index} has no emoji customization`)
    }
  })

  console.log("📤 Final Stripe metadata:", metadata)
}
