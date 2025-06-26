"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart-simplified"
import { useToast } from "@/hooks/use-toast"

interface CheckoutButtonProps {
  className?: string
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { items, getCartTotal } = useCart()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("=== STARTING CHECKOUT ===")
      console.log("Cart items:", items)

      // Map cart items to Stripe format
      const stripeItems = items.map((item) => {
        console.log("Processing item:", {
          id: item.id,
          name: item.name,
          stripeId: item.stripeId,
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
        })

        // Use stripeId if available, otherwise fall back to productId or id
        const priceId = item.stripeId || item.productId || item.id

        if (!priceId) {
          throw new Error(`No Stripe price ID found for item: ${item.name}`)
        }

        return {
          price_id: priceId,
          quantity: item.quantity,
        }
      })

      console.log("Stripe items:", stripeItems)

      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: stripeItems,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      })

      console.log("Checkout API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Checkout API error:", errorData)
        throw new Error(`Checkout failed: ${response.status} - ${errorData}`)
      }

      const { sessionId } = await response.json()
      console.log("Got session ID:", sessionId)

      if (!sessionId) {
        throw new Error("No session ID returned from checkout API")
      }

      // Redirect to Stripe Checkout
      const stripe = await import("@stripe/stripe-js").then((mod) =>
        mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
      )

      if (!stripe) {
        throw new Error("Failed to load Stripe")
      }

      console.log("Redirecting to Stripe checkout...")
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        console.error("Stripe redirect error:", error)
        throw new Error(error.message || "Failed to redirect to Stripe checkout")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "An unknown error occurred during checkout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading || items.length === 0} className={className} size="lg">
      {isLoading ? "Processing..." : `Checkout - $${getCartTotal().toFixed(2)}`}
    </Button>
  )
}
