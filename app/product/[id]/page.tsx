import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AddToCartButton } from "@/components/AddToCartButton"
import { ProductImageGallery } from "@/components/ProductImageGallery"
import { QuantityField } from "@/components/QuantityField"
import { getProduct } from "@/lib/shopify"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.featuredImage.url],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="lg:columns-2 gap-x-16">
      <ProductImageGallery product={product} />
      <div className="sticky top-0">
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-500 mb-6">{product.description}</p>
        <div className="mb-6">
          {product.variants.length > 1 ? (
            <QuantityField product={product} />
          ) : (
            <p className="text-xl font-medium">${product.variants[0].price}</p>
          )}
        </div>

        {/* Find the section that renders the Tesla vs Elon emoji product */}
        {/* Replace the customize link with direct navigation */}
        {product.id.includes("tesla") && product.id.includes("emoji") ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Link href={`/product/customize-emoji/sticker`}>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
                  Customize Sticker - ${product.variants?.sticker?.price.toFixed(2) || "8.99"}
                </Button>
              </Link>
              <Link href={`/product/customize-emoji/magnet`}>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
                  Customize Magnet - ${product.variants?.magnet?.price.toFixed(2) || "19.99"}
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/70">Choose your Tesla and Elon emojis to create your custom design</p>
          </div>
        ) : (
          // Regular add to cart for non-emoji products
          <AddToCartButton product={product} />
        )}
      </div>
    </div>
  )
}
