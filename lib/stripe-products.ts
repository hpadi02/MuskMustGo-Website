import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export interface StripeProductData {
  product_id: string
  product_name: string
  baseName: string
  baseId: string // Add this field explicitly
  image_name: string
  height: number
  width: number
  price: number
  medium_id: string
  medium_name: string
  stripeId: string // Price ID
  productId: string // Product ID
  images: string[]
}

// Mapping from Stripe product names to our internal structure
const STRIPE_PRODUCT_MAPPING: Record<
  string,
  {
    baseId: string
    baseName: string
    image_name: string
    height: number
    width: number
    customizable?: boolean
  }
> = {
  "Say No to Elon! - bumper sticker": {
    baseId: "no_elon_face",
    baseName: "Say No to Elon!",
    image_name: "no-elon-musk.png",
    height: 8.0,
    width: 8.0,
  },
  "Say No to Elon! - magnet": {
    baseId: "no_elon_face",
    baseName: "Say No to Elon!",
    image_name: "no-elon-musk.png",
    height: 8.0,
    width: 8.0,
  },
  "Love the Car, NOT the CEO! - bumper sticker": {
    baseId: "not_ceo_wavy",
    baseName: "Love the Car, NOT the CEO!",
    image_name: "not-ceo-wavy.png",
    height: 2.5,
    width: 10.0,
  },
  "Love the Car, NOT the CEO! - magnet": {
    baseId: "not_ceo_wavy",
    baseName: "Love the Car, NOT the CEO!",
    image_name: "not-ceo-wavy.png",
    height: 2.5,
    width: 10.0,
  },
  "Love Teslas, Hate Nazis - bumper sticker": {
    baseId: "hate_nazis",
    baseName: "Love Teslas, Hate Nazis",
    image_name: "hate-nazis.png",
    height: 6.0,
    width: 10.0,
  },
  "Love Teslas, Hate Nazis - magnet": {
    baseId: "hate_nazis",
    baseName: "Love Teslas, Hate Nazis",
    image_name: "hate-nazis.png",
    height: 6.0,
    width: 10.0,
  },
  "Deport Elon! - bumper sticker": {
    baseId: "deport_elon",
    baseName: "Deport Elon!",
    image_name: "deport-elon.png",
    height: 2.5,
    width: 10.0,
  },
  "Deport Elon! - magnet": {
    baseId: "deport_elon",
    baseName: "Deport Elon!",
    image_name: "deport-elon.png",
    height: 2.5,
    width: 10.0,
  },
  "Elon Did Not Invent This Car - bumper sticker": {
    baseId: "did_not_invent",
    baseName: "Elon Did Not Invent This Car",
    image_name: "did-not-invent.png",
    height: 6.0,
    width: 10.0,
  },
  "Elon Did Not Invent This Car - magnet": {
    baseId: "did_not_invent",
    baseName: "Elon Did Not Invent This Car",
    image_name: "did-not-invent.png",
    height: 6.0,
    width: 10.0,
  },
  "Tesla vs. Elon Emoji Bumper Sticker": {
    baseId: "tesla_vs_elon_emoji",
    baseName: "Tesla vs. Elon Emoji",
    image_name: "emoji-musk.png",
    height: 8.0,
    width: 12.0,
    customizable: true,
  },
  "Tesla vs. Elon Emoji Magnet": {
    baseId: "tesla_vs_elon_emoji",
    baseName: "Tesla vs. Elon Emoji",
    image_name: "emoji-musk.png",
    height: 8.0,
    width: 12.0,
    customizable: true,
  },
}

export async function getStripeProducts(): Promise<StripeProductData[]> {
  try {
    console.log("🔄 STRIPE: Fetching products from Stripe...")

    // Get all active products
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    })

    console.log(`🔄 STRIPE: Found ${products.data.length} products in Stripe`)
    console.log(
      "🔄 STRIPE: Product names:",
      products.data.map((p) => p.name),
    )

    const productData: StripeProductData[] = []

    for (const product of products.data) {
      try {
        console.log(`🔄 STRIPE: Processing product: ${product.name}`)

        // Get prices for this product
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
        })

        if (prices.data.length === 0) {
          console.warn(`⚠️ STRIPE: No active prices found for product: ${product.name}`)
          continue
        }

        // Use the first active price
        const price = prices.data[0]

        // Get product mapping
        const mapping = STRIPE_PRODUCT_MAPPING[product.name || ""]

        if (!mapping) {
          console.warn(`⚠️ STRIPE: No mapping found for Stripe product: ${product.name}`)
          console.log("🔄 STRIPE: Available mappings:", Object.keys(STRIPE_PRODUCT_MAPPING))
          continue
        }

        // Determine if this is a magnet or sticker
        const isMagnet = (product.name || "").toLowerCase().includes("magnet")
        const isSticker = (product.name || "").toLowerCase().includes("sticker")

        const productInfo: StripeProductData = {
          product_id: `${mapping.baseId}_${isMagnet ? "magnet" : "sticker"}`,
          product_name: product.name || "",
          baseName: mapping.baseName,
          baseId: mapping.baseId, // Explicitly set baseId
          image_name: mapping.image_name,
          height: mapping.height,
          width: mapping.width,
          price: (price.unit_amount || 0) / 100, // Convert from cents
          medium_id: isMagnet ? "magnet" : "sticker",
          medium_name: isMagnet ? "bumper magnet" : "bumper sticker",
          stripeId: price.id,
          productId: product.id,
          images: product.images || [],
        }

        productData.push(productInfo)
        console.log(`✅ STRIPE: Added product: ${product.name} - $${productInfo.price} - baseId: ${mapping.baseId}`)
      } catch (error) {
        console.error(`❌ STRIPE: Error processing product ${product.name}:`, error)
      }
    }

    console.log(`✅ STRIPE: Successfully processed ${productData.length} products`)
    return productData
  } catch (error) {
    console.error("❌ STRIPE: Error fetching products from Stripe:", error)
    return []
  }
}
