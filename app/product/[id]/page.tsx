import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import FallbackImage from "@/components/fallback-image"
import { getStripeProducts } from "@/lib/stripe-products"
import { groupProducts } from "@/lib/product-data"
import AddToCartClient from "@/components/add-to-cart-client"

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    // Fetch products from Stripe
    const products = await getStripeProducts()

    // Ensure we have valid products array
    if (!products || !Array.isArray(products)) {
      console.error("Failed to fetch products from Stripe")
      return (
        <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-6">Unable to Load Products</h1>
            <p className="text-white/70 mb-6">There was an issue loading product data. Please try again later.</p>
            <Link href="/shop/all">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
      )
    }

    // Group products by base name
    const groupedProducts = groupProducts(products)

    // Find product by ID
    const product = groupedProducts.find((p) => p.baseId === params.id)

    if (!product) {
      return (
        <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-6">Product Not Found</h1>
            <p className="text-white/70 mb-6">The product "{params.id}" could not be found.</p>
            <Link href="/shop/all">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
      )
    }

    // ✅ For Tesla vs Elon emoji products, show direct customization buttons
    const isEmojiProduct = product.baseId.includes("tesla") && product.baseId.includes("emoji")

    // Default to magnet if available, otherwise sticker
    const defaultVariant = product.variants?.magnet ? "magnet" : "sticker"
    const selectedProduct = product.variants?.[defaultVariant]

    if (!selectedProduct) {
      return (
        <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-6">Product Variant Not Available</h1>
            <p className="text-white/70 mb-6">No variants are available for this product.</p>
            <Link href="/shop/all">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
      )
    }

    // Calculate aspect ratio based on product dimensions
    const aspectRatio = (selectedProduct.width || 11.5) / (selectedProduct.height || 3)
    const getAspectRatioClass = () => {
      if (aspectRatio > 3) return "aspect-[4/1]" // Very wide (like Deport Elon)
      if (aspectRatio > 1.5) return "aspect-[3/2]" // Wide (like Tesla Musk Emojis)
      if (aspectRatio > 1.2) return "aspect-[5/3]" // Slightly wide
      return "aspect-square" // Square or tall (like No Elon Face)
    }

    // Ensure features array exists
    const features = product.features || [
      "Weather and UV resistant",
      "Easy application",
      "Removable without residue",
      "Made in USA",
    ]

    return (
      <div className="bg-dark-400 text-white min-h-screen">
        <div className="container mx-auto px-6 md:px-10 py-32">
          <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Product Image */}
            <div>
              <div
                className={`relative ${getAspectRatioClass()} bg-dark-300 w-full max-w-lg overflow-hidden rounded-lg`}
              >
                <FallbackImage
                  src={product.image || "/images/no-elon-musk.png"}
                  alt={product.baseName || "Product"}
                  fill
                  className="object-contain p-6"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
                  {product.baseName || "Product"}
                </h1>

                <div className="mb-8">
                  <p className="text-3xl font-medium mb-2">${(selectedProduct.price || 0).toFixed(2)}</p>
                  <p className="text-lg text-white/70 mb-6">
                    Dimensions: {selectedProduct.height || 3}" x {selectedProduct.width || 11.5}"
                  </p>
                </div>

                <div className="prose prose-lg mb-10">
                  <p className="text-white/70 text-lg leading-relaxed">
                    {product.description || "A great product for Tesla owners who want to express their independence."}
                  </p>
                </div>

                {/* ✅ Direct emoji customization buttons for Tesla vs Elon emoji products */}
                {isEmojiProduct ? (
                  <div className="mb-10">
                    <h3 className="text-xl font-medium mb-4">Customize Your Emojis</h3>
                    <div className="space-y-4">
                      {product.variants?.sticker && (
                        <Link href="/product/customize-emoji/sticker" className="block">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg">
                            Customize Sticker - ${product.variants.sticker.price.toFixed(2)}
                          </Button>
                        </Link>
                      )}
                      {product.variants?.magnet && (
                        <Link href="/product/customize-emoji/magnet" className="block">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg">
                            Customize Magnet - ${product.variants.magnet.price.toFixed(2)}
                          </Button>
                        </Link>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mt-3">
                      Choose your Tesla and Elon emojis to create your custom design
                    </p>
                  </div>
                ) : (
                  /* Regular add to cart for non-emoji products */
                  <div className="mb-10">
                    <AddToCartClient product={product} defaultVariant={defaultVariant} />
                  </div>
                )}

                {/* ✅ Features moved below customization/add to cart */}
                <div className="mb-10">
                  <h3 className="text-xl font-medium mb-6">Features</h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-red-500 rounded-full p-1 mr-3 mt-1">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
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
                        Size: {selectedProduct.height || 3}" x {selectedProduct.width || 11.5}"
                      </span>
                    </li>
                  </ul>
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
  } catch (error) {
    console.error("Error in ProductPage:", error)
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-6">Error Loading Product</h1>
          <p className="text-white/70 mb-6">There was an unexpected error loading this product.</p>
          <Link href="/shop/all">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }
}
