"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Check, Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import EmojiPreviewCanvas from "@/components/emoji-preview-canvas"

// Emoji options (same as in customize page)
const emojiOptions = {
  tesla: [
    { name: "love_stickers", path: "/emojis/positives/01_love_stickers.png" },
    { name: "smile_sly", path: "/emojis/positives/02_smile_sly.png" },
    { name: "happy_heart_eyes", path: "/emojis/positives/03_happy_face_heart_eyes.png" },
    { name: "laughing_clapping", path: "/emojis/positives/04_laughing_clipart.png" },
    { name: "thumbs_up_face", path: "/emojis/positives/05_thumbs_up_face.png" },
    { name: "thumbs_up", path: "/emojis/positives/06_thumbs_up.png" },
    { name: "heart", path: "/emojis/positives/07_heart.png" },
    { name: "phone_big_lashes", path: "/emojis/positives/08_phone_big_lashes.png" },
    { name: "beaming_face_with_smiling_eyes", path: "/emojis/positives/09_beaming_face_with_smiling_eyes.png" },
    { name: "thumbs_up_smiley", path: "/emojis/positives/10_thumbs_up_smiley.png" },
    { name: "cowboy", path: "/emojis/positives/11_cowboy.png" },
    { name: "cowgirl", path: "/emojis/positives/12_cowgirl.png" },
    { name: "crazy_smiling_sticker", path: "/emojis/positives/13_crazy_smiling_sticker.png" },
    { name: "smiling_icon_love", path: "/emojis/positives/14_smiling_icon_images.png" },
    { name: "smiling_symbols", path: "/emojis/positives/15_smiling_symbols.png" },
    { name: "happy_meme", path: "/emojis/positives/16_happy_meme.png" },
    { name: "italian_chef_kiss", path: "/emojis/positives/17_italian_chef_kiss.png" },
  ],
  elon: [
    { name: "orange_sad_face", path: "/emojis/negatives/01_orange_sad_face.png" },
    { name: "gradient_angry", path: "/emojis/negatives/02_gradient_angry.png" },
    { name: "vomit_face", path: "/emojis/negatives/03_vomit_face.png" },
    { name: "angry_smiley_face", path: "/emojis/negatives/04_angry_smiley_face.png" },
    { name: "middle_finger", path: "/emojis/negatives/05_middle_finger.png" },
    { name: "maga_shit", path: "/emojis/negatives/06_maga_shit.png" },
    { name: "crazy_shit", path: "/emojis/negatives/07_crazy_shit.png" },
    { name: "angry_face_with_horns", path: "/emojis/negatives/08_angry_face_with_horns.png" },
    { name: "disgusted_face_emoticon", path: "/emojis/negatives/09_disgusted_face_emoticon.png" },
    { name: "poop_throwing_up", path: "/emojis/negatives/10_poop_throwing_up.png" },
    { name: "good_shit", path: "/emojis/negatives/11_good_shit.png" },
    { name: "tired_face", path: "/emojis/negatives/12_tired_face.png" },
    { name: "black_eyes_thumb_down", path: "/emojis/negatives/13_black_eyes_thumb_down.png" },
    { name: "thumbs_down", path: "/emojis/negatives/14_thumbs_down.png" },
    { name: "thumbs_down_frown", path: "/emojis/negatives/15_thumbs_down_frown.png" },
    { name: "angry_meme_face", path: "/emojis/negatives/16_angry_meme_face.png" },
    { name: "skeleton_middle_finger", path: "/emojis/negatives/17_skeleton_middle_finger.png" },
    { name: "angry", path: "/emojis/negatives/18_angry.png" },
    { name: "yao_ming_disgusted_face", path: "/emojis/negatives/19_yao_ming_disgusted_face.png" },
    { name: "so_tired_smiley", path: "/emojis/negatives/20_so_tired_smiley.png" },
    { name: "angry_smiley_face_2", path: "/emojis/negatives/21_angry_smiley_face.png" },
    { name: "smiling_poop", path: "/emojis/negatives/22_smiling_poop.png" },
  ],
}

interface EmojiCustomizerProps {
  product: any
}

export default function EmojiCustomizer({ product }: EmojiCustomizerProps) {
  const { toast } = useToast()
  const { addItem } = useCart()

  // State for selected variant (magnet or sticker) - ✅ PERSISTENT
  const [selectedVariant, setSelectedVariant] = useState<"magnet" | "sticker">("magnet")

  // State for selected emojis
  const [selectedEmojis, setSelectedEmojis] = useState({
    tesla: emojiOptions.tesla[0], // Default Tesla emoji
    elon: emojiOptions.elon[2], // Default Elon emoji (vomit_face)
  })

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // ✅ Debug logging
  useEffect(() => {
    console.log("🎭 EmojiCustomizer - Selected emojis updated:", selectedEmojis)
    console.log("🎭 EmojiCustomizer - Selected variant:", selectedVariant)
  }, [selectedEmojis, selectedVariant])

  // Handler for emoji selection
  const handleEmojiChange = (type: "tesla" | "elon", emoji: { name: string; path: string }) => {
    setSelectedEmojis((prev) => {
      const newState = { ...prev, [type]: emoji }
      console.log(`🎭 Changed ${type} emoji to ${emoji.name}`, newState)
      return newState
    })
  }

  // Handler for adding to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const selectedProductVariant = product.variants[selectedVariant]

      if (!selectedProductVariant) {
        toast({
          title: "Error",
          description: `${selectedVariant} variant not available`,
          variant: "destructive",
        })
        return
      }

      // Create a unique ID for the customized product
      const customId = `${selectedProductVariant.product_id}-${selectedEmojis.tesla.name}-${selectedEmojis.elon.name}`
      const customName = `${product.baseName} (${selectedVariant})`

      // ✅ Create proper customOptions structure
      const customOptions = {
        teslaEmoji: selectedEmojis.tesla,
        elonEmoji: selectedEmojis.elon,
        variant: selectedVariant,
      }

      console.log("🛒 Adding customized emoji product to cart:", {
        id: selectedProductVariant.product_id,
        customId,
        name: customName,
        price: selectedProductVariant.price,
        quantity,
        customOptions,
        stripeId: selectedProductVariant.stripeId,
        productId: selectedProductVariant.productId,
      })

      addItem({
        id: selectedProductVariant.product_id,
        customId,
        name: customName,
        price: selectedProductVariant.price,
        image: product.image,
        quantity,
        customOptions,
        stripeId: selectedProductVariant.stripeId,
        productId: selectedProductVariant.productId,
      })

      setAdded(true)

      toast({
        title: "Added to cart",
        description: `${customName} has been added to your cart`,
      })

      // Reset the added state after 3 seconds
      setTimeout(() => {
        setAdded(false)
      }, 3000)
    } catch (error) {
      console.error("❌ Error adding emoji product to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      })
    }
  }

  const selectedProductVariant = product.variants[selectedVariant]

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-dark-400 p-4 rounded-lg">
        <EmojiPreviewCanvas
          teslaEmoji={selectedEmojis.tesla}
          elonEmoji={selectedEmojis.elon}
          className="w-full max-w-md mx-auto"
        />
      </div>

      {/* Variant Selection */}
      {product.variants.magnet && product.variants.sticker && (
        <div>
          <h4 className="text-white/70 mb-3">Select Type:</h4>
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
              <span className="text-white">Magnet (${product.variants.magnet.price.toFixed(2)})</span>
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
              <span className="text-white">Sticker (${product.variants.sticker.price.toFixed(2)})</span>
            </label>
          </div>
        </div>
      )}

      {/* Tesla Emoji Selection */}
      <div>
        <h4 className="text-white/70 mb-3">Tesla Emoji (Positive)</h4>
        <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
          {emojiOptions.tesla.map((emoji) => (
            <Button
              key={emoji.name}
              variant="outline"
              className={`p-2 h-12 ${
                selectedEmojis.tesla.name === emoji.name ? "border-red-500 bg-red-500/10" : "border-white/20"
              }`}
              onClick={() => handleEmojiChange("tesla", emoji)}
            >
              <Image
                src={emoji.path || "/placeholder.svg"}
                alt={emoji.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Elon Emoji Selection */}
      <div>
        <h4 className="text-white/70 mb-3">Elon Emoji (Negative)</h4>
        <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
          {emojiOptions.elon.map((emoji) => (
            <Button
              key={emoji.name}
              variant="outline"
              className={`p-2 h-12 ${
                selectedEmojis.elon.name === emoji.name ? "border-red-500 bg-red-500/10" : "border-white/20"
              }`}
              onClick={() => handleEmojiChange("elon", emoji)}
            >
              <Image
                src={emoji.path || "/placeholder.svg"}
                alt={emoji.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <h4 className="text-white/70 mb-3">Quantity</h4>
        <div className="flex items-center">
          <Button variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="border-white/20">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-6 font-medium">{quantity}</span>
          <Button variant="outline" onClick={() => setQuantity(quantity + 1)} className="border-white/20">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium">Price:</span>
          <span className="text-xl font-medium">
            ${selectedProductVariant ? (selectedProductVariant.price * quantity).toFixed(2) : "0.00"}
          </span>
        </div>

        <Button
          size="lg"
          className={`${added ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} w-full py-6`}
          onClick={handleAddToCart}
          disabled={!selectedProductVariant}
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
  )
}
