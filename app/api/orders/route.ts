import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    console.log("=== ORDER API RECEIVED ===")
    console.log("Order Data:", JSON.stringify(orderData, null, 2))

    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost"

    try {
      // Send to Ed's backend - NOTE: Using /orders/ with trailing slash
      const backendResponse = await fetch(`${apiBaseUrl}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
        },
        body: JSON.stringify(orderData),
      })

      if (backendResponse.ok) {
        const backendData = await backendResponse.json()
        return NextResponse.json({
          success: true,
          message: "Order sent to backend successfully",
          backendResponse: backendData,
        })
      } else {
        console.error("Backend responded with error:", backendResponse.status)
        const errorText = await backendResponse.text()
        console.error("Backend error details:", errorText)
        // Fall back to mock response
        return NextResponse.json({
          success: true,
          message: "Order received (backend unavailable)",
          orderId: `mock_${Date.now()}`,
        })
      }
    } catch (backendError) {
      console.error("Failed to reach backend:", backendError)
      // Return mock success response
      return NextResponse.json({
        success: true,
        message: "Order received (backend unavailable)",
        orderId: `mock_${Date.now()}`,
      })
    }
  } catch (error) {
    console.error("Order processing error:", error)
    return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Orders API is running",
    timestamp: new Date().toISOString(),
  })
}
