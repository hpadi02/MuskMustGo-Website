"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  customOptions?: Record<string, any>
  customId?: string // Added to track unique customized products
  stripeId?: string // Stripe price ID
  productId?: string // Stripe product ID
  emojiChoices?: {
    emoji_good?: string
    emoji_bad?: string
  }
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  sendOrderToBackend: (customerEmail: string, sessionId: string) => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()
  const toastRef = useRef(toast)
  const clearingRef = useRef(false) // Prevent multiple clear operations

  // Update toast ref when toast changes
  useEffect(() => {
    toastRef.current = toast
  }, [toast])

  // Calculate total items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Listen for storage events (when localStorage is changed from other tabs/components)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart" && !clearingRef.current) {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : []
          console.log("Storage event detected, updating cart:", newCart)
          setItems(newCart)
        } catch (error) {
          console.error("Failed to parse cart from storage event:", error)
          setItems([])
        }
      }
    }

    // Listen for storage events from other windows/tabs
    window.addEventListener("storage", handleStorageChange)

    // Listen for custom cart-clear events
    const handleCartClear = () => {
      if (!clearingRef.current) {
        console.log("Cart clear event detected")
        setItems([])
      }
    }

    window.addEventListener("cart-cleared", handleCartClear)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cart-cleared", handleCartClear)
    }
  }, [])

  // Save cart to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized || clearingRef.current) return

    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items, isInitialized])

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

    // Generate a custom ID if the item has customOptions and doesn't already have a customId
    const customId = item.customId || (item.customOptions ? generateCustomId(item) : item.id)

    console.log("Generated customId:", customId)

    // Store emoji choices for backend submission if this is a Tesla emoji product
    let emojiChoices = item.emojiChoices
    if (item.customOptions && item.id.includes("tesla") && item.id.includes("emoji")) {
      emojiChoices = {
        emoji_good: item.customOptions.tesla?.name || item.customOptions.good?.name,
        emoji_bad: item.customOptions.elon?.name || item.customOptions.bad?.name,
      }
      console.log("=== EMOJI CHOICES DETECTED ===")
      console.log("Tesla emoji (positive):", emojiChoices.emoji_good)
      console.log("Elon emoji (negative):", emojiChoices.emoji_bad)
    }

    setItems((prevItems) => {
      // Check if item with same customization already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => (i.customId && i.customId === customId) || (!i.customId && !customId && i.id === item.id),
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity

        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          toastRef.current({
            title: "Cart updated",
            description: `${item.name} quantity updated in your cart`,
          })
        }, 0)

        return updatedItems
      } else {
        // Add new item with customId and emoji choices
        setTimeout(() => {
          toastRef.current({
            title: "Added to cart",
            description: `${item.name} has been added to your cart`,
          })
        }, 0)

        return [...prevItems, { ...item, customId, emojiChoices }]
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
        setTimeout(() => {
          toastRef.current({
            title: "Removed from cart",
            description: `${itemToRemove.name} has been removed from your cart`,
          })
        }, 0)
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
    // Prevent multiple clear operations
    if (clearingRef.current) return

    console.log("Clearing cart completely")
    clearingRef.current = true

    setItems([])

    // Force clear localStorage immediately and aggressively
    try {
      localStorage.removeItem("cart")
      localStorage.setItem("cart", "[]")
      // Double check it's cleared
      const check = localStorage.getItem("cart")
      console.log("Cart after clearing:", check)

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("cart-cleared"))
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error)
    }

    // Show toast notification only once
    setTimeout(() => {
      toastRef.current({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      })

      // Reset clearing flag after toast
      setTimeout(() => {
        clearingRef.current = false
      }, 1000)
    }, 0)
  }

  // Send order to backend with emoji attributes - THIS IS THE KEY FUNCTION
  const sendOrderToBackend = async (customerEmail: string, sessionId: string) => {
    console.log("=== SENDING ORDER TO BACKEND ===")
    console.log("Customer email:", customerEmail)
    console.log("Stripe session ID:", sessionId)
    console.log("Cart items:", items)

    const orderData = {
      customer_email: customerEmail,
      items: items.map((item) => {
        const baseItem = {
          product_id: item.productId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }

        // Add emoji attributes for Tesla vs Elon Emoji products
        if (item.emojiChoices && (item.emojiChoices.emoji_good || item.emojiChoices.emoji_bad)) {
          console.log("=== ADDING EMOJI ATTRIBUTES ===")
          console.log("Item:", item.name)
          console.log("Emoji good:", item.emojiChoices.emoji_good)
          console.log("Emoji bad:", item.emojiChoices.emoji_bad)

          baseItem.attributes = []

          if (item.emojiChoices.emoji_good) {
            baseItem.attributes.push({
              name: "emoji_good",
              value: item.emojiChoices.emoji_good, // Already without .png extension
            })
          }

          if (item.emojiChoices.emoji_bad) {
            baseItem.attributes.push({
              name: "emoji_bad",
              value: item.emojiChoices.emoji_bad, // Already without .png extension
            })
          }

          console.log("Final attributes:", baseItem.attributes)
        }

        return baseItem
      }),
      total_amount: getCartTotal(),
      payment_status: "completed",
      stripe_session_id: sessionId,
    }

    console.log("=== FINAL ORDER DATA TO BACKEND ===")
    console.log(JSON.stringify(orderData, null, 2))

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Order placed successfully:", data)
      clearCart() // Clear the cart after successful order placement
    } catch (error) {
      console.error("Failed to place order:", error)
      throw error // Re-throw the error to be handled by the calling component
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
        getCartTotal,
        sendOrderToBackend,
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
