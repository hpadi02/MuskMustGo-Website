"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/hooks/use-cart-simplified"

export function CartClearer() {
  const [isMounted, setIsMounted] = useState(false)
  const cart = useCart() // Move useCart outside the conditional

  // Only access cart after component mounts to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    try {
      console.log("Success page loaded - clearing cart")
      cart.clearCart()
    } catch (error) {
      console.error("Error clearing cart:", error)
      // Fallback: clear localStorage directly
      try {
        localStorage.removeItem("cart")
        localStorage.setItem("cart", "[]")
        console.log("Cart cleared via localStorage fallback")
      } catch (storageError) {
        console.error("Failed to clear cart via localStorage:", storageError)
      }
    }
  }, [isMounted, cart])

  return null // This component doesn't render anything
}
