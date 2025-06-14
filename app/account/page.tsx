"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Package, CreditCard, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="bg-dark-300 p-6 rounded-lg">
                <div className="space-y-4">
                  <Link href="/account" className="flex items-center text-red-500 font-medium">
                    <User className="h-5 w-5 mr-3" /> Profile
                  </Link>
                  <Link href="/account/orders" className="flex items-center text-white/70 hover:text-white">
                    <Package className="h-5 w-5 mr-3" /> Orders
                  </Link>
                  <Link href="/account/payment" className="flex items-center text-white/70 hover:text-white">
                    <CreditCard className="h-5 w-5 mr-3" /> Payment Methods
                  </Link>
                  <hr className="border-dark-200" />
                  <button className="flex items-center text-white/70 hover:text-white w-full text-left">
                    <LogOut className="h-5 w-5 mr-3" /> Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="bg-dark-300 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Personal Information</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                {isEditing ? (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-white/70 mb-2">
                          First Name
                        </label>
                        <Input id="firstName" defaultValue="Alex" className="bg-dark-400 border-white/20 text-white" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-white/70 mb-2">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          defaultValue="Johnson"
                          className="bg-dark-400 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white/70 mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="alex@example.com"
                        className="bg-dark-400 border-white/20 text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-white/70 mb-2">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="(555) 123-4567"
                        className="bg-dark-400 border-white/20 text-white"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="bg-red-600 hover:bg-red-700 text-white">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/70 text-sm">First Name</p>
                        <p>Alex</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Last Name</p>
                        <p>Johnson</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/70 text-sm">Email</p>
                      <p>alex@example.com</p>
                    </div>

                    <div>
                      <p className="text-white/70 text-sm">Phone</p>
                      <p>(555) 123-4567</p>
                    </div>
                  </div>
                )}

                <hr className="my-8 border-dark-200" />

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Shipping Address</h2>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Edit
                  </Button>
                </div>

                <div>
                  <p>Alex Johnson</p>
                  <p>123 Tesla Street</p>
                  <p>San Francisco, CA 94103</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
