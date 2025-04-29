"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import FallbackImage from "./fallback-image"

const articles = [
  {
    id: 1,
    title: "Why I Still Love My Tesla, But Not Its CEO",
    excerpt: "A personal story from a Model 3 owner on separating the product from the personality behind it.",
    date: "Apr 1, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.42.20%E2%80%AFPM-vcV6wDN72IFHMFtRqKhTLdGYPYhBBN.png", // Tesla storefront with American flag
    category: "OWNER STORY",
  },
  {
    id: 2,
    title: "The Tesla Community Beyond Twitter: Finding Your People",
    excerpt: "There's a thriving community of Tesla owners who share your values. Here's how to connect with them.",
    date: "Mar 28, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.09%E2%80%AFPM-WHBxB6ohNVsF8af7JqJzZk1xPBnnZF.png", // Smartphone with Tesla app
    category: "COMMUNITY",
  },
  {
    id: 3,
    title: "Supercharging Etiquette: The Unwritten Rules Every Tesla Owner Should Know",
    excerpt: "From charging speeds to queue management, here's how to be a good citizen at the Supercharger.",
    date: "Mar 22, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.27%E2%80%AFPM-oshZaVC65xUKomTnPGTmvWirVumvzJ.png", // Tesla charging at station
    category: "TIPS & TRICKS",
  },
]

export default function FeaturedStories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.map((article) => (
        <Link href={`/stories/${article.id}`} key={article.id} className="group">
          <div className="image-grid-item">
            <div className="relative aspect-[4/3] mb-6">
              <FallbackImage
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                useRedFallback={false}
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-medium text-black">
                {article.category}
              </div>
            </div>
            <p className="text-white/60 text-sm mb-3">{article.date}</p>
            <h3 className="text-xl font-medium mb-4 group-hover:text-red-500 transition-colors">{article.title}</h3>
            <p className="text-white/70 mb-5">{article.excerpt}</p>
            <div className="flex items-center text-red-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
              READ MORE <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
