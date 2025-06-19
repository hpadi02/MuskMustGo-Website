"use client"

import { useEffect } from "react"

export function SimpleCartClearer() {
  useEffect(() => {
    // Simple localStorage clearing without dependencies
    const clearCart = () => {
      try {
        console.log("Clearing cart after successful purchase")
        localStorage.removeItem("cart")
        localStorage.setItem("cart", "[]")

        // Dispatch a storage event to notify other components
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "cart",
            newValue: "[]",
            oldValue: localStorage.getItem("cart"),
          }),
        )

        console.log("Cart successfully cleared")
      } catch (error) {
        console.error("Failed to clear cart:", error)
      }
    }

    // Clear cart immediately
    clearCart()
  }, [])

  return null
}
