import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== MOCK BACKEND: Received Order ===")

    const orderData = await request.json()

    // Log the complete order data structure
    console.log("Order Data Structure:")
    console.log(JSON.stringify(orderData, null, 2))

    // Validate the expected structure
    const validation = {
      hasCustomer: !!orderData.customer,
      hasPaymentId: !!orderData.payment_id,
      hasProducts: Array.isArray(orderData.products) && orderData.products.length > 0,
      hasShipping: typeof orderData.shipping === "number",
      hasTax: typeof orderData.tax === "number",
    }

    console.log("Validation Results:", validation)

    // Log individual components
    console.log("\n--- Customer Data ---")
    console.log(orderData.customer)

    console.log("\n--- Products ---")
    orderData.products?.forEach((product: any, index: number) => {
      console.log(`Product ${index + 1}:`, product)
    })

    console.log("\n--- Payment & Totals ---")
    console.log("Payment ID:", orderData.payment_id)
    console.log("Shipping:", orderData.shipping)
    console.log("Tax:", orderData.tax)

    // Simulate Ed's backend response
    const mockResponse = {
      success: true,
      order_id: `MMG-MOCK-${Date.now()}`,
      message: "Order received successfully (MOCK)",
      received_data: orderData,
      validation: validation,
    }

    console.log("\n--- Mock Backend Response ---")
    console.log(JSON.stringify(mockResponse, null, 2))

    // Simulate a slight delay like a real API
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockResponse, { status: 200 })
  } catch (error) {
    console.error("Mock Backend Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Mock backend processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
