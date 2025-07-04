"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { toast } from "sonner"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever items change (but only after mount)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id)

      if (existingItem) {
        toast.success(`Updated ${newItem.name} quantity`)
        return currentItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        toast.success(`Added ${newItem.name} to cart`)
        return [...currentItems, { ...newItem, quantity: 1 }]
      }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((item) => item.id === id)
      if (item) {
        toast.success(`Removed ${item.name} from cart`)
      }
      return currentItems.filter((item) => item.id !== id)
    })
  }, [])

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id)
        return
      }

      setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
    toast.success("Cart cleared")
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const value = {
    items,
    itemCount,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
