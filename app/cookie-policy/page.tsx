import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { SITE } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Cookie Policy — Fine Lanka Tours',
  description: 'How Fine Lanka Tours uses cookies on this website.',
}

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      intro="What cookies are, which ones this website uses, and how to control them."
    >
      <p className="legal-updated">Last updated: 28 August 2026</p>

      <h2>What are cookies</h2>
      <p>
        Cookies are small text files a website stores on your device to help it function, or to
        remember information between visits. Some are essential for a site to work at all;
        others are used for things like analytics or advertising.
      </p>

      <h2>What this site currently uses</h2>
      <p>
        This website currently only uses cookies that are strictly necessary for it to function
        — for example, remembering choices you make while browsing within a single session. We
        do not currently use analytics, advertising, or tracking cookies, and no data collected
        through this site&apos;s cookies is shared with third parties for marketing purposes.
      </p>
      <p>
        If that changes in future — for example, if we add analytics to understand how visitors
        use the site — we&apos;ll update this policy first and, where required by law, ask for
        your consent before setting any non-essential cookie.
      </p>

      <h2>Controlling cookies</h2>
      <p>
        Most browsers let you view, delete, and block cookies through their settings. Because
        strictly necessary cookies are required for core site functionality, blocking them may
        affect how parts of the site work. You can find instructions for your specific browser
        in its help documentation.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the site changes. The &ldquo;last updated&rdquo; date at
        the top will always reflect the most recent version.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy can be sent to{' '}
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
