"use client"

import { useEffect } from "react"
import { useCart } from "@/hooks/use-cart-simplified"

export function CartClearer() {
  const { clearCart, items } = useCart()

  useEffect(() => {
    // Clear cart when component mounts (success page loads)
    console.log("CartClearer mounted, clearing cart...")
    console.log("Current cart items before clearing:", items)

    // Use a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      clearCart()
      console.log("Cart cleared via clearCart function")
    }, 100)

    return () => clearTimeout(timer)
  }, [clearCart]) // Only depend on clearCart, not items to avoid infinite loops

  return null
}
