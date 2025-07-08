import { type NextRequest, NextResponse } from "next/server"
import { writeFileSync, readFileSync, unlinkSync, mkdirSync } from "fs"
import { join } from "path"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action") || "info"

  try {
    // Environment detection
    const isVercel = process.env.VERCEL === "1"
    const tempDir = isVercel ? require("os").tmpdir() : join(process.cwd(), "temp")

    console.log(`🔧 Environment: ${isVercel ? "Vercel" : "Nginx"}`)
    console.log(`📁 Temp directory: ${tempDir}`)

    switch (action) {
      case "info":
        return NextResponse.json({
          environment: isVercel ? "Vercel" : "Nginx",
          tempDirectory: tempDir,
          nodeVersion: process.version,
          platform: process.platform,
        })

      case "save":
        // Ensure temp directory exists (for nginx)
        if (!isVercel) {
          mkdirSync(tempDir, { recursive: true })
        }

        const testData = {
          sessionId: "test_session_123",
          cartData: [
            {
              id: "test-item",
              customOptions: {
                teslaEmoji: { name: "cowboy" },
                elonEmoji: { name: "angry_face" },
              },
            },
          ],
        }

        const filePath = join(tempDir, "test-cart-data.json")
        writeFileSync(filePath, JSON.stringify(testData, null, 2))

        return NextResponse.json({
          success: true,
          message: "Test file saved successfully",
          filePath,
          data: testData,
        })

      case "read":
        const readPath = join(tempDir, "test-cart-data.json")
        const fileContent = readFileSync(readPath, "utf8")
        const parsedData = JSON.parse(fileContent)

        return NextResponse.json({
          success: true,
          message: "Test file read successfully",
          data: parsedData,
        })

      case "cleanup":
        const cleanupPath = join(tempDir, "test-cart-data.json")
        unlinkSync(cleanupPath)

        return NextResponse.json({
          success: true,
          message: "Test file cleaned up successfully",
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Test cart flow error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        action,
      },
      { status: 500 },
    )
  }
}
