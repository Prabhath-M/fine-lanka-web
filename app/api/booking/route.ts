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

  // Silently "succeed" on a tripped honeypot so a bot gets no signal
  // that anything was different — don't tell it what gave it away.
  if (isHoneypotTripped(body)) {
    return NextResponse.json({ ok: true })
  }

  if (isRateLimited(req, 'booking')) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 },
    )
  }

  const name = cleanString(body.name, 120)
  const email = cleanString(body.email, 254)
  const phone = cleanString(body.phone, 40)
  const travellers = cleanString(body.travellers, 10)
  const dates = cleanString(body.dates, 200)
  const nights = cleanString(body.nights, 10)
  const tour = cleanString(body.tour, 200)
  const destinations = Array.isArray(body.destinations)
    ? body.destinations.filter((d): d is string => typeof d === 'string').slice(0, 50).join(', ')
    : undefined
  const budget = cleanString(body.budget, 40)
  const details = cleanString(body.details, 4000)

  if (!name || !email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please provide your name and a valid email address.' },
      { status: 400 },
    )
  }

  try {
    await sendTeamNotification({
      kind: 'booking',
      subject: `New booking enquiry — ${name}`,
      fields: [
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
        ['Travellers', travellers],
        ['Preferred dates', dates],
        ['Trip length (nights)', nights],
        ['Tour package', tour],
        ['Destinations', destinations],
        ['Budget per person', budget],
        ['Details', details],
      ],
    })
  } catch (err) {
    console.error('booking: team notification failed', err)
    return NextResponse.json(
      { error: 'Something went wrong sending your enquiry. Please try again or call us directly.' },
      { status: 502 },
    )
  }

  try {
    await sendAutoReply({
      toEmail: email,
      toName: name.split(' ')[0],
      subject: 'We\u2019ve received your trip enquiry — Fine Lanka Tours',
      bodyHtml: `
        <p>Thanks for telling us about your trip — a Sri Lanka-based travel
        designer will follow up within one business day with a considered
        first-draft route.</p>
        <p>If anything changes in the meantime, just reply to this email.</p>
      `,
    })
  } catch (err) {
    // Best-effort only — see lib/mail.ts for why this can fail (Resend's
    // unverified-domain sending restriction) and why it must not fail
    // the request.
    console.error('booking: auto-reply failed', err)
  }

  return NextResponse.json({ ok: true })
}
