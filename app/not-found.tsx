import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="bg-dark-400 text-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-9xl font-display font-bold text-red-500 mb-6">404</h1>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Page Not Found</h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-white text-black hover:bg-white/90 w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>

          <Link href="/shop/all">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
