import { Analytics } from '@vercel/analytics/next'
/* Ceylon Field Notes: retain elegant field typography and use the company
   logo consistently in browser chrome. */
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
        url: '/images/logo-site.png',
        type: 'image/png',
      },
    ],
    apple: '/images/logo-site.png',
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
        <SiteHeader />
        {children}
        <SiteFooter />
        <EnquiryModal />

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
