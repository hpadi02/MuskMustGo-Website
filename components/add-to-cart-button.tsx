"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import type { CartItem } from "@/hooks/use-cart-simplified"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
  }
  quantity?: number
  customOptions?: Record<string, any>
  className?: string
}

export default function AddToCartButton({
  product,
  quantity = 1,
  customOptions,
  className = "",
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid any external cart handlers
    e.preventDefault()
    e.stopPropagation()

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    }

    if (customOptions) {
      cartItem.customOptions = customOptions
    }

    addItem(cartItem)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })

    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`${isAdded ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-1" /> Added
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
        </>
      )}
    </Button>
  )
}
