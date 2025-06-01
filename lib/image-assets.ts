// Image assets from user-provided screenshots
export const IMAGES = {
  // Hero image - Red Tesla
  HERO_IMAGE:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-03%20at%2011.52.58%E2%80%AFPM-1v6cDUe2MaGMTdVGTTjG89FvRlx7r5.png",

  // Product images
  TESLA_ELON_MAGNET:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-03%20at%2011.53.53%E2%80%AFPM-tqtc5JOwMYQTHSwXduNICdAYsRFLfZ.png",
  NO_ELON_MAGNET:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-03%20at%2011.54.26%E2%80%AFPM-4ZaNY6wnZklOKh46Pb7NlHa2znipfV.png",

  // Article images
  ARTICLE_FRAUD:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-04%20at%2010.25.40%E2%80%AFAM-YsdBeK9IvGnMsflHfxQpkdNUwo14MU.png",
  ARTICLE_SUBSIDIES:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-04%20at%2010.25.57%E2%80%AFAM-hkE3Kq9zg7DJxRuJ67aCfeSOgHJiJ6.png",
  ARTICLE_COVID:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-04%20at%2010.26.13%E2%80%AFAM-f6iPDwvyJLg8rWjPlmNPb7xFxVErYa.png",

  // Emoji template
  EMOJI_TEMPLATE: "/images/emoji-musk-template.png",

  // Fallback images
  FALLBACK_IMAGE:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMyMjIyMjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjODg4ODg4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgUGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+",
  RED_FALLBACK_IMAGE:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNkYzI2MjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk11c2tNdXN0R288L3RleHQ+PC9zdmc+",
}

// Update the product data to use the Next.js placeholder SVG
export const PRODUCTS = [
  {
    id: "tesla-elon-magnet",
    name: "Tesla vs Elon Emoji Magnet",
    price: 20.0,
    image: "/images/emoji-musk.png",
    model: "All Models",
    dimensions: '6" x 10"',
    description:
      "Show your love for Tesla while making your feelings about its CEO clear with this humorous emoji magnet. Fully customizable with your choice of emojis.",
    features: [
      "Premium magnetic material",
      "Weather and UV resistant",
      "Easy application and removal",
      "Fits on any metal surface",
      '6" x 10" size',
      "Made in USA",
      "Customizable emojis",
    ],
    customizable: true,
    stripeId: null, // Not in Stripe yet
  },
  {
    id: "no-elon-magnet",
    name: "No Elon Bumper Magnet",
    price: 16.0,
    image: "/images/no-elon-musk.png",
    model: "All Models",
    dimensions: '6" x 6"',
    description:
      "Make a statement with this bold 'No Elon' bumper magnet. Perfect for Tesla owners who want to separate the car from its controversial CEO.",
    features: [
      "High-quality magnetic material",
      "Waterproof and UV resistant",
      "Strong magnetic hold",
      "Won't damage paint",
      '6" x 6" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRgGGHXKGu0DvSUDr9q1mNa", // Say No to Elon! - magnet
  },
]

// Stripe products from the provided JSON
export const STRIPE_PRODUCTS = [
  {
    id: "say-no-to-elon-sticker",
    name: "Say No to Elon! - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfUW4ydHdrdmlkVTFlTFpqc2JlbUZVUmc100RPNBx2an",
    model: "All Models",
    dimensions: '6" x 6"',
    description:
      'Show your dislike of Elon Musk with this image of his face covered by the international symbol for "NO"!',
    features: [
      "Premium vinyl material",
      "Weather and UV resistant",
      "Easy application",
      "Removable without residue",
      '6" x 6" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRgH0HXKGu0DvSUb9ggZcDF",
    productId: "prod_SMP5jwQujuz3Cl",
  },
  {
    id: "say-no-to-elon-magnet",
    name: "Say No to Elon! - Magnet",
    price: 16.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfalZ3QVN4eEsyQ1N6SktrWDNkRVdBcnBX00dwrqJs0b",
    model: "All Models",
    dimensions: '6" x 6"',
    description:
      'Show your dislike of Elon Musk with this image of his face covered by the international symbol for "NO"!',
    features: [
      "High-quality magnetic material",
      "Waterproof and UV resistant",
      "Strong magnetic hold",
      "Won't damage paint",
      '6" x 6" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRgGGHXKGu0DvSUDr9q1mNa",
    productId: "prod_SMP47IhOUcO1kn",
  },
  {
    id: "love-car-not-ceo-sticker",
    name: "Love the Car, NOT the CEO! - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfekJocENTY3dwVkJKMlhDUkNJUEMxV0xY00abXceio1",
    model: "All Models",
    dimensions: '6" x 10"',
    description:
      "Let the world know that you drive a Tesla because they are great cars, not because you are an Elon fanboi.",
    features: [
      "Premium vinyl material",
      "Weather and UV resistant",
      "Easy application",
      "Removable without residue",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRgEkHXKGu0DvSUaRbPVBds",
    productId: "prod_SMP21kBsg5qxRM",
  },
  {
    id: "love-car-not-ceo-magnet",
    name: "Love the Car, NOT the CEO! - Magnet",
    price: 16.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfMm9jVVVaaWRQRFhiY1Byd1FKSkV6Z01I00ZHeyzabV",
    model: "All Models",
    dimensions: '6" x 10"',
    description:
      "Let the world know that you drive a Tesla because they are great cars, not because you are an Elon fanboi.",
    features: [
      "High-quality magnetic material",
      "Waterproof and UV resistant",
      "Strong magnetic hold",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRgECHXKGu0DvSUe24j6AID",
    productId: "prod_SMP2rxDM8XwFoX",
  },
  {
    id: "love-teslas-hate-nazis-sticker",
    name: "Love Teslas, Hate Nazis - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfSjZVSU1UVm5ZY0RrcVV0MzhmR0xQSUlw00E0wZEUmz",
    model: "All Models",
    dimensions: '6" x 10"',
    description:
      'Tired of people calling Teslas "swasticars" because of Elon\'s Nazi salutes and statements? Make it clear that you want nothing to do with Nazis!',
    features: [
      "Premium vinyl material",
      "Weather and UV resistant",
      "Easy application",
      "Removable without residue",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRgBYHXKGu0DvSUDXpqZmob",
    productId: "prod_SMOzL5UlT5wbsO",
  },
  {
    id: "love-teslas-hate-nazis-magnet",
    name: "Love Teslas, Hate Nazis - Magnet",
    price: 16.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfcDJkZ1FsWHl6eGFZTXI2cmgyUUhCeWVP00lWHIuzqE",
    model: "All Models",
    dimensions: '6" x 10"',
    description:
      'Tired of people calling Teslas "swasticars" because of Elon\'s Nazi salutes and statements? Make it clear that you want nothing to do with Nazis!',
    features: [
      "High-quality magnetic material",
      "Waterproof and UV resistant",
      "Strong magnetic hold",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRgAoHXKGu0DvSU02nSht9K",
    productId: "prod_SMOymK1lY8V7nB",
  },
  {
    id: "deport-elon-sticker",
    name: "Deport Elon! - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfVDZObWREOUVnTmZ2cGRuZFlZdlQyVjJ400dJ6dnb4N",
    model: "All Models",
    dimensions: '6" x 10"',
    description: "Let's send this illegal immigrant back where he came from!",
    features: [
      "Premium vinyl material",
      "Weather and UV resistant",
      "Easy application",
      "Removable without residue",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRg7dHXKGu0DvSUUuTUPmxH",
    productId: "prod_SMOv2AdKsIZdCv",
  },
  {
    id: "deport-elon-magnet",
    name: "Deport Elon! - Magnet",
    price: 16.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfTHhWdlV3MU5hWGF2VXBHcksxTDkyeGk100OhPWMho3",
    model: "All Models",
    dimensions: '6" x 10"',
    description: "Let's send this illegal immigrant back where he came from!",
    features: [
      "High-quality magnetic material",
      "Waterproof and UV resistant",
      "Strong magnetic hold",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRg7CHXKGu0DvSUGROSqLjd",
    productId: "prod_SMOvz7QTtXbzeO",
  },
  {
    id: "elon-did-not-invent-sticker",
    name: "Elon Did Not Invent This Car - Bumper Sticker",
    price: 12.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfSWZJUWl2WlBlejFtYjBZbHFUODV5NWJN00HM6zzngu",
    model: "All Models",
    dimensions: '6" x 10"',
    description:
      "Elon Musk had nothing to do with the creation of Tesla technology. This is a great way to let the world know that your love of Teslas has nothing to do with Elon Musk.",
    features: [
      "Premium vinyl material",
      "Weather and UV resistant",
      "Easy application",
      "Removable without residue",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRg61HXKGu0DvSUcKARoUTL",
    productId: "prod_SMOtyyjmBf1DjJ",
  },
  {
    id: "elon-did-not-invent-magnet",
    name: "Elon Did Not Invent This Car - Magnet",
    price: 16.99,
    image:
      "https://files.stripe.com/links/MDB8YWNjdF8xUkpLQTZIWEtHdTBEdlNVfGZsX3Rlc3RfV2JzYk5qcHgxSVNqTUxXUXRaVGRyYWFK00EyDQn0nX",
    model: "All Models",
    dimensions: '6" x 10"',
    description:
      "Elon Musk had nothing to do with the creation of Tesla technology. This is a great way to let the world know that your love of Teslas has nothing to do with Elon Musk.",
    features: [
      "High-quality magnetic material",
      "Waterproof and UV resistant",
      "Strong magnetic hold",
      "Won't damage paint",
      '6" x 10" size',
      "Made in USA",
    ],
    customizable: false,
    stripeId: "price_1RRg5NHXKGu0DvSUQHxTKKeJ",
    productId: "prod_SMOtIBBTRR6MWe",
  },
]

// Filter products by type
export const MAGNET_PRODUCTS = STRIPE_PRODUCTS.filter((product) => product.name.includes("Magnet"))
export const STICKER_PRODUCTS = STRIPE_PRODUCTS.filter((product) => product.name.includes("Sticker"))

// Articles data
export const ARTICLES = [
  {
    id: 1,
    title: "Musk charged with securities fraud",
    image: IMAGES.ARTICLE_FRAUD,
    excerpt: "SEC charges Elon Musk with securities fraud for misleading tweets about taking Tesla private.",
    url: "/articles/musk-securities-fraud",
  },
  {
    id: 2,
    title: "Musk rants against government subsidies - except when he benefits",
    image: IMAGES.ARTICLE_SUBSIDIES,
    excerpt:
      "Elon Musk publicly criticizes government subsidies while his companies have received billions in government support.",
    url: "/articles/musk-subsidies-hypocrisy",
  },
  {
    id: 3,
    title: "Speaking about coronavirus concerns in 2020",
    image: IMAGES.ARTICLE_COVID,
    excerpt: "Elon Musk downplayed the COVID-19 pandemic, tweeting 'The coronavirus panic is dumb' in March 2020.",
    url: "/articles/musk-covid-comments",
  },
]
