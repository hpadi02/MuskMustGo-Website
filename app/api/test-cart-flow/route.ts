import { type NextRequest, NextResponse } from "next/server"
import { writeFileSync, readFileSync, unlinkSync, mkdirSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action") || "info"

  try {
    // Detect environment
    const isVercel = process.env.VERCEL === "1"
    const tempDir = isVercel ? tmpdir() : join(process.cwd(), "temp")

    switch (action) {
      case "info":
        return NextResponse.json({
          environment: isVercel ? "Vercel" : "Nginx",
          tempDirectory: tempDir,
          nodeVersion: process.version,
          platform: process.platform,
          message: "Cart flow test endpoint ready",
        })

      case "save":
        // Test saving a file
        const testData = {
          test: true,
          timestamp: new Date().toISOString(),
          emojis: {
            tesla: { name: "test_tesla", path: "/test/path" },
            elon: { name: "test_elon", path: "/test/path" },
          },
        }

        if (!isVercel) {
          mkdirSync(tempDir, { recursive: true })
        }

        const testFilePath = join(tempDir, "test-cart-data.json")
        writeFileSync(testFilePath, JSON.stringify(testData, null, 2))

        return NextResponse.json({
          success: true,
          action: "save",
          filePath: testFilePath,
          data: testData,
          environment: isVercel ? "Vercel" : "Nginx",
        })

      case "read":
        // Test reading the file
        const readFilePath = join(tempDir, "test-cart-data.json")
        const fileContent = readFileSync(readFilePath, "utf8")
        const parsedData = JSON.parse(fileContent)

        return NextResponse.json({
          success: true,
          action: "read",
          filePath: readFilePath,
          data: parsedData,
          environment: isVercel ? "Vercel" : "Nginx",
        })

      case "cleanup":
        // Test cleanup
        const cleanupFilePath = join(tempDir, "test-cart-data.json")
        unlinkSync(cleanupFilePath)

        return NextResponse.json({
          success: true,
          action: "cleanup",
          message: "Test file deleted successfully",
          environment: isVercel ? "Vercel" : "Nginx",
        })

      default:
        return NextResponse.json(
          {
            error: "Invalid action",
            usage: {
              info: "/api/test-cart-flow?action=info",
              save: "/api/test-cart-flow?action=save",
              read: "/api/test-cart-flow?action=read",
              cleanup: "/api/test-cart-flow?action=cleanup",
            },
          },
          { status: 400 },
        )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        action,
        environment: process.env.VERCEL === "1" ? "Vercel" : "Nginx",
      },
      { status: 500 },
    )
  }
}
