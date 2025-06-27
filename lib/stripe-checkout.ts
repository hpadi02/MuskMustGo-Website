import { getStripe } from "./stripe"

export interface CheckoutItem {
  id: string
  quantity: number
  customizations?: {
    selectedEmoji?: string
    customId?: string
    emojiType?: string
  }
}

export async function redirectToCheckout(items: CheckoutItem[]) {
  try {
    console.log("Stripe checkout initiated with items:", items)

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Checkout session creation failed:", errorData)
      throw new Error(errorData.error || "Failed to create checkout session")
    }

    const { sessionId } = await response.json()
    console.log("Checkout session created:", sessionId)

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
    console.error("Stripe checkout failed:", error)
    throw error
  }
}
