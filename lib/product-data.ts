// lib/product-data.ts

export interface Product {
  baseId: string
  baseName: string
  image: string
  altText: string
  variants: Variant[]
  description: string
}

export interface Variant {
  id: string
  name: string
  price: number
  options?: { [key: string]: string }
}

export const GROUPED_PRODUCTS: Product[] = [
  {
    baseId: "say-no-to-elon",
    baseName: "Say No to Elon!",
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfUW4ydHdrdmlkVTFlTFpqc2JlbUZVUmc100RPNBx2an", // Updated Stripe URL
    altText: "Say No to Elon! T-shirt",
    variants: [
      {
        id: "say-no-to-elon-tshirt-s",
        name: "T-shirt - S",
        price: 2500,
        options: { size: "S" },
      },
      {
        id: "say-no-to-elon-tshirt-m",
        name: "T-shirt - M",
        price: 2500,
        options: { size: "M" },
      },
      {
        id: "say-no-to-elon-tshirt-l",
        name: "T-shirt - L",
        price: 2500,
        options: { size: "L" },
      },
    ],
    description: "Show your disapproval of Elon's antics with this stylish t-shirt.",
  },
  {
    baseId: "free-palestine",
    baseName: "Free Palestine",
    image:
      "https://images.squarespace-cdn.com/content/v1/64c5444ff042ca35a5441188/6c29a967-4491-474f-8999-a91491ca4092/Free+Palestine+T-shirt.png?format=500w",
    altText: "Free Palestine T-shirt",
    variants: [
      {
        id: "free-palestine-tshirt-s",
        name: "T-shirt - S",
        price: 2500,
        options: { size: "S" },
      },
      {
        id: "free-palestine-tshirt-m",
        name: "T-shirt - M",
        price: 2500,
        options: { size: "M" },
      },
      {
        id: "free-palestine-tshirt-l",
        name: "T-shirt - L",
        price: 2500,
        options: { size: "L" },
      },
    ],
    description: "Show your support for a free Palestine with this t-shirt.",
  },
]

export function getProductById(id: string): Product | undefined {
  const baseId = id.split("-")[0] + "-" + id.split("-")[1] + "-" + id.split("-")[2]
  return GROUPED_PRODUCTS.find((product) => product.baseId === baseId)
}

export function getVariantById(id: string): Variant | undefined {
  for (const product of GROUPED_PRODUCTS) {
    const variant = product.variants.find((variant) => variant.id === id)
    if (variant) {
      return variant
    }
  }
  return undefined
}

// FallbackImage component (example usage, adjust as needed for your actual component)
export const FallbackImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={`object-contain transition-transform duration-700 ease-out group-hover:scale-105 bg-white/5 ${className || ""}`}
    />
  )
}
