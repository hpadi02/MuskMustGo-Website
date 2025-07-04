import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function createCheckoutSession(cartItems: any[]) {
  try {
    console.log("Creating checkout session for items:", cartItems)

    const lineItems = cartItems.map((item) => ({
      price: item.stripeId,
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.PUBLIC_URL || "http://localhost:3000"}/cart`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    })

    console.log("Checkout session created:", session.id)
    return { sessionId: session.id }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}
