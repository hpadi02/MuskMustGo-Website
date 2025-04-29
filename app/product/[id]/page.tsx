"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Minus, Plus, Check, ArrowLeft } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Update the PRODUCTS array to change stickers to magnets
const PRODUCTS = [
  {
    id: "tesla-elon-magnet",
    name: "Tesla vs Elon Emoji Magnet",
    price: 20.0,
    image: "/images/emoji-musk.png",
    model: "All Models",
    description:
      "Show your love for Tesla while making your feelings about its CEO clear with this humorous emoji magnet. Fully customizable with your choice of emojis.",
    features: [
      "Premium magnetic material",
      "Weather and UV resistant",
      "Easy application and removal",
      "Fits on any metal surface",
      "Made in USA",
      "Customizable emojis",
    ],
    customizable: true,
    dimensions: "3x3 inches",
  },
  {
    id: "no-elon-magnet",
    name: "No Elon Bumper Magnet",
    price: 16.0,
    image: "/images/no-elon-musk.png",
    model: "All Models",
    description:
      "Make a statement with this bold 'No Elon' bumper magnet. Perfect for Tesla owners who want to separate the car from its controversial CEO.",
    features: [
      "High-quality magnetic material",
      "Waterproof and UV resistant",
      "Strong magnetic hold",
      "Won't damage paint",
      "Made in USA",
    ],
    customizable: false,
    dimensions: "8x2 inches",
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  // Find product by ID or use the first product as fallback
  const product = PRODUCTS.find((p) => p.id === params.id) || PRODUCTS[0]
  const router = useRouter()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid any external cart handlers
    e.preventDefault()
    e.stopPropagation()

    console.log("Adding to cart:", product.id, quantity)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })

    setAdded(true)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })

    setTimeout(() => {
      setAdded(false)
      // Navigate to cart without using window.confirm
      router.push("/cart")
    }, 1500)
  }

  // Check if this is the emoji sticker product
  const isEmojiSticker = product.id === "tesla-elon-magnet"

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="relative aspect-square bg-dark-300 flex items-center justify-center">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain max-w-full max-h-full"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div>
              <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-4">{product.model}</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
                {product.name}
              </h1>
              <p className="text-3xl font-medium mb-2">${product.price.toFixed(2)}</p>
              <p className="text-lg text-white/70 mb-6">Dimensions: {product.dimensions}</p>

              <div className="prose prose-lg mb-10">
                <p className="text-white/70 text-lg leading-relaxed">{product.description}</p>
              </div>

              {isEmojiSticker && (
                <div className="mb-8">
                  <Link href="/product/customize-emoji-magnet">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3">Customize Emojis</Button>
                  </Link>
                  <p className="text-white/60 text-sm mt-2">
                    Click above to customize which emojis appear on your magnet
                  </p>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-xl font-medium mb-6">Features</h3>
                <ul className="space-y-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
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
                  className={`${added ? "bg-green-600 hover:bg-green-700" : "bg-white hover:bg-white/90 text-black"} w-full px-8 py-6 text-sm tracking-wide`}
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

              <div className="mt-10 text-white/60 space-y-2 text-sm">
                <p className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Free shipping on orders over $50
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
