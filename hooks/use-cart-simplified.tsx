"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

export function useCartSimplified() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("cart", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart:", error)
      }
    }
  }, [items, isLoading])

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id && i.variant === item.variant)

      if (existingItem) {
        const updatedItems = prevItems.map((i) =>
          i.id === item.id && i.variant === item.variant ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i,
        )
        return updatedItems
      } else {
        const newItems = [...prevItems, { ...item, quantity: item.quantity || 1 }]
        return newItems
      }
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }, [])

  const removeItem = useCallback((id: string, variant?: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => !(item.id === id && item.variant === variant))
      return newItems
    })

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    })
  }, [])

  const updateQuantity = useCallback(
    (id: string, quantity: number, variant?: string) => {
      if (quantity <= 0) {
        removeItem(id, variant)
        return
      }

      setItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.id === id && item.variant === variant ? { ...item, quantity } : item,
        )
        return newItems
      })
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading,
  }
}
