"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart-simplified"
import { getStripe } from "@/lib/stripe"

interface CheckoutButtonProps {
  className?: string
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { items, getTotalPrice } = useCart()

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsLoading(true)

    try {
      console.log("=== STARTING CHECKOUT ===")
      console.log("All cart items:", items)

      // Filter items that have Stripe IDs
      const itemsWithStripeId = items.filter((item) => {
        const hasStripeId = !!(item.stripeId || item.productId || item.id)
        console.log(`Filtering item "${item.name}": hasStripeId = ${hasStripeId}`)
        return hasStripeId
      })

      console.log("Stripe items after filtering:", itemsWithStripeId)
      console.log("Number of Stripe items:", itemsWithStripeId.length)
      console.log("Number of total items:", items.length)

      if (itemsWithStripeId.length === 0) {
        throw new Error("No items with valid Stripe price IDs found")
      }

      console.log("Proceeding with Stripe checkout...")

      // Map to Stripe format
      const stripeLineItems = itemsWithStripeId.map((item) => ({
        price_id: item.stripeId || item.productId || item.id,
        quantity: item.quantity || 1,
      }))

      console.log("Starting Stripe checkout with items:", stripeLineItems)
      console.log("Redirecting to Stripe checkout with line items:", stripeLineItems)

      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: stripeLineItems,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Checkout failed")
      }

      const { sessionId } = data

      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading || items.length === 0} className={className}>
      {isLoading ? "Processing..." : `Checkout - $${getTotalPrice().toFixed(2)}`}
    </Button>
  )
}
