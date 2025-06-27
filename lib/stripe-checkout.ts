import { stripe } from "./stripe"

export interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  customizations?: {
    selectedEmoji?: string
    emojiType?: string
    [key: string]: any
  }
}

export async function createCheckoutSession(items: CheckoutItem[], successUrl: string, cancelUrl: string) {
  try {
    console.log("Creating checkout session for items:", items)

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Prepare metadata for custom attributes
    const metadata: Record<string, string> = {}
    items.forEach((item, index) => {
      if (item.customizations) {
        Object.entries(item.customizations).forEach(([key, value]) => {
          if (typeof value === "string") {
            metadata[`item_${index}_${key}`] = value
          }
        })
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    })

    return session
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

export async function retrieveCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    })
    return session
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    throw error
  }
}
