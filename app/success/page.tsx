"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, CreditCard, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Customer {
  firstname: string
  lastname: string
  email: string
  addr1: string
  addr2?: string
  city: string
  state_prov: string
  postal_code: string
  country: string
}

interface ProductAttribute {
  name: string
  value: string
}

interface Product {
  product_id: string
  quantity: number
  attributes?: ProductAttribute[]
}

interface OrderData {
  customer: Customer
  products: Product[]
  payment_id: string
  shipping: number
  tax: number
}

interface BackendResponse {
  customer_id: string
  order_number: string
  product_cost: number
  total_cost: number
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [backendResponse, setBackendResponse] = useState<BackendResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to extract filename from emoji path
  const extractEmojiFilename = (path: string): string => {
    try {
      const filename = path.split("/").pop() || ""
      return filename.replace(".png", "")
    } catch (error) {
      console.error("❌ Error extracting emoji filename:", error)
      return "unknown_emoji"
    }
  }

  // Helper function to extract emoji metadata from Stripe session
  const extractEmojiAttributes = (metadata: Record<string, string>, itemIndex: number): ProductAttribute[] => {
    const attributes: ProductAttribute[] = []

    try {
      const teslaEmojiKey = `item_${itemIndex}_tesla_emoji`
      const elonEmojiKey = `item_${itemIndex}_elon_emoji`

      console.log(`🔍 Looking for emoji metadata keys: ${teslaEmojiKey}, ${elonEmojiKey}`)

      if (metadata[teslaEmojiKey] && metadata[elonEmojiKey]) {
        const teslaEmoji = JSON.parse(metadata[teslaEmojiKey])
        const elonEmoji = JSON.parse(metadata[elonEmojiKey])

        console.log("📝 Parsed emoji data:", { teslaEmoji, elonEmoji })

        attributes.push({
          name: "emoji_good",
          value: extractEmojiFilename(teslaEmoji.path),
        })

        attributes.push({
          name: "emoji_bad",
          value: extractEmojiFilename(elonEmoji.path),
        })

        console.log("✅ Created emoji attributes:", attributes)
      } else {
        console.log(`ℹ️ No emoji metadata found for item ${itemIndex}`)
      }
    } catch (error) {
      console.error(`❌ Error extracting emoji attributes for item ${itemIndex}:`, error)
    }

    return attributes
  }

  useEffect(() => {
    const processOrder = async () => {
      if (!sessionId) {
        setError("No session ID found")
        setLoading(false)
        return
      }

      try {
        console.log("🔄 Processing order for session:", sessionId)

        // Retrieve Stripe session
        const response = await fetch(`/api/stripe/session/${sessionId}`)
        if (!response.ok) {
          throw new Error(`Failed to retrieve session: ${response.statusText}`)
        }

        const session = await response.json()
        console.log("📦 Retrieved Stripe session:", session)
        console.log("🔍 Session metadata:", session.metadata)

        // Extract customer info
        const customer: Customer = {
          firstname: session.customer_details?.name?.split(" ")[0] || "",
          lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
          email: session.customer_details?.email || "",
          addr1: session.customer_details?.address?.line1 || "",
          addr2: session.customer_details?.address?.line2 || "",
          city: session.customer_details?.address?.city || "",
          state_prov: session.customer_details?.address?.state || "",
          postal_code: session.customer_details?.address?.postal_code || "",
          country: session.customer_details?.address?.country || "US",
        }

        // Extract products with emoji attributes
        const products: Product[] =
          session.line_items?.data.map((item: any, index: number) => {
            const productId = item.price?.product || "unknown"
            const quantity = item.quantity || 1

            console.log(`🔍 Processing line item ${index}:`, { productId, quantity })

            // Extract emoji attributes if they exist
            const attributes = extractEmojiAttributes(session.metadata || {}, index)

            const product: Product = {
              product_id: productId,
              quantity: quantity,
            }

            // Only add attributes if they exist
            if (attributes.length > 0) {
              product.attributes = attributes
              console.log(`✅ Added attributes to product ${index}:`, attributes)
            }

            return product
          }) || []

        const orderData: OrderData = {
          customer,
          products,
          payment_id: session.payment_intent?.id || "",
          shipping: (session.shipping_cost?.amount_total || 0) / 100,
          tax: (session.total_details?.amount_tax || 0) / 100,
        }

        console.log("📤 Sending order data to backend:", JSON.stringify(orderData, null, 2))
        setOrderData(orderData)

        // Send to backend
        const backendResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (!backendResponse.ok) {
          throw new Error(`Backend error: ${backendResponse.statusText}`)
        }

        const backendResult: BackendResponse = await backendResponse.json()
        console.log("✅ Backend response:", backendResult)
        setBackendResponse(backendResult)
      } catch (error) {
        console.error("❌ Error processing order:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    processOrder()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Order Processing Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild>
              <Link href="/">Return Home</Link>
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
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully processed.</p>
        </div>

        {/* Order Number Display */}
        {backendResponse?.order_number && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Number</h2>
              <p className="text-2xl font-bold text-red-600">{backendResponse.order_number}</p>
              <p className="text-sm text-gray-600 mt-2">Save this number for your records</p>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <div className="space-y-6">
          {/* Customer Information */}
          {orderData && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">
                      {orderData.customer.firstname} {orderData.customer.lastname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{orderData.customer.email}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Shipping Address</span>
                </div>
                <div className="text-sm">
                  <p>{orderData.customer.addr1}</p>
                  {orderData.customer.addr2 && <p>{orderData.customer.addr2}</p>}
                  <p>
                    {orderData.customer.city}, {orderData.customer.state_prov} {orderData.customer.postal_code}
                  </p>
                  <p>{orderData.customer.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {orderData && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                </div>
                <div className="space-y-4">
                  {orderData.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">Product ID: {product.product_id}</p>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        {product.attributes && product.attributes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Customizations:</p>
                            <ul className="text-sm text-gray-800 ml-4">
                              {product.attributes.map((attr, attrIndex) => (
                                <li key={attrIndex}>
                                  {attr.name === "emoji_good" ? "🚗 Tesla Emoji" : "👤 Elon Emoji"}: {attr.value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          {orderData && backendResponse && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Cost:</span>
                    <span className="font-medium">${backendResponse.product_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">${orderData.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${orderData.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${backendResponse.total_cost.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">Payment ID: {orderData.payment_id}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            A confirmation email has been sent to your email address with your order details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/shop/all">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
