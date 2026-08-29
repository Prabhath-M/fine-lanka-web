import { NextRequest, NextResponse } from 'next/server'
import { cleanString, isHoneypotTripped, isRateLimited, isValidEmail } from '@/lib/form-guard'
import { sendAutoReply, sendTeamNotification } from '@/lib/mail'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (isHoneypotTripped(body)) {
    return NextResponse.json({ ok: true })
  }

  if (isRateLimited(req, 'enquiry')) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 },
    )
  }

  const name = cleanString(body.name, 120)
  const email = cleanString(body.email, 254)
  const destination = cleanString(body.destination, 200)
  const details = cleanString(body.details, 4000)

  if (!name || !email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please provide your name and a valid email address.' },
      { status: 400 },
    )
  }

  try {
    await sendTeamNotification({
      kind: 'enquiry',
      subject: `New quick enquiry — ${name}`,
      fields: [
        ['Name', name],
        ['Email', email],
        ['Destination', destination],
        ['Details', details],
      ],
    })
  } catch (err) {
    console.error('enquiry: team notification failed', err)
    return NextResponse.json(
      { error: 'Something went wrong sending your enquiry. Please try again or call us directly.' },
      { status: 502 },
    )
  }

  try {
    await sendAutoReply({
      toEmail: email,
      toName: name.split(' ')[0],
      subject: 'We\u2019ve received your enquiry — Fine Lanka Tours',
      bodyHtml: `
        <p>Thanks for reaching out — a Sri Lanka-based travel designer will
        be in touch, usually within one business day.</p>
        <p>If anything changes in the meantime, just reply to this email.</p>
      `,
    })
  } catch (err) {
    console.error('enquiry: auto-reply failed', err)
  }

  return NextResponse.json({ ok: true })
}
