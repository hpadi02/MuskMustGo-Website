import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">
          My App
        </Link>

        <div className="space-x-4">
          <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
            Home
          </Link>
          <Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">
            About
          </Link>
          <Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">
            Contact
          </Link>
          {process.env.NODE_ENV === "development" && (
            <Link href="/test-backend" className="text-white/70 hover:text-white transition-colors text-sm">
              🧪 Test Backend
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
