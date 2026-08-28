import { Analytics } from '@vercel/analytics/next'
/* Ceylon Field Notes: retain elegant field typography with a high-contrast,
   standalone compass-grain mark used consistently in browser chrome. */
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, Space_Mono } from 'next/font/google'
import { EnquiryModal } from '@/components/enquiry-modal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
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
    default: 'Fine Lanka Tours — Considered Journeys Across Sri Lanka',
    template: '%s',
  },
  description:
    'Fine Lanka Tours designs considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage, planned with local knowledge and care in the details.',
  icons: {
    icon: [
      {
        url: '/images/milk-rice-compass-grain-mark.png',
        type: 'image/png',
      },
    ],
    apple: '/images/milk-rice-compass-grain-mark.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Fine Lanka Tours',
    title: 'Fine Lanka Tours — Considered Journeys Across Sri Lanka',
    description:
      'Considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage.',
    images: [
      {
        url: '/images/fine-lanka-about-heritage-hero.jpg',
        width: 2560,
        height: 1440,
        alt: 'Sigiriya rock fortress seen from a heritage fresco border, Sri Lanka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fine Lanka Tours — Considered Journeys Across Sri Lanka',
    description:
      'Considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage.',
    images: ['/images/fine-lanka-about-heritage-hero.jpg'],
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
        {/* app/globals.css (which now includes the former public/css/style.css,
            folded in during Phase 7) defines its own --font-display/--font-body/
            --font-mono names ("Fraunces"/"Inter"/"Space Mono") independent of
            the next/font variables above, so the actual Google Fonts
            stylesheet is still needed here too. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
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
