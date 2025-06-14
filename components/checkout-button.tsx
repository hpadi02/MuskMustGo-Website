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
      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            price_id: item.price_id,
            quantity: item.quantity,
          })),
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      })

      const { sessionId } = await response.json()

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
