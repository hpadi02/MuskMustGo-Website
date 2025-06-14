"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart-simplified"
import FallbackImage from "@/components/fallback-image"
import CheckoutButton from "@/components/checkout-button"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-10">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Link>

          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-white/40 mb-6" />
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">Your cart is empty</h1>
            <p className="text-white/70 mb-8">Add some items to your cart to get started.</p>
            <Link href="/shop/all">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.customId || ""}`} className="bg-dark-300 p-6 rounded-lg">
                  <div className="flex gap-6">
                    <div className="relative w-24 h-24 bg-dark-400 flex-shrink-0">
                      <FallbackImage src={item.image} alt={item.name} fill useRedFallback={true} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                      <p className="text-white/60 text-sm mb-4">${item.price.toFixed(2)} each</p>

                      {/* Custom Options Display */}
                      {item.customOptions && (
                        <div className="flex mb-4 space-x-4">
                          {Object.entries(item.customOptions).map(([key, value]) => (
                            <div key={key} className="flex flex-col items-center">
                              <span className="text-white/60 text-xs mb-1">{key === "tesla" ? "Tesla" : "Elon"}</span>
                              <span className="text-2xl bg-dark-400 p-2 rounded-full">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-white/20 text-white hover:bg-white/10"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.customId)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-white/20 text-white hover:bg-white/10"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customId)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => removeItem(item.id, item.customId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-dark-300 p-6 rounded-lg sticky top-32">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/70">Items ({itemCount})</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <hr className="border-dark-200" />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <CheckoutButton className="w-full bg-red-600 hover:bg-red-700 text-white" />

                <p className="text-white/60 text-sm mt-4 text-center">Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
