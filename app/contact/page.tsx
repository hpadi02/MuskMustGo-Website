"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [submitError, setSubmitError] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      setErrorMessage(decodeURIComponent(error))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    const formData = new FormData(e.target as HTMLFormElement)
    const contactData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    try {
      console.log("Sending contact form:", contactData)

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      const result = await response.json()
      console.log("Contact form response:", result)

      if (result.success) {
        setFormSubmitted(true)
      } else {
        setSubmitError(result.details || result.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setSubmitError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-green-400 font-medium mb-1">Contact Form</h3>
                  <p className="text-white/80 text-sm">
                    Messages are sent directly to Ed via email. You'll receive a confirmation once sent.
                  </p>
                </div>
              </div>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Message Received!</h2>
                <p className="text-white/70 mb-8">
                  Your message has been logged and Ed will be notified. We'll get back to you as soon as possible.
                </p>
                <Button onClick={() => setFormSubmitted(false)} className="bg-white text-black hover:bg-white/90">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-red-400 font-medium mb-1">Error sending message</h3>
                        <p className="text-white/80 text-sm">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                    <>Sending...</>
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
