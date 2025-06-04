// Product data from Ed's backend API
export interface Product {
  product_id: string
  product_name: string
  image_name: string
  height: number
  width: number
  price: number
  medium_id: string
  medium_name: string
}

// Group products by their base name (without _magnet or _sticker suffix)
export interface GroupedProduct {
  baseId: string
  baseName: string
  image: string
  variants: {
    magnet?: Product
    sticker?: Product
  }
  height: number
  width: number
  description: string
  features: string[]
  customizable: boolean
}

// Map image names to URLs
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

// Function to get base name from product name
function getBaseName(productName: string): string {
  return productName
    .replace(/_magnet$|_sticker$/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Function to format dimensions
function formatDimensions(height: number, width: number): string {
  return `${height}" x ${width}"`
}

// Function to group products by base name
export function groupProducts(products: Product[]): GroupedProduct[] {
  const groupedMap = new Map<string, GroupedProduct>()

  products.forEach((product) => {
    const baseProductName = product.product_name.replace(/_magnet$|_sticker$/, "")
    const type = product.product_name.endsWith("_magnet") ? "magnet" : "sticker"
    const baseName = getBaseName(baseProductName)
    const imageUrl =
      IMAGE_URLS[product.image_name] || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(baseName)}`

    if (!groupedMap.has(baseProductName)) {
      groupedMap.set(baseProductName, {
        baseId: baseProductName,
        baseName,
        image: imageUrl,
        variants: {},
        height: product.height,
        width: product.width,
        description:
          PRODUCT_DESCRIPTIONS[baseProductName] ||
          `${baseName} for Tesla owners who want to express their independence.`,
        features: type === "magnet" ? MAGNET_FEATURES : STICKER_FEATURES,
        customizable: baseProductName === "tesla_musk_emojis",
      })
    }

    const group = groupedMap.get(baseProductName)!
    group.variants[type as "magnet" | "sticker"] = product
  })

  return Array.from(groupedMap.values())
}

// Raw product data from the API
export const RAW_PRODUCTS: Product[] = [
  {
    product_id: "99374b4a-c419-43b1-a878-d57f676b68f6",
    product_name: "deport_elon_magnet",
    image_name: "deport-elon.png",
    height: 2.5,
    width: 10.0,
    price: 13.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
  },
  {
    product_id: "a6b2deb6-d6ee-4afe-9d9f-00f54f6dc123",
    product_name: "deport_elon_sticker",
    image_name: "deport-elon.png",
    height: 2.5,
    width: 10.0,
    price: 4.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
  },
  {
    product_id: "25715ee1-0ce8-47a1-a815-c5a7fde888d3",
    product_name: "did_not_invent_magnet",
    image_name: "did-not-invent.png",
    height: 6.0,
    width: 10.0,
    price: 19.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
  },
  {
    product_id: "996ef07f-0994-4127-9c57-eb14b3c1d88a",
    product_name: "did_not_invent_sticker",
    image_name: "did-not-invent.png",
    height: 6.0,
    width: 10.0,
    price: 8.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
  },
  {
    product_id: "500b3f79-e18b-4a4e-a61f-166934edfa61",
    product_name: "hate_nazis_magnet",
    image_name: "hate-nazis.png",
    height: 6.0,
    width: 10.0,
    price: 19.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
  },
  {
    product_id: "986c722c-823f-4004-95f2-fd027eb61c2f",
    product_name: "hate_nazis_sticker",
    image_name: "hate-nazis.png",
    height: 6.0,
    width: 10.0,
    price: 8.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
  },
  {
    product_id: "d2617bd5-8387-40e5-bdf9-ade5717f1cec",
    product_name: "not_ceo_wavy_magnet",
    image_name: "not-ceo-wavy.png",
    height: 2.5,
    width: 10.0,
    price: 13.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
  },
  {
    product_id: "3e982525-202d-4c18-a15d-e02c6d631b52",
    product_name: "not_ceo_wavy_sticker",
    image_name: "not-ceo-wavy.png",
    height: 2.5,
    width: 10.0,
    price: 4.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
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
  },
  {
    product_id: "adc3f2ae-9128-4352-8071-685ace54d19b",
    product_name: "no_elon_face_sticker",
    image_name: "no-elon-musk.png",
    height: 8.0,
    width: 8.0,
    price: 6.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
  },
  {
    product_id: "57ff283a-4124-4c37-ba30-217ed73cb2a9",
    product_name: "tesla_musk_emojis_magnet",
    image_name: "emoji-musk.png",
    height: 8.0,
    width: 12.0,
    price: 19.99,
    medium_id: "340401d7-936b-47a2-99bb-c7a665c52e5b",
    medium_name: "bumper magnet",
  },
  {
    product_id: "376de82f-fc72-4e9c-ac92-93e3055ccfc2",
    product_name: "tesla_musk_emojis_sticker",
    image_name: "emoji-musk.png",
    height: 8.0,
    width: 12.0,
    price: 8.99,
    medium_id: "7a21e0d6-b223-42a4-a042-0e35a36c1802",
    medium_name: "bumper sticker",
  },
]

// Grouped products for the UI
export const GROUPED_PRODUCTS = groupProducts(RAW_PRODUCTS)
