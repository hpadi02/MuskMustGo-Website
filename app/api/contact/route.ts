import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("From:", name, email)
    console.log("Subject:", subject)
    console.log("Message:", message)

    // Determine the correct mail server URL based on domain
    const host = request.headers.get("host") || ""
    let mailServerUrl = "http://127.0.0.1/contact" // Default fallback

    if (host.includes("elonmustgo.com") || host.includes("muskmustgo.com")) {
      // Production domains - use Ed's mail server
      mailServerUrl = `${process.env.API_BASE_URL || "http://127.0.0.1"}/contact`
    }

    console.log("Sending contact form to:", mailServerUrl)
    console.log("Host header:", host)

    const contactData = {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      source: "muskmustgo-website",
      domain: host,
    }

    // Send to Ed's mail server
    try {
      const response = await fetch(mailServerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add API key if Ed requires it
          ...(process.env.BACKEND_API_KEY && {
            Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
          }),
        },
        body: JSON.stringify(contactData),
      })

      console.log("Mail server response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Mail server error:", errorText)

        // Log the contact form data as fallback
        console.log("FALLBACK - CONTACT FORM DATA:", JSON.stringify(contactData, null, 2))

        return NextResponse.json({
          success: true,
          message: "Message received and logged. Ed will be notified.",
          note: "Mail server unavailable, message logged to console",
        })
      }

      const result = await response.json()
      console.log("Mail server success:", result)

      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
        timestamp: contactData.timestamp,
      })
    } catch (fetchError) {
      console.error("Failed to reach mail server:", fetchError)

      // Log the contact form data as fallback
      console.log("FALLBACK - CONTACT FORM DATA:", JSON.stringify(contactData, null, 2))

      return NextResponse.json({
        success: true,
        message: "Message received and logged. Ed will be notified.",
        note: "Mail server unavailable, message logged to console",
      })
    }
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
    message: "Contact API is running",
    timestamp: new Date().toISOString(),
    mailServerUrl: `${process.env.API_BASE_URL || "http://127.0.0.1"}/contact`,
    note: "Contact form submissions are sent to Ed's mail server with console logging as fallback",
  })
}
