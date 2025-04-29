"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

type OrderItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  customOptions?: Record<string, any>
  customId?: string
}

type Order = {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
  shipping: number
}

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Get the last order from localStorage
    const lastOrderJSON = localStorage.getItem("lastOrder")
    if (lastOrderJSON) {
      try {
        const lastOrder = JSON.parse(lastOrderJSON)
        setOrder(lastOrder)
      } catch (error) {
        console.error("Failed to parse last order:", error)
      }
    }
  }, [])

  // Helper function to display customization options
  const renderCustomOptions = (item: OrderItem) => {
    if (!item.customOptions) return null

    return (
      <div className="flex mt-2 space-x-4">
        {Object.entries(item.customOptions).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center">
            <span className="text-white/60 text-xs mb-1">{key === "tesla" ? "Tesla" : "Elon"}</span>
            <span className="text-2xl bg-dark-400 p-2 rounded-full">{value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Order Confirmed!</h1>
          <p className="text-xl text-white/80 mb-8">
            Thank you for your purchase. We've received your order and will process it right away.
          </p>
          <Link href="/shop/all">
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />

        <h1 className="text-4xl md:text-5xl font-bold mb-6">Order Confirmed!</h1>

        <p className="text-xl text-white/80 mb-8">
          Thank you for your purchase. We've received your order and will process it right away.
        </p>

        <div className="bg-dark-300 p-6 rounded-lg mb-8">
          <p className="text-white/60 mb-2">Order Reference</p>
          <p className="text-2xl font-medium">{order.id}</p>
        </div>

        <div className="bg-dark-300 rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-dark-200">
            <h2 className="text-xl font-medium mb-4 text-left">Order Summary</h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 bg-dark-400 flex-shrink-0">
                      <FallbackImage src={item.image} alt={item.name} fill useRedFallback={true} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
                      {renderCustomOptions(item)}
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Subtotal</span>
              <span>${(order.total - order.shipping).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Shipping</span>
              <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-4 border-t border-dark-200 mt-4">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p className="text-white/60 mb-12">A confirmation email has been sent to your email address.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop/all">
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>

          <Link href="/account/orders">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
            >
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
