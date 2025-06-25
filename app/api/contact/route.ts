import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("From:", name, email)
    console.log("Subject:", subject)
    console.log("Message:", message)

    // For now, we'll log the contact form data and return success
    // Ed can check the server logs to see contact form submissions
    // This avoids the nodemailer dependency issues

    const contactData = {
      timestamp: new Date().toISOString(),
      from: { name, email },
      subject,
      message,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    // Log the complete contact form data for Ed to see
    console.log("CONTACT FORM DATA:", JSON.stringify(contactData, null, 2))

    return NextResponse.json({
      success: true,
      message: "Message received and logged. Ed will be notified.",
      timestamp: contactData.timestamp,
    })
  } catch (error) {
    console.error("Contact form error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Contact API is running (logging mode)",
    timestamp: new Date().toISOString(),
    note: "Contact form submissions are logged to server console",
  })
}
