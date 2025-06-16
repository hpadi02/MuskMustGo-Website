import { getStripeProducts } from "@/lib/stripe-products"
import { groupProducts } from "@/lib/product-data"
import FeaturedProductsClient from "./featured-products-client"

export default async function FeaturedProducts() {
  try {
    // Use the same data source as the product page
    const products = await getStripeProducts()

    console.log("Raw Stripe products count:", products?.length || 0)

    if (!products || !Array.isArray(products)) {
      console.error("No products received from Stripe")
      throw new Error("No products from Stripe")
    }

    const groupedProducts = groupProducts(products)

    console.log(
      "All grouped products:",
      groupedProducts.map((p) => ({
        baseId: p.baseId,
        baseName: p.baseName,
        hasMagnet: !!p.variants.magnet,
        hasSticker: !!p.variants.sticker,
      })),
    )

    // Get "No Elon Face" and "Tesla vs Elon Emoji" products
    const featuredProducts = groupedProducts.filter(
      (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
    )

    console.log(
      "Filtered featured products:",
      featuredProducts.map((p) => ({
        baseId: p.baseId,
        baseName: p.baseName,
      })),
    )

    if (featuredProducts.length === 0) {
      console.warn(
        "No featured products found! Available baseIds:",
        groupedProducts.map((p) => p.baseId),
      )
    }

    return <FeaturedProductsClient products={featuredProducts} />
  } catch (error) {
    console.error("Error loading featured products:", error)

    // Fallback to static data if Stripe fails
    const { GROUPED_PRODUCTS } = await import("@/lib/product-data")
    const featuredProducts = GROUPED_PRODUCTS.filter(
      (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
    )

    console.log(
      "Using fallback static data:",
      featuredProducts.map((p) => ({
        baseId: p.baseId,
        baseName: p.baseName,
      })),
    )

    return <FeaturedProductsClient products={featuredProducts} />
  }
}
