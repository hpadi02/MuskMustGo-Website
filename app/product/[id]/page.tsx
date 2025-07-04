import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getStripeProducts } from "@/lib/stripe-products"
import { groupProducts } from "@/lib/product-data"
import { notFound } from "next/navigation"
import { ProductShowcase } from "@/components/product-showcase"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
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
      notFound()
    }

    // ✅ For Tesla vs Elon emoji products, redirect directly to customization
    if (product.baseId.includes("tesla") && product.baseId.includes("emoji")) {
      // Check if both variants exist to determine the default
      const hasMultipleVariants = product.variants.magnet && product.variants.sticker
      const defaultVariant = hasMultipleVariants ? "magnet" : product.variants.magnet ? "magnet" : "sticker"

      // Redirect directly to customize page, skipping the intermediate step
      if (typeof window !== "undefined") {
        window.location.href = `/product/customize-emoji/${defaultVariant}?product=${product.baseId}`
        return null
      }

      // Server-side redirect fallback
      return (
        <div className="min-h-screen bg-dark-400 text-white flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">Redirecting to customization...</p>
            <Link
              href={`/product/customize-emoji/${defaultVariant}?product=${product.baseId}`}
              className="text-red-400 hover:text-red-300 underline"
            >
              Click here if not redirected automatically
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-dark-400 text-white min-h-screen">
        <div className="container mx-auto px-6 md:px-10 py-32">
          <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Link>

          <ProductShowcase product={product} />
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
