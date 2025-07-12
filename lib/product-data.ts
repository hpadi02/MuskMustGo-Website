import type { Product } from "@/types/product"

// Fallback product sort order - used if environment variable is not available or invalid
const FALLBACK_PRODUCT_SORT_ORDER: Record<string, number> = {
  no_elon_face: 1,
  tesla_vs_elon_emoji: 2,
  not_ceo_wavy: 3,
  hate_nazis: 4,
  deport_elon: 5,
  did_not_invent: 6,
}

// Function to get product sort order from environment variable or fallback
function getProductSortOrder(): Record<string, number> {
  try {
    const envSortOrder = process.env.PRODUCT_SORT_ORDER

    if (!envSortOrder) {
      console.log("📋 No PRODUCT_SORT_ORDER environment variable found, using fallback order")
      return FALLBACK_PRODUCT_SORT_ORDER
    }

    console.log("📋 Found PRODUCT_SORT_ORDER environment variable:", envSortOrder)

    const parsedOrder = JSON.parse(envSortOrder)
    console.log("✅ Successfully parsed product sort order from environment:", parsedOrder)

    return parsedOrder
  } catch (error) {
    console.error("❌ Error parsing PRODUCT_SORT_ORDER environment variable:", error)
    console.log("📋 Falling back to hardcoded product sort order")
    return FALLBACK_PRODUCT_SORT_ORDER
  }
}

// Get the current product sort order (from env or fallback)
const PRODUCT_SORT_ORDER = getProductSortOrder()

export const products: Product[] = [
  {
    id: "tesla_vs_elon_emoji",
    baseId: "tesla_vs_elon_emoji",
    name: "Tesla vs Elon Emoji",
    description:
      "Express your feelings with custom emoji combinations! Choose your Tesla emoji (the good) and your Elon emoji (the bad) to create the perfect contrast.",
    price: 14.99,
    originalPrice: 19.99,
    image: "/images/emoji-musk.png",
    category: "stickers",
    inStock: true,
    featured: true,
    isCustomizable: true,
    customizationType: "emoji",
    stripeProductId: "prod_RNlhYOhKGu0DvSUkRoVtOeu",
    stripePriceId: "price_1RbrUmHXKGu0DvSUkRoVtOeu",
    sortOrder: PRODUCT_SORT_ORDER.tesla_vs_elon_emoji || 999,
  },
  {
    id: "deport_elon",
    baseId: "deport_elon",
    name: "Deport Elon",
    description:
      "Make a bold statement with this eye-catching design. Perfect for those who believe in accountability.",
    price: 12.99,
    originalPrice: 16.99,
    image: "/placeholder.svg?height=400&width=400&text=Deport+Elon",
    category: "stickers",
    inStock: true,
    featured: true,
    stripeProductId: "prod_RNlhYOhKGu0DvSUkRoVtOeu",
    stripePriceId: "price_1RbrUmHXKGu0DvSUkRoVtOeu",
    sortOrder: PRODUCT_SORT_ORDER.deport_elon || 999,
  },
  {
    id: "did_not_invent",
    baseId: "did_not_invent",
    name: "Elon Did Not Invent Tesla",
    description: "Set the record straight with this factual statement. Perfect for history buffs and truth seekers.",
    price: 11.99,
    originalPrice: 15.99,
    image: "/placeholder.svg?height=400&width=400&text=Did+Not+Invent",
    category: "stickers",
    inStock: true,
    featured: false,
    stripeProductId: "prod_RNlhYOhKGu0DvSUkRoVtOeu",
    stripePriceId: "price_1RbrUmHXKGu0DvSUkRoVtOeu",
    sortOrder: PRODUCT_SORT_ORDER.did_not_invent || 999,
  },
  {
    id: "hate_nazis",
    baseId: "hate_nazis",
    name: "I Hate Nazis",
    description: "A clear and unambiguous statement against hate. Stand up for what's right.",
    price: 10.99,
    originalPrice: 14.99,
    image: "/placeholder.svg?height=400&width=400&text=Hate+Nazis",
    category: "stickers",
    inStock: true,
    featured: true,
    stripeProductId: "prod_RNlhYOhKGu0DvSUkRoVtOeu",
    stripePriceId: "price_1RbrUmHXKGu0DvSUkRoVtOeu",
    sortOrder: PRODUCT_SORT_ORDER.hate_nazis || 999,
  },
  {
    id: "not_ceo_wavy",
    baseId: "not_ceo_wavy",
    name: "Elon Is Not My CEO",
    description: "Assert your independence with this wavy design. Perfect for those who value autonomy.",
    price: 13.99,
    originalPrice: 17.99,
    image: "/placeholder.svg?height=400&width=400&text=Not+My+CEO",
    category: "stickers",
    inStock: true,
    featured: false,
    stripeProductId: "prod_RNlhYOhKGu0DvSUkRoVtOeu",
    stripePriceId: "price_1RbrUmHXKGu0DvSUkRoVtOeu",
    sortOrder: PRODUCT_SORT_ORDER.not_ceo_wavy || 999,
  },
  {
    id: "no_elon_face",
    baseId: "no_elon_face",
    name: "Say No to Elon!",
    description: "A simple but powerful message. Sometimes less is more.",
    price: 9.99,
    originalPrice: 13.99,
    image: "/images/no-elon-musk.png",
    category: "stickers",
    inStock: true,
    featured: true,
    stripeProductId: "prod_RNlhYOhKGu0DvSUkRoVtOeu",
    stripePriceId: "price_1RbrUmHXKGu0DvSUkRoVtOeu",
    sortOrder: PRODUCT_SORT_ORDER.no_elon_face || 999,
  },
]

// Helper function to get products sorted by their sortOrder
export function getSortedProducts(): Product[] {
  return [...products].sort((a, b) => a.sortOrder - b.sortOrder)
}

// Helper function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

// Helper function to get featured products
export function getFeaturedProducts(): Product[] {
  return getSortedProducts().filter((product) => product.featured)
}

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return getSortedProducts().filter((product) => product.category === category)
}
