"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is MuskMustGo?",
    answer:
      "MuskMustGo is a community and merchandise brand for Tesla owners who love their cars but have concerns about the company's CEO. We provide a space for Tesla owners to express their independence and connect with like-minded individuals.",
  },
  {
    question: "Are you anti-Tesla?",
    answer:
      "Not at all! We love Tesla vehicles and the innovation they represent. We simply believe it's possible to separate the product from its CEO and to express nuanced views about both.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see the exact shipping cost during checkout.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account to view the status of your order.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery for unused items in their original packaging. Please visit our Returns page for more information on how to initiate a return.",
  },
  {
    question: "Do you have physical stores?",
    answer:
      "Currently, we operate exclusively online. However, we occasionally participate in Tesla owner meetups and EV events where you can find our merchandise in person.",
  },
  {
    question: "How can I join the community?",
    answer:
      "You can join our community by creating an account on our website, subscribing to our newsletter, or following us on social media. We also have a forum where you can connect with other Tesla owners.",
  },
  {
    question: "Do you make custom merchandise?",
    answer:
      "We can accommodate custom orders for group purchases or special events. Please contact us with your requirements for a quote.",
  },
]

export default function FAQPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">HELP CENTER</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/70">Find answers to common questions about our products and community.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-white/20 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-dark-300 transition-colors text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-white/70">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-white/70 mb-6">Can't find what you're looking for? Contact our support team.</p>
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
