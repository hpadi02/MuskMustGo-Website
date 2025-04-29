"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import FallbackImage from "./fallback-image"
import { ARTICLES } from "@/lib/image-assets"

export default function MuskArticles() {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null)

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">MUST READ</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold">
          Articles you <span className="text-red-500">MUSK</span> read
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTICLES.map((article, index) => (
          <motion.div
            key={article.id}
            className="group bg-dark-300 overflow-hidden flex flex-col h-full cursor-pointer border border-gray-800 hover:border-gray-600 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredArticle(article.id)}
            onMouseLeave={() => setHoveredArticle(null)}
          >
            <Link href={article.url} className="flex flex-col h-full">
              <div className="relative aspect-video overflow-hidden">
                <FallbackImage
                  src={article.image}
                  alt={article.title}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    hoveredArticle === article.id ? "scale-105" : "scale-100"
                  }`}
                />
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-medium mb-2 group-hover:text-red-500 transition-colors duration-300">
                  {article.title}
                </h3>

                <div className="mt-auto pt-3">
                  <span className="inline-flex items-center text-white/70 group-hover:text-red-500 transition-colors duration-300 font-medium text-sm">
                    Read More{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/articles">
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/10 text-white hover:text-red-500 transition-colors duration-300 px-8 py-2"
          >
            VIEW MORE
          </Button>
        </Link>
      </div>
    </div>
  )
}
