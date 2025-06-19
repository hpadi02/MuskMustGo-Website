import { getStripeProducts } from "@/lib/stripe-products"
import { groupProducts, GROUPED_PRODUCTS } from "@/lib/product-data"
import FeaturedProductsClient from "./featured-products-client"

export default async function FeaturedProducts() {
  console.log("🏠 FEATURED PRODUCTS: Starting to load...")

  try {
    // Try to get products from Stripe first
    const stripeProducts = await getStripeProducts()
    console.log("🏠 FEATURED PRODUCTS: Raw Stripe products:", stripeProducts?.length || 0)

    if (stripeProducts && stripeProducts.length > 0) {
      const groupedProducts = groupProducts(stripeProducts)
      console.log("🏠 FEATURED PRODUCTS: Grouped products:", groupedProducts.length)
      console.log(
        "🏠 FEATURED PRODUCTS: Available baseIds:",
        groupedProducts.map((p) => p.baseId),
      )

      // Get "No Elon Face" and "Tesla vs Elon Emoji" products
      const featuredProducts = groupedProducts.filter(
        (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
      )

      console.log("🏠 FEATURED PRODUCTS: Filtered featured products:", featuredProducts.length)
      console.log(
        "🏠 FEATURED PRODUCTS: Featured product details:",
        featuredProducts.map((p) => ({
          baseId: p.baseId,
          baseName: p.baseName,
          hasMagnet: !!p.variants.magnet,
          hasSticker: !!p.variants.sticker,
          magnetPrice: p.variants.magnet?.price,
          stickerPrice: p.variants.sticker?.price,
        })),
      )

      if (featuredProducts.length > 0) {
        return <FeaturedProductsClient products={featuredProducts} />
      }
    }

    // Fallback to static data
    console.log("🏠 FEATURED PRODUCTS: Using fallback static data")
    const staticFeaturedProducts = GROUPED_PRODUCTS.filter(
      (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
    )

    console.log("🏠 FEATURED PRODUCTS: Static featured products:", staticFeaturedProducts.length)
    console.log(
      "🏠 FEATURED PRODUCTS: Static product details:",
      staticFeaturedProducts.map((p) => ({
        baseId: p.baseId,
        baseName: p.baseName,
        hasMagnet: !!p.variants.magnet,
        hasSticker: !!p.variants.sticker,
      })),
    )

    return <FeaturedProductsClient products={staticFeaturedProducts} />
  } catch (error) {
    console.error("🏠 FEATURED PRODUCTS: Error loading products:", error)

    // Final fallback to static data
    const staticFeaturedProducts = GROUPED_PRODUCTS.filter(
      (product) => product.baseId === "no_elon_face" || product.baseId === "tesla_vs_elon_emoji",
    )

    return <FeaturedProductsClient products={staticFeaturedProducts} />
  }
}
