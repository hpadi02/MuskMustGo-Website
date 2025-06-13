import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import FallbackImage from "@/components/fallback-image"
import { getStripeProducts } from "@/lib/stripe-products"
import { groupProducts } from "@/lib/product-data"

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Fetch products from Stripe
  const products = await getStripeProducts()
  
  // Group products by base name
  const groupedProducts = groupProducts(products)
  
  // Find product by ID
  const product = groupedProducts.find((p) => p.baseId === params.id)

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

  // Default to magnet if available, otherwise sticker
  const defaultVariant = product.variants.magnet ? "magnet" : "sticker"
  const selectedProduct = product.variants[defaultVariant]

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

  // Calculate aspect ratio based on product dimensions
  const aspectRatio = selectedProduct.width / selectedProduct.height
  const getAspectRatioClass = () => {
    if (aspectRatio > 3) return "aspect-[4/1]" // Very wide (like Deport Elon)
    if (aspectRatio > 1.5) return "aspect-[3/2]" // Wide (like Tesla Musk Emojis)
    if (aspectRatio > 1.2) return "aspect-[5/3]" // Slightly wide
    return "aspect-square" // Square or tall (like No Elon Face)
  }

  // Check if this is the emoji customizable product
  const isCustomizable = product.customizable

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Image */}
          <div>
            <div className={`relative ${getAspectRatioClass()} bg-dark-300 w-full max-w-lg overflow-hidden rounded-lg`}>
              <FallbackImage src={product.image} alt={product.baseName} fill className="object-contain p-6" />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
                {product.baseName}
              </h1>
              
              {/* Product Type Selection - Server Component */}
              <div className="mb-8">
                <p className="text-3xl font-medium mb-2">
                  ${product.variants[defaultVariant].price.toFixed(2)}
                </p>
                <p className="text-lg text-white/70 mb-6">
                  Dimensions: {selectedProduct.height}" x {selectedProduct.width}"
                </p>
              </div>

              <div className="prose prose-lg mb-10">
                <p className="text-white/70 text-lg leading-relaxed">{product.description}</p>
              </div>

              {isCustomizable && (
                <div className="mb-8">
                  <Link href={`/product/customize-emoji/${defaultVariant}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3">Customize Emojis</Button>
                  </Link>
                  <p className="text-white/60 text-sm mt-2">
                    Click above to customize which emojis appear on your {defaultVariant}
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
                        \
