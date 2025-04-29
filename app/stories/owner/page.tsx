import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

const ownerStories = [
  {
    id: 1,
    title: "Why I Still Love My Tesla, But Not Its CEO",
    excerpt: "A personal story from a Model 3 owner on separating the product from the personality behind it.",
    date: "Apr 1, 2025",
    author: "Alex Johnson",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.42.20%E2%80%AFPM-vcV6wDN72IFHMFtRqKhTLdGYPYhBBN.png",
    category: "Model 3",
  },
  {
    id: 4,
    title: "From Fanboy to Critical Thinker: My Tesla Journey",
    excerpt: "How I learned to appreciate my car while questioning the company's direction.",
    date: "Mar 15, 2025",
    author: "Michael Chen",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.35.07%E2%80%AFPM-jvM8QTwm3IzH05C8zQl7G5Xi135RRU.png",
    category: "Model Y",
  },
  {
    id: 5,
    title: "Teaching My Kids About Ethical Consumption Through My Tesla",
    excerpt: "Using my car as a lesson in how we can love products while being critical of companies.",
    date: "Feb 28, 2025",
    author: "Sarah Williams",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.36.33%E2%80%AFPM-Ycu8SYXEwaq6lDakyOot7CPtioV45J.png",
    category: "Model X",
  },
  {
    id: 6,
    title: "My Tesla Road Trip: Conversations at Superchargers",
    excerpt: "What I learned talking to other owners about their complex feelings toward the brand.",
    date: "Feb 10, 2025",
    author: "David Rodriguez",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.27%E2%80%AFPM-oshZaVC65xUKomTnPGTmvWirVumvzJ.png",
    category: "Model S",
  },
]

export default function OwnerStoriesPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">COMMUNITY</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Owner Stories</h1>
            <p className="text-xl text-white/70 mb-8">
              Personal experiences from Tesla owners who love their cars but have concerns about the company's CEO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {ownerStories.map((story) => (
              <Link href={`/stories/${story.id}`} key={story.id} className="group">
                <div className="bg-dark-300 overflow-hidden h-full flex flex-col transition-transform duration-300 hover:translate-y-[-8px]">
                  <div className="relative aspect-[16/9]">
                    <FallbackImage
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-medium text-black">
                      {story.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-white/60 text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="mr-4">{story.date}</span>
                      <User className="h-4 w-4 mr-2" />
                      <span>{story.author}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-3 group-hover:text-red-500 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-white/70 mb-4">{story.excerpt}</p>
                    <div className="mt-auto pt-4">
                      <span className="text-red-500 font-medium group-hover:underline">Read more</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/70 mb-6">Have a story to share? We'd love to hear from you.</p>
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Submit Your Story</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
