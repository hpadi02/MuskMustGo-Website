import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MuskArticles from "@/components/musk-articles"

export default function ArticlesPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">ARTICLES</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Articles you MUSK read</h1>
            <p className="text-xl text-white/70">
              Stay informed with our collection of articles about Tesla and its controversial CEO.
            </p>
          </div>

          <MuskArticles />
        </div>
      </div>
    </div>
  )
}
