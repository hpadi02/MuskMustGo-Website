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

    switch (action) {
      case "info":
        return NextResponse.json({
          environment: isVercel ? "Vercel" : "Nginx",
          tempDir,
          timestamp: new Date().toISOString(),
        })

      case "save":
        // Create temp directory if needed
        if (!isVercel) {
          mkdirSync(tempDir, { recursive: true })
        }

        const testData = {
          test: true,
          timestamp: new Date().toISOString(),
          emoji: { tesla: "cowboy", elon: "angry_face" },
        }

        const testFile = join(tempDir, "test-cart-data.json")
        writeFileSync(testFile, JSON.stringify(testData, null, 2))

        return NextResponse.json({
          success: true,
          message: "Test file saved",
          filePath: testFile,
          data: testData,
        })

      case "read":
        const readFile = join(tempDir, "test-cart-data.json")
        const data = readFileSync(readFile, "utf8")
        return NextResponse.json({
          success: true,
          message: "Test file read",
          data: JSON.parse(data),
        })

      case "cleanup":
        const cleanupFile = join(tempDir, "test-cart-data.json")
        unlinkSync(cleanupFile)
        return NextResponse.json({
          success: true,
          message: "Test file deleted",
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
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
