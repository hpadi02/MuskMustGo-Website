import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Server-side Stripe instance
import StripeServer from "stripe"

export const stripe = new StripeServer(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})
