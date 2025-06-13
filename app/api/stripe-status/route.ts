import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "STRIPE_SECRET_KEY is not defined in environment variables",
        },
        { status: 500 },
      )
    }

    if (secretKey.startsWith("pk_")) {
      return NextResponse.json(
        {
          status: "error",
          message: "You're using a publishable key (pk_) instead of a secret key (sk_)",
        },
        { status: 500 },
      )
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(secretKey, {
      apiVersion: "2023-10-16",
    })

    // Try to make a simple API call to verify the key works
    const balance = await stripe.balance.retrieve()

    return NextResponse.json({
      status: "success",
      message: "Stripe API key is valid and working correctly",
      keyType: secretKey.startsWith("sk_test") ? "test" : "live",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
