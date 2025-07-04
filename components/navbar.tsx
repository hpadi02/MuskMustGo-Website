import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Props {
  className?: string
}

export function Navbar({ className }: Props) {
  return (
    <div className={cn("border-b", className)}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        </Link>
        <div className="flex-1 text-right">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Icons.menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-3/4 md:w-2/5">
                <SheetHeader>
                  <SheetTitle>{siteConfig.name}</SheetTitle>
                  <SheetDescription>{siteConfig.description}</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/">Home</Link>
                  </Button>
                  {/* Login button - hidden for now */}
                  {/* <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <Link href="/login">Log In</Link>
                  </Button> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            {/* Login button - hidden for now */}
            {/* <Button variant="outline" size="sm" asChild>
              <Link href="/login">Log In</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
