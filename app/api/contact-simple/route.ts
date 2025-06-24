import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Simple fetch to Ed's mail server without nodemailer
    const response = await fetch("http://mail.leafe.com:587", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: `From: ${name} <${email}>\nTo: support@muskmustgo.com\nSubject: ${subject}\n\n${message}`,
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Email sent successfully!" })
    } else {
      throw new Error("Failed to send email")
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ success: false, message: "Failed to send email. Please try again." }, { status: 500 })
  }
}
