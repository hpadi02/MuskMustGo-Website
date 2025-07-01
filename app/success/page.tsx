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
  // ✅ Add state variables for order processing
  let orderNumber: string | null = null
  let orderProcessingError: string | null = null
  let backendOrderData: any = null

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
        // ✅ IMPROVED: Process products with emoji attributes
        products:
          session.line_items?.data.map((item, itemIndex) => {
            const product_id =
              typeof item.price?.product === "string" ? item.price.product : item.price?.product?.id || ""

            console.log(`🎭 Processing product ${itemIndex + 1}: ${product_id}`)

            // Check if this is a Tesla vs Elon emoji product
            const isEmojiProduct =
              item.description?.toLowerCase().includes("emoji") ||
              product_id.includes("tesla_vs_elon_emoji") ||
              item.description?.toLowerCase().includes("tesla vs elon")

            if (isEmojiProduct) {
              console.log("🎭 Detected emoji product, extracting emoji choices...")

              try {
                // ✅ Extract emoji choices from session metadata using item index
                const teslaEmojiKey = `item_${itemIndex}_tesla_emoji`
                const elonEmojiKey = `item_${itemIndex}_elon_emoji`
                const variantKey = `item_${itemIndex}_variant`

                console.log(`🔍 Looking for metadata keys: ${teslaEmojiKey}, ${elonEmojiKey}, ${variantKey}`)

                let teslaEmoji = null
                let elonEmoji = null
                let variant = null

                // Extract Tesla emoji
                if (session.metadata?.[teslaEmojiKey]) {
                  console.log(`🎭 Found Tesla emoji data: ${session.metadata[teslaEmojiKey]}`)
                  try {
                    teslaEmoji = JSON.parse(session.metadata[teslaEmojiKey])
                    console.log("🎭 Parsed Tesla emoji:", teslaEmoji)
                  } catch (parseError) {
                    console.error(`❌ Failed to parse Tesla emoji data:`, parseError)
                  }
                }

                // Extract Elon emoji
                if (session.metadata?.[elonEmojiKey]) {
                  console.log(`🎭 Found Elon emoji data: ${session.metadata[elonEmojiKey]}`)
                  try {
                    elonEmoji = JSON.parse(session.metadata[elonEmojiKey])
                    console.log("🎭 Parsed Elon emoji:", elonEmoji)
                  } catch (parseError) {
                    console.error(`❌ Failed to parse Elon emoji data:`, parseError)
                  }
                }

                // Extract variant
                if (session.metadata?.[variantKey]) {
                  variant = session.metadata[variantKey]
                  console.log("🎭 Found variant:", variant)
                }

                // ✅ Format emoji names (extract filename without .png)
                let teslaEmojiName = ""
                let elonEmojiName = ""

                if (teslaEmoji?.path) {
                  // Extract filename from path: "/emojis/positives/02_smile_sly.png" -> "02_smile_sly"
                  const teslaFilename = teslaEmoji.path.split("/").pop() || ""
                  teslaEmojiName = teslaFilename.replace(".png", "")
                  console.log("🎭 Tesla emoji filename:", teslaEmojiName)
                }

                if (elonEmoji?.path) {
                  // Extract filename from path: "/emojis/negatives/02_gradient_angry.png" -> "02_gradient_angry"
                  const elonFilename = elonEmoji.path.split("/").pop() || ""
                  elonEmojiName = elonFilename.replace(".png", "")
                  console.log("🎭 Elon emoji filename:", elonEmojiName)
                }

                // ✅ Return product with attributes if we have emoji data
                if (teslaEmojiName && elonEmojiName) {
                  console.log(`✅ Creating emoji product with attributes:`, {
                    product_id,
                    quantity: item.quantity || 1,
                    attributes: [
                      { name: "emoji_good", value: teslaEmojiName },
                      { name: "emoji_bad", value: elonEmojiName },
                    ],
                  })

                  return {
                    product_id,
                    quantity: item.quantity || 1,
                    attributes: [
                      { name: "emoji_good", value: teslaEmojiName },
                      { name: "emoji_bad", value: elonEmojiName },
                    ],
                  }
                } else {
                  console.warn(
                    `⚠️ Emoji product but missing emoji data. Tesla: ${teslaEmojiName}, Elon: ${elonEmojiName}`,
                  )
                  // Fallback: return product without attributes but log the issue
                  return {
                    product_id,
                    quantity: item.quantity || 1,
                    attributes: [
                      { name: "Type", value: "Custom Emoji (Missing Data)" },
                      { name: "Source", value: "Stripe Checkout" },
                    ],
                  }
                }
              } catch (error) {
                console.error(`❌ Error processing emoji product ${itemIndex}:`, error)
                // Fallback: return basic product
                return {
                  product_id,
                  quantity: item.quantity || 1,
                  attributes: [
                    { name: "Type", value: "Custom Emoji (Error)" },
                    { name: "Error", value: error instanceof Error ? error.message : "Unknown error" },
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

      // ✅ IMPROVED: Handle backend response with order number
      if (!backendResponse.ok) {
        const errorText = await backendResponse.text()
        console.error("❌ Failed to send order to backend:")
        console.error("❌ Status:", backendResponse.status)
        console.error("❌ Error text:", errorText)

        // Store error for display
        orderProcessingError = `Backend error: ${backendResponse.status}`
      } else {
        const result = await backendResponse.json()
        console.log("✅ Order successfully sent to Ed's backend:")
        console.log("✅ Backend response:", JSON.stringify(result, null, 2))

        // ✅ Extract order number for display
        if (result.order_number) {
          orderNumber = result.order_number
          console.log("🎫 Order number received:", orderNumber)
        } else {
          console.warn("⚠️ No order_number in backend response")
        }

        // Store other response data
        backendOrderData = result
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
                {orderNumber && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Order Number:</span>
                    <span className="font-medium text-green-400">{orderNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/70">Email:</span>
                  <span>{session.customer_details?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total:</span>
                  <span className="font-medium">${((session.amount_total || 0) / 100).toFixed(2)}</span>
                </div>
                {orderProcessingError && (
                  <div className="flex justify-between">
                    <span className="text-red-400">Processing Status:</span>
                    <span className="text-red-400">Error: {orderProcessingError}</span>
                  </div>
                )}
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
