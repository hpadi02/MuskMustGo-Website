import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// Cache the products for 5 minutes (300 seconds)
const CACHE_DURATION = 300

// Create a cache for the products
let productsCache: any = null
let lastFetchTime = 0

// Function to fetch products from Stripe
async function fetchStripeProducts() {
  const now = Date.now()

  // Return cached products if they're still valid
  if (productsCache && now - lastFetchTime < CACHE_DURATION * 1000) {
    return productsCache
  }

  try {
    // Fetch all products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    })

    // Fetch all prices to ensure we have the most up-to-date pricing
    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    })

    // Create a map of product IDs to their prices
    const priceMap = new Map()
    prices.data.forEach((price) => {
      const productId = typeof price.product === "string" ? price.product : price.product?.id
      if (!priceMap.has(productId)) {
        priceMap.set(productId, [])
      }
      priceMap.get(productId).push(price)
    })

    // Enhance product data with prices
    const enhancedProducts = products.data.map((product) => {
      const productPrices = priceMap.get(product.id) || []
      const defaultPrice = productPrices.find((p) => p.id === product.default_price) || productPrices[0]

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: product.metadata || {},
        default_price: defaultPrice
          ? {
              id: defaultPrice.id,
              unit_amount: defaultPrice.unit_amount,
              currency: defaultPrice.currency,
            }
          : null,
        all_prices: productPrices.map((p) => ({
          id: p.id,
          unit_amount: p.unit_amount,
          currency: p.currency,
          nickname: p.nickname,
        })),
      }
    })

    // Update cache
    productsCache = enhancedProducts
    lastFetchTime = now

    return enhancedProducts
  } catch (error) {
    console.error("Error fetching products from Stripe:", error)
    throw error
  }
}

export async function GET() {
  try {
    const products = await fetchStripeProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error in products API route:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
