import type { Metadata } from 'next'
import { RouteMapPreview } from '@/components/route-map-preview'

export const metadata: Metadata = {
  title: 'Route Atlas Preview — Fine Lanka Tours',
  description: 'A preview of Fine Lanka Tours itinerary routes traced over Sri Lankan road corridors.',
}

export default function Page() {
  return <RouteMapPreview />
}
