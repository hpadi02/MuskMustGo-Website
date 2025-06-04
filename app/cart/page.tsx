// Update the import for the new product data
import { GROUPED_PRODUCTS, RAW_PRODUCTS } from "@/lib/product-data"

// Add a helper function to find product details by ID
const findProductById = (productId: string) => {
  // First check in raw products
  const rawProduct = RAW_PRODUCTS.find((p) => p.product_id === productId)
  if (rawProduct) {
    // Find the grouped product this belongs to
    const groupedProduct = GROUPED_PRODUCTS.find(
      (g) => g.variants.magnet?.product_id === productId || g.variants.sticker?.product_id === productId,
    )

    if (groupedProduct) {
      return {
        ...rawProduct,
        baseName: groupedProduct.baseName,
        image: groupedProduct.image,
        description: groupedProduct.description,
      }
    }
    return rawProduct
  }
  return null
}
