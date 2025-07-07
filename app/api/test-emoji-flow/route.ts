import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Test emoji flow endpoint",
    instructions: [
      "1. Go to /product/customize-emoji/tesla-vs-elon",
      "2. Select Tesla emoji (positive)",
      "3. Select Elon emoji (negative)",
      "4. Add to cart",
      "5. Go to checkout",
      "6. Complete payment with test card: 4242424242424242",
      "7. Check webhook logs for emoji attributes",
      "8. Verify Ed's backend receives the attributes",
    ],
    expectedFlow: {
      checkout: "Emoji choices stored in Stripe metadata",
      webhook: "Metadata converted to product attributes",
      backend: "Receives order with emoji_good and emoji_bad attributes",
    },
  })
}
