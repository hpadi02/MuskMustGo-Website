import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  customOptions?: Record<string, any>
  customId?: string
  stripeId?: string
  productId?: string
}

export async function createCheckoutSession(items: CartItem[]) {
  try {
    console.log("=== CREATING CHECKOUT SESSION ===")
    console.log("Items received:", items)

    // Filter items to only include those with Stripe price IDs
    const stripeItems = items.filter((item) => item.stripeId)
    console.log("Stripe items:", stripeItems)

    if (stripeItems.length === 0) {
      return {
        success: false,
        error: "No valid Stripe items found",
        isRedirectBlocked: false,
      }
    }

    // Extract emoji choices for metadata - IMPROVED VERSION
    const metadata: Record<string, string> = {}

    items.forEach((item, index) => {
      console.log(`🔍 Processing item ${index + 1} for metadata:`, {
        id: item.id,
        name: item.name,
        customOptions: item.customOptions,
      })

      // ✅ Check if this is the Tesla vs Elon emoji product
      const isEmojiProduct =
        item.id?.includes("tesla_vs_elon_emoji") || item.name?.toLowerCase().includes("tesla vs elon emoji")

      if (isEmojiProduct && item.customOptions) {
        console.log("🎭 Found Tesla vs Elon emoji product with customOptions:", item.customOptions)

        try {
          // ✅ Extract Tesla and Elon emoji choices with error handling
          if (item.customOptions.teslaEmoji) {
            const teslaEmojiData = JSON.stringify(item.customOptions.teslaEmoji)
            metadata[`item_${index}_tesla_emoji`] = teslaEmojiData
            console.log(`✅ Added Tesla emoji for item ${index}:`, item.customOptions.teslaEmoji)
          } else {
            console.warn(`⚠️ No Tesla emoji found for item ${index}`)
          }

          if (item.customOptions.elonEmoji) {
            const elonEmojiData = JSON.stringify(item.customOptions.elonEmoji)
            metadata[`item_${index}_elon_emoji`] = elonEmojiData
            console.log(`✅ Added Elon emoji for item ${index}:`, item.customOptions.elonEmoji)
          } else {
            console.warn(`⚠️ No Elon emoji found for item ${index}`)
          }

          // Also add the variant info
          if (item.customOptions.variant) {
            metadata[`item_${index}_variant`] = item.customOptions.variant
            console.log(`✅ Added variant for item ${index}:`, item.customOptions.variant)
          }
        } catch (error) {
          console.error(`❌ Error processing emoji data for item ${index}:`, error)
        }
      } else if (isEmojiProduct) {
        console.warn(`⚠️ Emoji product found but no customOptions for item ${index}`)
      }
    })

    console.log("📋 Final metadata for Stripe session:", metadata)

    // Create checkout session
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: stripeItems.map((item) => ({
          price: item.stripeId,
          quantity: item.quantity,
        })),
        metadata: metadata, // ✅ Include emoji choices in session metadata
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Checkout API error:", errorData)
      return {
        success: false,
        error: `Checkout failed: ${response.status}`,
        isRedirectBlocked: false,
      }
    }

    const { sessionId } = await response.json()
    console.log("Created session ID:", sessionId)

    // Redirect to Stripe Checkout
    const stripe = await stripePromise
    if (!stripe) {
      return {
        success: false,
        error: "Stripe failed to load",
        isRedirectBlocked: false,
      }
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      console.error("Stripe redirect error:", error)

      // Check if it's a redirect blocking issue (common in preview environments)
      if (error.message?.includes("redirect") || error.message?.includes("blocked")) {
        return {
          success: false,
          error: error.message,
          isRedirectBlocked: true,
        }
      }

      return {
        success: false,
        error: error.message,
        isRedirectBlocked: false,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Checkout session creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      isRedirectBlocked: false,
    }
  }
}
