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

export const metadata: Metadata = {
  title: "The Ship's Log — Fine Lanka Tours",
  description:
    'Cross the ancient doorway into the chronicles of Fine Lanka Tours — field notes from sunrise climbs, hill-country trains and whales before breakfast across Sri Lanka.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/milk-rice-compass-grain-mark.png',
        type: 'image/png',
      },
    ],
    apple: '/images/milk-rice-compass-grain-mark.png',
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
