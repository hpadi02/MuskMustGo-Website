export const STRIPE_PRODUCTS = {
  "deport-elon-sticker": {
    id: "prod_N0bILLG1m4m0gS",
    name: "Deport Elon! Sticker",
    description: "Premium vinyl sticker",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfVDZObWREOUVnTmZ2cGRuZFlZdlQyVjJ400dJ6dnb4N",
    ],
  },
  "deport-elon-magnet": {
    id: "prod_N0bIe9HkOnwP0j",
    name: "Deport Elon! Magnet",
    description: "Premium vinyl magnet",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfVDZObWREOUVnTmZ2cGRuZFlZdlQyVjJ400dJ6dnb4N",
    ],
  },
  "eat-the-rich-sticker": {
    id: "prod_N0bHhK1XBLpkjS",
    name: "Eat The Rich Sticker",
    description: "Premium vinyl sticker",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfV09lV014b016aWd2a2F6V2x0a2F6a05600x0a6mJ7I",
    ],
  },
  "eat-the-rich-magnet": {
    id: "prod_N0bH1G1wDi9wKz",
    name: "Eat The Rich Magnet",
    description: "Premium vinyl magnet",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfV09lV014b016aWd2a2F6V2x0a2F6a05600x0a6mJ7I",
    ],
  },
  "abolish-ice-sticker": {
    id: "prod_N0bGkI24DDXv6z",
    name: "Abolish ICE Sticker",
    description: "Premium vinyl sticker",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfS2l6b014a0J6aWd2a2F6V2x0a2F6a05600j1a00x0I",
    ],
  },
  "abolish-ice-magnet": {
    id: "prod_N0bGlG1q0x99a7",
    name: "Abolish ICE Magnet",
    description: "Premium vinyl magnet",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfS2l6b014a0J6aWd2a2F6V2x0a2F6a05600j1a00x0I",
    ],
  },
  "legalize-housing-sticker": {
    id: "prod_N0bFw8nL9XN2mP",
    name: "Legalize Housing Sticker",
    description: "Premium vinyl sticker",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfT0R6b014a0J6aWd2a2F6V2x0a2F6a05600j1a00x0I",
    ],
  },
  "legalize-housing-magnet": {
    id: "prod_N0bFh0mPezYF8g",
    name: "Legalize Housing Magnet",
    description: "Premium vinyl magnet",
    images: [
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfT0R6b014a0J6aWd2a2F6V2x0a2F6a05600j1a00x0I",
    ],
  },
}

export const GROUPED_PRODUCTS = [
  {
    baseId: "eat-the-rich",
    baseName: "Eat The Rich!",
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfV09lV014b016aWd2a2F6V2x0a2F6a05600x0a6mJ7I",
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
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfS2l6b014a0J6aWd2a2F6V2x0a2F6a05600j1a00x0I",
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
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfT0R6b014a0J6aWd2a2F6V2x0a2F6a05600j1a00x0I",
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
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfVDZObWREOUVnTmZ2cGRuZFlZdlQyVjJ400dJ6dnb4N",
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
