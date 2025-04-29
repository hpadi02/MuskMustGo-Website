"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CheckoutButtonProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    description: string
    model?: string
  }
  quantity?: number
}

export default function CheckoutButton({ product, quantity = 1 }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // Try the main checkout endpoint first
      let response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ ...product, quantity }],
          returnUrl: window.location.origin,
        }),
      })

      let data = await response.json()

      // If the main checkout fails, try the fallback
      if (!response.ok || data.error) {
        console.warn("Primary checkout failed, trying fallback:", data.error)

        response = await fetch("/api/checkout-fallback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [{ ...product, quantity }],
            returnUrl: window.location.origin,
          }),
        })

        data = await response.json()

        if (data.success && !data.url) {
          // If fallback succeeds but doesn't provide a URL, show a message
          toast({
            title: "Checkout Simulated",
            description: "This is a demo checkout. In production, you would be redirected to a payment processor.",
          })
          setIsLoading(false)
          return
        }
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout Error",
        description: "There was a problem processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  )
}
