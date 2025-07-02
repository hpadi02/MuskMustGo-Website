"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart-simplified"
import { useToast } from "@/hooks/use-toast"
import { GROUPED_PRODUCTS } from "@/lib/product-data"
import Image from "next/image"
import EmojiPreviewCanvas from "@/components/emoji-preview-canvas"

// Emoji options
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

export default function CustomizeEmojiPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { addItem } = useCart()

  const type = params.type as "magnet" | "sticker"
  const productId = searchParams.get("product")

  // Find the product
  const product = GROUPED_PRODUCTS.find((p) => p.baseId === productId)

  // ✅ State management with persistence
  const [selectedEmojis, setSelectedEmojis] = useState({
    tesla: emojiOptions.tesla[0], // Default Tesla emoji
    elon: emojiOptions.elon[2], // Default Elon emoji (vomit_face)
  })

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // ✅ Debug logging
  useEffect(() => {
    console.log("🎭 CustomizeEmoji - Selected emojis updated:", selectedEmojis)
    console.log("🎭 CustomizeEmoji - Type:", type)
    console.log("🎭 CustomizeEmoji - Product:", product)
  }, [selectedEmojis, type, product])

  if (!product || !product.variants[type]) {
    return (
      <div className="bg-dark-400 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop/all" className="text-red-400 hover:text-red-300 underline">
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

  const selectedProductVariant = product.variants[type]

  // Handler for emoji selection
  const handleEmojiChange = (emojiType: "tesla" | "elon", emoji: { name: string; path: string }) => {
    setSelectedEmojis((prev) => {
      const newState = { ...prev, [emojiType]: emoji }
      console.log(`🎭 Changed ${emojiType} emoji to ${emoji.name}`, newState)
      return newState
    })
  }

  // Handler for adding to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      // Create a unique ID for the customized product
      const customId = `${selectedProductVariant.product_id}-${selectedEmojis.tesla.name}-${selectedEmojis.elon.name}`
      const customName = `${product.baseName} (${type})`

      // ✅ Create proper customOptions structure
      const customOptions = {
        teslaEmoji: selectedEmojis.tesla,
        elonEmoji: selectedEmojis.elon,
        variant: type,
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

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Preview */}
            <div className="space-y-6">
              <div className="bg-dark-300 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Preview</h3>
                <EmojiPreviewCanvas
                  teslaEmoji={selectedEmojis.tesla}
                  elonEmoji={selectedEmojis.elon}
                  className="w-full max-w-md mx-auto"
                />
              </div>
            </div>

            {/* Right Column - Customization */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                  {product.baseName} ({type})
                </h1>
                <p className="text-lg text-white/70 mb-6">
                  Express your Tesla love and Elon opinions with custom emoji combinations.
                </p>
                <div className="text-2xl font-bold mb-8">${selectedProductVariant.price.toFixed(2)}</div>
              </div>

              {/* Tesla Emoji Selection */}
              <div className="bg-dark-300 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Tesla Emoji (Positive)</h3>
                <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto">
                  {emojiOptions.tesla.map((emoji) => (
                    <Button
                      key={emoji.name}
                      variant="outline"
                      className={`p-3 h-16 ${
                        selectedEmojis.tesla.name === emoji.name
                          ? "border-red-500 bg-red-500/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      onClick={() => handleEmojiChange("tesla", emoji)}
                    >
                      <Image
                        src={emoji.path || "/placeholder.svg"}
                        alt={emoji.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Elon Emoji Selection */}
              <div className="bg-dark-300 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Elon Emoji (Negative)</h3>
                <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto">
                  {emojiOptions.elon.map((emoji) => (
                    <Button
                      key={emoji.name}
                      variant="outline"
                      className={`p-3 h-16 ${
                        selectedEmojis.elon.name === emoji.name
                          ? "border-red-500 bg-red-500/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      onClick={() => handleEmojiChange("elon", emoji)}
                    >
                      <Image
                        src={emoji.path || "/placeholder.svg"}
                        alt={emoji.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="bg-dark-300 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-white/20 hover:border-white/40"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-6 text-xl font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-white/20 hover:border-white/40"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price and Add to Cart */}
              <div className="bg-dark-300 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-medium">Total:</span>
                  <span className="text-2xl font-bold">${(selectedProductVariant.price * quantity).toFixed(2)}</span>
                </div>

                <Button
                  size="lg"
                  className={`${
                    added ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  } w-full py-6 text-lg`}
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

              {/* Features */}
              <div className="bg-dark-300 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Features</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Weather and UV resistant</li>
                  <li>• Premium materials</li>
                  <li>• Perfect for cars, refrigerators, metal surfaces</li>
                  <li>• Custom emoji combinations</li>
                  <li>• High-quality printing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
