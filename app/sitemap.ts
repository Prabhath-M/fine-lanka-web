import type { MetadataRoute } from 'next'

// Same NEXT_PUBLIC_SITE_URL fallback as app/layout.tsx — set it in the
// host's environment variables once the production domain is known.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// No dynamic routes exist yet (no [slug] pages under app/) — this is a
// flat list of every real page. Add entries here if dynamic destination/
// tour detail routes are introduced later.
const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/destinations', priority: 0.9 },
  { path: '/tours-pricing', priority: 0.9 },
  { path: '/about', priority: 0.7 },
  { path: '/journal', priority: 0.7 },
  { path: '/booking', priority: 0.8 },
  { path: '/contact', priority: 0.6 },
  { path: '/privacy', priority: 0.2 },
  { path: '/booking-terms', priority: 0.2 },
  { path: '/cookie-policy', priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    priority,
  }))
}
