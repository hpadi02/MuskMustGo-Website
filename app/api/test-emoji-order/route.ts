import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("=== TEST EMOJI ORDER RECEIVED ===")
    console.log("Full request body:", JSON.stringify(body, null, 2))

    // Check if any items have emoji attributes
    const itemsWithEmojis = body.items?.filter((item) => item.attributes && item.attributes.length > 0)

    if (itemsWithEmojis && itemsWithEmojis.length > 0) {
      console.log("=== EMOJI ATTRIBUTES FOUND ===")
      itemsWithEmojis.forEach((item, index) => {
        console.log(`Item ${index + 1}: ${item.name}`)
        item.attributes.forEach((attr) => {
          console.log(`  - ${attr.name}: ${attr.value}`)
        })
      })
    } else {
      console.log("No emoji attributes found in order")
    }

    return NextResponse.json({
      success: true,
      message: "Test order received successfully",
      itemsWithEmojis: itemsWithEmojis?.length || 0,
      emojiAttributes:
        itemsWithEmojis?.map((item) => ({
          productName: item.name,
          attributes: item.attributes,
        })) || [],
    })
  } catch (error) {
    console.error("Test emoji order error:", error)
    return NextResponse.json({ error: "Failed to process test order" }, { status: 500 })
  }
}
