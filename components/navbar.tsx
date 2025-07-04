"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, ChevronDown } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  const communityLinks = [
    { href: "/community", label: "Community Hub" },
    { href: "/forum", label: "Discussion Forum" },
    { href: "/stories", label: "User Stories" },
    { href: "/news", label: "Latest News" },
  ]

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">MuskMustGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop/all" className="text-gray-700 hover:text-red-600 font-medium">
              SHOP
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-red-600 font-medium">
                COMMUNITY
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {communityLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium">
              ABOUT
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium">
              CONTACT
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Shop Now Button - Desktop */}
            <div className="hidden md:block">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/shop/all">SHOP NOW</Link>
              </Button>
            </div>

            {/* Mobile menu trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link
                    href="/shop/all"
                    className="text-lg font-medium text-gray-900 hover:text-red-600"
                    onClick={() => setIsOpen(false)}
                  >
                    SHOP
                  </Link>

                  <div className="space-y-2">
                    <span className="text-lg font-medium text-gray-900">COMMUNITY</span>
                    <div className="pl-4 space-y-2">
                      {communityLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block text-gray-700 hover:text-red-600"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/about"
                    className="text-lg font-medium text-gray-900 hover:text-red-600"
                    onClick={() => setIsOpen(false)}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium text-gray-900 hover:text-red-600"
                    onClick={() => setIsOpen(false)}
                  >
                    CONTACT
                  </Link>

                  {/* Shop Now Button - Mobile */}
                  <Button asChild className="bg-red-600 hover:bg-red-700 mt-6">
                    <Link href="/shop/all" onClick={() => setIsOpen(false)}>
                      SHOP NOW
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
