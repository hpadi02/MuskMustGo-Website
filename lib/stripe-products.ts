import "server-only"
import Stripe from "stripe"

// Initialize Stripe with the secret key
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables")
  }

  if (secretKey.startsWith("pk_")) {
    throw new Error(
      "You're using a publishable key (pk_) instead of a secret key (sk_). Please check your environment variables.",
    )
  }

  return new Stripe(secretKey, {
    apiVersion: "2023-10-16",
  })
}

// Map Stripe products to our product format
export async function getStripeProducts() {
  try {
    const stripe = getStripe()

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

    // Map Stripe products to our format
    return products.data.map((product) => {
      const productPrices = priceMap.get(product.id) || []
      const defaultPrice = productPrices.find((p) => p.id === product.default_price) || productPrices[0]

      // Extract dimensions from metadata if available
      const height = Number.parseFloat(product.metadata?.height || "0") || 0
      const width = Number.parseFloat(product.metadata?.width || "0") || 0

      // Determine if it's a magnet or sticker from the name
      const isMagnet = product.name.toLowerCase().includes("magnet")
      const isSticker = product.name.toLowerCase().includes("sticker")
      const medium_name = isMagnet ? "bumper magnet" : isSticker ? "bumper sticker" : "unknown"

      // Extract base product name (without magnet/sticker suffix)
      const baseName = product.name.replace(/\s*-\s*(Magnet|Sticker)$/i, "").trim()

      // Generate a product_id if not in metadata
      const product_id = product.metadata?.product_id || product.id

      // Extract image name from metadata or use first image
      const image_name =
        product.metadata?.image_name ||
        (product.images && product.images.length > 0
          ? product.images[0].split("/").pop() || "unknown.png"
          : "unknown.png")

      return {
        product_id,
        product_name:
          product.metadata?.product_name ||
          product.name
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, ""),
        image_name,
        height,
        width,
        price: defaultPrice?.unit_amount ? defaultPrice.unit_amount / 100 : 0,
        medium_id: product.metadata?.medium_id || "",
        medium_name,
        stripeId: defaultPrice?.id || "",
        productId: product.id,
        baseName,
        description: product.description || "",
        images: product.images || [],
      }
    })
  } catch (error) {
    console.error("Error fetching products from Stripe:", error)

    // Provide fallback data for development/testing
    if (process.env.NODE_ENV === "development") {
      console.log("Using fallback product data for development")
      return getFallbackProducts()
    }

    return []
  }
}

// Get a single product by ID
export async function getStripeProduct(productId: string) {
  try {
    const stripe = getStripe()

    const product = await stripe.products.retrieve(productId, {
      expand: ["default_price"],
    })

    // Get all prices for this product
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
    })

    const defaultPrice = product.default_price as Stripe.Price

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
      all_prices: prices.data.map((p) => ({
        id: p.id,
        unit_amount: p.unit_amount,
        currency: p.currency,
        nickname: p.nickname,
      })),
    }
  } catch (error) {
    console.error(`Error fetching product ${productId} from Stripe:`, error)
    return null
  }
}

// Fallback products for development/testing
function getFallbackProducts() {
  return [
    {
      product_id: "fallback_1",
      product_name: "no_elon_musk_magnet",
      image_name: "no-elon-musk.png",
      height: 3,
      width: 11.5,
      price: 9.99,
      medium_name: "bumper magnet",
      stripeId: "price_fallback_1",
      productId: "prod_fallback_1",
      baseName: "No Elon Musk",
      description: "Show your opposition to Elon Musk with this bumper magnet",
      images: ["/images/no-elon-musk.png"],
    },
    {
      product_id: "fallback_2",
      product_name: "no_elon_musk_sticker",
      image_name: "no-elon-musk.png",
      height: 3,
      width: 11.5,
      price: 7.99,
      medium_name: "bumper sticker",
      stripeId: "price_fallback_2",
      productId: "prod_fallback_2",
      baseName: "No Elon Musk",
      description: "Show your opposition to Elon Musk with this bumper sticker",
      images: ["/images/no-elon-musk.png"],
    },
  ]
}
