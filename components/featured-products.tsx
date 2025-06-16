"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import FallbackImage from "./fallback-image"
import { groupProducts } from "@/lib/product-data"

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        // Fetch products from the API endpoint instead of direct Stripe call
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        const products = data.products || []

        // Convert Stripe products to our format
        const formattedProducts = products.map((product: any) => ({
          product_id: product.id,
          product_name: product.name,
          baseName: product.name,
          image_name: product.images?.[0] || "",
          height: 8.0,
          width: 8.0,
          price: product.default_price?.unit_amount ? product.default_price.unit_amount / 100 : 0,
          medium_id: product.name?.toLowerCase().includes("magnet") ? "magnet" : "sticker",
          medium_name: product.name?.toLowerCase().includes("magnet") ? "bumper magnet" : "bumper sticker",
          stripeId: product.default_price?.id || "",
          productId: product.id,
          images: product.images || [],
        }))

        const groupedProducts = groupProducts(formattedProducts)

        // Get "No Elon Face" and "Tesla vs Elon Emoji" products
        const featured = groupedProducts.filter(
          (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
        )

        console.log(
          "Featured products loaded from API:",
          featured.map((p) => ({ baseId: p.baseId, baseName: p.baseName })),
        )
        setFeaturedProducts(featured)
      } catch (error) {
        console.error("Error loading featured products:", error)
        // Fallback to static data if API fails
        const { GROUPED_PRODUCTS } = await import("@/lib/product-data")
        const featured = GROUPED_PRODUCTS.filter(
          (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
        )
        setFeaturedProducts(featured)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-10">
          <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">FEATURED PRODUCTS</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Express Your Independence</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-dark-400 border border-gray-800 animate-pulse">
              <div className="h-80 bg-gray-700"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">FEATURED PRODUCTS</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold">Express Your Independence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredProducts.map((product) => (
          <div
            key={product.baseId}
            className="group bg-dark-400 border border-gray-800 hover:border-gray-700 transition-all duration-300 flex flex-col"
            onMouseEnter={() => setHoveredProduct(product.baseId)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <Link href={`/product/${product.baseId}`} className="flex flex-col h-full">
              <div
                className="relative overflow-hidden flex-1 flex items-center justify-center"
                style={{
                  minHeight: "350px",
                }}
              >
                <div
                  className="relative w-full h-full max-w-full max-h-full"
                  style={{
                    aspectRatio: `${product.width}/${product.height}`,
                  }}
                >
                  <FallbackImage
                    src={product.image}
                    alt={product.baseName}
                    fill
                    className="object-contain transition-transform duration-700 ease-out"
                    style={{
                      transform: hoveredProduct === product.baseId ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button className="w-full bg-white text-black hover:bg-white/90 rounded-none">
                    <ShoppingBag className="mr-2 h-4 w-4" /> View Options
                  </Button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium group-hover:text-red-500 transition-colors duration-300">
                      {product.baseName}
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      {product.variants.magnet && product.variants.sticker
                        ? "Available as magnet or sticker"
                        : product.variants.magnet
                          ? "Magnet"
                          : "Sticker"}
                    </p>
                  </div>
                  <p className="text-lg font-medium">
                    $
                    {Math.min(
                      product.variants.magnet?.price || Number.POSITIVE_INFINITY,
                      product.variants.sticker?.price || Number.POSITIVE_INFINITY,
                    ).toFixed(2)}
                    {product.variants.magnet && product.variants.sticker && "+"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {featuredProducts.length === 0 && !loading && (
        <div className="text-center text-white/70">
          <p>No featured products available at the moment.</p>
        </div>
      )}

      <div className="text-center mt-10">
        <Link href="/shop/all">
          <Button className="bg-white text-black hover:bg-white/90 px-8 py-3">VIEW ALL PRODUCTS</Button>
        </Link>
      </div>
    </div>
  )
}
