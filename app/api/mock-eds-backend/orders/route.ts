import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json()

    console.log("🎯 Mock Ed's Backend - Received order data:")
    console.log(JSON.stringify(orderData, null, 2))

    // Check for emoji attributes
    if (orderData.products) {
      orderData.products.forEach((product: any, index: number) => {
        if (product.attributes) {
          console.log(`📦 Product ${index + 1} has attributes:`, product.attributes)
          product.attributes.forEach((attr: any) => {
            console.log(`   - ${attr.name}: ${attr.value}`)
          })
        }
      })
    }

    // Simulate Ed's backend response
    return NextResponse.json({
      success: true,
      message: "Order received by Ed's backend",
      order_id: `ed_${Date.now()}`,
      received_attributes: orderData.products?.map((p: any) => p.attributes).filter(Boolean) || [],
    })
  } catch (error) {
    console.error("❌ Mock Ed's Backend Error:", error)
    return NextResponse.json({ error: "Backend processing failed" }, { status: 500 })
  }
}
