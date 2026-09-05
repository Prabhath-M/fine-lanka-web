import type { Metadata } from 'next'
import { ContactPage } from '@/components/contact-page'

export const metadata: Metadata = {
  title: 'Contact — Fine Lanka Tours',
  description:
    'Get in touch with Fine Lanka Tours — phone, email, and address, or send a message directly and a Sri Lanka-based travel designer will follow up.',
  alternates: { canonical: '/contact' },
}

export default function Page() {
  return <ContactPage />
}
