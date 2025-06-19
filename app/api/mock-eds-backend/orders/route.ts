import { type NextRequest, NextResponse } from "next/server"

// This simulates Ed's backend API for testing on Vercel
export async function POST(request: NextRequest) {
  try {
    console.log("=== MOCK ED'S BACKEND: Processing Order ===")

    const orderData = await request.json()

    // Log the complete request for debugging
    console.log("Received order data:", JSON.stringify(orderData, null, 2))

    // Simulate Ed's backend validation
    const requiredFields = {
      customer: {
        email: orderData.customer?.email,
        firstname: orderData.customer?.firstname,
        lastname: orderData.customer?.lastname,
        addr1: orderData.customer?.addr1,
        city: orderData.customer?.city,
        state_prov: orderData.customer?.state_prov,
        postal_code: orderData.customer?.postal_code,
        country: orderData.customer?.country,
      },
      payment_id: orderData.payment_id,
      products: orderData.products,
      shipping: orderData.shipping,
      tax: orderData.tax,
    }

    // Check for missing required fields
    const missingFields = []
    if (!requiredFields.customer.email) missingFields.push("customer.email")
    if (!requiredFields.customer.firstname) missingFields.push("customer.firstname")
    if (!requiredFields.payment_id) missingFields.push("payment_id")
    if (!Array.isArray(requiredFields.products) || requiredFields.products.length === 0) {
      missingFields.push("products")
    }

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields)
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missing_fields: missingFields,
        },
        { status: 400 },
      )
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a mock order ID like Ed's system would
    const orderId = `MMG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Simulate Ed's successful response
    const mockResponse = {
      success: true,
      order_id: orderId,
      message: "Order processed successfully",
      customer_email: orderData.customer.email,
      total_products: orderData.products.length,
      total_amount: orderData.products.reduce((sum: number, product: any) => sum + (product.quantity || 1), 0),
      shipping_cost: orderData.shipping,
      tax_amount: orderData.tax,
      payment_reference: orderData.payment_id,
      processing_time: new Date().toISOString(),
      // This is what Ed's backend might return
      backend_version: "mock-v1.0",
      environment: "vercel-test",
    }

    console.log("Sending mock response:", mockResponse)

    return NextResponse.json(mockResponse, { status: 200 })
  } catch (error) {
    console.error("Mock Ed's Backend Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Also handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: "Mock Ed's Backend API is running",
    endpoints: {
      orders: "POST /api/mock-eds-backend/orders",
    },
    status: "healthy",
    timestamp: new Date().toISOString(),
  })
}
