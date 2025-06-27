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
    console.log("Creating checkout session with items:", items)

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    console.log("Checkout API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Checkout API error:", errorText)
      return {
        success: false,
        error: `Checkout failed: ${response.status} ${errorText}`,
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

    // Redirect to Stripe Checkout
    console.log("Redirecting to Stripe checkout...")
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    })

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
