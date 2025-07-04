"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  customOptions?: any
  customId?: string
  stripeId?: string
  productId?: string
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

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()
  const clearingRef = useRef(false)

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
        console.log("Loaded cart from localStorage:", parsedCart)
      }
    } catch (error) {
      console.error("Error parsing saved cart:", error)
      setItems([])
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized || clearingRef.current) return

    localStorage.setItem("cart", JSON.stringify(items))
    console.log("Saved cart to localStorage:", items)
  }, [items, isInitialized])

  const generateCustomId = (item: CartItem) => {
    if (!item.customOptions) return item.id
    if (item.customId) return item.customId
    const optionsString = JSON.stringify(item.customOptions)
    return `${item.id}-${optionsString}`
  }

  const addItem = (item: CartItem) => {
    console.log("=== ADDING ITEM TO CART ===")
    console.log("Item details:", {
      id: item.id,
      name: item.name,
      price: item.price,
      stripeId: item.stripeId,
      productId: item.productId,
      customOptions: item.customOptions,
      customId: item.customId,
    })

    const customId = item.customId || (item.customOptions ? generateCustomId(item) : item.id)
    console.log("Generated customId:", customId)

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => (i.customId && i.customId === customId) || (!i.customId && !customId && i.id === item.id),
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity

        toast({
          title: "Cart updated",
          description: `${item.name} quantity updated in your cart`,
        })

        return updatedItems
      } else {
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart`,
        })

        return [...prevItems, { ...item, customId }]
      }
    })
  }

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

  const clearCart = () => {
    if (clearingRef.current) return

    console.log("Clearing cart completely")
    clearingRef.current = true

    setItems([])

    try {
      localStorage.removeItem("cart")
      localStorage.setItem("cart", "[]")
      const check = localStorage.getItem("cart")
      console.log("Cart after clearing:", check)
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error)
    }

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })

    setTimeout(() => {
      clearingRef.current = false
    }, 1000)
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
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
