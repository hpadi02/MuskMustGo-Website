"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, CreditCard, User } from "lucide-react"
import Link from "next/link"

interface OrderData {
  customer: {
    email: string
    firstname: string
    lastname: string
    addr1: string
    addr2: string
    city: string
    state_prov: string
    postal_code: string
    country: string
  }
  payment_id: string
  products: Array<{
    product_id: string
    quantity: number
    attributes?: Array<{
      name: string
      value: string
    }>
  }>
  shipping: number
  tax: number
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderStatus, setOrderStatus] = useState<"processing" | "success" | "error">("processing")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (!sessionId) {
      setOrderStatus("error")
      setErrorMessage("No session ID found")
      return
    }

    processOrder()
  }, [sessionId])

  const processOrder = async () => {
    try {
      console.log("=== PROCESSING ORDER ===")
      console.log("Session ID:", sessionId)

      // Get Stripe session details
      const sessionResponse = await fetch(`/api/stripe/session/${sessionId}`)
      if (!sessionResponse.ok) {
        throw new Error("Failed to retrieve session")
      }

      const sessionData = await sessionResponse.json()
      console.log("Session data:", sessionData)

      const { session, lineItems } = sessionData

      if (session.payment_status !== "paid") {
        throw new Error("Payment not completed")
      }

      // Get cart items from localStorage (client-side only)
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
      console.log("Cart items from localStorage:", cartItems)

      // Build order data for Ed's backend
      const orderData: OrderData = {
        customer: {
          email: session.customer_details?.email || "",
          firstname: session.customer_details?.name?.split(" ")[0] || "",
          lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
          addr1: session.customer_details?.address?.line1 || "",
          addr2: session.customer_details?.address?.line2 || "",
          city: session.customer_details?.address?.city || "",
          state_prov: session.customer_details?.address?.state || "",
          postal_code: session.customer_details?.address?.postal_code || "",
          country: session.customer_details?.address?.country || "",
        },
        payment_id: session.payment_intent,
        products: lineItems.map((lineItem: any) => {
          // Find matching cart item for emoji attributes
          const cartItem = cartItems.find(
            (item: any) => item.id === lineItem.price.product || item.productId === lineItem.price.product,
          )

          const product: any = {
            product_id: lineItem.price.product,
            quantity: lineItem.quantity,
          }

          // Add emoji attributes if this is a customized emoji product
          if (cartItem?.customOptions?.tesla && cartItem?.customOptions?.elon) {
            const teslaEmojiName =
              cartItem.customOptions.tesla.name ||
              cartItem.customOptions.tesla.path?.split("/").pop()?.replace(".png", "") ||
              "unknown"

            const elonEmojiName =
              cartItem.customOptions.elon.name ||
              cartItem.customOptions.elon.path?.split("/").pop()?.replace(".png", "") ||
              "unknown"

            product.attributes = [
              { name: "emoji_good", value: teslaEmojiName },
              { name: "emoji_bad", value: elonEmojiName },
            ]
          }

          return product
        }),
        shipping: 0,
        tax: 0,
      }

      console.log("=== SENDING ORDER TO BACKEND ===")
      console.log("Order data:", JSON.stringify(orderData, null, 2))

      setOrderData(orderData)

      // Send order to Ed's backend via our API
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(`Backend error: ${errorData.error || "Unknown error"}`)
      }

      const result = await orderResponse.json()
      console.log("=== BACKEND RESPONSE ===")
      console.log("Result:", result)

      // Clear cart after successful order
      localStorage.removeItem("cart")

      setOrderStatus("success")
    } catch (error) {
      console.error("Order processing error:", error)
      setOrderStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }

  if (orderStatus === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Processing your order...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Order Error</CardTitle>
            <CardDescription>There was an issue processing your order</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mt-2">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </div>

        {orderData && (
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">
                      {orderData.customer.firstname} {orderData.customer.lastname}
                    </p>
                    <p className="text-gray-600">{orderData.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {orderData.customer.addr1}
                      {orderData.customer.addr2 && (
                        <>
                          <br />
                          {orderData.customer.addr2}
                        </>
                      )}
                      <br />
                      {orderData.customer.city}, {orderData.customer.state_prov} {orderData.customer.postal_code}
                      <br />
                      {orderData.customer.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Payment ID: <span className="font-mono">{orderData.payment_id}</span>
                </p>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.products.map((product, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Product ID: {product.product_id}</p>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                          {product.attributes && product.attributes.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Customizations:</p>
                              {product.attributes.map((attr, attrIndex) => (
                                <p key={attrIndex} className="text-sm text-gray-600 ml-2">
                                  {attr.name}: {attr.value}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-8">
          <Button asChild className="mr-4">
            <Link href="/account/orders">View Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
