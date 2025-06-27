"use client"

import { loadStripe } from "@stripe/stripe-js"
import type { CartItem } from "@/hooks/use-cart-simplified"

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Check if we're in an iframe (preview environment)
const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

export async function createCheckoutSession(items: CartItem[]) {
  try {
    console.log("=== STRIPE CHECKOUT CLIENT ===")
    console.log("Starting Stripe checkout with items:", items)

    // Check if we're in an iframe first
    if (isInIframe()) {
      console.log("Detected iframe environment, skipping Stripe redirect")
      return {
        success: false,
        error:
          "Stripe checkout is not available in preview mode. In production, this would redirect to Stripe's secure checkout page.",
        isRedirectBlocked: true,
      }
    }

    const stripe = await stripePromise

    if (!stripe) {
      console.error("Stripe failed to initialize")
      return {
        success: false,
        error: "Stripe failed to initialize. Please check your connection.",
      }
    }

    // Filter items to only include those with Stripe price IDs
    const stripeItems = items.filter((item) => item.stripeId)
    console.log("Filtered Stripe items:", stripeItems)

    if (stripeItems.length === 0) {
      console.error("No valid Stripe products in cart")
      return {
        success: false,
        error: "No valid Stripe products in cart. Please add products with Stripe integration.",
      }
    }

    // Prepare items for checkout API
    const checkoutItems = stripeItems.map((item) => ({
      stripeId: item.stripeId,
      quantity: item.quantity,
      baseId: item.baseId,
      product_name: item.name,
      name: item.name,
      customOptions: item.customOptions, // Include custom options for emoji products
    }))

    console.log("Sending to checkout API:", checkoutItems)

    // Call our checkout API
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: checkoutItems,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cart`,
      }),
    })

    console.log("Checkout API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Checkout API error:", errorData)
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: Failed to create checkout session`,
      }
    }

    const { sessionId, url } = await response.json()
    console.log("Checkout session created:", sessionId)

    // Redirect to Stripe Checkout
    if (url) {
      console.log("Redirecting to Stripe URL:", url)
      window.location.href = url
      return { success: true }
    } else {
      console.log("Using sessionId for redirect:", sessionId)
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        console.error("Stripe redirect error:", error)
        return {
          success: false,
          error: error.message || "Failed to redirect to Stripe checkout",
        }
      }

      return { success: true }
    }
  } catch (error) {
    console.error("=== STRIPE CHECKOUT ERROR ===")
    console.error("Error creating checkout session:", error)

    // Check if it's a navigation/iframe error
    if (error instanceof Error && error.message.includes("navigate the target frame")) {
      return {
        success: false,
        error:
          "Stripe checkout is not available in preview mode. In production, this would redirect to Stripe's secure checkout page.",
        isRedirectBlocked: true,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
