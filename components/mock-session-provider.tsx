"use client"

import type React from "react"
import { createContext, useContext } from "react"

// Mock session type
interface MockSession {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

// Mock session context
const MockSessionContext = createContext<{
  data: MockSession | null
  status: "loading" | "authenticated" | "unauthenticated"
}>({
  data: null,
  status: "unauthenticated",
})

// Mock useSession hook
export function useSession() {
  return useContext(MockSessionContext)
}

// Mock SessionProvider
export function MockSessionProvider({ children }: { children: React.ReactNode }) {
  const mockSessionValue = {
    data: null,
    status: "unauthenticated" as const,
  }

  return <MockSessionContext.Provider value={mockSessionValue}>{children}</MockSessionContext.Provider>
}
