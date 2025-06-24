import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("From:", name, email)
    console.log("Subject:", subject)
    console.log("Message:", message)

    // Get mail server host from environment (defaults to Ed's server)
    const mailHost = process.env.MAIL_HOST || "mail.leafe.com"
    const mailPort = Number.parseInt(process.env.MAIL_PORT || "587")

    console.log("Using mail server:", mailHost, "port:", mailPort)

    // Create transporter using Ed's mail server (no auth required)
    const transporter = nodemailer.createTransporter({
      host: mailHost,
      port: mailPort,
      secure: false, // false for port 587
      requireTLS: false, // Ed's server doesn't require TLS
      ignoreTLS: true, // Ignore TLS errors if any
      // No auth section needed - Ed's server accepts from designated hosts
    })

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "support@muskmustgo.com",
      subject: `Contact Form: ${subject}`,
      text: `
From: ${name} <${email}>
Subject: ${subject}

Message:
${message}

---
Sent from MuskMustGo.com contact form
      `,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h4>Message:</h4>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><em>Sent from MuskMustGo.com contact form</em></p>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Contact form error:", error)

    // Return detailed error for debugging
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
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
    mailHost: process.env.MAIL_HOST || "mail.leafe.com",
    mailPort: process.env.MAIL_PORT || "587",
  })
}
