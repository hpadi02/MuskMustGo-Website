import { NextResponse } from "next/server"
import { getStripeProducts } from "@/lib/stripe-products"

export async function GET() {
  try {
    console.log("Testing Stripe connection...")

    // Check environment variables
    const secretKey = process.env.STRIPE_SECRET_KEY
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!secretKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "STRIPE_SECRET_KEY not found",
        },
        { status: 500 },
      )
    }

    if (!publishableKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found",
        },
        { status: 500 },
      )
    }

    console.log("Environment variables found, fetching products...")

    // Try to fetch products
    const products = await getStripeProducts()

    return NextResponse.json({
      status: "success",
      message: "Stripe connection successful",
      productCount: products.length,
      products: products.slice(0, 3), // Show first 3 products as sample
      keys: {
        secretKey: secretKey.substring(0, 20) + "...",
        publishableKey: publishableKey.substring(0, 20) + "...",
      },
    })
  } catch (error: any) {
    console.error("Stripe test error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unknown error occurred",
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}
