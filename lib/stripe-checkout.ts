"use client"

import { loadStripe } from "@stripe/stripe-js"
import type { CartItem } from "@/hooks/use-cart-simplified"

// Get the publishable key and validate it
const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined")
    return null
  }
  if (!key.startsWith("pk_")) {
    console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY should start with 'pk_'")
    return null
  }
  return key
}

// Initialize Stripe with publishable key (only if valid)
const publishableKey = getStripePublishableKey()
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

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

    // Check if we have a valid publishable key
    if (!publishableKey) {
      return {
        success: false,
        error: "Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.",
      }
    }

    const stripe = await stripePromise

    if (!stripe) {
      return {
        success: false,
        error: "Stripe failed to initialize. Please check your publishable key.",
      }
    }

    // Filter items to only include those with Stripe price IDs
    const stripeItems = items.filter((item) => item.stripeId)

    if (stripeItems.length === 0) {
      return { success: false, error: "No valid Stripe products in cart" }
    }

    // Create line items for Stripe checkout
    const lineItems = stripeItems.map((item) => ({
      price: item.stripeId,
      quantity: item.quantity,
    }))

    console.log("Redirecting to Stripe checkout with line items:", lineItems)

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      lineItems,
      mode: "payment",
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/cart`,
      shippingAddressCollection: {
        allowedCountries: ["US", "CA", "GB", "AU"],
      },
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
