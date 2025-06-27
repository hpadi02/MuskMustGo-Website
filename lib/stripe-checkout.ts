import { getStripe } from "./stripe"
import type { CartItem } from "@/hooks/use-cart-simplified"

export interface CheckoutResult {
  success: boolean
  error?: string
  isRedirectBlocked?: boolean
}

export async function createCheckoutSession(items: CartItem[]): Promise<CheckoutResult> {
  try {
    console.log("Creating checkout session with items:", items)

    // Filter items that have Stripe price IDs
    const stripeItems = items.filter((item) => item.stripeId)

    if (stripeItems.length === 0) {
      console.log("No Stripe items found, using fallback")
      return {
        success: false,
        error: "No items available for Stripe checkout",
      }
    }

    // Create checkout session on server
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: stripeItems.map((item) => ({
          price: item.stripeId,
          quantity: item.quantity,
          metadata: item.customOptions
            ? {
                customOptions: JSON.stringify(item.customOptions),
              }
            : undefined,
        })),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Checkout API error:", errorData)
      return {
        success: false,
        error: errorData.error || `Server error: ${response.status}`,
      }
    }

    const { sessionId } = await response.json()

    if (!sessionId) {
      return {
        success: false,
        error: "No session ID returned from server",
      }
    }

    // Redirect to Stripe Checkout
    const stripe = await getStripe()
    if (!stripe) {
      return {
        success: false,
        error: "Stripe failed to load",
      }
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      console.error("Stripe redirect error:", error)
      return {
        success: false,
        error: error.message,
        isRedirectBlocked: error.message?.includes("redirect"),
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Checkout session creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
