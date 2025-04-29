import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

export default function AboutPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">ABOUT US</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Our Mission</h1>
          </div>

          <div className="relative aspect-[21/9] mb-12">
            <FallbackImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.46.15%E2%80%AFPM-Y52Fbtim2W6y54pJfvLaFaos51cH3J.png"
              alt="Front view of a Tesla with prominent logo"
              fill
              className="object-cover"
              useRedFallback={true}
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <p className="lead text-xl">
              We're a community of Tesla owners who love our cars for their innovation, performance, and sustainability,
              but have concerns about the company's CEO.
            </p>

            <h2>Our Story</h2>
            <p>
              MuskMustGo was founded in 2023 by a group of Tesla owners who found themselves in an uncomfortable
              position. We had invested in what we believed was the future of transportation - vehicles that represented
              a step forward for both technology and the environment. But increasingly, we found ourselves at odds with
              the public statements, business decisions, and personal conduct of Tesla's CEO.
            </p>

            <p>
              We started as a small online forum where we could express these conflicted feelings. What we discovered
              was that we weren't alone - thousands of Tesla owners felt the same way. They loved their cars but wished
              for different leadership. They wanted to express their independence without abandoning their commitment to
              electric mobility.
            </p>

            <h2>What We Believe</h2>
            <p>
              We believe that it's possible to separate the product from its CEO. We believe that Tesla vehicles
              represent the work of thousands of talented engineers, designers, and workers who deserve recognition. We
              believe that being a Tesla owner doesn't mean unconditional support for its controversial leadership.
            </p>

            <p>
              Most importantly, we believe in creating a space where Tesla owners can express these nuanced views
              without judgment. Where they can celebrate their vehicles while also acknowledging their complicated
              context.
            </p>

            <h2>What We Do</h2>
            <p>
              We provide merchandise, community forums, and resources for Tesla owners who want to express their
              independence. Our products allow you to show your love for your Tesla while making it clear that your
              support has limits. Our community spaces offer connection with like-minded owners who share your values.
            </p>

            <p>
              We also work to educate the public about the distinction between Tesla's products and its CEO. We believe
              that the future of sustainable transportation is bigger than any one person, and we're committed to
              supporting that future while advocating for responsible leadership.
            </p>

            <h2>Join Us</h2>
            <p>
              If you're a Tesla owner who loves your car but has concerns about its CEO, you're not alone. Join our
              community today and be part of a movement that celebrates Tesla innovation while advocating for better
              leadership.
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
