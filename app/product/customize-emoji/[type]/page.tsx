"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import EmojiPreviewCanvas from "@/components/emoji-preview-canvas"
import { GROUPED_PRODUCTS } from "@/lib/product-data"

// Updated emoji options using Ed's PNG files with correct file names
const emojiOptions = {
  // Positive emojis for Tesla (from /positives folder)
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
  // Negative emojis for Elon (from /negatives folder)
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

export default function CustomizeEmojiPage({ params }: { params: { type: string } }) {
  const { toast } = useToast()

  // Find the Tesla emoji product from our grouped products
  const teslaEmojiProduct = GROUPED_PRODUCTS.find(
    (product) => product.baseId.includes("tesla") && product.baseId.includes("emoji"),
  )

  console.log("Tesla emoji product found:", teslaEmojiProduct)

  // State for selected variant (magnet or sticker)
  const [selectedVariant, setSelectedVariant] = useState<"magnet" | "sticker">("magnet")

  // State for selected emojis - now storing the full emoji objects
  const [selectedEmojis, setSelectedEmojis] = useState({
    tesla: emojiOptions.tesla[0], // Default Tesla emoji (first positive)
    elon: emojiOptions.elon[2], // Default Elon emoji (vomit_face)
  })
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    console.log("Selected emojis updated:", selectedEmojis)
  }, [selectedEmojis])

  // Handler for emoji selection
  const handleEmojiChange = (type: "tesla" | "elon", emoji: { name: string; path: string }) => {
    setSelectedEmojis((prev) => {
      const newState = { ...prev, [type]: emoji }
      console.log(`Changed ${type} emoji to ${emoji.name}`, newState)
      return newState
    })
  }

  // Handler for adding to cart - NOW USES REAL PRODUCT DATA WITH STRIPE IDS
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!teslaEmojiProduct) {
      toast({
        title: "Error",
        description: "Tesla emoji product not found",
        variant: "destructive",
      })
      return
    }

    // Get the selected variant (magnet or sticker) with Stripe IDs
    const selectedProductVariant = teslaEmojiProduct.variants[selectedVariant]

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

    // Create a unique name that includes the variant
    const customName = `${teslaEmojiProduct.baseName} (${selectedVariant})`

    console.log("Adding customized product to cart with Stripe IDs:", {
      id: selectedProductVariant.product_id,
      customId,
      name: customName,
      price: selectedProductVariant.price,
      image: teslaEmojiProduct.image,
      quantity,
      customOptions: selectedEmojis,
      stripeId: selectedProductVariant.stripeId, // ✅ NOW HAS STRIPE ID
      productId: selectedProductVariant.productId, // ✅ NOW HAS PRODUCT ID
    })

    addItem({
      id: selectedProductVariant.product_id,
      customId,
      name: customName,
      price: selectedProductVariant.price,
      image: teslaEmojiProduct.image,
      quantity,
      customOptions: selectedEmojis,
      stripeId: selectedProductVariant.stripeId, // ✅ STRIPE PRICE ID
      productId: selectedProductVariant.productId, // ✅ STRIPE PRODUCT ID
    })

    setAdded(true)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${customName} has been added to your cart`,
    })

    // Reset the added state after 3 seconds
    setTimeout(() => {
      setAdded(false)
    }, 3000)
  }

  if (!teslaEmojiProduct) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8">Product Not Found</h1>
          <p className="text-white/70 mb-8">The Tesla emoji product could not be found.</p>
          <Link href="/shop/all">
            <Button className="bg-red-600 hover:bg-red-700">Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  const selectedProductVariant = teslaEmojiProduct.variants[selectedVariant]

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link
          href={`/product/tesla_vs_elon_emoji`}
          className="inline-flex items-center text-white/70 hover:text-white mb-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to product
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Customize Your {teslaEmojiProduct.baseName}
          </h1>
          <p className="text-lg text-white/70 mb-8">
            Dimensions: {teslaEmojiProduct.height}" x {teslaEmojiProduct.width}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Preview with dynamic emoji canvas */}
            <div className="bg-dark-300 p-8 rounded-lg flex flex-col items-center">
              <EmojiPreviewCanvas
                teslaEmoji={selectedEmojis.tesla}
                elonEmoji={selectedEmojis.elon}
                className="w-full"
              />
            </div>

            {/* Customization Options */}
            <div className="bg-dark-300 p-8 rounded-lg">
              <h2 className="text-xl font-medium mb-6">Choose Your Options</h2>

              {/* Variant Selection */}
              {teslaEmojiProduct.variants.magnet && teslaEmojiProduct.variants.sticker && (
                <div className="mb-8">
                  <h3 className="text-white/60 mb-3">Select Type:</h3>
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
                      <span className="text-white">Magnet (${teslaEmojiProduct.variants.magnet.price.toFixed(2)})</span>
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
                      <span className="text-white">
                        Sticker (${teslaEmojiProduct.variants.sticker.price.toFixed(2)})
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-white/60 mb-3">Tesla Emoji (Positive)</h3>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {emojiOptions.tesla.map((emoji) => (
                    <Button
                      key={emoji.name}
                      variant="outline"
                      className={`p-2 h-16 ${
                        selectedEmojis.tesla.name === emoji.name ? "border-red-500 bg-red-500/10" : "border-white/20"
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

              <div className="mb-8">
                <h3 className="text-white/60 mb-3">Elon Emoji (Negative)</h3>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {emojiOptions.elon.map((emoji) => (
                    <Button
                      key={emoji.name}
                      variant="outline"
                      className={`p-2 h-16 ${
                        selectedEmojis.elon.name === emoji.name ? "border-red-500 bg-red-500/10" : "border-white/20"
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

              {/* Link to cart for manual navigation */}
              {added && (
                <div className="mt-4 text-center">
                  <Link href="/cart">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      View Cart
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 bg-dark-300 p-8 rounded-lg">
            <h2 className="text-xl font-medium mb-4">About This Customization</h2>
            <p className="text-white/70 mb-4">
              Our Tesla vs Elon Emoji {selectedVariant} ({teslaEmojiProduct.height}" x {teslaEmojiProduct.width}") lets
              you express exactly how you feel about your Tesla and its CEO. Choose from Ed's curated collection of
              custom emoji graphics to create your perfect combination.
            </p>
            <p className="text-white/70">
              The {selectedVariant} is made from premium materials that are weather and UV resistant, making it perfect
              for your car, refrigerator, or any metal surface where you want to display your Tesla pride (and Elon
              opinions).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
