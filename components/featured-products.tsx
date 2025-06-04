"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import FallbackImage from "./fallback-image"
import { GROUPED_PRODUCTS } from "@/lib/product-data"

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  // Get 4 featured products
  const featuredProducts = GROUPED_PRODUCTS.slice(0, 4)

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
            className="group bg-dark-400 border border-gray-800 hover:border-gray-700 transition-all duration-300"
            onMouseEnter={() => setHoveredProduct(product.baseId)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <Link href={`/product/${product.baseId}`}>
              <div className="relative aspect-square overflow-hidden">
                <FallbackImage
                  src={product.image}
                  alt={product.baseName}
                  fill
                  className="object-cover transition-transform duration-700 ease-out"
                  style={{
                    transform: hoveredProduct === product.baseId ? "scale(1.05)" : "scale(1)",
                  }}
                />
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

      <div className="text-center mt-10">
        <Link href="/shop/all">
          <Button className="bg-white text-black hover:bg-white/90 px-8 py-3">VIEW ALL PRODUCTS</Button>
        </Link>
      </div>
    </div>
  )
}
