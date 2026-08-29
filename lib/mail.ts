import { Resend } from 'resend'

/** Lazily construct the Resend client so a missing API key only breaks
 *  requests that actually try to send mail, not the whole app/build. */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set. Add it to your environment variables.')
  }
  return new Resend(apiKey)
}

const FROM_EMAIL = process.env.LEADS_FROM_EMAIL || 'onboarding@resend.dev'
const TO_EMAIL = process.env.LEADS_TO_EMAIL

export type LeadKind = 'booking' | 'enquiry' | 'newsletter'

/** Escapes user-supplied text before it goes into an HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Renders "Label: value" rows as an HTML definition list, skipping any
 *  field that's empty/undefined so the email doesn't show a wall of
 *  "Not specified" for optional fields nobody filled in. */
function renderFieldRows(fields: Array<[label: string, value: string | undefined]>): string {
  return fields
    .filter(([, value]) => value && value.trim().length > 0)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b6255;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value!).replace(/\n/g, '<br />')}</td></tr>`,
    )
    .join('')
}

interface SendTeamNotificationArgs {
  kind: LeadKind
  subject: string
  fields: Array<[label: string, value: string | undefined]>
}

/** Sends the internal notification to the team's inbox. Throws on
 *  failure — callers should catch and turn this into a proper HTTP
 *  error response, since this is the email that actually matters (the
 *  auto-reply to the customer is a nice-to-have by comparison). */
export async function sendTeamNotification({ kind, subject, fields }: SendTeamNotificationArgs) {
  if (!TO_EMAIL) {
    throw new Error('LEADS_TO_EMAIL is not set. Add it to your environment variables.')
  }
  const resend = getResendClient()
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;">
      <p style="color:#6b6255;text-transform:uppercase;letter-spacing:0.08em;font-size:12px;">
        New ${kind} — Fine Lanka Tours
      </p>
      <table style="border-collapse:collapse;font-size:14px;">
        ${renderFieldRows(fields)}
      </table>
    </div>
  `
  await resend.emails.send({
    from: `Fine Lanka Tours Website <${FROM_EMAIL}>`,
    to: TO_EMAIL,
    replyTo: fields.find(([label]) => label === 'Email')?.[1],
    subject,
    html,
  })
}

interface SendAutoReplyArgs {
  toEmail: string
  toName: string
  subject: string
  bodyHtml: string
}

/** Sends the customer-facing confirmation. Failures here are caught by
 *  the caller and logged, never thrown up to break the request — a
 *  failed auto-reply shouldn't make the form look broken to the
 *  customer or, worse, cause the team notification above to look like
 *  it failed too when it actually sent fine.
 *
 *  Known limitation: Resend restricts unverified accounts (no custom
 *  domain verified — see docs/PRE-LAUNCH-AUDIT.md Phase 9) to sending
 *  only to the account owner's own address. Until a domain is verified,
 *  auto-replies to real customers will fail here (and get logged) even
 *  though the team notification above succeeds — only submissions from
 *  the account owner's own email will get a working auto-reply. */
export async function sendAutoReply({ toEmail, toName, subject, bodyHtml }: SendAutoReplyArgs) {
  const resend = getResendClient()
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;color:#2c2620;">
      <p>Hi ${escapeHtml(toName || 'there')},</p>
      ${bodyHtml}
      <p style="margin-top:24px;color:#6b6255;font-size:13px;">
        Fine Lanka Tours — Considered Journeys Across Sri Lanka
      </p>
    </div>
  `
  await resend.emails.send({
    from: `Fine Lanka Tours <${FROM_EMAIL}>`,
    to: toEmail,
    subject,
    html,
  })
}
