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
  },
]

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
