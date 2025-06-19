import { Suspense } from "react"
import { redirect } from "next/navigation"
import { stripe } from "@/lib/stripe"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { CartClearer } from "@/components/cart-clearer"

interface SuccessPageProps {
  searchParams: {
    session_id?: string
  }
}

async function SuccessContent({ sessionId }: { sessionId: string }) {
  try {
    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    if (!session) {
      redirect("/cart")
    }

    // Process the order - send to backend
    try {
      const orderData = {
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
        payment_id: session.id,
        products:
          session.line_items?.data.map((item) => ({
            product_id: typeof item.price?.product === "string" ? item.price.product : item.price?.product?.id || "",
            quantity: item.quantity || 1,
            // Only add attributes for custom emoji products
            ...(item.description?.includes("emoji") && {
              attributes: [
                { name: "Type", value: "Custom Emoji" },
                { name: "Source", value: "Stripe Checkout" },
              ],
            }),
          })) || [],
        shipping: 0,
        tax: 0,
      }

      console.log("=== PROCESSING ORDER ON SUCCESS PAGE ===")
      console.log("Order data:", JSON.stringify(orderData, null, 2))

      // FIXED: Use full URL for server-side fetch
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NODE_ENV === "production"
          ? "https://elonmustgo.com"
          : "http://localhost:3000"

      const apiUrl = `${baseUrl}/api/orders`
      console.log("Calling API at:", apiUrl)

      // Send to backend
      const backendResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!backendResponse.ok) {
        console.error("Failed to send order to backend:", await backendResponse.text())
      } else {
        const result = await backendResponse.json()
        console.log("Order successfully sent to backend:", result)
      }
    } catch (error) {
      console.error("Error processing order:", error)
    }

    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        {/* Clear cart when success page loads */}
        <CartClearer />

        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Order Confirmed!</h1>
              <p className="text-white/70 text-lg">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
            </div>

            <div className="bg-dark-300 p-8 rounded-lg mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Order Details</h2>
                <Package className="h-6 w-6 text-white/60" />
              </div>

              <div className="space-y-4 text-left">
                <div className="flex justify-between">
                  <span className="text-white/70">Order ID:</span>
                  <span className="font-mono text-sm">{session.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Email:</span>
                  <span>{session.customer_details?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total:</span>
                  <span className="font-medium">${((session.amount_total || 0) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/70">
                You'll receive an email confirmation shortly with your order details and tracking information.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/account/orders">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    View Orders
                  </Button>
                </Link>
                <Link href="/shop/all">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error retrieving session:", error)
    redirect("/cart")
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect("/cart")
  }

  return (
    <Suspense
      fallback={
        <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6 md:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white/70">Processing your order...</p>
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent sessionId={sessionId} />
    </Suspense>
  )
}
