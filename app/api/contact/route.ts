import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("From:", name, email)
    console.log("Subject:", subject)
    console.log("Message:", message)

    // Create transporter using Ed's mail server
    const transporter = nodemailer.createTransporter({
      host: "mail.leafe.com",
      port: 587, // or 25, depending on Ed's server config
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Ed will need to provide this
        pass: process.env.SMTP_PASS, // Ed will need to provide this
      },
      // If Ed's server doesn't require auth, remove the auth section
      // and add: requireTLS: false, ignoreTLS: true
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
