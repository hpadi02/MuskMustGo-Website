"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Eye, Download, ChevronDown, ChevronUp } from "lucide-react"
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

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Load orders from localStorage
    const ordersJSON = localStorage.getItem("orderHistory")
    if (ordersJSON) {
      try {
        const loadedOrders = JSON.parse(ordersJSON)
        setOrders(loadedOrders)
      } catch (error) {
        console.error("Failed to parse orders:", error)
      }
    }
  }, [])

  const toggleOrder = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

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

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">My Orders</h1>
            <Link href="/account">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Account Settings
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-dark-300 rounded-lg">
              <Package className="h-16 w-16 mx-auto text-white/40 mb-6" />
              <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
              <p className="text-white/70 mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link href="/shop/all">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-dark-300 rounded-lg overflow-hidden">
                  <div
                    className="p-6 flex flex-wrap gap-4 justify-between items-center cursor-pointer hover:bg-dark-200/50 transition-colors"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div>
                      <p className="text-white/60 text-sm mb-1">Order #{order.id}</p>
                      <p className="font-medium">{order.date}</p>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "Shipped"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-white/60 text-sm mb-1">Total</p>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5 text-white/60" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white/60" />
                      )}
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="p-6 border-t border-dark-200">
                      <h3 className="text-lg font-medium mb-4">Order Items</h3>

                      <div className="space-y-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-4">
                            <div className="relative w-16 h-16 bg-dark-400 flex-shrink-0">
                              <FallbackImage src={item.image} alt={item.name} fill useRedFallback={true} />
                            </div>

                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <div className="flex justify-between text-white/60 text-sm">
                                <p>Qty: {item.quantity}</p>
                                <p>${item.price.toFixed(2)} each</p>
                              </div>
                              {renderCustomOptions(item)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between mt-6 pt-4 border-t border-dark-200">
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <Download className="h-4 w-4 mr-2" /> Invoice
                          </Button>
                        </div>

                        <Button className="bg-red-600 hover:bg-red-700 text-white">Track Order</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
