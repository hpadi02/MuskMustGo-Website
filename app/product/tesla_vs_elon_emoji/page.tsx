import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { GROUPED_PRODUCTS } from "@/lib/product-data"
import EmojiCustomizer from "@/components/emoji-customizer"

export default function TeslaVsElonEmojiPage() {
  // Find the Tesla emoji product
  const product = GROUPED_PRODUCTS.find((p) => p.baseId.includes("tesla") && p.baseId.includes("emoji"))

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-32">
        <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="aspect-square bg-dark-300 rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg?height=600&width=600"}
                  alt={product.baseName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">{product.baseName}</h1>
                <p className="text-lg text-white/70 mb-6">
                  Express your Tesla love and Elon opinions with custom emoji combinations. Dimensions: {product.height}
                  " x {product.width}"
                </p>

                <div className="flex items-center gap-4 mb-8">
                  {product.variants.magnet && (
                    <div className="text-2xl font-bold">Magnet: ${product.variants.magnet.price.toFixed(2)}</div>
                  )}
                  {product.variants.sticker && (
                    <div className="text-2xl font-bold">Sticker: ${product.variants.sticker.price.toFixed(2)}</div>
                  )}
                </div>
              </div>

              {/* ✅ EMOJI CUSTOMIZATION DIRECTLY ON PAGE */}
              <div className="bg-dark-300 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Customize Your Emojis</h3>
                <EmojiCustomizer product={product} />
              </div>

              {/* Features moved below */}
              <div className="bg-dark-300 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Features</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Weather and UV resistant</li>
                  <li>• Premium materials</li>
                  <li>• Perfect for cars, refrigerators, metal surfaces</li>
                  <li>• Custom emoji combinations</li>
                  <li>• Available as magnet or sticker</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
