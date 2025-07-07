import { NextResponse } from "next/server"

export async function GET() {
  console.log("🧪 === EMOJI FLOW TEST ENDPOINT ===")

  // Check environment variables
  const envStatus = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
    STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
    API_BASE_URL: process.env.API_BASE_URL || "❌ Not set",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "❌ Not set",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Not set (optional for testing)",
    NODE_ENV: process.env.NODE_ENV || "development",
    VERCEL: process.env.VERCEL ? "✅ Running on Vercel" : "❌ Not on Vercel",
  }

  console.log("🔧 Environment check:", envStatus)

  // Test data structure that would come from emoji customization
  const testEmojiData = {
    items: [
      {
        id: "tesla-vs-elon-emoji",
        productId: "tesla-vs-elon-emoji",
        price: "price_test_example",
        quantity: 1,
        customOptions: {
          teslaEmoji: {
            name: "happy_face_heart_eyes",
            path: "/emojis/positives/03_happy_face_heart_eyes.png",
          },
          elonEmoji: {
            name: "angry_smiley_face",
            path: "/emojis/negatives/04_angry_smiley_face.png",
          },
        },
      },
    ],
  }

  // Simulate what would be stored in Stripe metadata
  const expectedMetadata = {
    item_0_emoji_good: "happy_face_heart_eyes",
    item_0_emoji_bad: "angry_smiley_face",
    item_0_product_id: "tesla-vs-elon-emoji",
  }

  // Expected final order data structure
  const expectedOrderData = {
    customer: {
      email: "test@example.com",
      firstname: "Test",
      lastname: "User",
    },
    payment_id: "pi_test_example",
    products: [
      {
        product_id: "prod_test_example",
        quantity: 1,
        attributes: [
          { name: "emoji_good", value: "happy_face_heart_eyes" },
          { name: "emoji_bad", value: "angry_smiley_face" },
        ],
      },
    ],
    shipping: 0,
    tax: 0,
  }

  return NextResponse.json({
    message: "Emoji Flow Environment Check",
    environment: envStatus,
    timestamp: new Date().toISOString(),
    testFlow: {
      step1: "User customizes emoji product",
      step2: "Frontend sends testEmojiData to /api/checkout",
      step3: "Checkout API stores emoji choices in Stripe metadata",
      step4: "User completes payment with Stripe",
      step5: "Webhook receives session with metadata",
      step6: "Webhook converts metadata to product attributes",
      step7: "Order data sent to backend with emoji attributes",
    },
    testData: {
      inputFromFrontend: testEmojiData,
      stripeMetadata: expectedMetadata,
      finalOrderData: expectedOrderData,
    },
    nextSteps: [
      "1. Go to /product/customize-emoji/tesla-vs-elon",
      "2. Select Tesla and Elon emojis",
      "3. Add to cart and checkout",
      "4. Use test card: 4242424242424242",
      "5. Check Vercel function logs for emoji attributes",
    ],
  })
}
