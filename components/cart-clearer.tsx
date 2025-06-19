"use client"

import { useEffect, useRef } from "react"
import { useCart } from "@/hooks/use-cart-simplified"

export function CartClearer() {
  const { clearCart } = useCart()
  const hasCleared = useRef(false)

  useEffect(() => {
    // Only clear once per page load
    if (hasCleared.current) return

    console.log("CartClearer mounted, clearing cart once...")
    hasCleared.current = true

    // Clear cart immediately without delay
    clearCart()
    console.log("Cart cleared via clearCart function")
  }, [clearCart])

  return null
}
