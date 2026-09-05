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
    // unsupported format. Switched to the real PNG already sitting in
    // public/ but unused. apple-touch-icon isn't subject to the same
    // Google Search restriction, so it's left as the higher-resolution
    // WebP logo for now.
    icon: [
      {
        url: '/icon-light-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    shortcut: '/icon-light-32x32.png',
    apple: '/images/logo-site.webp',
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
