"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createCheckout, updateCheckout } from "@/app/api/shopify/actions"

type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  checkout: () => Promise<string | null>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    const savedCheckoutId = localStorage.getItem("checkoutId")

    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }

    if (savedCheckoutId) {
      setCheckoutId(savedCheckoutId)
    } else {
      // Create a new checkout using server action
      createCheckout()
        .then((result) => {
          if (result.success && result.id) {
            setCheckoutId(result.id)
            localStorage.setItem("checkoutId", result.id)
          } else {
            console.error("Failed to create checkout:", result.error)
          }
        })
        .catch((err) => {
          console.error("Failed to create checkout:", err)
        })
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)

      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const checkout = async (): Promise<string | null> => {
    if (!checkoutId || items.length === 0) return null

    setIsLoading(true)

    try {
      const lineItems = items.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
      }))

      const result = await updateCheckout(checkoutId, lineItems)

      if (result.success && result.webUrl) {
        return result.webUrl
      } else {
        console.error("Error during checkout:", result.error)
        return null
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        checkout,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
