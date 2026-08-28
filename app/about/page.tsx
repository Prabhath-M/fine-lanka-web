import type { Metadata } from 'next'
import { AboutPage } from '@/components/about-page'

/** Design reminder: keep this route a calm heritage folio, with a clear
 * path back into the island's destinations and enquiry flow. */
export const metadata: Metadata = {
  title: 'About Us — Fine Lanka Tours',
  description:
    'Meet Fine Lanka Tours, a Sri Lanka-based travel studio shaping considered journeys around cultural depth, local knowledge, and care in the details.',
}

export default function Page() {
  return <AboutPage />
}
