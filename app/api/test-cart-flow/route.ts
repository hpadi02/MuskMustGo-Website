import { type NextRequest, NextResponse } from "next/server"
import { writeFileSync, readFileSync, unlinkSync, mkdirSync } from "fs"
import { join } from "path"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action") || "info"

  try {
    // Detect environment
    const isVercel = process.env.VERCEL === "1"
    const tempDir = isVercel ? require("os").tmpdir() : join(process.cwd(), "temp")

    console.log(`🔍 Environment: ${isVercel ? "Vercel" : "Nginx"}`)
    console.log(`📁 Temp directory: ${tempDir}`)

    if (action === "info") {
      return NextResponse.json({
        environment: isVercel ? "Vercel" : "Nginx",
        tempDirectory: tempDir,
        nodeVersion: process.version,
        platform: process.platform,
      })
    }

    if (action === "save") {
      // Ensure directory exists (for nginx)
      if (!isVercel) {
        mkdirSync(tempDir, { recursive: true })
      }

      const testData = { test: "data", timestamp: new Date().toISOString() }
      const testFile = join(tempDir, "test-cart-data.json")

      writeFileSync(testFile, JSON.stringify(testData, null, 2))

      return NextResponse.json({
        success: true,
        message: "Test file saved successfully",
        filePath: testFile,
        data: testData,
      })
    }

    if (action === "read") {
      const testFile = join(tempDir, "test-cart-data.json")
      const data = readFileSync(testFile, "utf8")

      return NextResponse.json({
        success: true,
        message: "Test file read successfully",
        filePath: testFile,
        data: JSON.parse(data),
      })
    }

    if (action === "cleanup") {
      const testFile = join(tempDir, "test-cart-data.json")
      unlinkSync(testFile)

      return NextResponse.json({
        success: true,
        message: "Test file deleted successfully",
        filePath: testFile,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("❌ Test error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
