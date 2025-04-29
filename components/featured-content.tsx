"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const articles = [
  {
    id: 1,
    title: "Why I Still Love My Tesla, But Not Its CEO",
    excerpt: "A personal story from a Model 3 owner on separating the product from the personality behind it.",
    date: "Apr 1, 2025",
    image: "/images/article1.png",
    category: "Owner Story",
  },
  {
    id: 2,
    title: "The Tesla Community Beyond Twitter: Finding Your People",
    excerpt: "There's a thriving community of Tesla owners who share your values. Here's how to connect with them.",
    date: "Mar 28, 2025",
    image: "/images/article2.png",
    category: "Community",
  },
  {
    id: 3,
    title: "Supercharging Etiquette: The Unwritten Rules Every Tesla Owner Should Know",
    excerpt: "From charging speeds to queue management, here's how to be a good citizen at the Supercharger.",
    date: "Mar 22, 2025",
    image: "/images/article3.png",
    category: "Tips & Tricks",
  },
]

export default function FeaturedContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Link href={`/stories/${article.id}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-6">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 text-sm font-medium">{article.category}</div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{article.date}</p>
            <h3 className="text-xl font-medium mb-3 group-hover:text-red-600 transition-colors">{article.title}</h3>
            <p className="text-gray-600 mb-4">{article.excerpt}</p>
            <div className="flex items-center text-red-600 font-medium group-hover:translate-x-1 transition-transform">
              Read More <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
