"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import EmojiPreviewCanvas from "@/components/emoji-preview-canvas"

// Updated emoji options based on Ed's server list
const emojiOptions = {
  // Positive emojis for Tesla (from /positives folder)
  tesla: [
    "😍", // love_stickers
    "😏", // smile_sly
    "😻", // happy_heart_eyes
    "👏", // laughing_clapping
    "👍", // thumbs_up
    "🥶", // icy
    "💅", // phone_big_lashes
    "😊", // beaming_face_with_smiling_eyes
    "🤠", // cowboy
    "🤠", // cowgirl (using same emoji)
    "🤪", // crazy_smiling_sticker
    "😘", // smiling_icon_love
    "🔥", // smiling_symbols
    "😂", // happy_meme
    "🤌", // italian_chef_kiss
    "⚡", // Tesla symbol
    "🚗", // Car
    "🔋", // Battery
    "🌱", // Green/eco
    "💯", // 100
  ],
  // Negative emojis for Elon (from /negatives folder)
  elon: [
    "😢", // orange_sad_face
    "😠", // gradient_angry
    "🤮", // vomit_face
    "😡", // angry_smiley_face
    "🖕", // middle_finger
    "💩", // maga_shit/crazy_shit/mad_shit
    "👹", // angry_face_with_horns
    "🤢", // disgusted_face_emoticon
    "🤬", // poop_throwing_up (angry face)
    "😤", // tired_smiley
    "🙄", // black_eyes_thumb_down (eye roll)
    "👎", // thumbs_down
    "🤦", // thumbs_down_frown
    "😒", // angry_face
    "💀", // skeleton_middle_finger
    "🤡", // clown
    "🤥", // yao_ming_disgusted_face
    "🤑", // money face
    "😵", // smiling_no_good
    "🗣️", // talking/ranting
  ],
}

// Product data
const product = {
  id: "tesla-elon-magnet",
  name: "Tesla vs Elon Emoji Magnet",
  price: 20.0,
  dimensions: '6" x 10"',
  image: "/images/emoji-musk.png",
  description:
    "Show your love for Tesla while making your feelings about its CEO clear with this humorous emoji magnet. Fully customizable with your choice of emojis.",
}

export default function CustomizeEmojiMagnetPage() {
  const { toast } = useToast()
  const router = useRouter()

  // State for selected emojis
  const [selectedEmojis, setSelectedEmojis] = useState({
    tesla: "😍", // Default Tesla emoji (positive)
    elon: "🤮", // Default Elon emoji (negative)
  })
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    console.log("Selected emojis updated:", selectedEmojis)
  }, [selectedEmojis])

  // Handler for emoji selection
  const handleEmojiChange = (type: "tesla" | "elon", emoji: string) => {
    setSelectedEmojis((prev) => {
      const newState = { ...prev, [type]: emoji }
      console.log(`Changed ${type} emoji to ${emoji}`, newState)
      return newState
    })
  }

  // Handler for adding to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid any external cart handlers
    e.preventDefault()
    e.stopPropagation()

    // Create a unique ID for the customized product
    const customId = `${product.id}-${selectedEmojis.tesla}-${selectedEmojis.elon}`

    // Create a unique name that includes the selected emojis
    const customName = `${product.name} (${selectedEmojis.tesla} vs ${selectedEmojis.elon})`

    console.log("Adding customized product to cart:", {
      id: product.id,
      customId,
      name: customName,
      price: product.price,
      image: product.image,
      quantity,
      customOptions: selectedEmojis,
    })

    addItem({
      id: product.id,
      customId,
      name: customName,
      price: product.price,
      image: product.image,
      quantity,
      customOptions: selectedEmojis,
    })

    setAdded(true)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${customName} has been added to your cart`,
    })

    setTimeout(() => {
      setAdded(false)
      // Navigate to cart without using window.confirm
      router.push("/cart")
    }, 1500)
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link href={`/product/${product.id}`} className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to product
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Customize Your {product.name}
          </h1>
          <p className="text-lg text-white/70 mb-8">Dimensions: {product.dimensions}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Preview with dynamic canvas */}
            <div className="bg-dark-300 p-8 rounded-lg flex flex-col items-center">
              <EmojiPreviewCanvas
                teslaEmoji={selectedEmojis.tesla}
                elonEmoji={selectedEmojis.elon}
                className="w-full aspect-square mb-6"
              />
            </div>

            {/* Customization Options */}
            <div className="bg-dark-300 p-8 rounded-lg">
              <h2 className="text-xl font-medium mb-6">Choose Your Emojis</h2>

              <div className="mb-8">
                <h3 className="text-white/60 mb-3">Tesla Emoji (Positive)</h3>
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                  {emojiOptions.tesla.map((emoji, index) => (
                    <Button
                      key={`tesla-${index}`}
                      variant="outline"
                      className={`text-2xl h-12 ${
                        selectedEmojis.tesla === emoji ? "border-red-500 bg-red-500/10" : "border-white/20"
                      }`}
                      onClick={() => handleEmojiChange("tesla", emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white/60 mb-3">Elon Emoji (Negative)</h3>
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                  {emojiOptions.elon.map((emoji, index) => (
                    <Button
                      key={`elon-${index}`}
                      variant="outline"
                      className={`text-2xl h-12 ${
                        selectedEmojis.elon === emoji ? "border-red-500 bg-red-500/10" : "border-white/20"
                      }`}
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
              Our Tesla vs Elon Emoji Magnet (6" x 10") lets you express exactly how you feel about your Tesla and its
              CEO. Choose from Ed's curated collection of emojis to create your perfect combination.
            </p>
            <p className="text-white/70">
              The magnet is made from premium materials that are weather and UV resistant, making it perfect for your
              car, refrigerator, or any metal surface where you want to display your Tesla pride (and Elon opinions).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
