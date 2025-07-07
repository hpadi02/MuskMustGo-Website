import { type NextRequest, NextResponse } from "next/server"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, cartData } = await req.json()

    if (!sessionId || !cartData) {
      return NextResponse.json({ error: "Missing sessionId or cartData" }, { status: 400 })
    }

    // Use /tmp for Vercel, temp for nginx
    const isVercel = process.env.VERCEL === "1"
    const tempDir = isVercel ? require("os").tmpdir() : join(process.cwd(), "temp")

    // Ensure directory exists (for nginx)
    if (!isVercel) {
      try {
        mkdirSync(tempDir, { recursive: true })
      } catch (error) {
        // Directory might already exist, ignore error
      }
    }

    const filePath = join(tempDir, `cart-${sessionId}.json`)

    console.log(`💾 Cart data saved for session: ${sessionId} at ${filePath}`)
    console.log(`📋 Cart data preview:`, JSON.stringify(cartData, null, 2))

    writeFileSync(filePath, JSON.stringify(cartData, null, 2))

    return NextResponse.json({
      success: true,
      message: "Cart data saved successfully",
      sessionId,
      filePath: filePath,
    })
  } catch (error) {
    console.error("❌ Error saving cart data:", error)
    return NextResponse.json({ error: "Failed to save cart data" }, { status: 500 })
  }
}
