import { type NextRequest, NextResponse } from "next/server"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, cartData } = await req.json()

    if (!sessionId || !cartData) {
      return NextResponse.json({ error: "Missing sessionId or cartData" }, { status: 400 })
    }

    // Use /tmp for Vercel, temp for nginx
    const isVercel = process.env.VERCEL === "1"
    const tempDir = isVercel ? tmpdir() : join(process.cwd(), "temp")

    // Create temp directory if it doesn't exist (for nginx)
    if (!isVercel) {
      mkdirSync(tempDir, { recursive: true })
    }

    const filePath = join(tempDir, `cart-${sessionId}.json`)

    // Save cart data to file
    writeFileSync(filePath, JSON.stringify(cartData, null, 2))

    console.log(`💾 Cart data saved for session: ${sessionId} at ${filePath}`)
    console.log("📋 Cart data preview:", JSON.stringify(cartData, null, 2))

    return NextResponse.json({
      success: true,
      message: "Cart data saved successfully",
      sessionId,
      filePath,
    })
  } catch (error) {
    console.error("❌ Error saving cart data:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
