import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, MessageSquare, Calendar } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

const communityGroups = [
  {
    id: 1,
    title: "Independent Tesla Owners Club",
    description:
      "A nationwide community of Tesla owners who appreciate their cars but maintain critical perspectives on the company's leadership.",
    members: 2547,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.35.56%E2%80%AFPM-rO9AOtfhNaRjfRZ6KAu8VM4LXkhHvN.png",
  },
  {
    id: 2,
    title: "Tesla Owners Without Twitter",
    description:
      "For Tesla owners who want to discuss their cars without the social media drama that often surrounds the brand.",
    members: 1823,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.09%E2%80%AFPM-WHBxB6ohNVsF8af7JqJzZk1xPBnnZF.png",
  },
]

const upcomingDiscussions = [
  {
    id: 1,
    title: "Navigating Conversations with Tesla Superfans",
    date: "April 15, 2025",
    time: "7:00 PM EST",
    participants: 42,
    description:
      "Strategies for having productive conversations with Tesla enthusiasts who may not share your perspective on the company's leadership.",
  },
  {
    id: 2,
    title: "Modifications That Express Your Independence",
    date: "April 22, 2025",
    time: "8:00 PM EST",
    participants: 56,
    description:
      "Share and discuss tasteful modifications that allow you to express your independence while maintaining your Tesla's aesthetic.",
  },
  {
    id: 3,
    title: "Building Local Communities of Like-Minded Owners",
    date: "May 5, 2025",
    time: "7:30 PM EST",
    participants: 38,
    description:
      "Tips and strategies for finding and connecting with other Tesla owners in your area who share your values.",
  },
]

export default function CommunityPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">CONNECT</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Join Our Community</h1>
            <p className="text-xl text-white/70 mb-8">
              Connect with like-minded Tesla owners who love their cars but have concerns about the company's CEO.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Community Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {communityGroups.map((group) => (
              <div key={group.id} className="bg-dark-300 overflow-hidden">
                <div className="relative aspect-video">
                  <FallbackImage src={group.image} alt={group.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3">{group.title}</h3>
                  <p className="text-white/70 mb-4">{group.description}</p>
                  <div className="flex items-center text-white/60 mb-6">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{group.members} members</span>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white w-full">Join Group</Button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Upcoming Forum Discussions</h2>
          <div className="bg-dark-300 mb-12">
            {upcomingDiscussions.map((discussion, index) => (
              <div
                key={discussion.id}
                className={`p-6 ${index !== upcomingDiscussions.length - 1 ? "border-b border-dark-200" : ""}`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-medium">{discussion.title}</h3>
                  <div className="flex items-center text-white/60 mt-2 md:mt-0">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {discussion.date} • {discussion.time}
                    </span>
                  </div>
                </div>
                <p className="text-white/70 mb-4">{discussion.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/60">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{discussion.participants} participating</span>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <MessageSquare className="h-4 w-4 mr-2" /> Join Discussion
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/70 mb-6">Want to start your own discussion or group? We'd love to help.</p>
            <Link href="/forum">
              <Button className="bg-white text-black hover:bg-white/90 mr-4">Visit Forum</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
