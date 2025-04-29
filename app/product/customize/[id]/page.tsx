"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { PRODUCTS } from "@/lib/image-assets"

// Emoji options
const emojiOptions = {
  tesla: ["😍", "🚗", "⚡", "🔋", "🌱", "💯", "👍", "❤️"],
  elon: ["🤮", "👎", "🤡", "💩", "🙄", "😒", "🤦", "🤔"],
}

// This would normally come from a database or API
const getProductById = (id: string) => {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]
}

export default function CustomizeProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)
  const [selectedEmojis, setSelectedEmojis] = useState({
    tesla: "😍",
    elon: "🤮",
  })
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  // Create a preview image URL
  const [previewImage, setPreviewImage] = useState("")

  useEffect(() => {
    // In a real implementation, this would dynamically generate an image
    // For now, we'll just use the original image
    setPreviewImage(product.image)
  }, [selectedEmojis, product.image])

  const handleEmojiChange = (type: "tesla" | "elon", emoji: string) => {
    setSelectedEmojis((prev) => ({
      ...prev,
      [type]: emoji,
    }))
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      customOptions: {
        teslaEmoji: selectedEmojis.tesla,
        elonEmoji: selectedEmojis.elon,
      },
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-dark-400 text-white">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link href={`/product/${product.id}`} className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to product
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8">
            Customize Your {product.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Preview */}
            <div className="bg-dark-300 p-8 rounded-lg flex flex-col items-center">
              <div className="relative w-full aspect-square mb-6">
                <Image src={previewImage || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
              </div>
              <div className="flex justify-center space-x-8 text-4xl">
                <div className="text-center">
                  <p className="text-white/60 text-sm mb-2">Tesla</p>
                  <span>{selectedEmojis.tesla}</span>
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm mb-2">Elon</p>
                  <span>{selectedEmojis.elon}</span>
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="bg-dark-300 p-8 rounded-lg">
              <h2 className="text-xl font-medium mb-6">Choose Your Emojis</h2>

              <div className="mb-8">
                <h3 className="text-white/60 mb-3">Tesla Emoji</h3>
                <div className="grid grid-cols-4 gap-4">
                  {emojiOptions.tesla.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      className={`text-2xl h-12 ${selectedEmojis.tesla === emoji ? "border-red-500 bg-red-500/10" : "border-white/20"}`}
                      onClick={() => handleEmojiChange("tesla", emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white/60 mb-3">Elon Emoji</h3>
                <div className="grid grid-cols-4 gap-4">
                  {emojiOptions.elon.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      className={`text-2xl h-12 ${selectedEmojis.elon === emoji ? "border-red-500 bg-red-500/10" : "border-white/20"}`}
                      onClick={() => handleEmojiChange("elon", emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white/60 mb-3">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-white/20"
                  >
                    -
                  </Button>
                  <span className="mx-6 font-medium">{quantity}</span>
                  <Button variant="outline" onClick={() => setQuantity(quantity + 1)} className="border-white/20">
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-medium">Price:</span>
                <span className="text-xl font-medium">${(product.price * quantity).toFixed(2)}</span>
              </div>

              <Button
                size="lg"
                className={`${added ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} w-full py-6`}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check className="mr-2 h-5 w-5" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-12 bg-dark-300 p-8 rounded-lg">
            <h2 className="text-xl font-medium mb-4">About This Customization</h2>
            <p className="text-white/70 mb-4">
              Our Tesla vs Elon Emoji Sticker lets you express exactly how you feel about your Tesla and its CEO. Choose
              from a variety of emojis to create your perfect combination.
            </p>
            <p className="text-white/70">
              The sticker is made from premium vinyl material that's weather and UV resistant, making it perfect for
              your car, laptop, water bottle, or anywhere else you want to display your Tesla pride (and Elon opinions).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
