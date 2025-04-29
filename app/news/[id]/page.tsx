import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

// Sample news articles data
const newsArticles = [
  {
    id: 1,
    title: "Tesla Announces New Battery Technology",
    content: `
      <p>Tesla has unveiled its next-generation battery cells, promising significant improvements in energy density, charging speed, and production costs. The new cells, developed at Tesla's battery research facility, represent a major step forward in the company's mission to accelerate the world's transition to sustainable energy.</p>
      
      <p>According to Tesla's engineering team, the new cells feature a novel electrode design that allows for faster ion movement and better thermal management. This translates to batteries that can charge more quickly and deliver more power when needed, all while maintaining a longer overall lifespan.</p>
      
      <p>"This is the result of years of research and development," said a senior battery engineer at Tesla. "We've been working to optimize every aspect of the cell, from materials to manufacturing processes."</p>
      
      <h2>Production Scaling</h2>
      
      <p>Perhaps most importantly, Tesla claims the new cells will be significantly cheaper to produce at scale. The company has developed new manufacturing techniques that reduce waste and energy consumption during production.</p>
      
      <p>The first vehicles equipped with the new battery technology are expected to enter production in early 2026, with retrofitting options potentially becoming available for existing models later that year.</p>
      
      <h2>Environmental Impact</h2>
      
      <p>Beyond performance improvements, the new batteries also feature a reduced cobalt content, addressing concerns about the environmental and ethical implications of cobalt mining. Tesla has been working to reduce or eliminate cobalt from its batteries for several years.</p>
      
      <p>The company also announced that the new cells are designed with recycling in mind, making it easier to recover valuable materials at the end of the battery's life cycle.</p>
      
      <p>This announcement comes as Tesla continues to expand its energy storage business alongside its electric vehicle production, with the new cell technology expected to benefit both sectors.</p>
    `,
    date: "April 3, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.36.33%E2%80%AFPM-Ycu8SYXEwaq6lDakyOot7CPtioV45J.png",
    category: "TECHNOLOGY",
  },
  {
    id: 2,
    title: "Tesla Engineers Recognized for Innovation",
    content: `
      <p>A team of Tesla engineers has received the prestigious Automotive Innovation Award for their groundbreaking work on electric vehicle technology. The award, presented annually to the most significant technological advancement in the automotive industry, recognizes the team's development of a new motor design that improves efficiency while reducing manufacturing complexity.</p>
      
      <p>The winning team, led by senior engineer Dr. Maya Rodriguez, developed a novel permanent magnet motor architecture that delivers more torque while using less rare earth materials than conventional designs. The innovation is expected to appear in Tesla vehicles starting next year.</p>
      
      <p>"This recognition belongs to the entire team," said Dr. Rodriguez. "We've been pushing the boundaries of what's possible in electric motor design, and it's gratifying to see that work acknowledged by our peers in the industry."</p>
      
      <h2>Industry Impact</h2>
      
      <p>The award committee specifically cited the potential industry-wide impact of the technology, noting that advancements in motor efficiency have implications beyond Tesla's own vehicles. As the automotive industry continues its shift toward electrification, innovations that improve efficiency and reduce dependency on limited resources become increasingly valuable.</p>
      
      <p>"The work being done by Tesla's engineering teams continues to raise the bar for the entire industry," said the award committee chair. "This motor design represents exactly the kind of thinking we need to accelerate the transition to sustainable transportation."</p>
      
      <h2>Continued Innovation</h2>
      
      <p>This marks the third time in five years that Tesla engineers have received the award, highlighting the company's ongoing commitment to technological innovation. Previous wins came for advancements in battery management systems and manufacturing automation.</p>
      
      <p>The recognition comes at a time when Tesla is expanding its engineering teams across multiple locations, with a particular focus on motor technology, battery chemistry, and manufacturing processes.</p>
    `,
    date: "March 27, 2025",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.34.02%E2%80%AFPM-2DljODifDHWm6ppwyCnYufZO3KXCsn.png",
    category: "AWARDS",
  },
  // Add more articles as needed with similar structure
]

// Get article by ID
const getArticleById = (id: string) => {
  const articleId = Number.parseInt(id)
  const article = newsArticles.find((a) => a.id === articleId)

  if (!article) {
    // Return a default "not found" article if the ID doesn't match
    return {
      id: 0,
      title: "Article not found",
      content: "<p>We couldn't find the article you're looking for. Please check the URL and try again.</p>",
      date: "Unknown",
      image: "/placeholder.svg",
      category: "NOT FOUND",
    }
  }

  return article
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = getArticleById(params.id)

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/news" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to news
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-red-600 text-white px-3 py-1 text-sm font-medium mb-6">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
              {article.title}
            </h1>

            <div className="flex items-center text-white/60 mb-8">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{article.date}</span>
            </div>
          </div>

          <div className="relative aspect-[16/9] mb-10">
            <FallbackImage src={article.image} alt={article.title} fill useRedFallback={true} />
          </div>

          <div
            className="prose prose-lg prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="border-t border-gray-800 pt-8 mt-12">
            <h3 className="text-xl font-medium mb-4">Share this article</h3>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
