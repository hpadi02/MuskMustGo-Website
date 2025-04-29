import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import FallbackImage from "@/components/fallback-image"
import { ARTICLES } from "@/lib/image-assets"

// This would normally come from a database or API
const getArticleById = (id: string) => {
  const article = ARTICLES.find((a) => a.id === Number.parseInt(id))

  if (!article) {
    return {
      id: 1,
      title: "Article not found",
      image: "/placeholder.svg",
      excerpt: "This article could not be found.",
      content: "<p>The requested article could not be found.</p>",
      date: "Unknown",
      author: "Unknown",
      url: "/articles",
    }
  }

  // Add full content to the article
  return {
    ...article,
    author: "MuskMustGo Editorial Team",
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <h2>The Controversy</h2>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <h2>What Tesla Owners Think</h2>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <h2>Moving Forward</h2>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
    `,
  }
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = getArticleById(params.id)

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/articles" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to articles
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center text-white/60 gap-4 mb-8">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>5 min read</span>
              </div>
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
