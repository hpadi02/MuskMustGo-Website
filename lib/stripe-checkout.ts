import { getStripe } from "./stripe"

export interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  stripeId?: string
  customizations?: {
    selectedEmoji?: string
    customId?: string
    emojiType?: string
  }
}

export interface CheckoutResponse {
  sessionId?: string
  url?: string
  error?: string
  details?: string
}

export async function createCheckoutSession(items: CheckoutItem[]): Promise<CheckoutResponse> {
  try {
    console.log("Creating checkout session with items:", items)

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Checkout session creation failed:", data)
      throw new Error(data.error || "Failed to create checkout session")
    }

    console.log("Checkout session created:", data)
    return data
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return {
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function redirectToCheckout(sessionId: string) {
  try {
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error("Stripe failed to load")
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      console.error("Stripe redirect error:", error)
      throw error
    }
  } catch (error) {
    console.error("Error redirecting to checkout:", error)
    throw error
  }
}
