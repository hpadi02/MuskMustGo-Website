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
    console.log("🎉 === SUCCESS PAGE STARTED ===")
    console.log("⏰ Timestamp:", new Date().toISOString())
    console.log("🔑 Session ID received:", sessionId)

    // Retrieve the Stripe session with payment intent
    console.log("💳 Retrieving Stripe session...")
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    })

    if (!session) {
      console.error("❌ No session found for ID:", sessionId)
      redirect("/cart")
    }

    console.log("✅ Stripe session retrieved successfully")
    console.log("📋 Session details:")
    console.log("  - Session ID:", session.id)
    console.log("  - Payment status:", session.payment_status)
    console.log("  - Amount total:", session.amount_total)
    console.log("  - Currency:", session.currency)
    console.log("  - Customer email:", session.customer_details?.email)
    console.log("  - Customer name:", session.customer_details?.name)

    // Get the payment intent ID (this is what Ed needs)
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || session.id

    console.log("💰 === PAYMENT PROCESSING ===")
    console.log("💰 Session ID:", session.id)
    console.log("💰 Payment Intent ID:", paymentIntentId)
    console.log("💰 Session metadata:", JSON.stringify(session.metadata, null, 2))

    // Log line items details
    console.log("📦 === ORDER ITEMS ===")
    session.line_items?.data.forEach((item, index) => {
      console.log(`📦 Item ${index + 1}:`)
      console.log(`  - Description: ${item.description}`)
      console.log(`  - Quantity: ${item.quantity}`)
      console.log(`  - Amount: ${item.amount_total}`)
      console.log(`  - Price ID: ${item.price?.id}`)
      console.log(
        `  - Product ID: ${typeof item.price?.product === "string" ? item.price.product : item.price?.product?.id}`,
      )
    })

    // Process the order - send to backend
    try {
      console.log("🏗️ === BUILDING ORDER DATA ===")
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
        payment_id: paymentIntentId, // ✅ Correct Payment Intent ID
        products:
          session.line_items?.data.map((item, itemIndex) => {
            const product_id =
              typeof item.price?.product === "string" ? item.price.product : item.price?.product?.id || ""

            console.log(`🎭 Processing product ${itemIndex + 1}: ${product_id}`)

            // Check if this is a Tesla vs Elon emoji product and has emoji choices
            const isEmojiProduct = item.description?.includes("emoji") || product_id.includes("tesla_vs_elon_emoji")

            if (isEmojiProduct) {
              console.log("🎭 Detected emoji product, checking for emoji choices...")

              // Try multiple metadata keys for emoji choices
              const possibleKeys = [
                "emoji_choices",
                `item_${itemIndex}_emoji_choices`,
                `item_${itemIndex}_custom_options`,
              ]

              let emojiChoices = null
              for (const key of possibleKeys) {
                if (session.metadata?.[key]) {
                  console.log(`🎭 Found emoji data in metadata key: ${key}`)
                  console.log(`🎭 Raw emoji data: ${session.metadata[key]}`)
                  try {
                    emojiChoices = JSON.parse(session.metadata[key])
                    console.log("🎭 Parsed emoji choices:", JSON.stringify(emojiChoices, null, 2))
                    break
                  } catch (parseError) {
                    console.error(`❌ Failed to parse emoji data from ${key}:`, parseError)
                  }
                }
              }

              if (emojiChoices) {
                // Extract emoji names (remove .png extension)
                const teslaEmoji = emojiChoices.tesla?.name?.replace(".png", "") || ""
                const elonEmoji = emojiChoices.elon?.name?.replace(".png", "") || ""

                console.log("🎭 Tesla emoji:", teslaEmoji)
                console.log("🎭 Elon emoji:", elonEmoji)

                return {
                  product_id,
                  quantity: item.quantity || 1,
                  attributes: [
                    { name: "emoji_good", value: teslaEmoji },
                    { name: "emoji_bad", value: elonEmoji },
                  ],
                }
              } else {
                console.log("⚠️ Emoji product but no emoji choices found in metadata")
                // Fallback to generic attributes if parsing fails
                return {
                  product_id,
                  quantity: item.quantity || 1,
                  attributes: [
                    { name: "Type", value: "Custom Emoji" },
                    { name: "Source", value: "Stripe Checkout" },
                  ],
                }
              }
            }

            // For non-emoji products, return without attributes
            console.log("📦 Regular product (no emoji customization)")
            return {
              product_id,
              quantity: item.quantity || 1,
            }
          }) || [],
        shipping: 0,
        tax: 0,
      }

      console.log("📤 === SENDING ORDER TO ED'S BACKEND ===")
      console.log("📤 Order data:", JSON.stringify(orderData, null, 2))

      // ✅ URL determination with extensive debugging
      console.log("🌐 === DETERMINING API URL ===")
      let baseUrl: string

      // Log environment variables
      console.log("🔧 Environment check:")
      console.log("  - NODE_ENV:", process.env.NODE_ENV)
      console.log("  - VERCEL_URL:", process.env.VERCEL_URL)
      console.log("  - PUBLIC_URL:", process.env.PUBLIC_URL)

      if (process.env.PUBLIC_URL) {
        baseUrl = process.env.PUBLIC_URL
        console.log("✅ Using PUBLIC_URL:", baseUrl)
      } else if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
        console.log("✅ Using Vercel URL:", baseUrl)
      } else if (process.env.NODE_ENV === "production") {
        baseUrl = "https://elonmustgo.com" // ✅ Production URL
        console.log("✅ Using production URL:", baseUrl)
      } else {
        baseUrl = "http://localhost:3000" // ✅ Development URL
        console.log("✅ Using development URL:", baseUrl)
      }

      const apiUrl = `${baseUrl}/api/orders` // ✅ Calls your Next.js API route
      console.log("🎯 Final API URL:", apiUrl)

      // Send to Ed's backend via your API route
      console.log("📡 Making API call to backend...")
      const backendResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      console.log("📡 Backend response status:", backendResponse.status)
      console.log("📡 Backend response headers:", Object.fromEntries(backendResponse.headers.entries()))

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text()
        console.error("❌ Failed to send order to backend:")
        console.error("❌ Status:", backendResponse.status)
        console.error("❌ Error text:", errorText)
      } else {
        const result = await backendResponse.json()
        console.log("✅ Order successfully sent to Ed's backend:")
        console.log("✅ Backend response:", JSON.stringify(result, null, 2))
      }
    } catch (error) {
      console.error("💥 === ORDER PROCESSING ERROR ===")
      console.error("💥 Error:", error)
      if (error instanceof Error) {
        console.error("💥 Error message:", error.message)
        console.error("💥 Error stack:", error.stack)
      }
    }

    console.log("🎉 === SUCCESS PAGE RENDERING ===")
    console.log("🎉 Rendering success page for user")

    return (
      <div className="bg-black text-white min-h-screen">
        {/* Clear cart when success page loads */}
        <CartClearer />

        {/* Navbar */}
        <nav className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-red-500">Musk</span>
                <span className="text-white">MustGo</span>
              </Link>

              <div className="flex items-center space-x-8">
                <Link href="/shop" className="text-white hover:text-red-500 transition-colors">
                  SHOP
                </Link>
                <div className="relative">
                  <Link href="/community" className="text-white hover:text-red-500 transition-colors">
                    COMMUNITY
                  </Link>
                </div>
                <Link href="/about" className="text-white hover:text-red-500 transition-colors">
                  ABOUT
                </Link>
                <Link href="/contact" className="text-white hover:text-red-500 transition-colors">
                  CONTACT
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Order Confirmed!</h1>
              <p className="text-white/70 text-lg">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg mb-8">
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
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
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
    console.error("💥 === SUCCESS PAGE ERROR ===")
    console.error("💥 Error retrieving session:", error)
    if (error instanceof Error) {
      console.error("💥 Error message:", error.message)
      console.error("💥 Error stack:", error.stack)
    }
    console.error("💥 Redirecting to cart...")
    redirect("/cart")
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id

  console.log("🚀 === SUCCESS PAGE ENTRY ===")
  console.log("🚀 Session ID from URL:", sessionId)

  if (!sessionId) {
    console.error("❌ No session_id in URL parameters")
    redirect("/cart")
  }

  return (
    <Suspense
      fallback={
        <div className="bg-black text-white min-h-screen pt-32 pb-20">
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
