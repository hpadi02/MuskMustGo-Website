import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    console.log("=== FORWARDING ORDER TO ED'S BACKEND ===")
    console.log("Order data:", JSON.stringify(orderData, null, 2))

    // FIXED: Use Ed's exact backend URL
    const backendUrl = "http://localhost/orders" // No /api/, just /orders
    console.log("Calling Ed's backend at:", backendUrl)

    // Forward the order to Ed's backend
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add API key if Ed requires it
        ...(process.env.BACKEND_API_KEY && {
          Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
        }),
      },
      body: JSON.stringify(orderData),
    })

    console.log("Ed's backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Ed's backend error:", errorText)
      return NextResponse.json({ error: "Failed to process order", details: errorText }, { status: response.status })
    }

    const result = await response.json()
    console.log("Ed's backend success:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Order processing error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Orders API is running",
    timestamp: new Date().toISOString(),
    backendUrl: "http://localhost/orders",
  })
}
