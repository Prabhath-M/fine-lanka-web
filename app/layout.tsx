import { Analytics } from '@vercel/analytics/next'
/* Ceylon Field Notes: retain elegant field typography and use the company
   logo consistently in browser chrome. */
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, Space_Mono } from 'next/font/google'
import { EnquiryModal } from '@/components/enquiry-modal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SITE } from '@/lib/site-data'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

// Falls back to localhost during local dev; set NEXT_PUBLIC_SITE_URL in
// the host's environment variables once the production domain is known,
// so absolute OG/Twitter/canonical URLs resolve correctly.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fine Lanka Tours — Journey Beyond Expectations',
    template: '%s',
  },
  description:
    'Fine Lanka Tours designs considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage, planned with local knowledge and care in the details.',
  icons: {
    // Google Search only shows favicons in a specific set of formats
    // (BMP, GIF, ICO, PNG, JPEG, PPM, TIFF — no WebP, no SVG, per
    // Google's own favicon documentation, updated 2026-08-28). The
    // previous value here (logo-site.webp) was also declaring
    // `type: 'image/png'` on a .webp file, a mismatch on top of the
    // unsupported format.
    //
    // icon-light-32x32.png/icon.svg used to be Vercel's default
    // v0-scaffold placeholder image (leftover from project setup,
    // never actually removed) — switching the code to reference them
    // without also fixing their pixel content would have kept Google
    // showing that placeholder, just in a supported format instead of
    // an unsupported one. Both files now contain a proper crop of the
    // real logo's circular emblem (elephants/palms/sunset, no wordmark
    // text, since that's illegible at real favicon sizes), and a full
    // size set (16/32/48/192/512 + a multi-res favicon.ico) was
    // generated from the same crop for broader browser support beyond
    // just Google Search's specific favicon requirements.
    //
    // apple-touch-icon also switched from the full-resolution WebP
    // logo to a properly cropped/sized PNG: WebP support for
    // apple-touch-icon specifically is inconsistent across Safari/iOS
    // versions (separately from Google's favicon restriction above,
    // which doesn't apply to apple-touch-icon at all), and the full
    // logo's wordmark text is illegible at typical apple-touch-icon
    // display sizes regardless of format.
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-light-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/icon-light-32x32.png',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Fine Lanka Tours',
    title: 'Fine Lanka Tours — Journey Beyond Expectations',
    description:
      'Considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage.',
    images: [
      {
        url: '/images/fine-lanka-about-heritage-hero.webp',
        width: 2560,
        height: 1440,
        alt: 'Sigiriya rock fortress seen from a heritage fresco border, Sri Lanka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fine Lanka Tours — Journey Beyond Expectations',
    description:
      'Considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage.',
    images: ['/images/fine-lanka-about-heritage-hero.webp'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f1b2b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable} bg-background`}
    >
      <body className="antialiased">
        {/* TravelAgency structured data (JSON-LD) — helps Google associate
           this exact business name/phone/address with the site for brand
           searches, and is a prerequisite for things like a sitelinks
           search box or knowledge-panel-style results. No `sameAs` yet
           since there are no linked social profiles in the codebase —
           add each verified profile URL here once those exist. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: SITE.brand,
              description:
                'Fine Lanka Tours designs considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage.',
              url: SITE_URL,
              logo: `${SITE_URL}/images/logo-site.webp`,
              telephone: SITE.phone,
              email: SITE.email,
              foundingDate: String(SITE.foundedYear),
              address: {
                '@type': 'PostalAddress',
                streetAddress: SITE.address,
                addressCountry: 'LK',
              },
              areaServed: {
                '@type': 'Country',
                name: 'Sri Lanka',
              },
            }),
          }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
        <EnquiryModal />

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
