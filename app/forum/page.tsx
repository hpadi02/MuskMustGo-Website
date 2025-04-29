import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, Clock } from "lucide-react"

const forumTopics = [
  {
    id: 1,
    title: "How to deal with Tesla service center staff who worship Elon",
    author: "model3owner",
    replies: 24,
    views: 342,
    lastActivity: "2 hours ago",
    category: "Service & Support",
  },
  {
    id: 2,
    title: "Alternatives to the official Tesla app?",
    author: "independentdriver",
    replies: 18,
    views: 276,
    lastActivity: "5 hours ago",
    category: "Apps & Software",
  },
  {
    id: 3,
    title: "Removing the Tesla logo from your car - experiences?",
    author: "rebadged_Y",
    replies: 37,
    views: 512,
    lastActivity: "1 day ago",
    category: "Modifications",
  },
  {
    id: 4,
    title: "Community meetup in Seattle - No Elon talk allowed!",
    author: "seattleEV",
    replies: 15,
    views: 189,
    lastActivity: "2 days ago",
    category: "Events",
  },
  {
    id: 5,
    title: "Best bumper stickers that make your position clear",
    author: "stickerfan",
    replies: 42,
    views: 631,
    lastActivity: "3 days ago",
    category: "Merchandise",
  },
]

export default function ForumPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">COMMUNITY</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Forum</h1>
            <p className="text-xl text-white/70 mb-8">
              Connect with like-minded Tesla owners and discuss your experiences.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Start New Topic</Button>
          </div>

          <div className="bg-dark-300 rounded-lg overflow-hidden mb-8">
            <div className="grid grid-cols-12 bg-dark-200 p-4 text-white/60 text-sm font-medium">
              <div className="col-span-6 md:col-span-7">Topic</div>
              <div className="col-span-3 md:col-span-2 text-center">Replies</div>
              <div className="col-span-3 text-right">Last Activity</div>
            </div>

            {forumTopics.map((topic) => (
              <div
                key={topic.id}
                className="grid grid-cols-12 p-4 border-b border-dark-200 hover:bg-dark-200/50 transition-colors"
              >
                <div className="col-span-6 md:col-span-7">
                  <Link href={`/forum/${topic.id}`} className="font-medium hover:text-red-500 transition-colors">
                    {topic.title}
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <span className="text-white/40">by {topic.author}</span>
                    <span className="text-red-500/80 text-xs px-2 py-0.5 bg-red-500/10 rounded">{topic.category}</span>
                  </div>
                </div>
                <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                  <div className="flex items-center text-white/60">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>{topic.replies}</span>
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end text-white/60 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{topic.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Previous
            </Button>
            <div className="text-white/60">Page 1 of 12</div>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
