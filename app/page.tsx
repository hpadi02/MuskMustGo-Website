import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import FeaturedCategories from "@/components/featured-categories"
import FeaturedStories from "@/components/featured-stories"
import MuskArticles from "@/components/musk-articles"
import TeslaFact from "@/components/tesla-fact"
import FallbackImage from "@/components/fallback-image"
import { IMAGES } from "@/lib/image-assets"

export default function Home() {
  return (
    <div className="bg-dark-400 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <FallbackImage
            src={IMAGES.HERO_IMAGE}
            alt="Red Tesla sports car"
            fill
            className="brightness-[0.4]"
            useRedFallback={true}
          />
        </div>
        <div className="container mx-auto px-6 md:px-10 z-10 pt-20">
          <div className="max-w-4xl">
            {/* Small label at top */}
            <p className="text-white text-sm font-medium tracking-widest uppercase mb-6">TESLA OWNERS</p>

            {/* Main headline with the requested styling */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-white">We love our Teslas,</span>{" "}
              <span className="text-red-500">but despise Elon Musk</span>
            </h1>

            {/* Description text */}
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl">
              Express your independence with premium merchandise that separates your love for Tesla vehicles from their
              controversial CEO.
            </p>

            {/* CTA Button */}
            <Link href="/shop/all">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-medium">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-16 md:py-20 bg-dark-300">
        <div className="container mx-auto px-6 md:px-10">
          <FeaturedProducts />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 md:py-20 bg-dark-400">
        <div className="container mx-auto px-6 md:px-10">
          <FeaturedCategories />
        </div>
      </section>

      {/* Musk Articles Section */}
      <section className="py-16 md:py-20 bg-black">
        <div className="container mx-auto px-6 md:px-10">
          <MuskArticles />
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-20 bg-dark-300">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square">
              <FallbackImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.39.25%E2%80%AFPM-Q3rMnp0TCr0L2buB0vZhq40A6FY3bx.png"
                alt="Red Tesla headlight close-up"
                fill
                className="object-cover"
                useRedFallback={true}
              />
            </div>
            <div className="max-w-xl">
              <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">OUR MISSION</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Why We Exist</h2>
              <p className="text-xl text-white/70 mb-4 leading-relaxed">
                We're Tesla owners just like you. We love our cars for their innovation, performance, and
                sustainability.
              </p>
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                But we believe in separating the product from its CEO. Our merchandise helps you express that
                distinction without compromising your commitment to electric mobility.
              </p>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-sm tracking-wide group"
                >
                  LEARN MORE <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 md:py-20 bg-dark-400">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">COMMUNITY</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Tesla Owner Stories</h2>
          </div>

          <FeaturedStories />

          <div className="text-center mt-12">
            <Link href="/stories">
              <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 text-sm tracking-wide">
                READ ALL STORIES
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tesla Fact Section */}
      <section className="py-16 md:py-20 bg-dark-300">
        <div className="container mx-auto px-6 md:px-10">
          <TeslaFact />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20 bg-black">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">NEWSLETTER</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Stay Updated</h2>
          </div>

          <div className="max-w-lg mx-auto">
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 focus:outline-none focus:ring-1 focus:ring-white/30"
              />
              <Button type="submit" className="bg-white text-black hover:bg-white/90 px-8 py-4 text-sm tracking-wide">
                SUBSCRIBE
              </Button>
            </form>
            <p className="text-white/60 text-sm mt-4 text-center">
              Subscribe to our newsletter for the latest products, Tesla owner stories, and community updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
