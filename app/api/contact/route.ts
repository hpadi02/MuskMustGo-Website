import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("From:", name, email)
    console.log("Subject:", subject)
    console.log("Message:", message)

    // Create transporter for mail.leafe.com
    const transporter = nodemailer.createTransporter({
      host: "mail.leafe.com",
      port: 587, // Try 587 first, fallback to 25 if needed
      secure: false, // true for 465, false for other ports
      // No auth needed as server accepts from designated hosts
    })

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "support@muskmustgo.com",
      cc: "ed@leafe.com",
      subject: subject,
      text: message,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Sent from muskmustgo.com contact form</small></p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    console.log("Email sent successfully to support@muskmustgo.com and ed@leafe.com")

    return NextResponse.json({
      success: true,
      message: "Message sent successfully. Ed will be notified.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Contact form error:", error)

    // Log the complete contact form data as fallback
    const contactData = {
      timestamp: new Date().toISOString(),
      from: { name: request.body?.name, email: request.body?.email },
      subject: request.body?.subject,
      message: request.body?.message,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      error: error instanceof Error ? error.message : "Unknown error",
    }

    console.log("FALLBACK - CONTACT FORM DATA:", JSON.stringify(contactData, null, 2))

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: "Message logged to server console as backup",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Contact API is running (email mode)",
    timestamp: new Date().toISOString(),
    mailServer: "mail.leafe.com",
    note: "Contact form submissions are sent via email",
  })
}
