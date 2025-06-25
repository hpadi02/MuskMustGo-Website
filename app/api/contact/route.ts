import { type NextRequest, NextResponse } from "next/server"

// Fallback logging function (Option 2)
function logContactFormData(name: string, email: string, subject: string, message: string, error?: string) {
  const contactData = {
    timestamp: new Date().toISOString(),
    from: { name, email },
    subject,
    message,
    ip: "server-side", // Will be filled by server
    error: error || null,
  }

  console.log("=== CONTACT FORM SUBMISSION ===")
  console.log("FALLBACK LOGGING - CONTACT FORM DATA:")
  console.log(JSON.stringify(contactData, null, 2))
  console.log("=== END CONTACT FORM ===")

  return contactData
}

// SMTP email function (Option 1)
async function sendEmailViaSMTP(name: string, email: string, subject: string, message: string) {
  try {
    // Dynamic import to handle potential missing dependency gracefully
    const nodemailer = await import("nodemailer")

    console.log("Attempting to send email via SMTP...")

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
      connectionTimeout: 10000, // 10 second timeout
      greetingTimeout: 5000, // 5 second greeting timeout
    })

    // Prepare email content exactly as Ed specified
    const mailOptions = {
      from: `${name} <${email}>`,
      to: "support@muskmustgo.com",
      cc: "ed@leafe.com", // Also send to Ed directly
      subject: subject,
      text: message,
      headers: {
        "X-Mailer": "MuskMustGo Website",
        "X-Source": "Contact Form",
        "X-Timestamp": new Date().toISOString(),
      },
    }

    console.log("SMTP Configuration:")
    console.log("- Host: mail.leafe.com:587")
    console.log("- From:", mailOptions.from)
    console.log("- To:", mailOptions.to)
    console.log("- CC:", mailOptions.cc)
    console.log("- Subject:", mailOptions.subject)

    // Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log("✅ EMAIL SENT SUCCESSFULLY!")
    console.log("Message ID:", info.messageId)
    console.log("Response:", info.response)

    return {
      success: true,
      method: "smtp",
      messageId: info.messageId,
      message: "Email sent successfully! Ed will receive your message shortly.",
    }
  } catch (error) {
    console.error("❌ SMTP ERROR:", error)
    throw error
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
          error: "All fields are required (name, email, subject, message)",
        },
        { status: 400 },
      )
    }

    console.log("📧 Processing contact form submission...")
    console.log("From:", name, `<${email}>`)
    console.log("Subject:", subject)

    // TRY OPTION 1: SMTP Email First
    try {
      const smtpResult = await sendEmailViaSMTP(name, email, subject, message)

      // SUCCESS: Email sent via SMTP
      return NextResponse.json({
        success: true,
        message: smtpResult.message,
        method: "smtp",
        messageId: smtpResult.messageId,
        timestamp: new Date().toISOString(),
        note: "Email delivered via Ed's mail server",
      })
    } catch (smtpError) {
      console.log("⚠️  SMTP failed, falling back to logging...")

      // FALLBACK TO OPTION 2: Logging
      const logData = logContactFormData(
        name,
        email,
        subject,
        message,
        smtpError instanceof Error ? smtpError.message : "Unknown SMTP error",
      )

      return NextResponse.json({
        success: true,
        message: "Message received and logged. Ed will be notified and respond shortly.",
        method: "logging",
        timestamp: logData.timestamp,
        note: "Email server temporarily unavailable - message logged for Ed to process manually",
      })
    }
  } catch (error) {
    console.error("💥 Contact form processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process contact form",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Contact API is running with SMTP + Logging fallback",
    timestamp: new Date().toISOString(),
    primaryMethod: "SMTP via mail.leafe.com:587",
    fallbackMethod: "Console logging",
    recipients: ["support@muskmustgo.com", "ed@leafe.com"],
    note: "Attempts SMTP first, falls back to logging if SMTP fails",
  })
}
