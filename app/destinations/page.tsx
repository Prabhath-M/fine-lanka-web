import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DestinationsPage } from '@/components/destinations-page'

export const metadata: Metadata = {
  title: 'Destinations — Fine Lanka Tours',
  description:
    "Explore Sri Lanka by region with Fine Lanka Tours — the Cultural Triangle, Hill Country, South Coast, East Coast, wildlife parks, Colombo and the West Coast.",
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DestinationsPage />
    </Suspense>
  )
}
