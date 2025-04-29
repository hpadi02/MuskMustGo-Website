"use client"

import { motion } from "framer-motion"

export default function HeroStatement() {
  return (
    <motion.div
      className="mb-16 md:mb-20 max-w-4xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="inline-block bg-black/30 backdrop-blur-sm px-8 py-6 rounded-2xl">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight drop-shadow-lg">
          <span className="text-white">We love our Teslas,</span>
          <br className="hidden md:block" />
          <span className="text-red-500">but despise Elon Musk</span>
        </h2>
      </div>
    </motion.div>
  )
}
