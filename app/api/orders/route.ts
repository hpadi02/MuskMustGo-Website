import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const orderData = await req.json()

    console.log("Received order data:", orderData)

    // Validate required fields
    if (!orderData.payment_id || !orderData.total_amount || !orderData.items) {
      return NextResponse.json(
        { error: "Missing required fields: payment_id, total_amount, or items" },
        { status: 400 },
      )
    }

    // Here you would integrate with Ed's backend API
    // Example: POST to Ed's backend service
    const backendUrl = process.env.API_BASE_URL || "http://localhost:8000"

    try {
      const backendResponse = await fetch(`${backendUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers Ed's backend requires
          // 'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        },
        body: JSON.stringify({
          payment_id: orderData.payment_id,
          customer_email: orderData.customer_email,
          total_amount: orderData.total_amount, // in cents
          items: orderData.items,
          shipping_address: orderData.shipping_address,
          created_at: orderData.created_at,
          // Add any additional fields Ed's backend expects
          source: "nextjs-frontend",
          status: "pending",
        }),
      })

      if (!backendResponse.ok) {
        throw new Error(`Backend API error: ${backendResponse.status}`)
      }

      const backendResult = await backendResponse.json()

      return NextResponse.json({
        success: true,
        message: "Order saved successfully",
        order_id: backendResult.order_id || backendResult.id,
        backend_response: backendResult,
      })
    } catch (backendError) {
      console.error("Backend API error:", backendError)

      // Fallback: save locally or queue for retry
      // You could implement a retry mechanism here

      return NextResponse.json(
        {
          success: false,
          error: "Failed to save order to backend",
          details: backendError instanceof Error ? backendError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Order processing error:", error)
    return NextResponse.json(
      {
        error: "Failed to process order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}
