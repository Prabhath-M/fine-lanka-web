import type { Metadata } from 'next'
import { RouteMapPreview } from '@/components/route-map-preview'

export const metadata: Metadata = {
  title: 'Route Atlas Preview | Fine Lanka Tours',
  description: 'Explore a connected interactive atlas of Fine Lanka Tours airport-to-airport journeys across the latest illustrated Sri Lankan map.',
}

export default function MapPreviewPage() {
  return <RouteMapPreview />
}
