"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, User, MapPin } from "lucide-react"
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

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderData, setOrderData] = useState<OrderResponse | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
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
      return "default_emoji"
    }
  }

  useEffect(() => {
    const processOrder = async () => {
      if (!sessionId) {
        console.error("❌ No session ID found in URL")
        setError("No session ID found")
        setLoading(false)
        return
      }

      try {
        console.log("🔍 Processing order for session:", sessionId)

        // Fetch Stripe session details
        const response = await fetch(`/api/stripe/session/${sessionId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.statusText}`)
        }

        const session = await response.json()
        console.log("📋 Retrieved Stripe session:", JSON.stringify(session, null, 2))

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

        // ✅ Enhanced product processing with emoji attributes
        const products: OrderProduct[] = []

        if (session.line_items?.data) {
          session.line_items.data.forEach((item: any, index: number) => {
            console.log(`📦 Processing line item ${index}:`, item)

            const baseProduct: OrderProduct = {
              product_id: item.price?.product || "",
              quantity: item.quantity || 1,
            }

            // ✅ Check for emoji customization metadata
            const teslaEmojiKey = `item_${index}_tesla_emoji`
            const elonEmojiKey = `item_${index}_elon_emoji`

            if (session.metadata?.[teslaEmojiKey] && session.metadata?.[elonEmojiKey]) {
              console.log(`🎨 Found emoji metadata for item ${index}`)

              try {
                // Parse emoji data from metadata
                const teslaEmojiData = JSON.parse(session.metadata[teslaEmojiKey])
                const elonEmojiData = JSON.parse(session.metadata[elonEmojiKey])

                console.log("🎨 Parsed emoji data:", { teslaEmojiData, elonEmojiData })

                // Extract filenames (e.g., "02_smile_sly" from "/emojis/positives/02_smile_sly.png")
                const teslaEmojiFilename = extractEmojiFilename(teslaEmojiData.path)
                const elonEmojiFilename = extractEmojiFilename(elonEmojiData.path)

                console.log("📝 Extracted emoji filenames:", {
                  tesla: teslaEmojiFilename,
                  elon: elonEmojiFilename,
                })

                // ✅ Add attributes array as expected by backend
                baseProduct.attributes = [
                  { name: "emoji_good", value: teslaEmojiFilename },
                  { name: "emoji_bad", value: elonEmojiFilename },
                ]

                console.log(`✅ Added emoji attributes to product ${index}:`, baseProduct.attributes)
              } catch (parseError) {
                console.error(`❌ Error parsing emoji metadata for item ${index}:`, parseError)
                // Continue without attributes if parsing fails
              }
            } else {
              console.log(`ℹ️ No emoji customization found for item ${index}`)
            }

            products.push(baseProduct)
          })
        }

        console.log("📦 Final products array for backend:", JSON.stringify(products, null, 2))

        // Prepare order data for backend
        const orderPayload = {
          customer: customerInfo,
          products: products,
          payment_id: session.payment_intent || "",
          shipping: 0,
          tax: 0,
        }

        console.log("📤 Sending order to backend:", JSON.stringify(orderPayload, null, 2))

        // Send to backend
        const backendResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        })

        if (!backendResponse.ok) {
          const errorText = await backendResponse.text()
          throw new Error(`Backend error: ${backendResponse.status} - ${errorText}`)
        }

        const backendResult: OrderResponse = await backendResponse.json()
        console.log("✅ Backend response:", backendResult)

        // ✅ Set order data including order_number
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
      <div className="min-h-screen bg-dark-400 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-400 text-white flex items-center justify-center">
        <Card className="bg-dark-300 border-red-500 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Order Processing Error</h2>
            <p className="text-white/70 mb-4">{error}</p>
            <Link href="/shop/all">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-400 text-white">
      <CartClearer />
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-white/70 text-lg">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>

          {/* ✅ Order Number Display */}
          {orderData?.order_number && (
            <Card className="bg-dark-300 border-green-500 mb-8">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-bold mb-2 text-green-400">Order Number</h2>
                <p className="text-2xl font-mono font-bold text-white">{orderData.order_number}</p>
                <p className="text-white/60 text-sm mt-2">
                  Save this number for your records. A confirmation email has been sent to you.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Details */}
          <div className="space-y-6">
            {/* Customer Information */}
            {customer && (
              <Card className="bg-dark-300 border-dark-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                    <div>
                      <p>
                        <strong>Name:</strong> {customer.firstname} {customer.lastname}
                      </p>
                      <p>
                        <strong>Email:</strong> {customer.email}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-red-500 mr-1 mt-1 flex-shrink-0" />
                        <div>
                          <p>{customer.addr1}</p>
                          {customer.addr2 && <p>{customer.addr2}</p>}
                          <p>
                            {customer.city}, {customer.state_prov} {customer.postal_code}
                          </p>
                          <p>{customer.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            {orderData && (
              <Card className="bg-dark-300 border-dark-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Package className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                  </div>
                  <div className="space-y-2 text-white/80">
                    <div className="flex justify-between">
                      <span>Product Cost:</span>
                      <span>${orderData.product_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-dark-200 pt-2">
                      <span>Total:</span>
                      <span>${orderData.total_cost.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center">
            <Link href="/shop/all">
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-3">Continue Shopping</Button>
            </Link>
            <Link href="/account/orders">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
              >
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
