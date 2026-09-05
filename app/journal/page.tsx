import type { Metadata } from 'next'
import { JournalPage } from '@/components/journal-page'

export const metadata: Metadata = {
  title: "The Ship's Log — Fine Lanka Tours",
  description:
    'Field notes from sunrise climbs, hill-country trains and whales before breakfast — the Fine Lanka Tours journal of Sri Lanka.',
  alternates: { canonical: '/journal' },
}

export default function Page() {
  return <JournalPage />
}
