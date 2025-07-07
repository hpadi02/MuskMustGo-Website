import { type NextRequest, NextResponse } from "next/server"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, cartData } = await req.json()

    if (!sessionId || !cartData) {
      return NextResponse.json({ error: "Missing sessionId or cartData" }, { status: 400 })
    }

    // Ensure temp directory exists
    const tempDir = join(process.cwd(), "temp")
    try {
      mkdirSync(tempDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Save cart data to temporary file
    const filePath = join(tempDir, `cart-${sessionId}.json`)
    writeFileSync(filePath, JSON.stringify(cartData, null, 2))

    console.log(`💾 Cart data saved for session: ${sessionId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error saving cart data:", error)
    return NextResponse.json({ error: "Failed to save cart data" }, { status: 500 })
  }
}
