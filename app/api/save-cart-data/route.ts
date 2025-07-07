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

    // Ensure temp directory exists (only needed for nginx)
    if (!isVercel) {
      try {
        mkdirSync(tempDir, { recursive: true })
      } catch (error) {
        // Directory might already exist, that's fine
      }
    }

    // Save cart data to temporary file
    const filePath = join(tempDir, `cart-${sessionId}.json`)
    writeFileSync(filePath, JSON.stringify(cartData, null, 2))

    console.log(`💾 Cart data saved for session: ${sessionId} at ${filePath}`)
    console.log(`📋 Cart data preview:`, JSON.stringify(cartData, null, 2))

    return NextResponse.json({ success: true, filePath })
  } catch (error) {
    console.error("❌ Error saving cart data:", error)
    return NextResponse.json({ error: "Failed to save cart data" }, { status: 500 })
  }
}
