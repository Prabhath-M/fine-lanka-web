import type { Metadata } from 'next'
import { HomePage } from '@/components/home-page'

export const metadata: Metadata = {
  title: 'Fine Lanka Tours — Journey Beyond Expectations',
  description:
    'Fine Lanka Tours designs considered, small-group journeys across Sri Lanka — hill-country trains, ancient rock fortresses, whale watching and cultural heritage, planned with local knowledge and care in the details.',
  alternates: { canonical: '/' },
}

export default function Page() {
  return <HomePage />
}
