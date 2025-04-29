"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import FallbackImage from "./fallback-image"
import { PRODUCTS } from "@/lib/image-assets"

export default function ProductGallery() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
      {PRODUCTS.map((product, index) => (
        <Link href={`/product/${product.id}`} key={product.id}>
          <motion.div
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
              <FallbackImage
                src={product.image}
                alt={product.name}
                fill
                className="transition-transform duration-700 ease-in-out"
                style={{
                  transform: hoveredProduct === product.id ? "scale(1.1)" : "scale(1)",
                }}
                useRedFallback={true}
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{product.name}</h3>
              </div>
              <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
