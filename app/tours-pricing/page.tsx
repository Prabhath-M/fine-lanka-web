import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ToursPricingPage } from '@/components/tours-pricing-page'

export const metadata: Metadata = {
  title: 'Tours & Pricing — Fine Lanka Tours',
  description:
    'Sample tailor-made Sri Lanka tour packages and indicative pricing from Fine Lanka Tours — wildlife, hill country, beaches, culture, honeymoons and adventure.',
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ToursPricingPage />
    </Suspense>
  )
}
