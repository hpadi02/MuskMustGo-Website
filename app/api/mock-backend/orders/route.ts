import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json()

    console.log("📦 Mock Backend - Received order:")
    console.log("Customer:", orderData.customer?.email)
    console.log("Products:", orderData.products?.length || 0)
    console.log("Payment ID:", orderData.payment_id)

    // Log any product attributes (including emoji attributes)
    if (orderData.products) {
      orderData.products.forEach((product: any, index: number) => {
        console.log(`Product ${index + 1}:`, product.product_id)
        if (product.attributes) {
          console.log(`  Attributes:`, product.attributes)
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      order_id: `mock_${Date.now()}`,
    })
  } catch (error) {
    console.error("Mock backend error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
