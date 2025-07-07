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

    // Create checkout session with FULL item data including customOptions
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: stripeItems.map((item) => ({
          price: item.stripeId,
          quantity: item.quantity,
          // PASS THROUGH THE CUSTOM OPTIONS AND OTHER DATA
          id: item.id,
          productId: item.productId,
          customOptions: item.customOptions, // This is the key fix!
          name: item.name,
        })),
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
