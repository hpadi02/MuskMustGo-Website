"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would normally send the email to your API
      setSubmitted(true)
      setEmail("")
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      <span className="text-red-500 font-medium tracking-wider uppercase mb-4 block">Newsletter</span>
      <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">Join Our Community</h2>
      <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
        Subscribe to our newsletter for the latest products, Tesla owner stories, and community updates.
      </p>

      {submitted ? (
        <div className="flex items-center justify-center space-x-3 text-xl">
          <CheckCircle className="h-6 w-6" />
          <span>Thanks for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-16 text-lg rounded-full px-6"
          />
          <Button type="submit" className="bg-red-500 text-white hover:bg-red-600 h-16 text-lg px-10 rounded-full">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  )
}
