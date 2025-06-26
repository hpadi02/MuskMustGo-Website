// Image assets for products
const IMAGE_URLS: Record<string, string> = {
  "deport-elon.png":
    "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfVDZObWREOUVnTmZ2cGRuZFlZdlQyVjJ400dJ6dnb4N",
  "did-not-invent.png":
    "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfSWZJUWl2WlBlejFtYjBZbHFUODV5NWJN00HM6zzngu",
  "hate-nazis.png":
    "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfSjZVSU1UVm5ZY0RrcVV0MzhmR0xQSUlw00E0wZEUmz",
  "not-ceo-wavy.png":
    "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfekJocENTY3dwVkJKMlhDUkNJUEMxV0xY00abXceio1",
  "no-elon-musk.png":
    "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfUW4ydHdrdmlkVTFlTFpqc2JlbUZVUmc100RPNBx2an",
  "emoji-musk.png": "/images/emoji-musk.png",
}

// Product descriptions
const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  deport_elon: "Let's send this illegal immigrant back where he came from!",
  did_not_invent:
    "Elon Musk had nothing to do with the creation of Tesla technology. This is a great way to let the world know that your love of Teslas has nothing to do with Elon Musk.",
  hate_nazis:
    'Tired of people calling Teslas "swasticars" because of Elon\'s Nazi salutes and statements? Make it clear that you want nothing to do with Nazis!',
  not_ceo_wavy:
    "Let the world know that you drive a Tesla because they are great cars, not because you are an Elon fanboi.",
  no_elon_face:
    'Show your dislike of Elon Musk with this image of his face covered by the international symbol for "NO"!',
  tesla_musk_emojis:
    "Show your love for Tesla while making your feelings about its CEO clear with this humorous emoji design. Fully customizable with your choice of emojis.",
  tesla_vs_elon_emoji:
    "Show your love for Tesla while making your feelings about its CEO clear with this humorous emoji design. Fully customizable with your choice of emojis.",
}

// Map baseId to proper display names
const DISPLAY_NAMES: Record<string, string> = {
  deport_elon: "Deport Elon",
  did_not_invent: "Elon Did Not Invent Tesla",
  hate_nazis: "I Hate Nazis",
  not_ceo_wavy: "Elon Is Not My CEO",
  no_elon_face: "Say No to Elon!",
  tesla_vs_elon_emoji: "Tesla vs Elon Emoji",
  tesla_musk_emojis: "Tesla Musk Emojis",
}

// MANUAL PRODUCT ORDERING - Ed can change these numbers to reorder products
const PRODUCT_SORT_ORDER: Record<string, number> = {
  no_elon_face: 1, // Say No to Elon! - Ed's top choice
  tesla_vs_elon_emoji: 2, // Tesla vs Elon Emoji - customizable, popular
  not_ceo_wavy: 3, // Elon Is Not My CEO - clear statement
  hate_nazis: 4, // I Hate Nazis - strong message
  deport_elon: 5, // Deport Elon - controversial, last
  did_not_invent: 6, // Elon Did Not Invent Tesla - educational
}

// Product features
const DEFAULT_FEATURES = ["Weather and UV resistant", "Easy application", "Removable without residue", "Made in USA"]

const MAGNET_FEATURES = [
  "High-quality magnetic material",
  "Strong magnetic hold",
  "Won't damage paint",
  ...DEFAULT_FEATURES,
]

const STICKER_FEATURES = ["Premium vinyl material", ...DEFAULT_FEATURES]

// Function to get base ID from Stripe product data
function getBaseIdFromStripe(product: any): string {
  // For Stripe products, use the baseId directly if available
  if (product.baseId) {
    console.log(`🔄 GROUP: Using direct baseId: ${product.baseId}`)
    return product.baseId
  }

  // If the product has a baseName from our mapping, use it to create baseId
  if (product.baseName) {
    const baseId = product.baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
    console.log(`🔄 GROUP: Generated baseId from baseName: ${product.baseName} -> ${baseId}`)
    return baseId
  }

  // Fallback to product name processing
  const name = (product.product_name || product.name || "").toLowerCase()
  const baseId = name
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_?(bumper_)?(sticker|magnet)_?/g, "")
  console.log(`🔄 GROUP: Generated baseId from product name: ${name} -> ${baseId}`)
  return baseId
}

// Function to determine if product is magnet or sticker
function getProductType(product: any): "magnet" | "sticker" | "unknown" {
  const name = (product.product_name || product.name || "").toLowerCase()
  const medium = (product.medium_name || product.medium_id || "").toLowerCase()

  if (name.includes("magnet") || medium.includes("magnet")) {
    return "magnet"
  }
  if (name.includes("sticker") || medium.includes("sticker")) {
    return "sticker"
  }
  return "unknown"
}

// Updated groupProducts function to handle Stripe data properly and add sorting
export function groupProducts(products: any[]) {
  // Handle undefined or null products array
  if (!products || !Array.isArray(products)) {
    console.warn("🔄 GROUP: groupProducts received invalid products array:", products)
    return []
  }

  console.log(`🔄 GROUP: Grouping ${products.length} products`)

  const groupedMap = new Map()

  // Group products by their base name
  products.forEach((product, index) => {
    if (!product || (!product.product_name && !product.name)) {
      console.warn(`🔄 GROUP: Invalid product found at index ${index}:`, product)
      return
    }

    // Get the base ID for grouping
    const baseId = getBaseIdFromStripe(product)
    // Use display name mapping
    const baseName =
      DISPLAY_NAMES[baseId] || product.baseName || product.product_name || product.name || "Unknown Product"
    const productType = getProductType(product)

    console.log(
      `🔄 GROUP: Processing product: ${product.product_name || product.name} -> baseId: ${baseId}, baseName: ${baseName}, type: ${productType}`,
    )

    // Create the grouped product if it doesn't exist
    if (!groupedMap.has(baseId)) {
      groupedMap.set(baseId, {
        baseId,
        baseName,
        variants: {},
        height: product.height || 3,
        width: product.width || 11.5,
        image:
          product.images?.[0] ||
          IMAGE_URLS[product.image_name] ||
          `/images/${product.image_name || "no-elon-musk.png"}`,
        description:
          PRODUCT_DESCRIPTIONS[baseId] || `${baseName} for Tesla owners who want to express their independence.`,
        features: productType === "magnet" ? MAGNET_FEATURES : STICKER_FEATURES,
        customizable: baseId.includes("emoji") || baseId.includes("tesla_vs_elon_emoji"),
        sortOrder: PRODUCT_SORT_ORDER[baseId] || 999, // Default to end if not specified
      })
    }

    const group = groupedMap.get(baseId)

    // Create the product variant object
    const productVariant = {
      product_id: product.product_id || product.id,
      product_name: product.product_name || product.name,
      image_name: product.image_name || "unknown.png",
      height: product.height || 3,
      width: product.width || 11.5,
      price: product.price || 0,
      medium_id: product.medium_id || "",
      medium_name: product.medium_name || (productType === "magnet" ? "bumper magnet" : "bumper sticker"),
      stripeId: product.stripeId,
      productId: product.productId,
      sortOrder: PRODUCT_SORT_ORDER[baseId] || 999,
    }

    // Add the product as either magnet or sticker variant
    if (productType === "magnet") {
      group.variants.magnet = productVariant
      // Update features to magnet features
      group.features = MAGNET_FEATURES
    } else if (productType === "sticker") {
      group.variants.sticker = productVariant
      // If we don't have magnet features yet, use sticker features
      if (!group.variants.magnet) {
        group.features = STICKER_FEATURES
      }
    } else {
      // If we can't determine the type, log warning but don't add
      console.warn(`🔄 GROUP: Could not determine product type for: ${product.product_name || product.name}`)
    }
  })

  const result = Array.from(groupedMap.values())

  // SORT BY SORT ORDER
  result.sort((a, b) => a.sortOrder - b.sortOrder)

  console.log(`🔄 GROUP: Grouped ${products.length} products into ${result.length} product groups`)

  // Log the final grouped products for debugging
  result.forEach((group) => {
    console.log(`🔄 GROUP: Final group: ${group.baseName} (sortOrder: ${group.sortOrder})`, {
      baseId: group.baseId,
      hasMagnet: !!group.variants.magnet,
      hasSticker: !!group.variants.sticker,
      magnetPrice: group.variants.magnet?.price,
      stickerPrice: group.variants.sticker?.price,
    })
  })

  return result
}

// Updated raw products with correct Tesla emoji Stripe IDs and sortOrder
export const RAW_PRODUCTS = [
  {
    product_id: "99374b4a-c419-43b1-a878-d57f676b68f6",
    product_name: "deport_elon_magnet",
    image_name: "deport-elon.png",
    height: 2.5,
    width: 10.0,
    price: 16.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
    stripeId: "price_1RRg7CHXKGu0DvSUGROSqLjd",
    productId: "prod_SMOvz7QTtXbzeO",
    sortOrder: 5,
  },
  {
    product_id: "a6b2deb6-d6ee-4afe-9d9f-00f54f6dc123",
    product_name: "deport_elon_sticker",
    image_name: "deport-elon.png",
    height: 2.5,
    width: 10.0,
    price: 12.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
    stripeId: "price_1RRg7dHXKGu0DvSUUuTUPmxH",
    productId: "prod_SMOv2AdKsIZdCv",
    sortOrder: 5,
  },
  {
    product_id: "25715ee1-0ce8-47a1-a815-c5a7fde888d3",
    product_name: "did_not_invent_magnet",
    image_name: "did-not-invent.png",
    height: 6.0,
    width: 10.0,
    price: 16.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
    stripeId: "price_1RRg5NHXKGu0DvSUQHxTKKeJ",
    productId: "prod_SMOtIBBTRR6MWe",
    sortOrder: 6,
  },
  {
    product_id: "996ef07f-0994-4127-9c57-eb14b3c1d88a",
    product_name: "did_not_invent_sticker",
    image_name: "did-not-invent.png",
    height: 6.0,
    width: 10.0,
    price: 12.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
    stripeId: "price_1RRg61HXKGu0DvSUcKARoUTL",
    productId: "prod_SMOtyyjmBf1DjJ",
    sortOrder: 6,
  },
  {
    product_id: "500b3f79-e18b-4a4e-a61f-166934edfa61",
    product_name: "hate_nazis_magnet",
    image_name: "hate-nazis.png",
    height: 6.0,
    width: 10.0,
    price: 16.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
    stripeId: "price_1RRgAoHXKGu0DvSU02nSht9K",
    productId: "prod_SMOymK1lY8V7nB",
    sortOrder: 4,
  },
  {
    product_id: "986c722c-823f-4004-95f2-fd027eb61c2f",
    product_name: "hate_nazis_sticker",
    image_name: "hate-nazis.png",
    height: 6.0,
    width: 10.0,
    price: 12.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
    stripeId: "price_1RRgBYHXKGu0DvSUDXpqZmob",
    productId: "prod_SMOzL5UlT5wbsO",
    sortOrder: 4,
  },
  {
    product_id: "d2617bd5-8387-40e5-bdf9-ade5717f1cec",
    product_name: "not_ceo_wavy_magnet",
    image_name: "not-ceo-wavy.png",
    height: 2.5,
    width: 10.0,
    price: 16.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
    stripeId: "price_1RRgECHXKGu0DvSUe24j6AID",
    productId: "prod_SMP2rxDM8XwFoX",
    sortOrder: 3,
  },
  {
    product_id: "3e982525-202d-4c18-a15d-e02c6d631b52",
    product_name: "not_ceo_wavy_sticker",
    image_name: "not-ceo-wavy.png",
    height: 2.5,
    width: 10.0,
    price: 12.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
    stripeId: "price_1RRgEkHXKGu0DvSUaRbPVBds",
    productId: "prod_SMP21kBsg5qxRM",
    sortOrder: 3,
  },
  {
    product_id: "9e445577-58a2-4615-b63f-8e0713e1f413",
    product_name: "no_elon_face_magnet",
    image_name: "no-elon-musk.png",
    height: 8.0,
    width: 8.0,
    price: 16.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
    stripeId: "price_1RRgGGHXKGu0DvSUDr9q1mNa",
    productId: "prod_SMP47IhOUcO1kn",
    sortOrder: 1,
  },
  {
    product_id: "adc3f2ae-9128-4352-8071-685ace54d19b",
    product_name: "no_elon_face_sticker",
    image_name: "no-elon-musk.png",
    height: 8.0,
    width: 8.0,
    price: 12.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
    stripeId: "price_1RRgH0HXKGu0DvSUb9ggZcDF",
    productId: "prod_SMP5jwQujuz3Cl",
    sortOrder: 1,
  },
  // FIXED: Tesla emoji products with correct Stripe IDs
  {
    product_id: "57ff283a-4124-4c37-ba30-217ed73cb2a9",
    product_name: "tesla_vs_elon_emoji_magnet",
    image_name: "emoji-musk.png",
    height: 8.0,
    width: 12.0,
    price: 19.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
    stripeId: "price_1RRg0LHXKGu0DvSUz39kCbyI", // Tesla vs. Elon Emoji Magnet
    productId: "prod_SMOn24zhjeCmXm", // Tesla vs. Elon Emoji Magnet
    sortOrder: 2,
  },
  {
    product_id: "376de82f-fc72-4e9c-ac92-93e3055ccfc2",
    product_name: "tesla_vs_elon_emoji_sticker",
    image_name: "emoji-musk.png",
    height: 8.0,
    width: 12.0,
    price: 8.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
    stripeId: "price_1RRg2MHXKGu0DvSUrcUOYZIO", // Tesla vs. Elon Emoji Bumper Sticker
    productId: "prod_SMOquwq3mLZSDE", // Tesla vs. Elon Emoji Bumper Sticker
    sortOrder: 2,
  },
]

// Grouped products for the UI - now sorted by sortOrder
export const GROUPED_PRODUCTS = groupProducts(RAW_PRODUCTS)

// Filter products by type
export const MAGNET_PRODUCTS = RAW_PRODUCTS.filter((product) => product.product_name.includes("magnet"))
export const STICKER_PRODUCTS = RAW_PRODUCTS.filter((product) => product.product_name.includes("sticker"))

// Helper function to find product by Stripe product ID
export function findProductByStripeId(stripeProductId: string): any | undefined {
  return RAW_PRODUCTS.find((product) => product.productId === stripeProductId)
}

// Helper function to find product by Stripe price ID
export function findProductByStripePriceId(stripePriceId: string): any | undefined {
  return RAW_PRODUCTS.find((product) => product.stripeId === stripePriceId)
}
