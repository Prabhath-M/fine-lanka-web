/** @type {import('next').NextConfig} */
const isVercelBuild = process.env.VERCEL === '1' || process.env.VERCEL === 'true'

const nextConfig = {
  // Keep the self-contained server bundle for cPanel / VPS deployments.
  // Vercel supplies its own Next.js output adapter; leaving `standalone`
  // enabled there can remove the `.nft.json` manifest expected by Vercel's
  // post-build hook.
  ...(isVercelBuild ? {} : { output: 'standalone' }),
  // docs/MEDIA-OPTIMIZATION.md's Phase 2b established a site-wide policy:
  // nothing is ever served above 1600px wide, regardless of screen size —
  // applied by hand to every CSS background-image and plain <img> on the
  // site. The two next/image usages (this map, journal-page.tsx) were
  // missed, since next/image generates its own responsive variants
  // on-demand rather than reading from that manually-capped set. Left at
  // Next's default deviceSizes, that array goes up to 3840px — so a wide,
  // high-DPI screen could trigger an on-demand 3840px resize through
  // next/image's live sharp-based optimizer, exactly the kind of
  // expensive per-request server-side work this project has otherwise
  // gone out of its way to avoid on this memory-constrained cPanel host
  // (see the "why this wasn't caught by next/image" note near the top of
  // MEDIA-OPTIMIZATION.md). Capping deviceSizes here brings next/image
  // in line with the same 1600px ceiling already enforced everywhere
  // else, and should be revisited if a genuinely full-bleed next/image
  // usage is ever added that needs to exceed it.
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
  },
  // Phase 8 of the pre-launch audit: baseline security headers. The site
  // is fully self-contained right now — no external scripts, fonts,
  // analytics, or image hosts (next/font self-hosts Google Fonts, all
  // images are served from /public) — so the CSP below is intentionally
  // strict. If a third-party embed (payment widget, analytics, map, etc.)
  // is added later, its origin needs to be added to the relevant
  // directive here or it will be silently blocked.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js needs 'unsafe-inline' for its own hydration/RSC
              // bootstrap scripts in dev and some prod configurations;
              // 'unsafe-eval' is dev-only (React Refresh) but harmless to
              // leave since this header applies to both.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // docs/MEDIA-OPTIMIZATION.md flagged this as the remaining gap after
      // Phases 1-3 (format/quality, dimensions, next/image deviceSizes):
      // no Cache-Control policy existed at all for static assets under
      // public/, so every image/video re-validates with the server on
      // every single page view - even repeat visits to a page whose
      // media hasn't changed. next/image's own on-demand-optimized output
      // (/_next/image) and Next's own build output (/_next/static/*) both
      // already get long-lived immutable caching automatically from
      // Next.js itself; this only needed adding for the plain files
      // served as-is from public/.
      //
      // `immutable, max-age=31536000` (1 year) is safe here specifically
      // because of how this project's media-optimization work is done:
      // every conversion/resize swaps in a file under its existing name
      // rather than editing bytes in place (see MEDIA-OPTIMIZATION.md's
      // "How to resume" - variants get their own distinct filenames,
      // e.g. `-960w`/`-1600w` suffixes). If that convention ever changes
      // (a file's content updated while keeping the exact same name),
      // visitors with a cached copy won't see the update for up to a
      // year - rename the file (or add a cache-busting query/version)
      // instead of overwriting in place.
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/mural/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source:
          '/:path(icon-light-32x32\\.png|icon\\.svg|placeholder\\.svg|favicon\\.ico|favicon-16x16\\.png|favicon-48x48\\.png|apple-touch-icon\\.png|icon-192x192\\.png|icon-512x512\\.png)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // The route-atlas map data is structured content, not a media
      // file - it could plausibly be updated (a destination added/
      // edited) without the filename changing, unlike the media files
      // above. A much shorter cache with revalidation avoids visitors
      // getting stuck with stale map data for a year after an update.
      {
        source: '/data/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }],
      },
    ]
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
