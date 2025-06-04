"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import EmojiPreviewCanvas from "@/components/emoji-preview-canvas"
import { GROUPED_PRODUCTS } from "@/lib/product-data"

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

export default function CustomizeEmojiPage({ params }: { params: { type: string } }) {
  const type = params.type === "magnet" || params.type === "sticker" ? params.type : "magnet"

  // Find the emoji product
  const product = GROUPED_PRODUCTS.find((p) => p.baseId === "tesla_musk_emojis")

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

  if (!product || !product.variants[type]) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-6">Product Not Found</h1>
          <Link href="/shop/all">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  const selectedProduct = product.variants[type]

  // Handler for emoji selection
  const handleEmojiChange = (emojiType: "tesla" | "elon", emoji: string) => {
    setSelectedEmojis((prev) => ({
      ...prev,
      [emojiType]: emoji,
    }))
  }

  // Handler for adding to cart
  const handleAddToCart = () => {
    // Create a unique ID for the customized product
    const customId = `${selectedProduct.product_id}-${selectedEmojis.tesla}-${selectedEmojis.elon}`

    // Create a unique name that includes the selected emojis
    const customName = `${product.baseName} ${type} (${selectedEmojis.tesla} vs ${selectedEmojis.elon})`

    addItem({
      id: selectedProduct.product_id,
      customId,
      name: customName,
      price: selectedProduct.price,
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
      router.push("/cart")
    }, 1500)
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link
          href={`/product/tesla_musk_emojis`}
          className="inline-flex items-center text-white/70 hover:text-white mb-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to product
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Customize Your {product.baseName} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h1>
          <p className="text-lg text-white/70 mb-8">
            Dimensions: {selectedProduct.height}" x {selectedProduct.width}"
          </p>

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
                <span className="text-xl font-medium">${(selectedProduct.price * quantity).toFixed(2)}</span>
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
              Our Tesla vs Elon Emoji {type} ({selectedProduct.height}" x {selectedProduct.width}") lets you express
              exactly how you feel about your Tesla and its CEO. Choose from Ed's curated collection of emojis to create
              your perfect combination.
            </p>
            <p className="text-white/70">
              {type === "magnet"
                ? "The magnet is made from premium materials that are weather and UV resistant, making it perfect for your car, refrigerator, or any metal surface where you want to display your Tesla pride (and Elon opinions)."
                : "The sticker is made from premium vinyl material that's weather and UV resistant, making it perfect for your car, laptop, water bottle, or anywhere else you want to display your Tesla pride (and Elon opinions)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
