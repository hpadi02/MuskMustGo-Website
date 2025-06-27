import { getStripe } from "./stripe"

export interface CheckoutItem {
  price: string
  quantity: number
  metadata?: Record<string, string>
}

export async function createCheckoutSession(items: CheckoutItem[]) {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create checkout session")
    }

    const { sessionId } = await response.json()

    const stripe = await getStripe()
    if (!stripe) {
      throw new Error("Stripe failed to load")
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Checkout error:", error)
    throw error
  }
}
