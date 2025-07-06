import { redirect, notFound } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Star, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"
import { ProductGallery } from "@/components/product-gallery"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { products } from "@/lib/product-data"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params

  // Redirect Tesla vs Elon Emoji product directly to customization
  if (id === "tesla_vs_elon_emoji") {
    redirect("/product/customize-emoji/magnet")
  }

  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Link
          href="/shop/all"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Suspense fallback={<div className="aspect-square bg-dark-100 rounded-lg animate-pulse" />}>
              <ProductGallery images={product.images} alt={product.name} />
            </Suspense>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                  {product.category}
                </Badge>
                {product.featured && (
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/70 text-sm">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-white/50 line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.originalPrice && (
                <div className="text-sm text-green-400">
                  Save ${(product.originalPrice - product.price).toFixed(2)} (
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </div>
              )}
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Description</h3>
              <p className="text-white/80 leading-relaxed">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/80">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className="bg-white/10" />

            {/* Add to Cart */}
            <div className="space-y-4">
              <AddToCartButton product={product} />

              {product.customizable && (
                <Link href={`/product/customize/${product.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Customize This Product
                  </Button>
                </Link>
              )}
            </div>

            {/* Product Benefits */}
            <Card className="bg-dark-100/50 border-white/10">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <Truck className="w-4 h-4 text-green-400" />
                    Free shipping over $50
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Quality guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <RotateCcw className="w-4 h-4 text-yellow-400" />
                    30-day returns
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
