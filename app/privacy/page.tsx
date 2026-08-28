import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { SITE } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Privacy Notice — Fine Lanka Tours',
  description: 'How Fine Lanka Tours collects, uses, and protects your personal data.',
}

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Notice"
      intro="How we collect, use, and protect the personal information you share with us."
    >
      <p className="legal-updated">Last updated: 28 August 2026</p>

      <h2>Who we are</h2>
      <p>
        This notice applies to {SITE.brand} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;),
        a Sri Lanka-based travel design studio at {SITE.address}. It explains what personal data
        we collect when you use this website or get in touch with us, and what we do with it.
      </p>

      <h2>What we collect</h2>
      <p>We collect personal data you give us directly, through the booking form, the enquiry form, the contact page, or the newsletter sign-up. Depending on which of these you use, this may include:</p>
      <ul>
        <li>Your name, email address, and phone number</li>
        <li>Travel dates, destinations, group size, and trip preferences</li>
        <li>Any other details you choose to include in a message to us</li>
      </ul>
      <p>
        We do not collect payment card details through this website. If you go on to book a
        trip, any payment is handled directly between you and the relevant payment provider or
        bank, not stored by us.
      </p>

      <h2>How we use it</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Respond to your enquiry and put together a travel itinerary</li>
        <li>Communicate with you about a booking, before and during your trip</li>
        <li>Keep records we&apos;re required to keep for accounting and legal purposes</li>
        <li>Occasionally send travel updates or offers, only if you&apos;ve opted in to the newsletter — you can unsubscribe at any time</li>
      </ul>
      <p>We do not sell your personal data to anyone.</p>

      <h2>Who we share it with</h2>
      <p>
        To arrange your trip, we may share relevant details (such as your name and travel
        dates) with the local partners involved in delivering it — hotels, driver-guides, and
        activity operators. We only share what&apos;s needed for them to do their part. We may
        also share data with service providers who help us run this website or process
        enquiries (such as email or hosting providers), under terms that require them to keep
        it secure and not use it for their own purposes.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry and booking records for as long as needed to deliver your trip, respond
        to any follow-up questions, and meet our accounting and legal record-keeping
        obligations, after which it&apos;s deleted or anonymised.
      </p>

      <h2>Your rights</h2>
      <p>You can ask us at any time to:</p>
      <ul>
        <li>Tell you what personal data we hold about you</li>
        <li>Correct anything that&apos;s inaccurate</li>
        <li>Delete your data, where we&apos;re not required to keep it for legal reasons</li>
        <li>Stop sending you marketing emails</li>
      </ul>
      <p>
        To do any of this, contact us using the details below.
      </p>

      <h2>Cookies</h2>
      <p>
        This website uses a small number of cookies needed for it to function correctly. See
        our <Link href="/cookie-policy">Cookie Policy</Link> for details.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable technical and organisational steps to keep your information secure,
        but no method of transmission over the internet is completely secure, and we can&apos;t
        guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>This website and our services are not directed at children, and we don&apos;t knowingly collect personal data from children.</p>

      <h2>Changes to this notice</h2>
      <p>
        We may update this notice from time to time, for example as our services or applicable
        law change. The &ldquo;last updated&rdquo; date at the top will always reflect the most
        recent version.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this notice, or about your personal data, can be sent to{' '}
        {SITE.emails.map((email, i) => (
          <span key={email}>
            <a href={`mailto:${email}`}>{email}</a>
            {i < SITE.emails.length - 1 ? ' or ' : ''}
          </span>
        ))}
        , or by phone at {SITE.phones.join(' / ')}.
      </p>
    </LegalPage>
  )
}
