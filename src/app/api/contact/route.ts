import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    })

    await transporter.sendMail({
      from: `"AgentFlow Integrations" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "Neue Kontaktanfrage",
      text: `Name: ${name}\nE-Mail: ${email}\nNachricht: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>E-Mail:</strong> ${email}</p>
             <p><strong>Nachricht:</strong> ${message}</p>`,
    })

    return NextResponse.json({ message: 'E-Mail erfolgreich gesendet' })
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error)
    return NextResponse.json({ message: 'Fehler beim Senden der E-Mail' }, { status: 500 })
  }
}