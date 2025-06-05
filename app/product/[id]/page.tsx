"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Minus, Plus, Check, ArrowLeft } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import FallbackImage from "@/components/fallback-image"
import { GROUPED_PRODUCTS } from "@/lib/product-data"

export default function ProductPage({ params }: { params: { id: string } }) {
  // Find product by ID
  const product = GROUPED_PRODUCTS.find((p) => p.baseId === params.id)

  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<"magnet" | "sticker">(
    product?.variants.magnet ? "magnet" : "sticker",
  )

  const selectedProduct = product?.variants[selectedVariant]

  if (!product) {
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

  if (!selectedProduct) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-6">Product Variant Not Available</h1>
          <Link href="/shop/all">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
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
    addItem({
      id: selectedProduct.product_id,
      name: `${product.baseName} (${selectedVariant})`,
      price: selectedProduct.price,
      image: product.image,
      quantity,
    })

    setAdded(true)

    toast({
      title: "Added to cart",
      description: `${product.baseName} (${selectedVariant}) has been added to your cart`,
    })

    setTimeout(() => {
      setAdded(false)
      router.push("/cart")
    }, 1500)
  }

  // Check if this is the emoji customizable product
  const isCustomizable = product.customizable

  // Calculate aspect ratio based on product dimensions
  const aspectRatio = selectedProduct.width / selectedProduct.height
  const getAspectRatioClass = () => {
    if (aspectRatio > 3) return "aspect-[4/1]" // Very wide (like Deport Elon)
    if (aspectRatio > 1.5) return "aspect-[3/2]" // Wide (like Tesla Musk Emojis)
    if (aspectRatio > 1.2) return "aspect-[5/3]" // Slightly wide
    return "aspect-square" // Square or tall (like No Elon Face)
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Image - Full height and properly sized */}
          <div className="flex items-center justify-center">
            <div className={`relative ${getAspectRatioClass()} bg-dark-300 w-full max-w-lg overflow-hidden rounded-lg`}>
              <FallbackImage src={product.image} alt={product.baseName} fill className="object-contain p-6" />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
                {product.baseName}
              </h1>
              <p className="text-3xl font-medium mb-2">${selectedProduct.price.toFixed(2)}</p>
              <p className="text-lg text-white/70 mb-6">
                Dimensions: {selectedProduct.height}" x {selectedProduct.width}"
              </p>

              <div className="prose prose-lg mb-10">
                <p className="text-white/70 text-lg leading-relaxed">{product.description}</p>
              </div>

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

              {isCustomizable && (
                <div className="mb-8">
                  <Link href={`/product/customize-emoji/${selectedVariant}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3">Customize Emojis</Button>
                  </Link>
                  <p className="text-white/60 text-sm mt-2">
                    Click above to customize which emojis appear on your {selectedVariant}
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
                  <li className="flex items-start">
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
                    <span className="text-white/80">
                      Size: {selectedProduct.height}" x {selectedProduct.width}"
                    </span>
                  </li>
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
