"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import EmojiPreviewCanvas from "@/components/emoji-preview-canvas"

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

  // Handler for adding to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid any external cart handlers
    e.preventDefault()
    e.stopPropagation()

    // Create a unique ID for the customized product
    const customId = `${product.id}-${selectedEmojis.tesla.name}-${selectedEmojis.elon.name}`

    // Create a unique name that includes the selected emojis
    const customName = `${product.name} (${selectedEmojis.tesla.name} vs ${selectedEmojis.elon.name})`

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
            {/* Preview with dynamic emoji canvas */}
            <div className="bg-dark-300 p-8 rounded-lg flex flex-col items-center">
              <EmojiPreviewCanvas
                teslaEmoji={selectedEmojis.tesla}
                elonEmoji={selectedEmojis.elon}
                className="w-full mb-6"
              />
              <p className="text-sm text-white/60 text-center">
                Preview: {selectedEmojis.tesla.name} vs {selectedEmojis.elon.name}
              </p>
            </div>

            {/* Customization Options */}
            <div className="bg-dark-300 p-8 rounded-lg">
              <h2 className="text-xl font-medium mb-6">Choose Your Emojis</h2>

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
              CEO. Choose from Ed's curated collection of custom emoji graphics to create your perfect combination.
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
