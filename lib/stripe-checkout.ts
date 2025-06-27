import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export async function createCheckoutSession(items: any[]) {
  try {
    console.log("Creating checkout session with items:", items)

    // Prepare metadata for emoji products
    const metadata: Record<string, string> = {}

    // Check if any items have custom emoji options
    items.forEach((item, index) => {
      if (
        item.customOptions &&
        (item.id?.includes("tesla_vs_elon_emoji") || item.customId?.includes("tesla_vs_elon_emoji"))
      ) {
        // Store emoji choices in metadata
        metadata.emoji_choices = JSON.stringify(item.customOptions)
        console.log("Adding emoji choices to session metadata:", item.customOptions)
      }
    })

    // Transform items to Stripe format
    const lineItems = items.map((item) => ({
      price: item.stripeId, // Use the Stripe price ID
      quantity: item.quantity,
    }))

    console.log("Stripe line items:", lineItems)
    console.log("Session metadata:", metadata)

    // Create checkout session
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: lineItems,
        metadata: metadata, // Include metadata with emoji choices
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cart`,
      }),
    })

    const { sessionId, error } = await response.json()

    if (error) {
      console.error("Checkout session creation failed:", error)
      return { success: false, error }
    }

    console.log("Checkout session created:", sessionId)

    // Redirect to Stripe Checkout
    const stripe = await stripePromise
    if (!stripe) {
      return { success: false, error: "Stripe failed to load" }
    }

    const { error: redirectError } = await stripe.redirectToCheckout({
      sessionId,
    })

    if (redirectError) {
      console.error("Stripe redirect error:", redirectError)

      // Check if it's a redirect blocking issue (common in preview environments)
      if (redirectError.message?.includes("blocked") || redirectError.message?.includes("redirect")) {
        return {
          success: false,
          error: "Redirect blocked in preview environment",
          isRedirectBlocked: true,
        }
      }

      return { success: false, error: redirectError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Checkout error:", error)
    return { success: false, error: "Failed to create checkout session" }
  }
}
