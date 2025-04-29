"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PRODUCTS } from "@/lib/image-assets"

export default function ProductShowcase() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Add to cart logic would go here
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
      {PRODUCTS.map((product) => (
        <div
          key={product.id}
          className="group"
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <Link href={`/product/${product.id}`}>
            <div className="relative aspect-square overflow-hidden rounded-2xl mb-6">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-1000 ease-out"
                style={{
                  transform: hoveredProduct === product.id ? "scale(1.1)" : "scale(1)",
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full" onClick={handleAddToCart}>
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-medium group-hover:text-red-500 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
