import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-dark-300 text-white">
      <div className="container mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo and About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold">
                <span className="text-red-500">Musk</span>
                <span className="text-white">MustGo</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Premium merchandise for Tesla owners who want to express their independence and separate the product from
              its CEO.
            </p>
            {/* HIDDEN: Social media links - keeping code for later when Ed sets up accounts */}
            {/* 
            <div className="flex space-x-5">
              <Link href="#" className="text-white/50 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/50 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/50 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/50 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
            */}
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium tracking-wide text-white/60 mb-6">SHOP</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop/all" className="text-white/80 hover:text-white text-sm">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium tracking-wide text-white/60 mb-6">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/80 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-white/80 hover:text-white text-sm">
                  Tesla Stories
                </Link>
              </li>
              {/* HIDDEN: Forum link - keeping code for later */}
              {/* 
              <li>
                <Link href="/forum" className="text-white/80 hover:text-white text-sm">
                  Forum
                </Link>
              </li>
              */}
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-white text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/80 hover:text-white text-sm">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-medium tracking-wide text-white/60 mb-6">NEWSLETTER</h3>
            <p className="text-white/70 text-sm mb-4">Subscribe to get special offers, free giveaways, and updates.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-dark-200 border border-dark-100 text-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
              />
              <button
                type="submit"
                className="w-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-dark-100 mt-16 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} MuskMustGo. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
