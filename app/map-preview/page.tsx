import type { Metadata } from 'next'
import { RouteMapPreview } from '@/components/route-map-preview'

// Internal preview route — deliberately left out of app/sitemap.ts's
// ROUTES list already; noindex here too so it can't compete with the
// real public pages for indexing/ranking if it's ever linked anywhere
// or crawled directly.
export const metadata: Metadata = {
  title: 'Route Atlas Preview | Fine Lanka Tours',
  description: 'Explore a connected interactive atlas of Fine Lanka Tours airport-to-airport journeys across the latest illustrated Sri Lankan map.',
  robots: { index: false, follow: false },
}

export default function MapPreviewPage() {
  return <RouteMapPreview />
}
