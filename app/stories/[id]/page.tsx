import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

// Define the stories with their specific images
const stories = [
  {
    id: 1,
    title: "Why I Still Love My Tesla, But Not Its CEO",
    excerpt: "A personal story from a Model 3 owner on separating the product from the personality behind it.",
    content: `
      <p>I remember the day I picked up my Model 3 like it was yesterday. The excitement, the anticipation, the feeling that I was part of something revolutionary. And in many ways, I was. The car itself is a marvel of engineering - responsive, efficient, and packed with features that make driving a joy.</p>
      
      <p>But as time went on, I found myself increasingly uncomfortable with the behavior of Tesla's CEO. The erratic tweets, the questionable business decisions, the treatment of employees - it all started to weigh on me. I began to wonder: could I still love my car while distancing myself from its controversial leader?</p>
      
      <p>The answer, I discovered, is a resounding yes. My Model 3 is not its CEO. It's the result of thousands of talented engineers, designers, and workers who poured their expertise and passion into creating something extraordinary. It's a product that represents the future of transportation, regardless of who sits at the company's helm.</p>
      
      <p>That's why I've chosen to express my independence. I still proudly drive my Tesla, but I've found ways to make it clear that my support for the product doesn't extend to unconditional support for its CEO. From subtle modifications to conversations with curious onlookers, I've reclaimed my Tesla experience on my own terms.</p>
      
      <p>And I'm not alone. There's a growing community of Tesla owners who feel the same way - who love their cars but wish for different leadership. Together, we're creating a space where we can celebrate these remarkable vehicles while also acknowledging their complicated context.</p>
      
      <p>So if you're a Tesla owner who's feeling conflicted, know that you're not alone. You can appreciate the innovation without endorsing the innovator. You can be part of the electric revolution without compromising your values. Your Tesla is yours - not his.</p>
    `,
    date: "Apr 1, 2025",
    readTime: "5 min read",
    author: "Alex Johnson",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.42.20%E2%80%AFPM-vcV6wDN72IFHMFtRqKhTLdGYPYhBBN.png",
    category: "OWNER STORY",
  },
  {
    id: 2,
    title: "The Tesla Community Beyond Twitter: Finding Your People",
    excerpt: "There's a thriving community of Tesla owners who share your values. Here's how to connect with them.",
    content: `
      <p>When I first bought my Tesla, I was excited to join the online community of owners. But I quickly discovered that many of the official forums and social media groups had become echo chambers for the CEO's most ardent supporters. Any criticism or nuanced discussion was met with hostility.</p>
      
      <p>I almost gave up on finding like-minded Tesla owners until I discovered alternative communities where people celebrated their cars without worshiping the company's leadership. These spaces allowed for honest conversations about both the incredible engineering achievements and the legitimate concerns about corporate direction.</p>
      
      <p>Today, I'm connected with hundreds of Tesla owners who share my perspective. We organize local meetups, share tips and modifications, and support each other through the unique experience of loving a product while having reservations about its creator.</p>
      
      <p>If you're looking to find your Tesla community beyond the official channels, here are some places to start:</p>
      
      <p>Independent forums like TeslaOwnersClub and regional Facebook groups often have more diverse perspectives than official channels. Look for groups that explicitly welcome all viewpoints and moderate against toxic behavior.</p>
      
      <p>Local EV meetups are another great way to connect with Tesla owners in person. These events typically focus on the cars themselves rather than company politics, creating a neutral space for all owners.</p>
      
      <p>Remember, you're not alone in your complex feelings about Tesla. There's a whole community of owners who love their cars but maintain independent perspectives on the company's leadership. You just need to know where to look.</p>
    `,
    date: "Mar 28, 2025",
    readTime: "8 min read",
    author: "Jamie Rodriguez",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.09%E2%80%AFPM-WHBxB6ohNVsF8af7JqJzZk1xPBnnZF.png",
    category: "COMMUNITY",
  },
  {
    id: 3,
    title: "Supercharging Etiquette: The Unwritten Rules Every Tesla Owner Should Know",
    excerpt: "From charging speeds to queue management, here's how to be a good citizen at the Supercharger.",
    content: `
      <p>As Tesla's popularity continues to grow, Supercharger stations are becoming increasingly busy. While Tesla has expanded its charging network significantly, peak travel times can still mean waiting for a spot. That's why it's more important than ever to follow good Supercharger etiquette.</p>
      
      <p>First and foremost, don't treat Supercharger spots as parking spaces. Once your car is sufficiently charged (typically to 80%, which happens much faster than the final 20%), move your vehicle to make room for others. The Tesla app will notify you when your charge is nearing completion.</p>
      
      <p>If you arrive at a busy station, form an orderly queue rather than hovering around spots waiting for someone to leave. Some locations have implemented formal queuing systems, but at those that haven't, it's up to owners to self-organize respectfully.</p>
      
      <p>Be mindful of charging speeds. If you're in no rush and the station is busy, consider using a slower charger or charging to a lower percentage to free up the space more quickly for those who might need a faster charge for long-distance travel.</p>
      
      <p>Keep the area clean. Don't leave trash behind, and coil cables neatly when you're done. It's a small gesture that makes a big difference in maintaining a pleasant experience for everyone.</p>
      
      <p>Finally, be friendly! Supercharger stops are a great opportunity to meet other Tesla owners and share experiences. Just be mindful that not everyone wants to chat, especially if they're in a hurry or prefer privacy.</p>
      
      <p>By following these unwritten rules, we all contribute to a positive Supercharger experience that reflects well on Tesla owners as a community - regardless of our varied opinions on the company's leadership.</p>
    `,
    date: "Mar 22, 2025",
    readTime: "6 min read",
    author: "Taylor Kim",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.43.27%E2%80%AFPM-oshZaVC65xUKomTnPGTmvWirVumvzJ.png",
    category: "TIPS & TRICKS",
  },
]

// Get story by ID
const getStoryById = (id: string) => {
  const storyId = Number.parseInt(id)
  const story = stories.find((s) => s.id === storyId)

  if (!story) {
    // Return a default "not found" story if the ID doesn't match
    return {
      id: 0,
      title: "Story not found",
      excerpt: "The requested story could not be found.",
      content: "<p>We couldn't find the story you're looking for. Please check the URL and try again.</p>",
      date: "Unknown",
      readTime: "0 min read",
      author: "Unknown",
      image: "/placeholder.svg",
      category: "NOT FOUND",
    }
  }

  return story
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = getStoryById(params.id)

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/stories" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to stories
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-red-600 text-white px-3 py-1 text-sm font-medium mb-6">
              {story.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
              {story.title}
            </h1>

            <div className="flex flex-wrap items-center text-white/60 gap-4 mb-8">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{story.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{story.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{story.readTime}</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/9] mb-10">
            <FallbackImage src={story.image} alt={story.title} fill useRedFallback={true} />
          </div>

          <div
            className="prose prose-lg prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />

          <div className="border-t border-gray-800 pt-8 mt-12">
            <h3 className="text-xl font-medium mb-4">Share this story</h3>
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
