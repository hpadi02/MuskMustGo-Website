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

    return <FeaturedProductsClient products={featuredProducts} />
  } catch (error) {
    console.error("Error loading featured products:", error)

    // Fallback to static data if Stripe fails
    const { GROUPED_PRODUCTS } = await import("@/lib/product-data")
    const featuredProducts = GROUPED_PRODUCTS.filter(
      (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
    )

    return <FeaturedProductsClient products={featuredProducts} />
  }
}
