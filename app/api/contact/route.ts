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

${message}

---
This message was sent via the Musk Must Go contact form.
Reply directly to: ${email}
    `

    // Send email to both addresses
    const mailOptions = {
      from: email,
      to: ["support@muskmustgo.com", "ed@leafe.com"],
      subject: `Contact Form: ${subject}`,
      text: emailContent,
      replyTo: email,
    }

    await transporter.sendMail(mailOptions)

    console.log("Contact form email sent successfully")

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to send contact email:", error)

    // Log the contact form submission even if email fails
    console.log("Contact form submission (email failed):", {
      name: request.body?.name,
      email: request.body?.email,
      subject: request.body?.subject,
      message: request.body?.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 })
  }
}
