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

const RAW_PRODUCTS = [
  {
    baseId: "eat-the-rich",
    baseName: "Eat The Rich!",
    image: IMAGE_URLS["hate-nazis.png"],
    description: "Seize the means of production!",
    features: [
      "Premium vinyl/magnetic material",
      "Weather and UV resistant",
      "Easy application",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    variants: {
      sticker: {
        product_id: "eat-the-rich-sticker",
        price: 12.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg6MHXKGu0DvSU4wzWmz9G",
      },
      magnet: {
        product_id: "eat-the-rich-magnet",
        price: 16.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg6MHXKGu0DvSUXxFx9q4m",
      },
    },
  },
  {
    baseId: "abolish-ice",
    baseName: "Abolish ICE!",
    image: IMAGE_URLS["hate-nazis.png"],
    description: "No human is illegal!",
    features: [
      "Premium vinyl/magnetic material",
      "Weather and UV resistant",
      "Easy application",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    variants: {
      sticker: {
        product_id: "abolish-ice-sticker",
        price: 12.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg5zHXKGu0DvSU0v9FfM6J",
      },
      magnet: {
        product_id: "abolish-ice-magnet",
        price: 16.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg5zHXKGu0DvSU0SjQeqVM",
      },
    },
  },
  {
    baseId: "legalize-housing",
    baseName: "Legalize Housing!",
    image: IMAGE_URLS["hate-nazis.png"],
    description: "Housing is a human right!",
    features: [
      "Premium vinyl/magnetic material",
      "Weather and UV resistant",
      "Easy application",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    variants: {
      sticker: {
        product_id: "legalize-housing-sticker",
        price: 12.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg5gHXKGu0DvSU6w39Xv9z",
      },
      magnet: {
        product_id: "legalize-housing-magnet",
        price: 16.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg5gHXKGu0DvSU4oF70eBU",
      },
    },
  },
  {
    baseId: "deport-elon",
    baseName: "Deport Elon!",
    image: IMAGE_URLS["deport-elon.png"],
    description: "Let's send this illegal immigrant back where he came from!",
    features: [
      "Premium vinyl/magnetic material",
      "Weather and UV resistant",
      "Easy application",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    variants: {
      sticker: {
        product_id: "deport-elon-sticker",
        price: 12.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg7dHXKGu0DvSUUuTUPmxH",
      },
      magnet: {
        product_id: "deport-elon-magnet",
        price: 16.99,
        height: 6,
        width: 10,
        stripeId: "price_1RRg7CHXKGu0DvSUGROSqLjd",
      },
    },
  },
]

function groupProducts(products: any) {
  return products.map((product: any) => {
    return {
      ...product,
      variants: Object.entries(product.variants).map(([key, value]: any) => {
        return {
          ...value,
          name: key,
        }
      }),
    }
  })
}

export const GROUPED_PRODUCTS = groupProducts(RAW_PRODUCTS)
