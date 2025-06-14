"use client"

import { useEffect } from "react"
import { useCart } from "@/hooks/use-cart-simplified"

export function CartClearer() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart when success page loads
    console.log("Success page loaded - clearing cart")
    clearCart()
  }, [clearCart])

  return null // This component doesn't render anything
}
