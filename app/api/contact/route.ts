import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("From:", name, email)
    console.log("Subject:", subject)
    console.log("Message:", message)

    // Create transporter using Ed's mail server (no auth required)
    const transporter = nodemailer.createTransport({
      host: "mail.leafe.com",
      port: 587, // Ed said it listens on both 587 and 25
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
    smtpServer: "mail.leafe.com",
  })
}
