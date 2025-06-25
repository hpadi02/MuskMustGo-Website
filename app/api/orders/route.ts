import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, address } = body

    if (!items || items.length === 0) {
      return new NextResponse("Items are required", { status: 400 })
    }

    if (!address) {
      return new NextResponse("Address is required", { status: 400 })
    }

    const orderId = uuidv4()

    // Process each item and include emoji attributes if present
    const processedItems = items.map((item) => {
      const processedItem = {
        product_id: item.product_id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }

      // Add emoji attributes for Tesla emoji products
      if (
        item.emojiChoices ||
        (item.customOptions && item.name?.toLowerCase().includes("tesla") && item.name?.toLowerCase().includes("emoji"))
      ) {
        processedItem.attributes = []

        if (item.emojiChoices) {
          if (item.emojiChoices.emoji_good) {
            processedItem.attributes.push({
              name: "emoji_good",
              value: item.emojiChoices.emoji_good.replace(".png", ""),
            })
          }
          if (item.emojiChoices.emoji_bad) {
            processedItem.attributes.push({
              name: "emoji_bad",
              value: item.emojiChoices.emoji_bad.replace(".png", ""),
            })
          }
        } else if (item.customOptions) {
          // Fallback to customOptions structure
          if (item.customOptions.tesla?.name || item.customOptions.good?.name) {
            processedItem.attributes.push({
              name: "emoji_good",
              value: (item.customOptions.tesla?.name || item.customOptions.good?.name).replace(".png", ""),
            })
          }
          if (item.customOptions.elon?.name || item.customOptions.bad?.name) {
            processedItem.attributes.push({
              name: "emoji_bad",
              value: (item.customOptions.elon?.name || item.customOptions.bad?.name).replace(".png", ""),
            })
          }
        }
      }

      return processedItem
    })

    console.log(`[Orders API]: Order ID=${orderId} created successfully`)

    return NextResponse.json({ orderId }, { headers: corsHeaders })
  } catch (error) {
    console.error("[Orders API]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
