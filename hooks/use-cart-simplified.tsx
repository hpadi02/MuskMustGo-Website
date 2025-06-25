import { useLocalStorage } from "./use-local-storage"
import type { Product } from "../types"

interface CartItem extends Product {
  quantity: number
}

interface UseCartSimplified {
  items: CartItem[]
  addItem: (item: Product) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  sendOrderToBackend: (customerEmail: string, sessionId: string) => Promise<void>
}

const useCartSimplified = (): UseCartSimplified => {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart-items", [])

  const addItem = (item: Product) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex !== -1) {
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += 1
        return newItems
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: quantity }
        }
        return item
      })
      return newItems
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const sendOrderToBackend = async (customerEmail: string, sessionId: string) => {
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
        if (item.customOptions && item.id.includes("tesla") && item.id.includes("emoji")) {
          baseItem.attributes = [
            {
              name: "emoji_good",
              value: item.customOptions.tesla.name,
            },
            {
              name: "emoji_bad",
              value: item.customOptions.elon.name,
            },
          ]
        }

        return baseItem
      }),
      total_amount: getTotalPrice(),
      payment_status: "completed",
      stripe_session_id: sessionId,
    }

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

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    sendOrderToBackend,
  }
}

export default useCartSimplified
