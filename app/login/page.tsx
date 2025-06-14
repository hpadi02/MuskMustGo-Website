"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Log In</h1>
            <p className="text-white/70">Sign in to your account to access your profile, orders, and more.</p>
          </div>

          <div className="bg-dark-300 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-white/70 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    required
                    className="bg-dark-400 border-white/20 text-white pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-white/70 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="bg-dark-400 border-white/20 text-white pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-white/70">
                    Remember me
                  </label>
                </div>

                <Link href="/forgot-password" className="text-sm text-red-500 hover:text-red-400">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white w-full">
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-white/70 text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-red-500 hover:text-red-400">
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
