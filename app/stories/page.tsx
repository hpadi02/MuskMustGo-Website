import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import FeaturedStories from "@/components/featured-stories"

export default function StoriesPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">COMMUNITY</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Tesla Owner Stories</h1>
          <p className="text-xl text-white/70">
            Read experiences from Tesla owners who share your values and love their cars but not the CEO.
          </p>
        </div>

        <FeaturedStories />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/stories/owner" className="bg-dark-300 p-6 hover:bg-dark-200 transition-colors">
            <h3 className="text-xl font-medium mb-3">Owner Stories</h3>
            <p className="text-white/70">Personal experiences from Tesla owners who share your values</p>
          </Link>

          <Link href="/stories/community" className="bg-dark-300 p-6 hover:bg-dark-200 transition-colors">
            <h3 className="text-xl font-medium mb-3">Community Stories</h3>
            <p className="text-white/70">Stories from the broader Tesla community</p>
          </Link>

          <Link href="/stories/tips" className="bg-dark-300 p-6 hover:bg-dark-200 transition-colors">
            <h3 className="text-xl font-medium mb-3">Tips & Tricks</h3>
            <p className="text-white/70">Helpful advice for getting the most from your Tesla</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
