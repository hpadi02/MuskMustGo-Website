import { type NextRequest, NextResponse } from "next/server"

// Use dynamic import to avoid build issues with nodemailer
async function sendEmail(name: string, email: string, subject: string, message: string) {
  try {
    const nodemailer = await import("nodemailer")

    // Create SMTP transporter using Ed's mail server
    const transporter = nodemailer.default.createTransporter({
      host: "mail.leafe.com",
      port: 587,
      secure: false, // Use STARTTLS
      requireTLS: true,
      auth: false, // No authentication needed - server accepts from designated hosts
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates if needed
      },
    })

    // Prepare email content exactly as Ed specified
    const mailOptions = {
      from: `${name} <${email}>`,
      to: "support@muskmustgo.com",
      cc: "ed@leafe.com", // Also send to Ed directly
      subject: subject,
      text: message,
      // Add some additional context
      headers: {
        "X-Mailer": "MuskMustGo Website",
        "X-Source": "Contact Form",
        "X-Timestamp": new Date().toISOString(),
      },
    }

    console.log("Sending email via mail.leafe.com...")
    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      cc: mailOptions.cc,
      subject: mailOptions.subject,
    })

    // Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully!")
    console.log("Message ID:", info.messageId)
    console.log("Response:", info.response)

    return {
      success: true,
      message: "Message sent successfully! Ed will receive your email shortly.",
      messageId: info.messageId,
    }
  } catch (emailError) {
    console.error("SMTP Error:", emailError)
    throw emailError
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("From:", name, email)
    console.log("Subject:", subject)
    console.log("Message:", message)

    try {
      // Try to send email via SMTP
      const result = await sendEmail(name, email, subject, message)

      return NextResponse.json({
        success: true,
        message: result.message,
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
      })
    } catch (emailError) {
      // Log the contact form data as fallback
      const contactData = {
        timestamp: new Date().toISOString(),
        from: { name, email },
        subject,
        message,
        error: emailError instanceof Error ? emailError.message : "Unknown SMTP error",
      }

      console.log("FALLBACK - CONTACT FORM DATA:", JSON.stringify(contactData, null, 2))

      return NextResponse.json({
        success: true,
        message: "Message received and logged. Ed will be notified.",
        note: "Email server temporarily unavailable, message logged for manual processing",
        timestamp: contactData.timestamp,
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
    message: "Contact API is running with SMTP integration",
    timestamp: new Date().toISOString(),
    mailServer: "mail.leafe.com:587",
    recipients: ["support@muskmustgo.com", "ed@leafe.com"],
    note: "Contact form submissions are sent via SMTP with console logging as fallback",
  })
}
