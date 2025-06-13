"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Minus, Plus, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { useToast } from "@/hooks/use-toast"

interface Product {
  baseId: string
  baseName: string
  image: string
  description: string
  features: string[]
  customizable: boolean
  variants: {
    magnet?: {
      product_id: string
      price: number
      height: number
      width: number
      stripeId: string
      productId: string
    }
    sticker?: {
      product_id: string
      price: number
      height: number
      width: number
      stripeId: string
      productId: string
    }
  }
}

interface AddToCartClientProps {
  product: Product
  defaultVariant: "magnet" | "sticker"
}

export default function AddToCartClient({ product, defaultVariant }: AddToCartClientProps) {
  const { toast } = useToast()
  const { addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<"magnet" | "sticker">(defaultVariant)

  const selectedProduct = product.variants[selectedVariant]

  if (!selectedProduct) {
    return <div>Product variant not available</div>
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    const selectedProductData = product.variants[selectedVariant]

    if (!selectedProductData) return

    addItem({
      id: selectedProduct.product_id,
      name: `${product.baseName} (${selectedVariant})`,
      price: selectedProduct.price,
      image: product.image,
      quantity,
      stripeId: selectedProductData.stripeId,
      productId: selectedProductData.productId,
    })

    setAdded(true)

    toast({
      title: "Added to cart",
      description: `${product.baseName} (${selectedVariant}) has been added to your cart`,
    })

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Product Type Selection */}
      {product.variants.magnet && product.variants.sticker && (
        <div className="mb-8">
          <p className="text-white/70 mb-3">Select Type:</p>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="variant"
                value="magnet"
                checked={selectedVariant === "magnet"}
                onChange={(e) => setSelectedVariant(e.target.value as "magnet" | "sticker")}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
              />
              <span className="text-white">Magnet (${product.variants.magnet?.price.toFixed(2)})</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="variant"
                value="sticker"
                checked={selectedVariant === "sticker"}
                onChange={(e) => setSelectedVariant(e.target.value as "magnet" | "sticker")}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
              />
              <span className="text-white">Sticker (${product.variants.sticker?.price.toFixed(2)})</span>
            </label>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-white/60 mb-2">Quantity</p>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseQuantity}
            className="rounded-none h-10 w-10 border-white/20 text-white hover:bg-white/10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-6 font-medium w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={increaseQuantity}
            className="rounded-none h-10 w-10 border-white/20 text-white hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        className={`${
          added ? "bg-green-600 hover:bg-green-700" : "bg-white hover:bg-white/90 text-black"
        } w-full px-8 py-6 text-sm tracking-wide`}
        onClick={handleAddToCart}
      >
        {added ? (
          <>
            <Check className="mr-2 h-5 w-5" /> ADDED TO CART
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO CART
          </>
        )}
      </Button>
    </div>
  )
}
