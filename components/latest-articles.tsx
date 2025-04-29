import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const articles = [
  {
    id: 1,
    title: "Why I Still Love My Tesla, But Not Its CEO",
    excerpt: "A personal story from a Model 3 owner on separating the product from the personality behind it...",
    date: "Apr 1, 2025",
    readTime: "5 min read",
    image: "/placeholder.svg?height=300&width=500",
    category: "Owner Story",
  },
  {
    id: 2,
    title: "The Tesla Community Beyond Twitter: Finding Your People",
    excerpt: "There's a thriving community of Tesla owners who share your values. Here's how to connect with them...",
    date: "Mar 28, 2025",
    readTime: "8 min read",
    image: "/placeholder.svg?height=300&width=500",
    category: "Community",
  },
  {
    id: 3,
    title: "Supercharging Etiquette: The Unwritten Rules Every Tesla Owner Should Know",
    excerpt: "From charging speeds to queue management, here's how to be a good citizen at the Supercharger...",
    date: "Mar 22, 2025",
    readTime: "6 min read",
    image: "/placeholder.svg?height=300&width=500",
    category: "Tips & Tricks",
  },
]

export default function LatestArticles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-video">
            <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-600">{article.category}</Badge>
            </div>
          </div>
          <CardHeader className="p-4">
            <h3 className="text-xl font-bold line-clamp-2 hover:text-red-600 transition-colors">
              <Link href={`/articles/${article.id}`}>{article.title}</Link>
            </h3>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span className="mr-4">{article.date}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{article.readTime}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link
              href={`/articles/${article.id}`}
              className="text-red-600 hover:text-red-700 font-medium flex items-center"
            >
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
