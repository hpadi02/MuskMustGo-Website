import { NextResponse } from "next/server"

export async function GET() {
  // This shows exactly what would be sent to your backend for a Tesla emoji product
  const sampleEmojiOrderData = {
    customer_email: "customer@example.com",
    items: [
      {
        product_id: "tesla_vs_elon_emoji_magnet", // Your Stripe product ID
        name: "Tesla vs Elon Emoji (magnet)",
        price: 12.99,
        quantity: 1,
        attributes: [
          {
            name: "emoji_good", // Tesla emoji (positive)
            value: "01_love_stickers", // Without .png extension as requested
          },
          {
            name: "emoji_bad", // Elon emoji (negative)
            value: "03_vomit_face", // Without .png extension as requested
          },
        ],
      },
    ],
    total_amount: 12.99,
    payment_status: "completed",
    stripe_session_id: "cs_test_123456789",
  }

  // This shows the mail server configuration
  const mailServerConfig = {
    host: "mail.leafe.com",
    port: 587, // Primary port
    fallbackPort: 25,
    secure: false,
    auth: false, // No username/password needed
    destination: "support@muskmustgo.com",
    replyTo: "user_email_from_form",
    logging: "All submissions logged to console as backup",
  }

  return NextResponse.json({
    mailServerFlow: {
      description: "Contact form emails sent via your mail server",
      config: mailServerConfig,
      process: [
        "1. User submits contact form",
        "2. Server connects to mail.leafe.com:587",
        "3. Sends email to support@muskmustgo.com",
        "4. User's email set as reply-to",
        "5. All details logged to console as backup",
        "6. If port 587 fails, retry with port 25",
      ],
    },
    teslaEmojiBackendData: {
      description: "Data sent to your backend for Tesla emoji products",
      sampleData: sampleEmojiOrderData,
      emojiAttributeFormat: {
        emoji_good: "Selected positive emoji filename without .png (e.g., '01_love_stickers')",
        emoji_bad: "Selected negative emoji filename without .png (e.g., '03_vomit_face')",
      },
      process: [
        "1. User customizes emojis on product page",
        "2. Emoji choices stored in cart with customOptions",
        "3. After Stripe checkout success, sendOrderToBackend() called",
        "4. POST to /api/orders with attributes array",
        "5. Your backend receives emoji choices as name/value pairs",
      ],
    },
  })
}
