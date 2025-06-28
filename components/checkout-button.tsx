"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { createCheckoutSession } from "@/lib/stripe-checkout"
import { useToast } from "@/hooks/use-toast"

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { items, clearCart } = useCart()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Starting checkout with items:", items)

      const result = await createCheckoutSession(items)

      if (result.success) {
        // Clear cart on successful checkout initiation
        clearCart()
      } else {
        console.error("Checkout failed:", result.error)
        toast({
          title: "Checkout failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Button onClick={handleCheckout} disabled={isLoading || items.length === 0} className="w-full" size="lg">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Checkout (${total.toFixed(2)})
        </>
      )}
    </Button>
  )
}
