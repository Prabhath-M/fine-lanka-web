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
