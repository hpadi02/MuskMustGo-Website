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
    // Retrieve the Stripe session with payment intent
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    })

    if (!session) {
      redirect("/cart")
    }

    // Get the payment intent ID
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || session.id

    console.log("=== PAYMENT PROCESSING ===")
    console.log("Session ID:", session.id)
    console.log("Payment Intent ID:", paymentIntentId)

    // Build order data from Stripe session line items
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
      payment_id: paymentIntentId,
      products:
        session.line_items?.data.map((item: any) => {
          const product: any = {
            product_id: typeof item.price.product === "string" ? item.price.product : item.price.product.id,
            quantity: item.quantity || 1,
          }

          // For emoji products, we'll need to get the attributes from metadata
          // Stripe should have stored the emoji choices in the line item metadata
          if (item.price.product.metadata) {
            const metadata = typeof item.price.product === "string" ? {} : item.price.product.metadata

            if (metadata.emoji_good || metadata.emoji_bad) {
              product.attributes = []

              if (metadata.emoji_good) {
                product.attributes.push({
                  name: "emoji_good",
                  value: metadata.emoji_good,
                })
              }

              if (metadata.emoji_bad) {
                product.attributes.push({
                  name: "emoji_bad",
                  value: metadata.emoji_bad,
                })
              }

              console.log(`✅ Added emoji attributes for product ${product.product_id}:`, product.attributes)
            }
          }

          return product
        }) || [],
      shipping: 0,
      tax: 0,
    }

    console.log("=== SENDING ORDER TO ED'S BACKEND ===")
    console.log("Order data:", JSON.stringify(orderData, null, 2))

    // Send to Ed's backend via the API route
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000"}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to send order to backend:", errorText)
      } else {
        const result = await response.json()
        console.log("✅ Order successfully sent to Ed's backend:", result)
      }
    } catch (error) {
      console.error("❌ Error processing order:", error)
    }

    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
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
