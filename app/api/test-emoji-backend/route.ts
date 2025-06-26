import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json()

    console.log("=== TEST BACKEND RECEIVED ORDER ===")
    console.log(JSON.stringify(orderData, null, 2))

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check for emoji attributes
    const hasEmojiAttributes = orderData.products?.some(
      (product: any) => product.attributes && product.attributes.length > 0,
    )

    return NextResponse.json({
      success: true,
      message: "Order received successfully",
      hasEmojiAttributes,
      receivedAt: new Date().toISOString(),
      orderData,
    })
  } catch (error) {
    console.error("Test backend error:", error)
    return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 })
  }
}
