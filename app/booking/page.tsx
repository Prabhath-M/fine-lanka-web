import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BookingPage } from '@/components/booking-page'

export const metadata: Metadata = {
  title: 'Book Now — Fine Lanka Tours',
  description:
    'Start planning your tailor-made Sri Lanka trip with Fine Lanka Tours — tell us your dates and interests and a local travel designer will be in touch.',
  alternates: { canonical: '/booking' },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BookingPage />
    </Suspense>
  )
}
