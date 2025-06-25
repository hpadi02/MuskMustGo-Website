import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString()
  let contactData: any = {}

  try {
    const { name, email, subject, message } = await request.json()

    // Store contact data for logging
    contactData = {
      timestamp,
      name,
      email,
      subject,
      message,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    // Always log the inquiry as backup
    console.log("=== CONTACT FORM SUBMISSION ===")
    console.log("Timestamp:", timestamp)
    console.log("From:", name, "<" + email + ">")
    console.log("Subject:", subject)
    console.log("IP Address:", contactData.ip)
    console.log("User Agent:", contactData.userAgent)
    console.log("Message:")
    console.log(message)
    console.log("=== END SUBMISSION ===")

    // Also log as JSON for easy parsing
    console.log("CONTACT_FORM_JSON:", JSON.stringify(contactData, null, 2))

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log("ERROR: Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if we're in test mode (not on production server)
    const isTestMode =
      process.env.NODE_ENV !== "production" ||
      !process.env.HOSTNAME?.includes("muskmustgo") ||
      request.headers.get("host")?.includes("localhost") ||
      request.headers.get("host")?.includes("v0.dev")

    if (isTestMode) {
      console.log("=== TEST MODE: Simulating email send ===")
      console.log("Would send email to: support@muskmustgo.com")
      console.log("Email subject:", `[Musk Must Go Contact] ${subject}`)
      console.log("Email content preview:")
      console.log(`From: ${name} <${email}>`)
      console.log(`Subject: ${subject}`)
      console.log(`Message: ${message}`)
      console.log("=== Email simulation complete ===")

      return NextResponse.json({
        success: true,
        message: "Message received! (Test mode - email simulated)",
        testMode: true,
        logged: true,
      })
    }

    // Production mode - try actual email sending
    console.log("=== PRODUCTION MODE: Attempting real email send ===")

    // Create transporter for mail.leafe.com
    const transporter = nodemailer.createTransporter({
      host: "mail.leafe.com",
      port: 587, // Try 587 first
      secure: false, // Use STARTTLS
      requireTLS: false,
      auth: false, // No authentication needed as per your setup
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
    })

    // Verify connection first
    console.log("Attempting to connect to mail.leafe.com...")
    await transporter.verify()
    console.log("Mail server connection verified successfully")

    // Prepare email content
    const emailSubject = `[Musk Must Go Contact] ${subject}`
    const emailText = `
Contact Form Submission from muskmustgo.com

From: ${name}
Email: ${email}
Subject: ${subject}
Timestamp: ${timestamp}
IP Address: ${contactData.ip}

Message:
${message}

---
This message was sent via the Musk Must Go contact form.
Reply directly to: ${email}
    `

    const emailHtml = `
<h2>Contact Form Submission from muskmustgo.com</h2>
<p><strong>From:</strong> ${name}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Subject:</strong> ${subject}</p>
<p><strong>Timestamp:</strong> ${timestamp}</p>
<p><strong>IP Address:</strong> ${contactData.ip}</p>

<h3>Message:</h3>
<p style="white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-left: 3px solid #ccc;">${message}</p>

<hr>
<p><small>This message was sent via the Musk Must Go contact form.<br>
Reply directly to: <a href="mailto:${email}">${email}</a></small></p>
    `

    // Send email
    console.log("Sending email to support@muskmustgo.com...")
    const info = await transporter.sendMail({
      from: `"${name}" <noreply@muskmustgo.com>`, // Use your domain as sender
      to: "support@muskmustgo.com",
      replyTo: email, // User can reply directly to the sender
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    console.log("Email sent successfully!")
    console.log("Message ID:", info.messageId)
    console.log("Response:", info.response)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("=== CONTACT FORM ERROR ===")
    console.error("Error details:", error)
    console.error("Contact data:", contactData)
    console.error("=== END ERROR ===")

    // Try alternative port 25 if 587 failed (only in production)
    const isTestMode =
      process.env.NODE_ENV !== "production" ||
      !process.env.HOSTNAME?.includes("muskmustgo") ||
      request.headers.get("host")?.includes("localhost") ||
      request.headers.get("host")?.includes("v0.dev")

    if (!isTestMode && error instanceof Error && error.message.includes("ECONNREFUSED")) {
      try {
        console.log("Retrying with port 25...")
        const altTransporter = nodemailer.createTransporter({
          host: "mail.leafe.com",
          port: 25,
          secure: false,
          auth: false,
          tls: {
            rejectUnauthorized: false,
          },
        })

        await altTransporter.verify()
        console.log("Port 25 connection successful")

        const info = await altTransporter.sendMail({
          from: `"${contactData.name}" <noreply@muskmustgo.com>`,
          to: "support@muskmustgo.com",
          replyTo: contactData.email,
          subject: `[Musk Must Go Contact] ${contactData.subject}`,
          text: `From: ${contactData.name} <${contactData.email}>\nSubject: ${contactData.subject}\n\n${contactData.message}`,
        })

        console.log("Email sent successfully via port 25!")
        return NextResponse.json({
          success: true,
          message: "Message sent successfully! We'll get back to you soon.",
          messageId: info.messageId,
        })
      } catch (altError) {
        console.error("Port 25 also failed:", altError)
      }
    }

    // Return error but confirm logging
    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to send email at this time, but your message has been received and logged. We'll get back to you soon.",
        details: error instanceof Error ? error.message : "Unknown error",
        logged: true,
        timestamp: contactData.timestamp,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  const isTestMode = process.env.NODE_ENV !== "production" || !process.env.HOSTNAME?.includes("muskmustgo")

  return NextResponse.json({
    status: "Contact API is running",
    mode: isTestMode ? "TEST MODE" : "PRODUCTION MODE",
    mailServer: "mail.leafe.com",
    ports: [587, 25],
    timestamp: new Date().toISOString(),
    note: isTestMode
      ? "In test mode - emails are simulated and logged"
      : "In production mode - emails sent to mail server",
  })
}
