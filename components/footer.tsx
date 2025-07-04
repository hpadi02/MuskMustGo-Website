import Link from "next/link"
import { Newsletter } from "@/components/newsletter"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="container mx-auto px-6 md:px-10">
          <Newsletter />
        </div>
      </section>

      {/* Main Footer */}
      <div className="container mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">MuskMustGo</h3>
            <p className="text-white/70 mb-6 max-w-md">
              Express your independence with premium merchandise that separates your love for Tesla vehicles from their
              controversial CEO.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop/all" className="text-white/70 hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-white/70 hover:text-white transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-white/70 hover:text-white transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/70 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-white/70 hover:text-white transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>

            {/* Social Media - Hidden for now */}
            {/* <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div> */}
          </div>

          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">© 2024 MuskMustGo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
