import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    console.log("=== FORWARDING ORDER TO ED'S BACKEND ===")
    console.log("Order data:", JSON.stringify(orderData, null, 2))

    // Get the API base URL from environment
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost"
    console.log("API Base URL:", apiBaseUrl)

    // Forward the order to Ed's backend
    const response = await fetch(`${apiBaseUrl}/orders`, {
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

    console.log("Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      return NextResponse.json({ error: "Failed to process order", details: errorText }, { status: response.status })
    }

    const result = await response.json()
    console.log("Backend success:", result)

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
  })
}
