"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Send, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      setErrorMessage(decodeURIComponent(error))
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const contactData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    // Create mailto link with form data
    const mailtoLink = `mailto:support@muskmustgo.com?subject=${encodeURIComponent(contactData.subject)}&body=${encodeURIComponent(
      `Name: ${contactData.name}\nEmail: ${contactData.email}\n\nMessage:\n${contactData.message}`,
    )}`

    // Open user's email client
    window.location.href = mailtoLink

    // Simulate form submission for UI
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSubmitted(true)
    }, 1000)
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">GET IN TOUCH</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Contact Us</h1>
            <p className="text-xl text-white/70">Have questions or suggestions? We'd love to hear from you.</p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Email Support</h3>
              <p className="text-white/70">support@muskmustgo.com</p>
            </div>
          </div>

          <div className="bg-dark-300 p-8 rounded-lg">
            {formSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
                <p className="text-white/70 mb-8">
                  Your email client should have opened with the message. Send it to reach us directly.
                </p>
                <Button onClick={() => setFormSubmitted(false)} className="bg-white text-black hover:bg-white/90">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white/70 mb-2">
                      Name
                    </label>
                    <Input
                      name="name"
                      id="name"
                      type="text"
                      required
                      className="bg-dark-400 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white/70 mb-2">
                      Email
                    </label>
                    <Input
                      name="email"
                      id="email"
                      type="email"
                      required
                      className="bg-dark-400 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white/70 mb-2">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    id="subject"
                    type="text"
                    required
                    className="bg-dark-400 border-white/20 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white/70 mb-2">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    id="message"
                    required
                    rows={6}
                    className="bg-dark-400 border-white/20 text-white resize-none"
                    defaultValue={errorMessage ? `Order Processing Error Details:\n\n${errorMessage}\n\n` : ""}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>Opening Email Client...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
