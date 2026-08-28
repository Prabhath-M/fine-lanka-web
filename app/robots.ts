import type { MetadataRoute } from 'next'

// Same NEXT_PUBLIC_SITE_URL fallback as app/layout.tsx — set it in the
// host's environment variables once the production domain is known.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
