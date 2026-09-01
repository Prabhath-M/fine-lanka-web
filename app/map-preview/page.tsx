import type { Metadata } from 'next'
import { RouteMapPreview } from '@/components/route-map-preview'

export const metadata: Metadata = {
  title: 'Route Atlas Preview | Fine Lanka Tours',
  description: 'Explore a sample interactive overlay for Fine Lanka Tours routes across the latest illustrated Sri Lankan atlas.',
}

export default function MapPreviewPage() {
  return <RouteMapPreview />
}
