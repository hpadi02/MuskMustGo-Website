"use client"

import Link from "next/link"
import { signIn, signOut } from "next-auth/react"
import { useSession as useMockSession } from "@/components/mock-session-provider"

export default function Navbar() {
  const { data: session } = useMockSession()

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">
          My App
        </Link>
        <div className="space-x-4">
          <Link href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
          {session ? (
            <>
              <span className="text-gray-300">Hello, {session.user?.name || session.user?.email}!</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
