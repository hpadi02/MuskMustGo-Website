"use server"

import Client from "shopify-buy"

// Shopify client initialization - server-side only
const client = Client.buildClient({
  domain: process.env.SHOPIFY_DOMAIN!,
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
})

export async function createCheckout() {
  return await client.checkout.create()
}

export async function updateCheckout(checkoutId: string, lineItems: any[]) {
  return await client.checkout.addLineItems(checkoutId, lineItems)
}

export async function getProductByHandle(handle: string) {
  return await client.product.fetchByHandle(handle)
}

export async function getAllProducts() {
  return await client.product.fetchAll()
}

export async function getCollectionByHandle(handle: string) {
  return await client.collection.fetchByHandle(handle)
}

export async function getAllCollections() {
  return await client.collection.fetchAll()
}

// Don't export the client directly
// export default client
