"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cart = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark-300/95 backdrop-blur-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <span className="font-display text-2xl font-bold text-white">
              <span className="text-red-500">Musk</span>
              <span>MustGo</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/shop/all" className="text-white/90 hover:text-white text-sm font-medium tracking-wide">
              SHOP
            </Link>

            {/* HIDDEN: Community dropdown with Forum - keeping code for later */}
            {/* 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white/90 hover:text-white flex items-center text-sm font-medium tracking-wide">
                  COMMUNITY <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-300 border-dark-100 text-white">
                <DropdownMenuItem className="focus:bg-dark-100 focus:text-white">
                  <Link href="/stories" className="w-full">
                    STORIES
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-dark-100 focus:text-white">
                  <Link href="/forum" className="w-full">
                    FORUM
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            */}

            {/* Keep Stories link but remove Forum */}
            <Link href="/stories" className="text-white/90 hover:text-white text-sm font-medium tracking-wide">
              STORIES
            </Link>

            <Link href="/about" className="text-white/90 hover:text-white text-sm font-medium tracking-wide">
              ABOUT
            </Link>

            <Link href="/contact" className="text-white/90 hover:text-white text-sm font-medium tracking-wide">
              CONTACT
            </Link>
          </nav>

          {/* Right Side - Cart & Mobile Menu */}
          <div className="flex items-center space-x-4 z-10">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full relative">
                <ShoppingBag className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.itemCount > 9 ? "9+" : cart.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* HIDDEN: Login button - keeping code for later */}
            {/* 
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" className="text-white hover:bg-white/10 text-sm font-medium tracking-wide">
                LOG IN
              </Button>
            </Link>
            */}

            <Link href="/shop/all" className="hidden md:block">
              <Button className="bg-white hover:bg-white/90 text-black text-sm font-medium tracking-wide">
                SHOP NOW
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-300 absolute top-full left-0 right-0 border-t border-dark-100">
          <div className="container mx-auto px-6 py-6 space-y-6">
            <Link
              href="/shop/all"
              className="block text-white hover:text-red-500 text-sm font-medium tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              SHOP
            </Link>

            {/* HIDDEN: Community section with Forum - keeping code for later */}
            {/* 
            <div className="space-y-4">
              <h3 className="text-white/60 text-sm font-medium tracking-wide">COMMUNITY</h3>
              <div className="space-y-3 pl-2">
                <Link
                  href="/stories"
                  className="block text-white hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Stories
                </Link>
                <Link
                  href="/forum"
                  className="block text-white hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Forum
                </Link>
              </div>
            </div>
            */}

            {/* Keep Stories link */}
            <Link
              href="/stories"
              className="block text-white hover:text-red-500 text-sm font-medium tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              STORIES
            </Link>

            <Link
              href="/about"
              className="block text-white hover:text-red-500 text-sm font-medium tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              ABOUT
            </Link>

            <Link
              href="/contact"
              className="block text-white hover:text-red-500 text-sm font-medium tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              CONTACT
            </Link>

            <div className="pt-4 flex flex-col space-y-3">
              {/* HIDDEN: Login button - keeping code for later */}
              {/* 
              <Link href="/login">
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                  LOG IN
                </Button>
              </Link>
              */}
              <Link href="/shop/all">
                <Button className="w-full bg-white hover:bg-white/90 text-black">SHOP NOW</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
