import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

const newsArticles = [
  {
    id: 1,
    title: "Tesla Announces New Battery Technology",
    excerpt:
      "The company reveals next-generation battery cells with improved energy density and lower production costs.",
    date: "April 3, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.36.33%E2%80%AFPM-Ycu8SYXEwaq6lDakyOot7CPtioV45J.png",
    category: "TECHNOLOGY",
  },
  {
    id: 2,
    title: "Tesla Engineers Recognized for Innovation",
    excerpt: "A team of Tesla engineers receives industry award for advancements in electric vehicle technology.",
    date: "March 27, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.34.02%E2%80%AFPM-2DljODifDHWm6ppwyCnYufZO3KXCsn.png",
    category: "AWARDS",
  },
  {
    id: 3,
    title: "Tesla Opens New Factory in Europe",
    excerpt: "The company expands its manufacturing capacity with a new state-of-the-art facility.",
    date: "March 15, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.35.07%E2%80%AFPM-jvM8QTwm3IzH05C8zQl7G5Xi135RRU.png",
    category: "EXPANSION",
  },
  {
    id: 4,
    title: "Tesla Releases Major Software Update",
    excerpt: "The latest update brings new features and improvements to the Tesla user experience.",
    date: "March 5, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.09%E2%80%AFPM-WHBxB6ohNVsF8af7JqJzZk1xPBnnZF.png",
    category: "SOFTWARE",
  },
  {
    id: 5,
    title: "Tesla's Environmental Impact Report Released",
    excerpt: "New data shows the positive environmental impact of Tesla's growing electric vehicle fleet.",
    date: "February 28, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.27%E2%80%AFPM-oshZaVC65xUKomTnPGTmvWirVumvzJ.png",
    category: "SUSTAINABILITY",
  },
  {
    id: 6,
    title: "Tesla Service Centers Expand Capacity",
    excerpt: "The company announces plans to increase service center capacity by 40% over the next year.",
    date: "February 15, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.42.20%E2%80%AFPM-vcV6wDN72IFHMFtRqKhTLdGYPYhBBN.png",
    category: "SERVICE",
  },
]

export default function NewsPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">STAY INFORMED</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Tesla News</h1>
            <p className="text-xl text-white/70 mb-8">Stay updated on Tesla developments without the CEO drama.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {newsArticles.map((article) => (
              <Link href={`/news/${article.id}`} key={article.id} className="group">
                <div className="bg-dark-300 overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[16/9]">
                    <FallbackImage
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-medium text-black">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-white/60 text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{article.date}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-3 group-hover:text-red-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-white/70 mb-4">{article.excerpt}</p>
                    <div className="mt-auto pt-4 flex items-center text-red-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      READ MORE <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Previous
            </Button>
            <div className="text-white/60">Page 1 of 5</div>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
