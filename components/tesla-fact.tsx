"use client"

import { motion } from "framer-motion"

export default function TeslaFact() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">TESLA HISTORY</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold">The Real Founders</h2>
      </div>

      <motion.div
        className="text-center px-6 py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90 mb-8">
          Before getting fired in 2007 from his own company, Martin Eberhard Founded Tesla Motors in 2003 with Mark
          Tarpenning in case you thought it was someone else.
        </p>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-red-500">
          MUSK MUST GO
        </h2>
      </motion.div>
    </div>
  )
}
