import { getStripeProducts } from "@/lib/stripe-products"
import { groupProducts } from "@/lib/product-data"
import FeaturedProductsClient from "./featured-products-client"

export default async function FeaturedProducts() {
  try {
    // Use the same data source as the product page
    const products = await getStripeProducts()
    const groupedProducts = groupProducts(products)

    // Get "No Elon Face" and "Tesla vs Elon Emoji" products
    const featuredProducts = groupedProducts.filter(
      (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
    )

    console.log(
      "Server-side featured products:",
      featuredProducts.map((p) => ({ baseId: p.baseId, baseName: p.baseName })),
    )

    return <FeaturedProductsClient products={featuredProducts} />
  } catch (error) {
    console.error("Error loading featured products:", error)
    return (
      <div className="w-full">
        <div className="text-center mb-10">
          <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">FEATURED PRODUCTS</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Express Your Independence</h2>
        </div>
        <div className="text-center text-white/70 p-8">
          <p>Unable to load featured products at the moment.</p>
        </div>
      </div>
    )
  }
}
