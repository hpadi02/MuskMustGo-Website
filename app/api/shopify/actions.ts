"use server"

import {
  createCheckout as createShopifyCheckout,
  updateCheckout as updateShopifyCheckout,
  getAllProducts as fetchAllProducts,
  getProductByHandle as fetchProductByHandle,
} from "@/lib/shopify"

// Server actions to interact with Shopify
export async function createCheckout() {
  try {
    const checkout = await createShopifyCheckout()
    return {
      id: checkout.id,
      webUrl: checkout.webUrl,
      success: true,
    }
  } catch (error) {
    console.error("Error creating checkout:", error)
    return { success: false, error: "Failed to create checkout" }
  }
}

export async function updateCheckout(checkoutId: string, lineItems: any[]) {
  try {
    const checkout = await updateShopifyCheckout(checkoutId, lineItems)
    return {
      id: checkout.id,
      webUrl: checkout.webUrl,
      success: true,
    }
  } catch (error) {
    console.error("Error updating checkout:", error)
    return { success: false, error: "Failed to update checkout" }
  }
}

export async function getProducts() {
  try {
    const products = await fetchAllProducts()
    return { products, success: true }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { success: false, error: "Failed to fetch products" }
  }
}

export async function getProduct(handle: string) {
  try {
    const product = await fetchProductByHandle(handle)
    return { product, success: true }
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error)
    return { success: false, error: "Failed to fetch product" }
  }
}
