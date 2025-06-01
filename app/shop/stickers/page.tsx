import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

const STICKER_PRODUCTS = [
  {
    id: "say-no-to-elon-sticker",
    name: "Say No to Elon! - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfUW4ydHdrdmlkVTFlTFpqc2JlbUZVUmc100RPNBx2an",
    dimensions: '6" x 6"',
    stripeId: "price_1RRgH0HXKGu0DvSUb9ggZcDF",
  },
  {
    id: "love-car-not-ceo-sticker",
    name: "Love the Car, NOT the CEO! - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfekJocENTY3dwVkJKMlhDUkNJUEMxV0xY00abXceio1",
    dimensions: '6" x 10"',
    stripeId: "price_1RRgEkHXKGu0DvSUaRbPVBds",
  },
  {
    id: "love-teslas-hate-nazis-sticker",
    name: "Love Teslas, Hate Nazis - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfSjZVSU1UVm5ZY0RrcVV0MzhmR0xQSUlw00E0wZEUmz",
    dimensions: '6" x 10"',
    stripeId: "price_1RRgBYHXKGu0DvSUDXpqZmob",
  },
  {
    id: "deport-elon-sticker",
    name: "Deport Elon! - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfVDZObWREOUVnTmZ2cGRuZFlZdlQyVjJ400dJ6dnb4N",
    dimensions: '6" x 10"',
    stripeId: "price_1RRg7dHXKGu0DvSUUuTUPmxH",
  },
  {
    id: "elon-did-not-invent-sticker",
    name: "Elon Did Not Invent This Car - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfSWZJUWl2WlBlejFtYjBZbHFUODV5NWJN00HM6zzngu",
    dimensions: '6" x 10"',
    stripeId: "price_1RRg61HXKGu0DvSUcKARoUTL",
  },
]

export default function StickersPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">SHOP</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Stickers</h1>
          <p className="text-xl text-white/70">Make a statement with our premium Tesla owner stickers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {STICKER_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group bg-dark-300 border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <FallbackImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-white text-black hover:bg-white/90 rounded-none">
                      <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium group-hover:text-red-500 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-sm text-white/70 mt-1">Dimensions: {product.dimensions}</p>
                    </div>
                    <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
