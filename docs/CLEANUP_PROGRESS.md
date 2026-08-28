# Pre-Launch Cleanup — Progress Tracker

Living checklist tracking the pre-launch audit phases. Each phase is done
on its own branch and merged via PR, in order — later phases assume
earlier ones are done. This file is updated as each phase ships.

Full original findings/rationale: `docs/archive/` (see the pre-launch audit
notes) — this file tracks status, not the detailed reasoning.

---

## Phase 1 — Remove legacy & dev files ✅ Done
PR #1 — merged into `main` (squash commit `20b3c4b`)

- [x] Delete leftover pre-Next.js static site in `public/` (`index.html`,
      `destinations.html`, `tours-pricing.html`, `booking.html`,
      `css/style.css`, `js/*.js`)
- [x] Delete `app/nav-preview/` and `components/mural-nav.tsx`
- [x] Delete one-off scratch files (`tmp_logo_*.py`, `*.patch`)
- [x] Consolidate planning docs — single root `README.md`, old docs/READMEs
      moved to `docs/archive/`
- [x] Pick one package manager — standardized on **pnpm**, removed
      `package-lock.json`
- [x] Delete unused template placeholder assets (`placeholder-*`,
      `apple-icon.png`, `icon-dark-32x32.png`)

---

## Phase 2 — Unused media cleanup ⏳ Not started
`public/images/` is 443 MB; ~57 files (~112 MB) are unreferenced.

- [ ] Delete confirmed-unused images (re-verify each before deleting)
- [ ] Manually check near-duplicate risks before bulk-deleting (e.g.
      `journal/*-refined.png` vs what's wired into `lib/journal-data.ts`;
      `navbar_backdrop_5.png` vs the in-use `navbar_backdrop_2/3/4.png`)

---

## Phase 3 — Image weight & optimization ⏳ Not started
- [ ] Turn off `images: { unoptimized: true }` in `next.config.mjs` once
      manual compression is done
- [ ] Compress/resize large background/hero images (several 6–16MB)
- [ ] Re-check `sizes` props on `next/image` usage

---

## Phase 4 — Fix missing / placeholder links ⏳ Not started
- [ ] Footer "Fine Lanka Tours" column: Careers, Contact (currently `#`)
- [ ] Footer "Legal" column: Privacy Notice, Booking Terms, Cookie Policy
      (currently `#`)
- [ ] Footer socials: Facebook, Instagram, LinkedIn (currently `#`)
- [ ] All fixes live in `lib/site-data.ts` (`FOOTER_COLUMNS`,
      `SOCIAL_LINKS`)

---

## Phase 5 — SEO & metadata ⏳ Not started
- [ ] Add `metadata` export to `app/page.tsx` (homepage currently falls
      back to the journal-flavored root layout metadata)
- [ ] Add Open Graph / Twitter Card tags (`app/layout.tsx` + per-page)
- [ ] Add `app/robots.ts` and `app/sitemap.ts`
- [ ] Add custom `not-found.tsx`
- [ ] Remove `metadata.generator: 'v0.app'` from `app/layout.tsx`

---

## Phase 6 — Rendering & code-quality cleanup ⏳ Not started
- [ ] Swap internal `<a href="/...">` → `next/link`'s `<Link>` (zero
      current usage of `next/link` in `components/`/`app/`)
- [ ] Remove duplicate font loading — keep `next/font/google`, delete the
      classic `<link>` Google Fonts tags in `app/layout.tsx`
- [ ] Consolidate `app/globals.css` (16,300+ lines / 572KB) — remove
      superseded duplicate selector blocks
- [ ] Turn off `typescript: { ignoreBuildErrors: true }`, fix what
      surfaces

---

## Phase 7 — Dependency updates & known vulnerabilities ⏳ Not started
`npm audit`: 8 vulnerabilities (7 high, 1 moderate), all from outdated
Next.js.

- [ ] Update Next.js `16.2.6` → `16.3.3`
- [ ] Confirm `sharp`/`libvips` vulnerabilities resolve as a transitive
      dependency of the Next.js update
- [ ] Re-run audit, confirm clean

---

## Phase 8 — Security hardening ⏳ Not started
- [ ] Add security headers in `next.config.mjs` (`headers()`):
      `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
      `X-Frame-Options: DENY` / `frame-ancestors`, basic CSP
- [ ] Add honeypot/CAPTCHA + rate limiting to lead-capture forms once
      Phase 9 backends exist
- [ ] Real secrets (email API key, CRM token) go into env vars / host
      secret manager, never committed

---

## Phase 9 — Forms need a real backend ⏳ Not started
Booking form, enquiry modal, and newsletter signup are client-side only
right now — nothing is actually sent anywhere.

- [ ] Decide where enquiries land (email via Resend/Postmark/SendGrid, a
      CRM, or DB + admin view) and wire up `components/booking-page.tsx`,
      `components/enquiry-modal.tsx`, `components/home/newsletter.tsx`
- [ ] Add server-side validation (don't rely on client `checkValidity()`
      alone)
- [ ] Decide on customer-facing confirmation (auto-reply email?)

---

## Phase 10 — Final pre-launch QA ⏳ Not started
- [ ] Add destination video files per
      `public/videos/destinations/README.md`
- [ ] Full click-through of every nav/footer/CTA link on a production
      build (`npm run build && npm run start`)
- [ ] Run Lighthouse/PageSpeed against the production build after
      Phases 3, 6, 7
- [ ] Test booking/enquiry/newsletter forms end-to-end after Phase 9
- [ ] Cross-browser + mobile check (Chrome, Safari, Firefox; real iOS +
      Android device)
- [ ] Confirm `robots.txt`/`sitemap.xml` reachable post-deploy, submit
      sitemap in Google Search Console
