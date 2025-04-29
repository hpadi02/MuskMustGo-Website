import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PRODUCTS } from "@/lib/image-assets"
import FallbackImage from "@/components/fallback-image"
import { ShoppingBag } from "lucide-react"

export default function StickersPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">SHOP</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Magnets</h1>
          <p className="text-xl text-white/70">Make a statement with our premium Tesla owner magnets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group bg-dark-300 border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <FallbackImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-white text-black hover:bg-white/90 rounded-none">
                      <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium group-hover:text-red-500 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-sm text-white/70 mt-1">Dimensions: {product.dimensions}</p>
                    </div>
                    <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
