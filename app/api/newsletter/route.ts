import { NextRequest, NextResponse } from 'next/server'
import { cleanString, isHoneypotTripped, isRateLimited, isValidEmail } from '@/lib/form-guard'
import { sendAutoReply, sendTeamNotification } from '@/lib/mail'

/** NOTE: this sends a plain transactional notification + confirmation via
 *  Resend — it is NOT a real mailing-list signup. There's no unsubscribe
 *  link, no list storage, no bulk-sending capability. If/when actual
 *  newsletter campaigns are wanted, this should be swapped for (or feed
 *  into) a proper email marketing tool (Mailchimp, Resend's own
 *  Audiences/Broadcasts feature, etc.) — see docs/PRE-LAUNCH-AUDIT.md. */
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

  if (isRateLimited(req, 'newsletter')) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 },
    )
  }

  const email = cleanString(body.email, 254)

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  try {
    await sendTeamNotification({
      kind: 'newsletter',
      subject: `New newsletter signup — ${email}`,
      fields: [['Email', email]],
    })
  } catch (err) {
    console.error('newsletter: team notification failed', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 502 },
    )
  }

  try {
    await sendAutoReply({
      toEmail: email,
      toName: '',
      subject: 'You\u2019re on the list — Fine Lanka Tours',
      bodyHtml: `
        <p>You're signed up for occasional dispatches on new routes,
        seasonal openings, and the rare upgrade reserved first for our
        mailing list.</p>
      `,
    })
  } catch (err) {
    console.error('newsletter: auto-reply failed', err)
  }

  return NextResponse.json({ ok: true })
}
