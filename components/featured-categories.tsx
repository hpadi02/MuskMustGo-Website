"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import FallbackImage from "./fallback-image"

const categories = [
  {
    id: "magnets",
    name: "MAGNETS",
    description: "Express your independence with our premium magnets",
    url: "/shop/magnets",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.34.02%E2%80%AFPM-2DljODifDHWm6ppwyCnYufZO3KXCsn.png", // Tesla steering wheel
  },
  {
    id: "owner-stories",
    name: "OWNER STORY",
    description: "Personal experiences from Tesla owners who share your values",
    url: "/stories/owner",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.35.07%E2%80%AFPM-jvM8QTwm3IzH05C8zQl7G5Xi135RRU.png", // Tesla storefront with cars
  },
  {
    id: "community",
    name: "COMMUNITY",
    description: "Connect with like-minded Tesla owners and enthusiasts",
    url: "/community",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.35.56%E2%80%AFPM-rO9AOtfhNaRjfRZ6KAu8VM4LXkhHvN.png", // Tesla pop-up store with red Model S
  },
  {
    id: "news",
    name: "TESLA NEWS",
    description: "Stay updated on Tesla developments without the CEO drama",
    url: "/news",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.36.33%E2%80%AFPM-Ycu8SYXEwaq6lDakyOot7CPtioV45J.png", // Tesla dealership at night with orange lighting
  },
]

export default function FeaturedCategories() {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">EXPLORE</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold">Join Our Community</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="relative aspect-square overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <FallbackImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
            <Link
              href={category.url}
              className="absolute inset-0 block h-full w-full p-6 flex flex-col justify-center items-center text-center z-10"
            >
              <div className="bg-white text-black px-3 py-1 text-xs font-bold mb-auto">{category.name}</div>

              <div className="mt-auto">
                <h3 className="text-white text-xl font-medium mb-2">MuskMustGo</h3>
                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
