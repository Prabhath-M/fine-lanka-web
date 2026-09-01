/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phase 10 / cPanel hosting: produces a self-contained server bundle
  // (its own minimal node_modules + a server.js entry point) instead of
  // relying on Vercel-specific build output. This is what a plain
  // Node.js host (cPanel's "Setup Node.js App", a VPS, etc.) needs —
  // Vercel deployments work fine with or without this setting, so it's
  // safe to keep even though this project also deploys there for
  // previews.
  output: 'standalone',
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
