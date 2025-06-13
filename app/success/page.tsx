import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import FallbackImage from "@/components/fallback-image"
import Link from "next/link"
import { redirect } from "next/navigation"

// Server action to process the order
async function processStripeOrder(sessionId: string) {
  "use server"

  try {
    console.log("=== SERVER-SIDE ORDER PROCESSING ===")
    console.log("Processing session ID:", sessionId)

    // Step 1: Fetch session details from Stripe
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.price.product"],
    })

    console.log("Stripe session retrieved:", {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
    })

    // Step 2: Transform Stripe data to Ed's backend format
    const orderData = {
      customer: {
        email: session.customer_details?.email || "customer@example.com",
        firstname: session.customer_details?.name?.split(" ")[0] || "Customer",
        lastname: session.customer_details?.name?.split(" ").slice(1).join(" ") || "User",
        addr1: session.customer_details?.address?.line1 || "",
        addr2: session.customer_details?.address?.line2 || "",
        city: session.customer_details?.address?.city || "",
        state_prov: session.customer_details?.address?.state || "",
        postal_code: session.customer_details?.address?.postal_code || "",
        country: session.customer_details?.address?.country || "US",
      },
      payment_id: sessionId,
      products: session.line_items.data.map((item: any) => ({
        product_id: item.price.product.id,
        quantity: item.quantity,
        // Handle custom attributes if they exist in metadata
        attributes: item.price.product.metadata
          ? Object.entries(item.price.product.metadata).map(([name, value]) => ({
              name,
              value: String(value),
            }))
          : undefined,
      })),
      shipping: (session.shipping_cost?.amount_total || 0) / 100,
      tax: (session.total_details?.amount_tax || 0) / 100,
    }

    console.log("Order data formatted for Ed's backend:", JSON.stringify(orderData, null, 2))

    // Step 3: POST to Ed's backend - UPDATED to use localhost as default
    const backendUrl = process.env.API_BASE_URL || "http://localhost:5000"
    console.log("Posting to Ed's backend at:", `${backendUrl}/orders`)

    const backendResponse = await fetch(`${backendUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const responseText = await backendResponse.text()
    console.log("Backend response status:", backendResponse.status)
    console.log("Backend response body:", responseText)

    if (!backendResponse.ok) {
      throw new Error(`Backend API error: ${backendResponse.status} - ${responseText}`)
    }

    let backendResult
    try {
      backendResult = JSON.parse(responseText)
    } catch {
      backendResult = { message: responseText }
    }

    // Step 4: Return processed order data for display
    return {
      success: true,
      order: {
        id: backendResult.order_id || `MMG-${Date.now()}`,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: "Processing",
        total: session.amount_total / 100,
        items: session.line_items.data.map((item: any) => ({
          id: item.price.product.id,
          name: item.price.product.name,
          price: item.price.unit_amount / 100,
          quantity: item.quantity,
          image: item.price.product.images?.[0] || "/placeholder.svg",
        })),
        shipping: (session.shipping_cost?.amount_total || 0) / 100,
        customer: session.customer_details,
      },
      backend_response: backendResult,
    }
  } catch (error) {
    console.error("Error processing order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Success page component
async function SuccessPageContent({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect("/shop/all")
  }

  // Process the order on the server
  const result = await processStripeOrder(sessionId)

  if (!result.success) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-4xl">!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Order Processing Error</h1>
          <p className="text-xl text-white/80 mb-8">
            There was an issue processing your order. Your payment was successful. Please contact support.
          </p>
          <p className="text-sm text-white/60 mb-8">Error: {result.error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg w-full sm:w-auto">
                Contact Support
              </Button>
            </Link>
            <Link href="/shop/all">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { order } = result

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />

        <h1 className="text-4xl md:text-5xl font-bold mb-6">Order Confirmed!</h1>

        <p className="text-xl text-white/80 mb-8">
          Thank you for your purchase. We've received your order and sent it to our fulfillment team.
        </p>

        <div className="bg-dark-300 p-6 rounded-lg mb-8">
          <p className="text-white/60 mb-2">Order Reference</p>
          <p className="text-2xl font-medium">{order.id}</p>
          <p className="text-white/60 mt-4">Order Date: {order.date}</p>
        </div>

        <div className="bg-dark-300 rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-dark-200">
            <h2 className="text-xl font-medium mb-4 text-left">Order Summary</h2>

            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 bg-dark-400 flex-shrink-0">
                      <FallbackImage src={item.image} alt={item.name} fill useRedFallback={true} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
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
          A confirmation email has been sent to {order.customer?.email}. Your payment has been processed successfully.
        </p>

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

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <Suspense
      fallback={
        <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Processing Your Order...</h1>
            <p className="text-xl text-white/80 mb-8">Please wait while we confirm your payment and save your order.</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent searchParams={searchParams} />
    </Suspense>
  )
}
