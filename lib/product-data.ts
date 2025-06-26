// Image assets for products
export const PRODUCT_IMAGES = {
  no_elon_face: "/images/no-elon-musk.png",
  tesla_vs_elon_emoji: "/images/emoji-musk.png",
  not_ceo_wavy: "/placeholder.svg?height=400&width=400&text=Not+My+CEO",
  hate_nazis: "/placeholder.svg?height=400&width=400&text=I+Hate+Nazis",
  deport_elon: "/placeholder.svg?height=400&width=400&text=Deport+Elon",
  elon_did_not_invent: "/placeholder.svg?height=400&width=400&text=Elon+Did+Not+Invent+Tesla",
}

// Product sort order - change these numbers to reorder products
const PRODUCT_SORT_ORDER: Record<string, number> = {
  no_elon_face: 1,
  tesla_vs_elon_emoji: 2,
  not_ceo_wavy: 3,
  hate_nazis: 4,
  deport_elon: 5,
  elon_did_not_invent: 6,
}

// Display names for products (optional - falls back to formatted baseId)
const DISPLAY_NAMES: Record<string, string> = {
  no_elon_face: "Say No to Elon!",
  tesla_vs_elon_emoji: "Tesla vs Elon Emoji",
  not_ceo_wavy: "Elon Is Not My CEO",
  hate_nazis: "I Hate Nazis",
  deport_elon: "Deport Elon",
  elon_did_not_invent: "Elon Did Not Invent Tesla",
}

// Raw product data
const RAW_PRODUCTS = [
  // Say No to Elon! - Magnet only
  {
    baseId: "no_elon_face",
    baseName: "Say No to Elon!",
    description: "Express your feelings about Elon with this bold statement magnet.",
    height: 3,
    width: 3,
    image: PRODUCT_IMAGES.no_elon_face,
    variants: {
      magnet: {
        product_id: "no_elon_face_magnet",
        price: 12.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
    },
  },

  // Tesla vs Elon Emoji - Both magnet and sticker
  {
    baseId: "tesla_vs_elon_emoji",
    baseName: "Tesla vs Elon Emoji",
    description: "Customize your own Tesla vs Elon emoji combination.",
    height: 4,
    width: 6,
    image: PRODUCT_IMAGES.tesla_vs_elon_emoji,
    variants: {
      magnet: {
        product_id: "tesla_vs_elon_emoji_magnet",
        price: 15.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
      sticker: {
        product_id: "tesla_vs_elon_emoji_sticker",
        price: 8.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
    },
  },

  // Elon Is Not My CEO - Both magnet and sticker
  {
    baseId: "not_ceo_wavy",
    baseName: "Elon Is Not My CEO",
    description: "Make it clear who's not your boss with this wavy design.",
    height: 3,
    width: 5,
    image: PRODUCT_IMAGES.not_ceo_wavy,
    variants: {
      magnet: {
        product_id: "not_ceo_wavy_magnet",
        price: 13.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
      sticker: {
        product_id: "not_ceo_wavy_sticker",
        price: 7.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
    },
  },

  // I Hate Nazis - Both magnet and sticker
  {
    baseId: "hate_nazis",
    baseName: "I Hate Nazis",
    description: "Stand against hate with this clear anti-Nazi statement.",
    height: 3,
    width: 4,
    image: PRODUCT_IMAGES.hate_nazis,
    variants: {
      magnet: {
        product_id: "hate_nazis_magnet",
        price: 12.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
      sticker: {
        product_id: "hate_nazis_sticker",
        price: 6.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
    },
  },

  // Deport Elon - Both magnet and sticker
  {
    baseId: "deport_elon",
    baseName: "Deport Elon",
    description: "Express your immigration policy preferences regarding Elon.",
    height: 3,
    width: 4,
    image: PRODUCT_IMAGES.deport_elon,
    variants: {
      magnet: {
        product_id: "deport_elon_magnet",
        price: 12.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
      sticker: {
        product_id: "deport_elon_sticker",
        price: 6.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
    },
  },

  // Elon Did Not Invent Tesla - Both magnet and sticker
  {
    baseId: "elon_did_not_invent",
    baseName: "Elon Did Not Invent Tesla",
    description: "Set the record straight about Tesla's true founders.",
    height: 3,
    width: 5,
    image: PRODUCT_IMAGES.elon_did_not_invent,
    variants: {
      magnet: {
        product_id: "elon_did_not_invent_magnet",
        price: 13.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
      sticker: {
        product_id: "elon_did_not_invent_sticker",
        price: 7.99,
        stripeId: "price_1RbpzaHXKGu0DvSUoVQQhWJy", // Stripe price ID
        productId: "prod_SMOtIBBTRR6MWe", // Stripe product ID
      },
    },
  },
]

// Helper function to get sort order
function getSortOrder(baseId: string): number {
  return PRODUCT_SORT_ORDER[baseId] || 999 // Default to 999 for new products
}

// Helper function to get display name
function getDisplayName(baseId: string): string {
  return DISPLAY_NAMES[baseId] || baseId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

// Process and sort products
export const GROUPED_PRODUCTS = RAW_PRODUCTS.map((product) => ({
  ...product,
  baseName: getDisplayName(product.baseId),
  sortOrder: getSortOrder(product.baseId),
})).sort((a, b) => a.sortOrder - b.sortOrder)

// Export individual products for easy access
export const PRODUCTS = GROUPED_PRODUCTS.reduce(
  (acc, product) => {
    acc[product.baseId] = product
    return acc
  },
  {} as Record<string, (typeof GROUPED_PRODUCTS)[0]>,
)

// Helper function to get all variants as flat array
export const getAllVariants = () => {
  const variants: Array<{
    id: string
    name: string
    price: number
    image: string
    baseId: string
    variantType: string
    stripeId?: string
    productId?: string
  }> = []

  GROUPED_PRODUCTS.forEach((product) => {
    Object.entries(product.variants).forEach(([variantType, variant]) => {
      variants.push({
        id: variant.product_id,
        name: `${product.baseName} (${variantType})`,
        price: variant.price,
        image: product.image,
        baseId: product.baseId,
        variantType,
        stripeId: variant.stripeId,
        productId: variant.productId,
      })
    })
  })

  return variants.sort((a, b) => getSortOrder(a.baseId) - getSortOrder(b.baseId))
}
