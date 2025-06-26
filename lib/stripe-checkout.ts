"use client"

import { loadStripe } from "@stripe/stripe-js"
import type { CartItem } from "@/hooks/use-cart"

// Your test publishable key
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51RJKA6HXKGu0DvSUCAmDKPO6FhWBOoaYP2GeyoYVO9JUM3kYWIlCV5w9TCAy5APL2xsxt5nLULXHpqZrmcBPwXUQ00RtQ3Yxdc"

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

// Check if we're in an iframe (preview environment)
const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

export async function createCheckoutSession(items: CartItem[], successUrl: string, cancelUrl: string) {
  try {
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
      return {
        success: false,
        error: "Stripe failed to initialize. Please check your connection.",
      }
    }

    // Filter items to only include those with Stripe price IDs
    const stripeItems = items.filter((item) => item.stripeId)

    if (stripeItems.length === 0) {
      return {
        success: false,
        error: "No valid Stripe products in cart. Please add products with Stripe integration.",
      }
    }

    // Create line items for Stripe checkout
    const lineItems = stripeItems.map((item) => {
      const lineItem: any = {
        price: item.stripeId,
        quantity: item.quantity,
      }

      // Add emoji choices to line item metadata for emoji products
      if (item.customOptions?.tesla && item.customOptions?.elon) {
        const teslaEmojiName =
          item.customOptions.tesla.name ||
          item.customOptions.tesla.path?.split("/").pop()?.replace(".png", "") ||
          "unknown"

        const elonEmojiName =
          item.customOptions.elon.name ||
          item.customOptions.elon.path?.split("/").pop()?.replace(".png", "") ||
          "unknown"

        lineItem.price_data = {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: {
              emoji_good: teslaEmojiName,
              emoji_bad: elonEmojiName,
            },
          },
          unit_amount: Math.round(item.price * 100),
        }

        // Remove the price field since we're using price_data
        delete lineItem.price
      }

      return lineItem
    })

    console.log("Redirecting to Stripe checkout with line items:", lineItems)

    // Redirect to Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
    })

    return { sessionId: session.id, url: session.url }
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

    throw error
  }
}
