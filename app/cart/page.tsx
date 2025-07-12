"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import FallbackImage from "@/components/fallback-image"
import { useCart } from "@/hooks/use-cart-simplified"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createCheckoutSession } from "@/lib/stripe-checkout"
import Image from "next/image"

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart, getCartTotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showPreviewMessage, setShowPreviewMessage] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const subtotal = getCartTotal()

  // Save cart to localStorage for order history
  const saveOrderToHistory = () => {
    try {
      // Generate a random order ID (will be replaced by backend)
      const orderId = `MMG-${Math.floor(Math.random() * 10000)}`

      // Create order object
      const order = {
        id: orderId,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: "Processing",
        total: subtotal, // Will be updated with actual total including tax and shipping
        items: items.map((item) => ({
          ...item,
          price: item.price,
        })),
        payment_id: null, // Will be updated after Stripe payment
      }

      // Get existing orders or initialize empty array
      const existingOrdersJSON = localStorage.getItem("orderHistory")
      const existingOrders = existingOrdersJSON ? JSON.parse(existingOrdersJSON) : []

      // Add new order to history
      const updatedOrders = [order, ...existingOrders]

      // Save updated order history
      localStorage.setItem("orderHistory", JSON.stringify(updatedOrders))

      // Save current order as "lastOrder" for success page
      localStorage.setItem("lastOrder", JSON.stringify(order))

      return orderId
    } catch (error) {
      console.error("Failed to save order to history:", error)
      return null
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      console.log("=== STARTING CHECKOUT ===")
      console.log("All cart items:", items)

      // Check each item for Stripe integration
      items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          name: item.name,
          id: item.id,
          customId: item.customId,
          stripeId: item.stripeId,
          productId: item.productId,
          hasStripeId: !!item.stripeId,
          hasProductId: !!item.productId,
          customOptions: item.customOptions,
        })
      })

      // Filter items to only include those with Stripe price IDs
      const stripeItems = items.filter((item) => {
        const hasStripeId = !!item.stripeId
        console.log(`Filtering item "${item.name}": hasStripeId = ${hasStripeId}`)
        return hasStripeId
      })

      console.log("Stripe items after filtering:", stripeItems)
      console.log("Number of Stripe items:", stripeItems.length)
      console.log("Number of total items:", items.length)

      if (stripeItems.length > 0) {
        console.log("Proceeding with Stripe checkout...")
        // Use client-side Stripe checkout
        const result = await createCheckoutSession(stripeItems)

        if (!result.success) {
          console.log("Stripe checkout failed:", result)
          // Check if it's a redirect blocking issue
          if (result.isRedirectBlocked) {
            // Show preview environment message
            setShowPreviewMessage(true)

            // Simulate successful checkout for demo purposes after a delay
            setTimeout(() => {
              saveOrderToHistory()
              clearCart()
              router.push("/success")
            }, 2000)
          } else {
            // Show other errors
            toast({
              title: "Checkout error",
              description: result.error || "There was a problem creating your checkout session",
              variant: "destructive",
            })
          }
        } else {
          // Save order to history and clear cart only if successful
          saveOrderToHistory()
          clearCart()
        }
        // Note: If successful, user will be redirected to Stripe
      } else {
        console.log("No Stripe items found, using fallback checkout...")
        // Fallback for items without Stripe IDs (like custom emoji magnet)
        saveOrderToHistory()

        // Show toast notification
        toast({
          title: "Order processed",
          description: "Your order has been processed successfully",
        })

        // Clear cart
        clearCart()

        // Redirect to success page
        router.push("/success")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout error",
        description: "There was a problem processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Helper function to display customization options (ONLY EMOJI IMAGES, NO TEXT)
  const renderCustomOptions = (item: any) => {
    if (!item.customOptions) return null

    return (
      <div className="mb-4">
        <div className="flex flex-wrap gap-4">
          {Object.entries(item.customOptions).map(([key, value]) => {
            // Check if value is an object with a path property (emoji object)
            if (value && typeof value === "object" && "path" in value) {
              return (
                <div key={key} className="flex flex-col items-center">
                  {/* REMOVED TEXT LABELS - only show emoji images */}
                  <Image
                    src={(value as any).path || "/placeholder.svg"}
                    alt={key}
                    width={40}
                    height={40}
                    className="bg-dark-300 p-1 rounded-full"
                  />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">Your Cart</h1>

          <div className="max-w-md mx-auto text-center py-16">
            <svg
              className="w-16 h-16 mx-auto mb-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-white/70 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/shop/all">
              <Button size="lg" className="bg-white hover:bg-white/90 text-black px-8 py-6 text-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">Your Cart</h1>

        {/* Preview Environment Message */}
        {showPreviewMessage && (
          <div className="mb-8 bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-2">Preview Environment</h3>
                <p className="text-white/80 mb-3">
                  You're viewing this in a preview environment where Stripe checkout redirects are blocked for security.
                  In production, you would be redirected to Stripe's secure checkout page.
                </p>
                <p className="text-white/60 text-sm">
                  Simulating successful checkout... You'll be redirected to the success page shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.customId || item.id}
                  className="flex flex-col sm:flex-row gap-6 border-b border-gray-800 pb-6"
                >
                  <div className="relative w-full sm:w-32 h-32 bg-gray-900 overflow-hidden">
                    <FallbackImage src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-medium">{item.name}</h3>
                      <p className="text-xl font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-white/60 mb-4">${item.price.toFixed(2)} each</p>

                    {/* Show emoji images without text descriptions - NO DEBUG INFO */}
                    {renderCustomOptions(item)}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateItemQuantity(item.customId || item.id, item.quantity - 1)}
                          className="rounded-full h-8 w-8 border-gray-700 text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-4 font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateItemQuantity(item.customId || item.id, item.quantity + 1)}
                          className="rounded-full h-8 w-8 border-gray-700 text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.customId || item.id)}
                        className="text-white/60 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/shop/all"
                className="inline-flex items-center text-lg font-medium text-white/60 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-black rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Tax</span>
                  <span className="font-medium text-white/60">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Shipping</span>
                  <span className="font-medium text-white/60">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mb-8">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)} + tax + shipping</span>
                </div>
                <p className="text-sm text-white/50 mt-1">Tax and shipping calculated at checkout</p>
              </div>

              <Button
                size="lg"
                className="w-full bg-white hover:bg-white/90 text-black py-6 rounded-md text-lg font-medium"
                onClick={handleCheckout}
                disabled={isCheckingOut || showPreviewMessage}
              >
                {isCheckingOut || showPreviewMessage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {showPreviewMessage ? "Processing Demo Checkout..." : "Redirecting to Stripe..."}
                  </>
                ) : (
                  "Checkout with Stripe"
                )}
              </Button>

              <div className="mt-6 text-center text-sm text-white/50">
                <p>Secure checkout powered by Stripe</p>
                <p className="mt-2 text-xs">Using Stripe Test Mode</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
