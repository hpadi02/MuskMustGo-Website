"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Package, CreditCard, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CartClearer } from "@/components/cart-clearer"

interface OrderResponse {
  customer_id: string
  order_number: string
  product_cost: number
  total_cost: number
}

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

interface OrderProduct {
  product_id: string
  quantity: number
  attributes?: ProductAttribute[]
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderData, setOrderData] = useState<OrderResponse | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [products, setProducts] = useState<OrderProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to extract filename from emoji path
  const extractEmojiFilename = (path: string): string => {
    try {
      // Extract filename from path like "/emojis/positives/02_smile_sly.png"
      const filename = path.split("/").pop() || ""
      // Remove .png extension
      return filename.replace(".png", "")
    } catch (error) {
      console.error("❌ Error extracting emoji filename from path:", path, error)
      return "unknown_emoji"
    }
  }

  // Helper function to extract emoji metadata for a specific item
  const extractEmojiMetadata = (metadata: any, itemIndex: number): ProductAttribute[] => {
    const attributes: ProductAttribute[] = []

    try {
      const teslaEmojiKey = `item_${itemIndex}_tesla_emoji`
      const elonEmojiKey = `item_${itemIndex}_elon_emoji`

      console.log(`🎭 Looking for emoji metadata keys: ${teslaEmojiKey}, ${elonEmojiKey}`)
      console.log("🎭 Available metadata keys:", Object.keys(metadata))

      if (metadata[teslaEmojiKey] && metadata[elonEmojiKey]) {
        console.log(`✅ Found emoji metadata for item ${itemIndex}`)

        // Parse Tesla emoji
        const teslaEmojiData = JSON.parse(metadata[teslaEmojiKey])
        const teslaFilename = extractEmojiFilename(teslaEmojiData.path)
        attributes.push({
          name: "emoji_good",
          value: teslaFilename,
        })

        // Parse Elon emoji
        const elonEmojiData = JSON.parse(metadata[elonEmojiKey])
        const elonFilename = extractEmojiFilename(elonEmojiData.path)
        attributes.push({
          name: "emoji_bad",
          value: elonFilename,
        })

        console.log(`🎭 Extracted emoji attributes for item ${itemIndex}:`, attributes)
      } else {
        console.log(`📦 No emoji metadata found for item ${itemIndex}`)
      }
    } catch (error) {
      console.error(`❌ Error extracting emoji metadata for item ${itemIndex}:`, error)
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

        // Fetch session details from Stripe
        const response = await fetch(`/api/stripe/session/${sessionId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.status}`)
        }

        const session = await response.json()
        console.log("✅ Retrieved Stripe session:", session)
        console.log("🎭 Session metadata:", session.metadata)

        // Extract customer information
        const customerInfo: Customer = {
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

        console.log("👤 Extracted customer info:", customerInfo)
        setCustomer(customerInfo)

        // Extract products with emoji attributes
        const orderProducts: OrderProduct[] =
          session.line_items?.data.map((item: any, index: number) => {
            console.log(`📦 Processing line item ${index}:`, item)

            const baseProduct: OrderProduct = {
              product_id: item.price.product,
              quantity: item.quantity || 1,
            }

            // Check for emoji customizations
            const emojiAttributes = extractEmojiMetadata(session.metadata || {}, index)
            if (emojiAttributes.length > 0) {
              baseProduct.attributes = emojiAttributes
              console.log(`🎭 Added emoji attributes to product ${index}:`, baseProduct)
            }

            return baseProduct
          }) || []

        console.log("📦 Final products array:", orderProducts)
        setProducts(orderProducts)

        // Prepare order data for backend
        const orderData = {
          customer: customerInfo,
          products: orderProducts,
          payment_id: session.payment_intent,
          shipping: 0,
          tax: 0,
        }

        console.log("📤 Sending order to backend:", orderData)

        // Send to backend
        const backendResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (!backendResponse.ok) {
          const errorText = await backendResponse.text()
          throw new Error(`Backend error: ${backendResponse.status} - ${errorText}`)
        }

        const backendResult: OrderResponse = await backendResponse.json()
        console.log("✅ Backend response:", backendResult)

        setOrderData(backendResult)
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Order Processing Error</CardTitle>
          </CardHeader>
          <CardContent>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <CartClearer />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully processed.</p>
        </div>

        {/* Order Details */}
        {orderData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold text-lg">{orderData.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-mono text-sm">{orderData.customer_id}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Product Cost</p>
                  <p className="font-semibold">${orderData.product_cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="font-semibold text-lg">${orderData.total_cost.toFixed(2)}</p>
                </div>
                <div>
                  <Badge variant="secondary" className="w-fit">
                    <Clock className="h-3 w-3 mr-1" />
                    Processing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Information */}
        {customer && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">
                  {customer.firstname} {customer.lastname}
                </p>
                <p className="text-gray-600">{customer.email}</p>
                <div className="text-gray-600">
                  <p>{customer.addr1}</p>
                  {customer.addr2 && <p>{customer.addr2}</p>}
                  <p>
                    {customer.city}, {customer.state_prov} {customer.postal_code}
                  </p>
                  <p>{customer.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        {products.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Items Ordered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Product ID: {product.product_id}</p>
                        <p className="text-gray-600">Quantity: {product.quantity}</p>
                      </div>
                    </div>

                    {/* Show emoji customizations if present */}
                    {product.attributes && product.attributes.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">Custom Emoji Selection:</p>
                        <div className="space-y-1">
                          {product.attributes.map((attr, attrIndex) => (
                            <div key={attrIndex} className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {attr.name === "emoji_good" ? "🚗 Tesla" : "👤 Elon"}
                              </Badge>
                              <span className="text-sm font-mono">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-gray-600">• You'll receive a confirmation email shortly with your order details</p>
              <p className="text-gray-600">• Your order will be processed and shipped within 2-3 business days</p>
              <p className="text-gray-600">
                • You can track your order status using the order number: <strong>{orderData?.order_number}</strong>
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/shop/all">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
