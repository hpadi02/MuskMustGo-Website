"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-dark-400 text-white fixed w-full z-50 top-0">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight" onClick={closeMenu}>
            MuskMustGo
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop/all" className="hover:text-gray-300 transition-colors">
              Shop
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              About
            </Link>
            <Link href="/stories" className="hover:text-gray-300 transition-colors">
              Stories
            </Link>
            <Link href="/news" className="hover:text-gray-300 transition-colors">
              News
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Contact
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative hover:text-gray-300 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Login button hidden for now */}
            {/* <Link href="/login">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black bg-transparent">
                Login
              </Button>
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link href="/cart" className="relative hover:text-gray-300 transition-colors" onClick={closeMenu}>
              <ShoppingBag className="h-6 w-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button onClick={toggleMenu} className="text-white hover:text-gray-300 transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
              <Link
                href="/shop/all"
                className="block px-3 py-2 text-base font-medium hover:text-gray-300 transition-colors"
                onClick={closeMenu}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium hover:text-gray-300 transition-colors"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                href="/stories"
                className="block px-3 py-2 text-base font-medium hover:text-gray-300 transition-colors"
                onClick={closeMenu}
              >
                Stories
              </Link>
              <Link
                href="/news"
                className="block px-3 py-2 text-base font-medium hover:text-gray-300 transition-colors"
                onClick={closeMenu}
              >
                News
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium hover:text-gray-300 transition-colors"
                onClick={closeMenu}
              >
                Contact
              </Link>

              {/* Mobile Login button hidden for now */}
              {/* <div className="px-3 py-2">
                <Link href="/login" onClick={closeMenu}>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black w-full bg-transparent">
                    Login
                  </Button>
                </Link>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
