"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  customOptions?: Record<string, any>
  customId?: string // Added to track unique customized products
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Calculate total items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  // Generate a unique ID for customized products
  const generateCustomId = (item: CartItem) => {
    if (!item.customOptions) return item.id

    // If the item already has a customId, use it
    if (item.customId) return item.customId

    // Create a unique ID based on the product ID and custom options
    const optionsString = JSON.stringify(item.customOptions)
    return `${item.id}-${optionsString}`
  }

  // Add item to cart
  const addItem = (item: CartItem) => {
    console.log("Adding item to cart:", item)

    // Generate a custom ID if the item has customOptions and doesn't already have a customId
    const customId = item.customId || (item.customOptions ? generateCustomId(item) : item.id)

    setItems((prevItems) => {
      // Check if item with same customization already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => (i.customId && i.customId === customId) || (!i.customId && !customId && i.id === item.id),
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity

        toast({
          title: "Cart updated",
          description: `${item.name} quantity updated in your cart`,
        })

        return updatedItems
      } else {
        // Add new item with customId
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart`,
        })

        return [...prevItems, { ...item, customId }]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => (item.customId && item.customId === id) || (!item.customId && item.id === id),
      )

      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} has been removed from your cart`,
        })
      }

      return prevItems.filter((item) => !(item.customId && item.customId === id) && !(!item.customId && item.id === id))
    })
  }

  // Update item quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        (item.customId && item.customId === id) || (!item.customId && item.id === id) ? { ...item, quantity } : item,
      ),
    )
  }

  // Calculate cart total
  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
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
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
