import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create transporter for your mail server
    const transporter = nodemailer.createTransporter({
      host: "mail.leafe.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: false, // No authentication required as per your setup
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates if needed
      },
    })

    // Email content
    const emailContent = `
From: ${name} <${email}>
Subject: ${subject}

Message:
${message}

---
Sent from muskmustgo.com contact form
    `.trim()

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: ["support@muskmustgo.com", "ed@leafe.com"],
      subject: `Contact Form: ${subject}`,
      text: emailContent,
      replyTo: email,
    })

    console.log("Contact form email sent successfully")

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("Failed to send contact email:", error)

    // Log the contact form submission as fallback
    console.log("CONTACT FORM SUBMISSION:", {
      name: request.body?.name,
      email: request.body?.email,
      subject: request.body?.subject,
      message: request.body?.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
