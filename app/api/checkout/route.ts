import { type NextRequest, NextResponse } from "next/server"
// import { Resend } from "resend"

import { validateCartItems, formatLineItems } from "use-shopping-cart/utilities"

import { inventory } from "@/config/inventory"
import { stripe } from "@/lib/stripe"

// const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const json = await req.json()
      const cartDetails = json.cartDetails
      // console.log("cartDetails", cartDetails)

      if (!cartDetails) {
        return new NextResponse(JSON.stringify({ message: "Cart details are missing." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }

      const lineItems = validateCartItems(inventory, cartDetails)
      const origin = req.headers.get("origin")
      if (!origin) {
        return new NextResponse(JSON.stringify({ message: "Missing origin" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }

      const session = await stripe.checkout.sessions.create({
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["US", "CA"],
        },
        line_items: formatLineItems(inventory, lineItems),
        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
        metadata: {
          cart: JSON.stringify(cartDetails),
        },
      })

      // Prepare session metadata for email
      const sessionMetadata: { [key: string]: any } = {}
      let index = 0
      for (const itemId in cartDetails) {
        const item = cartDetails[itemId]
        sessionMetadata[`item_${index}_name`] = item.name
        sessionMetadata[`item_${index}_quantity`] = item.quantity
        sessionMetadata[`item_${index}_price`] = item.price

        // For Tesla vs Elon emoji products, store the emoji choices with number prefixes
        if (item.customOptions.teslaEmoji) {
          // Extract filename with number prefix from path
          const teslaEmojiValue = item.customOptions.teslaEmoji.path
            ? item.customOptions.teslaEmoji.path.split("/").pop()?.replace(".png", "")
            : item.customOptions.teslaEmoji.name
          sessionMetadata[`item_${index}_emoji_good`] = teslaEmojiValue
          console.log(`✅ Added Tesla emoji: ${teslaEmojiValue}`)
        }
        if (item.customOptions.elonEmoji) {
          // Extract filename with number prefix from path
          const elonEmojiValue = item.customOptions.elonEmoji.path
            ? item.customOptions.elonEmoji.path.split("/").pop()?.replace(".png", "")
            : item.customOptions.elonEmoji.name
          sessionMetadata[`item_${index}_emoji_bad`] = elonEmojiValue
          console.log(`✅ Added Elon emoji: ${elonEmojiValue}`)
        }

        index++
      }

      await stripe.checkout.sessions.update(session.id, {
        metadata: sessionMetadata,
      })

      return NextResponse.json({ sessionId: session.id }, { status: 200 })
    } catch (error: any) {
      console.log("Error", error)
      return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 })
    }
  } else {
    return new NextResponse("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    })
  }
}
