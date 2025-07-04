"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop/all" },
    { name: "Stories", href: "/stories" },
    { name: "Articles", href: "/articles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">MuskMustGo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/60 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            {/* Login button hidden as requested */}
            {/* <Link href="/login">
              <Button size="sm">Login</Button>
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground/60 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <Link href="/cart" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start relative bg-transparent">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart
                        {itemCount > 0 && (
                          <span className="ml-auto bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                            {itemCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                    {/* Mobile login button hidden as requested */}
                    {/* <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Login</Button>
                    </Link> */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
