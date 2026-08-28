/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Phase 8.2 of MIGRATION_PLAN.md: every page used to be a static file
  // at these *.html URLs (public/index.html, destinations.html,
  // tours-pricing.html, booking.html — all deleted in Phases 3-6 in
  // favour of real routes). Redirect them in case anything external
  // (search results, bookmarks, old marketing links) still points at
  // the old URLs. Query strings (e.g. ?region=…, ?category=…, ?tour=…)
  // are preserved automatically since none of these destinations
  // specify their own query string.
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/destinations.html', destination: '/destinations', permanent: true },
      { source: '/tours-pricing.html', destination: '/tours-pricing', permanent: true },
      { source: '/booking.html', destination: '/booking', permanent: true },
    ]
  },
}

export default nextConfig
