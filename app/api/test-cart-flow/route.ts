import { type NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, unlinkSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"

const isVercel = process.env.VERCEL === "1"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action")
  const sessionId = searchParams.get("sessionId") || "test-session-123"

  try {
    const tempDir = isVercel ? tmpdir() : join(process.cwd(), "temp")
    const filePath = join(tempDir, `cart-${sessionId}.json`)

    if (action === "save") {
      // Test saving cart data
      const testCartData = [
        {
          id: "test-tesla-emoji",
          name: "Tesla vs Elon Emoji (magnet)",
          customOptions: {
            teslaEmoji: { name: "love_stickers", path: "/emojis/positives/01_love_stickers.png" },
            elonEmoji: { name: "gradient_angry", path: "/emojis/negatives/02_gradient_angry.png" },
            variant: "magnet",
          },
          stripeId: "price_test123",
          productId: "prod_test123",
        },
      ]

      writeFileSync(filePath, JSON.stringify(testCartData, null, 2))

      return NextResponse.json({
        success: true,
        message: "Test cart data saved",
        filePath,
        environment: isVercel ? "Vercel" : "Nginx",
        data: testCartData,
      })
    } else if (action === "read") {
      // Test reading cart data
      const cartDataString = readFileSync(filePath, "utf8")
      const cartData = JSON.parse(cartDataString)

      return NextResponse.json({
        success: true,
        message: "Cart data retrieved",
        filePath,
        environment: isVercel ? "Vercel" : "Nginx",
        data: cartData,
      })
    } else if (action === "cleanup") {
      // Test cleanup
      unlinkSync(filePath)

      return NextResponse.json({
        success: true,
        message: "Cart data cleaned up",
        filePath,
        environment: isVercel ? "Vercel" : "Nginx",
      })
    } else {
      return NextResponse.json({
        message: "Cart flow test endpoint",
        usage: {
          save: "/api/test-cart-flow?action=save&sessionId=test123",
          read: "/api/test-cart-flow?action=read&sessionId=test123",
          cleanup: "/api/test-cart-flow?action=cleanup&sessionId=test123",
        },
        environment: isVercel ? "Vercel" : "Nginx",
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        environment: isVercel ? "Vercel" : "Nginx",
      },
      { status: 500 },
    )
  }
}
