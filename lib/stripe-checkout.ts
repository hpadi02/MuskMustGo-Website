import { getStripe } from "./stripe"

export interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  stripeId?: string
  customOptions?: Record<string, any>
}

export interface CheckoutResult {
  success: boolean
  error?: string
  isRedirectBlocked?: boolean
}

export async function createCheckoutSession(items: CheckoutItem[]): Promise<CheckoutResult> {
  try {
    console.log("=== STARTING CHECKOUT ===")
    console.log("All cart items:", items)

    // Filter items that have Stripe IDs
    const stripeItems = items.filter((item) => {
      const hasStripeId = Boolean(item.stripeId)
      console.log(`Filtering item "${item.name}": hasStripeId = ${hasStripeId}`)
      return hasStripeId
    })

    console.log("Stripe items after filtering:", stripeItems)
    console.log("Number of Stripe items:", stripeItems.length)
    console.log("Number of total items:", items.length)

    if (stripeItems.length === 0) {
      return {
        success: false,
        error: "No items with Stripe integration found in cart",
      }
    }

    console.log("Proceeding with Stripe checkout...")

    // Create checkout session
    console.log("Creating checkout session with items:", stripeItems)

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: stripeItems }),
    })

    console.log("Checkout API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Checkout API error:", errorText)
      return {
        success: false,
        error: `Checkout failed: ${response.status} - ${errorText}`,
      }
    }

    const { sessionId, url } = await response.json()
    console.log("Received session ID:", sessionId)
    console.log("Received checkout URL:", url)

    if (!sessionId) {
      return {
        success: false,
        error: "No session ID received from server",
      }
    }

    // Get Stripe instance
    const stripe = await getStripe()
    if (!stripe) {
      return {
        success: false,
        error: "Failed to load Stripe",
      }
    }

    // Check if we're in an iframe (preview environment)
    const isInIframe = () => {
      try {
        return window.self !== window.top
      } catch (e) {
        return true
      }
    }

    if (isInIframe()) {
      console.log("Detected iframe environment, cannot redirect to Stripe")
      return {
        success: false,
        error:
          "Stripe checkout is not available in preview mode. In production, this would redirect to Stripe's secure checkout page.",
        isRedirectBlocked: true,
      }
    }

    // Redirect to Stripe Checkout
    console.log("Redirecting to Stripe checkout...")
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    })

    if (error) {
      console.error("Stripe redirect error:", error)
      return {
        success: false,
        error: error.message || "Failed to redirect to Stripe checkout",
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
