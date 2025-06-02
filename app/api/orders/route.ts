import { NextResponse } from "next/server"

// Types based on Ed's OpenAPI spec
interface Emoji {
  name: string
  value: string
}

interface OrderProduct {
  product_id: string
  quantity: number
  attributes?: Emoji[]
}

interface OrderCustomer {
  customer_id?: string
  email: string
  firstname: string
  lastname: string
  addr1?: string
  addr2?: string
  city?: string
  state_prov?: string
  postal_code?: string
  country?: string
}

interface OrderCreate {
  customer: OrderCustomer
  payment_id: string
  products: OrderProduct[]
  shipping: number
  tax: number
}

export async function POST(req: Request) {
  try {
    const orderData = await req.json()

    console.log("Received order data:", orderData)

    // Validate required fields
    if (!orderData.payment_id || !orderData.customer || !orderData.items) {
      return NextResponse.json({ error: "Missing required fields: payment_id, customer, or items" }, { status: 400 })
    }

    // Transform our frontend data to match Ed's API schema
    const edOrderData: OrderCreate = {
      customer: {
        email: orderData.customer.email || "customer@example.com",
        firstname: orderData.customer.firstname || "Customer",
        lastname: orderData.customer.lastname || "User",
        addr1: orderData.customer.addr1 || orderData.shipping_address?.line1 || "",
        addr2: orderData.customer.addr2 || orderData.shipping_address?.line2 || "",
        city: orderData.customer.city || orderData.shipping_address?.city || "",
        state_prov: orderData.customer.state_prov || orderData.shipping_address?.state || "",
        postal_code: orderData.customer.postal_code || orderData.shipping_address?.postal_code || "",
        country: orderData.customer.country || orderData.shipping_address?.country || "US",
      },
      payment_id: orderData.payment_id,
      products: orderData.items.map((item: any) => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity || 1,
        // Transform customOptions to attributes (Emoji array)
        attributes: item.customOptions
          ? Object.entries(item.customOptions).map(([name, value]) => ({
              name,
              value: String(value),
            }))
          : undefined,
      })),
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
    }

    console.log("Transformed data for Ed's API:", edOrderData)

    // POST to Ed's backend API
    const backendUrl = process.env.API_BASE_URL || "http://leafe.com:5000"

    try {
      const backendResponse = await fetch(`${backendUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if Ed's backend requires them
          // 'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        },
        body: JSON.stringify(edOrderData),
      })

      const responseText = await backendResponse.text()
      console.log("Backend response status:", backendResponse.status)
      console.log("Backend response body:", responseText)

      if (!backendResponse.ok) {
        throw new Error(`Backend API error: ${backendResponse.status} - ${responseText}`)
      }

      let backendResult
      try {
        backendResult = JSON.parse(responseText)
      } catch {
        backendResult = { message: responseText }
      }

      return NextResponse.json({
        success: true,
        message: "Order saved successfully to Ed's backend",
        order_id: backendResult.order_id || backendResult.id || `order_${Date.now()}`,
        backend_response: backendResult,
      })
    } catch (backendError) {
      console.error("Backend API error:", backendError)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to save order to Ed's backend",
          details: backendError instanceof Error ? backendError.message : "Unknown error",
          // Include the data we tried to send for debugging
          attempted_data: edOrderData,
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
    backend_url: process.env.API_BASE_URL || "http://leafe.com:5000",
  })
}
