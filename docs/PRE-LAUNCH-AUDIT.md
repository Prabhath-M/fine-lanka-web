# Fine Lanka Tours — Pre-Launch Audit & To-Do List

Findings are based on a direct inspection of the codebase (not guesses) — file
sizes, `npm audit`, grepping every source file for references, running the
dev server, etc. Organized into small phases so you can tackle and ship them
one at a time rather than as one giant task. Do them roughly in order —
later phases assume earlier ones are done.

Not included per your note: destination video files (`public/videos/destinations/`)
— you're adding those yourself.

> **Tracking:** this file is the live checklist for the pre-launch audit. Check items off in the PR that completes them. See git history / PRs for what changed and when.

---

## Phase 1 — Remove legacy & dev files
Small, safe, zero-risk deletions. Do this first so later phases aren't
auditing dead code.

- [x] Delete the leftover pre-Next.js static site sitting in `public/`:
  `public/index.html`, `public/destinations.html`, `public/tours-pricing.html`,
  `public/booking.html`, `public/css/style.css`, `public/js/*.js`.
  These are the **old site** the Next.js app replaced. `next.config.mjs`
  even has a comment saying they were "deleted in Phases 3–6" of the
  migration — they weren't. Because they live in `public/`, Next.js will
  serve them as real, working pages at `/index.html`, `/booking.html`, etc.,
  *alongside* your real `/` and `/booking` routes — duplicate content,
  confusing for search engines, and a maintenance trap (someone edits the
  real page and wonders why "the site" didn't change).
- [x] Delete `app/nav-preview/` and `components/mural-nav.tsx`. This is a
  component-preview page left over from development — it's not linked from
  anywhere in the real site, but it's still a public, indexable route right
  now (`/nav-preview`).
- [x] Delete the one-off scratch files in the repo root: `tmp_logo_edit.py`,
  `tmp_logo_fix.py`, `tmp_logo_reflection.py`, `globals.css.patch`,
  `typed-opening.tsx.patch`.
- [x] Decide what to do with the planning docs in the repo root
  (`MIGRATION_PLAN.md`, `ASSET_NOTES.md`, `ASSET_SOURCES.md`, `ideas.md`,
  `todo.md`, `SUMMARY.md`, `UPDATE_NOTES.md`, and the four separate
  `README*.md` files). None of these ship to the live site, but consolidate
  down to one `README.md` before you hand this off to anyone else —  right
  now there are 4 different READMEs with overlapping/conflicting info.
- [x] Pick **one** package manager. The repo currently has both
  `package-lock.json` (npm) *and* `pnpm-lock.yaml` + `pnpm-workspace.yaml`
  (pnpm). Mixing them risks the two lockfiles drifting out of sync and
  someone installing different dependency versions than you tested with.
  Delete whichever one you're not using.
- [x] Delete the unused template placeholder assets left over from the
  original scaffold — confirmed unreferenced anywhere in the code:
  `public/placeholder-logo.png`, `public/placeholder-logo.svg`,
  `public/placeholder-user.jpg`, `public/placeholder.jpg`,
  `public/apple-icon.png`, `public/icon-dark-32x32.png`.

---

## Phase 2 — Unused media cleanup
`public/images/` is **443 MB**. I cross-referenced every filename against
every `.ts`/`.tsx`/`.css` file in the project; **57 files (~112 MB) are not
referenced anywhere** and are safe to delete. Worth doing as its own phase
since it's the single biggest chunk of repo weight.

- [ ] Delete the confirmed-unused images (full list — verify once more
  yourself before deleting, in case something loads a filename dynamically
  in a way my search missed):
  `ask1.png`, `ask2.png`, `caption-sigiri-liyawel-bg.png`, `carved-stone.png`,
  `destination-video-frame.png`, `destinations-compass-mark.png`,
  `destinations1.png`, `direction.png`, `direction2.png`,
  `dropdown-crest-destinations.png`, `dropdown-crest-tours.png`,
  `dropdown-frame-bottom.png`, `dropdown-frame-middle.png`,
  `dropdown-frame-top.png`, `dropdown-frame.png`, `dropdown-liyawel-divider.png`,
  `fine-lanka-compact-journey-heritage-bg.jpg`, `fine-lanka-compact-sigiriya-dancers.jpg`,
  `fine-lanka-explore-video-frame-kandyan-brasswork-uploaded.png`,
  `fine-lanka-explore-video-frame-refined.png`,
  `fine-lanka-explore-video-frame-temple-ledger.png`,
  `fine-lanka-moonstone-liyawel-symbol.png`, `fine-lanka-nav-desktop-bar-1280x80.png`,
  `fine-lanka-nav-heritage-texture.png`, `fine-lanka-nav-metallic-heritage.png`,
  `fine-lanka-nav-responsive-border-wall-2048x144.png`,
  `fine-lanka-nav-sigiriya-jewel-banner-shallow.png`,
  `fine-lanka-nav-sigiriya-jewel-heritage.png`, `fine-lanka-process-route-background.png`,
  `general.png`, `icon-crossed-swords.png`, `icon-lotus-motif.png`, `icon-tureen.png`,
  `journal/ella-train-refined.png`, `journal/kandy-temple-refined.png`,
  `journal/mannar-ramayana-refined.png`, `journal/mirissa-whale-refined.png`,
  `journal/sigiriya-pidurangala-refined.png`, `journal/yala-leopard-refined.png`,
  `logo-full.png`, `logo-site-backup.png`, `lotus-badge.png`, `mural-emboss.png`,
  `nav-border-option-1-deep-jade-2048x144.png`, `nav-border-option-2-sapphire-2048x144.png`,
  `nav-border-option-3-light-sandstone-2048x144.png`,
  `nav-border-sapphire-uniform-tile-512x144.png`, `navbar_backdrop_5.png`,
  `notify.png`, `plan.png`, `sri-lanka-map.jpg`, `tour-beach.png`,
  `tour-cultural-historical.png`, `tour-nature.png`, `tour-ramayana-trails.png`,
  `tour-romantic.png`.
  ⚠️ A few of these look like **near-duplicates of images that *are* in
  use** (e.g. `journal/*-refined.png` vs. whatever's actually wired into
  `lib/journal-data.ts`, `navbar_backdrop_5.png` vs `navbar_backdrop_2/3/4.png`
  which *are* used). Worth a quick manual glance before bulk-deleting in
  case one was meant to replace another and the swap never got finished.
- [ ] After deleting, re-run a search for any filename you're unsure about
  before removing it — grep the whole `components/`, `lib/`, and
  `app/globals.css` for the filename first.

---

## Phase 3 — Image weight & optimization
This is the biggest real performance problem on the site.

- [ ] `next.config.mjs` currently has **`images: { unoptimized: true }`**,
  which switches off all of Next.js's automatic image optimization
  (resizing, WebP/AVIF conversion, responsive `srcset`). Combined with the
  raw image weight, this means visitors are downloading full-size,
  unconverted PNGs/JPGs. Turn this off (remove the flag) once you've done
  the manual compression below, or leave it on temporarily but prioritize
  the manual pass — `unoptimized` alone won't fix files that are 6–16 MB to
  start with.
- [ ] Compress and resize the large background/hero images before upload —
  several are 6–16 MB as PNG for what's ultimately a full-bleed background
  photo (`how-it-works-exploration-bg.jpg` is 16 MB; a dozen others are
  6–8 MB). Convert decorative background PNGs to JPEG or WebP at a
  sensible quality (80–85%) and cap dimensions at roughly what's actually
  displayed (most of these don't need to be wider than ~2560px).
- [ ] Re-check `sizes` props on any `next/image` usage once optimization is
  back on, so the browser isn't served a desktop-width image on mobile.

---

## Phase 4 — Fix missing / placeholder links
Every one of these is a real `href="#"` (or unset) link right now — they
render as normal-looking buttons/links but go nowhere.

- [ ] Footer → "Fine Lanka Tours" column: **Careers** and **Contact** both
  link to `#`.
- [ ] Footer → "Legal" column: **Privacy Notice**, **Booking Terms**, and
  **Cookie Policy** all link to `#`. These matter more than they might
  seem — a live site collecting names/emails/phone numbers through the
  booking and newsletter forms should have an actual privacy policy before
  launch, not just for legal reasons but because it's linked from data
  collection forms.
- [ ] Footer socials: **Facebook**, **Instagram**, **LinkedIn** icons all
  link to `#`. Either wire up the real profile URLs or remove the icons —
  a social icon that goes nowhere looks broken/unfinished to a visitor.
  (`lib/site-data.ts`, `SOCIAL_LINKS`)
- [ ] All of the above are in one place: `lib/site-data.ts` —
  `FOOTER_COLUMNS` and `SOCIAL_LINKS`. Quick fix once you have the real
  URLs.

---

## Phase 5 — SEO & metadata
- [ ] **The homepage has no metadata of its own.** Every other page
  (`/about`, `/destinations`, `/tours-pricing`, `/booking`) sets its own
  `<title>`/description, but `app/page.tsx` doesn't — so it falls back to
  the root layout's default, which is titled **"The Ship's Log — Fine Lanka
  Tours"** with a journal-flavored description. That means your homepage —
  the page most likely to show up in search results and get shared — is
  currently titled and described like a blog post. Add a proper `metadata`
  export to `app/page.tsx`.
- [ ] No Open Graph or Twitter Card tags anywhere (`openGraph`/`twitter` in
  the `Metadata` object) — right now a link to any page shared on
  WhatsApp/Facebook/X/iMessage will show no preview image and a generic
  title. Worth adding at least a site-wide default in `app/layout.tsx`,
  plus a per-page image for the homepage.
- [ ] No `robots.txt` or `sitemap.xml`. Add `app/robots.ts` and
  `app/sitemap.ts` (Next's App Router convention) so search engines know
  what to index.
- [ ] No custom `not-found.tsx` — a mistyped URL currently shows Next's
  bare default 404. A styled one matching the site is a small, cheap win.
- [ ] `metadata.generator: 'v0.app'` in `app/layout.tsx` reveals the
  scaffolding tool used to build the site — harmless, but worth removing
  for a polished public launch.

---

## Phase 6 — Rendering & code-quality cleanup
- [ ] **Every internal link on the site is a plain `<a href="...">` instead
  of Next.js's `<Link>` component** — I checked, there are zero uses of
  `next/link` anywhere in `components/` or `app/`. This means every click
  between pages (footer links, "Book Now", destination cards, etc.) does a
  full browser page reload instead of Next's fast client-side navigation —
  you're not getting the performance Next.js is actually built to provide.
  Swap `<a href="/...">` → `<Link href="/...">` for every *internal* link
  (external links and the `#anchor` links can stay as `<a>`).
- [ ] Fonts are being loaded **twice**: once properly via `next/font/google`
  (self-hosted, optimized, no render-blocking request) in `app/layout.tsx`,
  and *again* via a classic `<link href="https://fonts.googleapis.com/...">`
  tag in the same file. Pick one — since `next/font` is already set up
  correctly, just delete the three `<link>` tags (`preconnect` ×2 +
  stylesheet) and confirm the CSS variables (`--font-display` etc. in
  `globals.css`) point at the `next/font` output instead.
- [ ] `app/globals.css` is **16,300+ lines / 572 KB**, all loaded on every
  single page. A lot of it is layered, superseding rewrites of the same
  selectors (e.g. `.booking-page .booking-layout` is redefined from scratch
  6+ separate times further down the file, each block overriding the last
  — only the final one actually matters, the earlier five are dead weight
  the browser still has to parse). Worth a consolidation pass: for each
  selector, keep only the last/effective declaration and delete the
  superseded versions. This won't change how the site looks (the cascade
  already ignores the dead rules) — it just cuts real weight and makes the
  file maintainable again.
- [ ] `typescript: { ignoreBuildErrors: true }` in `next.config.mjs` means
  the production build will succeed even if there are real type errors —
  effectively flying blind. Turn this off, run a build, and fix whatever
  surfaces before launch.

---

## Phase 7 — Dependency updates & known vulnerabilities
Ran `npm audit` — **8 vulnerabilities (7 high, 1 moderate)**, all stemming
from an outdated Next.js:

- [ ] Next.js is pinned to `16.2.6`; latest is `16.3.3`. The audit flags
  **7 high-severity issues** fixed in the newer version, including a
  middleware/proxy bypass, a couple of SSRF issues (server actions and
  rewrites), a cache-confusion bug, a DoS in the image optimization API,
  and unauthenticated disclosure of internal server-function endpoints.
  Update Next.js — this also pulls in a patched `postcss` (fixes an XSS +
  several path-traversal/source-map disclosure issues) as a transitive
  dependency.
- [ ] `sharp` (used by Next's image pipeline) is also flagged for
  inherited `libvips` vulnerabilities — the Next.js update should resolve
  this too since it's a transitive dependency; just confirm with a fresh
  `npm audit` after.
- [ ] Re-run `npm audit` after updating and confirm it comes back clean
  before launch.

---

## Phase 8 — Security hardening
- [ ] No security headers are configured at all (`next.config.mjs` has no
  `headers()` function). Before launch, add at minimum:
  `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY` (or a `frame-ancestors` CSP directive), and a
  basic `Content-Security-Policy`.
- [ ] All three lead-capture forms (booking, the enquiry modal, newsletter
  signup) currently have **no backend and no bot/spam protection** — see
  Phase 9. Once they're wired to a real endpoint, add a honeypot field or
  lightweight CAPTCHA (e.g. Cloudflare Turnstile) plus basic server-side
  rate limiting, or you'll get spam-submitted the day the forms go live and
  start actually sending somewhere.
- [ ] Once you pick a hosting/deploy target, make sure any real secrets
  (email API key, CRM token, etc. from Phase 9) go into environment
  variables / your host's secret manager — never committed to the repo.
  Nothing is hardcoded right now (checked), just flagging it as a rule to
  keep once real integrations are added.

---

## Phase 9 — Forms need a real backend
Right now the booking form, the enquiry modal, and the newsletter signup
all do client-side validation only and show a fake "Thanks, we'll be in
touch" message — **nothing is actually sent anywhere**. This is fine for a
demo but is presumably not fine for launch.

- [ ] Decide where enquiries should land — email (e.g. via Resend/Postmark/
  SendGrid), a CRM, or a simple database + admin view — and wire the
  `onSubmit` handlers in `components/booking-page.tsx`,
  `components/enquiry-modal.tsx`, and `components/home/newsletter.tsx` to
  a real API route.
- [ ] Add server-side validation to match (don't rely on the client-side
  `checkValidity()` alone — anyone can bypass that).
- [ ] Decide what confirmation the *customer* gets (auto-reply email?) in
  addition to your team being notified.

---

## Phase 10 — Final pre-launch QA
Do this last, once everything above is done.

- [ ] Add the destination video files per `public/videos/destinations/README.md`
  (your note — just listing it here so it's on the one master checklist).
  When you do, keep clips short (6–15s) and compressed — same size
  discipline as Phase 3, since these autoplay.
- [ ] Full click-through of every nav link, footer link, and CTA button on
  a production build (`npm run build && npm run start`), not just `next dev`.
- [ ] Run Lighthouse (or PageSpeed Insights) against the production build
  after Phases 3, 6, and 7 — should show a real jump in performance score
  once the image weight and CSS bloat are addressed.
- [ ] Test the booking/enquiry/newsletter forms end-to-end after Phase 9 —
  confirm the email/CRM notification actually arrives.
- [ ] Cross-browser check (Chrome, Safari, Firefox) and mobile check —
  the site leans heavily on custom-styled form controls and layered
  background art, worth a manual look on at least one real iOS and one
  real Android device.
- [ ] Confirm `robots.txt`/`sitemap.xml` (Phase 5) are reachable at their
  real URLs after deploy, and submit the sitemap in Google Search Console.
