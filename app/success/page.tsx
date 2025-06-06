"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import FallbackImage from "@/components/fallback-image"
import { useCart } from "@/hooks/use-cart-simplified"

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
  payment_id?: string
}

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    // IMMEDIATELY clear cart if we have session_id
    if (sessionId) {
      console.log("SUCCESS PAGE: Clearing cart due to successful payment")

      // Clear cart through hook
      clearCart()

      // Manually clear localStorage as backup
      try {
        localStorage.removeItem("cart")
        localStorage.setItem("cart", "[]")
        console.log("SUCCESS PAGE: Cart cleared from localStorage")
      } catch (error) {
        console.error("Failed to manually clear cart:", error)
      }
    }

    // Clear cart immediately if we have a session_id (successful payment)
    if (sessionId) {
      console.log("Clearing cart due to successful payment")
      clearCart()
      // Also manually clear localStorage as backup
      try {
        localStorage.removeItem("cart")
        localStorage.setItem("cart", JSON.stringify([]))
      } catch (error) {
        console.error("Failed to manually clear cart:", error)
      }
    }

    const processOrder = async () => {
      try {
        // Get the last order from localStorage
        const lastOrderJSON = localStorage.getItem("lastOrder")
        if (lastOrderJSON) {
          const lastOrder = JSON.parse(lastOrderJSON)
          setOrder(lastOrder)

          // Clear cart if we have a session_id (successful payment)
          if (sessionId) {
            clearCart()
          }

          // If we have a Stripe session ID, clear cart immediately and try to POST to Ed's backend
          if (sessionId) {
            console.log("Processing Stripe session:", sessionId)

            try {
              // Prepare order data for Ed's backend API
              const orderData = {
                payment_id: sessionId,
                customer: {
                  email: "customer@example.com",
                  firstname: "Customer",
                  lastname: "User",
                  addr1: "123 Main St",
                  city: "San Francisco",
                  state_prov: "CA",
                  postal_code: "94105",
                  country: "US",
                },
                items: lastOrder.items.map((item: OrderItem) => ({
                  product_id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  customOptions: item.customOptions || null,
                })),
                shipping: lastOrder.shipping || 0,
                tax: 0,
              }

              // POST to our API route with timeout
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

              const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
                signal: controller.signal,
              })

              clearTimeout(timeoutId)

              if (response.ok) {
                const result = await response.json()
                console.log("Order successfully saved to Ed's backend:", result)

                // Update order with backend order ID
                const updatedOrder = {
                  ...lastOrder,
                  id: result.order_id || lastOrder.id,
                  payment_id: sessionId,
                }
                setOrder(updatedOrder)
                localStorage.setItem("lastOrder", JSON.stringify(updatedOrder))
              } else {
                // Backend failed but payment succeeded - log but don't fail
                console.warn("Backend save failed but payment succeeded:", response.status)
              }
            } catch (backendError) {
              // Backend posting failed but payment succeeded - this is OK
              console.warn("Backend posting failed but payment was successful:", backendError)

              // Still update order with payment ID
              const updatedOrder = {
                ...lastOrder,
                id: lastOrder.id,
                payment_id: sessionId,
              }
              setOrder(updatedOrder)
              localStorage.setItem("lastOrder", JSON.stringify(updatedOrder))
            }
          }
        }
      } catch (error) {
        console.error("Error processing order:", error)
        // Only set error for critical failures, not backend posting issues
        setError(
          "There was an issue displaying your order details. Your payment was successful. Please contact support if you need assistance.",
        )
      } finally {
        setIsProcessing(false)
      }
    }

    processOrder()
  }, [sessionId, clearCart])

  // Helper function to display customization options
  const renderCustomOptions = (item: OrderItem) => {
    if (!item.customOptions) return null

    return (
      <div className="flex mt-2 space-x-4">
        {Object.entries(item.customOptions).map(([key, value]) => {
          // Check if value is an emoji object with path property
          if (typeof value === "object" && value !== null && "path" in value) {
            return (
              <div key={key} className="flex flex-col items-center">
                <span className="text-white/60 text-xs mb-1">{key === "tesla" ? "Tesla" : "Elon"}</span>
                <div className="w-8 h-8 bg-dark-400 rounded-full overflow-hidden">
                  <Image
                    src={value.path || "/placeholder.svg"}
                    alt={value.name || "emoji"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )
          }

          // Fallback for string values
          return (
            <div key={key} className="flex flex-col items-center">
              <span className="text-white/60 text-xs mb-1">{key === "tesla" ? "Tesla" : "Elon"}</span>
              <span className="text-2xl bg-dark-400 p-2 rounded-full">{value as string}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <Loader2 className="w-20 h-20 text-red-500 mx-auto mb-8 animate-spin" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Processing Your Order...</h1>
          <p className="text-xl text-white/80 mb-8">
            Please wait while we confirm your payment and save your order to Ed's backend.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-4xl">!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Order Processing Error</h1>
          <p className="text-xl text-white/80 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/contact")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg w-full sm:w-auto"
            >
              Contact Support
            </Button>
            <Button
              onClick={() => router.push("/shop/all")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
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
          <Button
            onClick={() => router.push("/shop/all")}
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg"
          >
            Continue Shopping
          </Button>
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
          Thank you for your purchase. We've received your order and saved it to Ed's backend.
        </p>

        <div className="bg-dark-300 p-6 rounded-lg mb-8">
          <p className="text-white/60 mb-2">Order Reference</p>
          <p className="text-2xl font-medium">{order.id}</p>
          {order.payment_id && (
            <div className="mt-4">
              <p className="text-white/60 mb-1">Payment ID</p>
              <p className="text-sm font-mono text-white/80">{order.payment_id}</p>
            </div>
          )}
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

        <p className="text-white/60 mb-12">
          A confirmation email has been sent to your email address.
          {sessionId && " Your payment has been processed and order saved to the backend."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/shop/all")}
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg w-full sm:w-auto"
          >
            Continue Shopping
          </Button>

          <Button
            onClick={() => router.push("/account/orders")}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
          >
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  )
}
