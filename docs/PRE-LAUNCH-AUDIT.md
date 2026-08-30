# Fine Lanka Tours — Pre-Launch Audit & To-Do List

Findings are based on a direct inspection of the codebase (not guesses) — file
sizes, `npm audit`, grepping every source file for references, running the
dev server, etc. Organized into small phases so you can tackle and ship them
one at a time rather than as one giant task. Do them roughly in order —
later phases assume earlier ones are done.

Not included per your note: destination video files (`public/videos/destinations/`)
— you're adding those yourself.

> **Tracking:** this file is the live checklist for the pre-launch audit. Check items off in the PR that completes them. See git history / PRs for what changed and when.

> **Live test deployment:** `https://fine-lanka-web-rgle.vercel.app/` —
> deployed on Vercel's free tier for testing (not the final production
> domain). Forms confirmed working end-to-end here as of 2026-08-29.

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

- [x] Delete the confirmed-unused images (full list — verify once more
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
- [x] After deleting, re-run a search for any filename you're unsure about
  before removing it — grep the whole `components/`, `lib/`, and
  `app/globals.css` for the filename first.

  **Verification done:** re-grepped all 56 candidates individually against
  `app/`, `components/`, `lib/`, `next.config.mjs`, `package.json` — none
  referenced. Also specifically checked the two flagged near-duplicate
  cases: the `journal/*-refined.png` files use different filenames than
  what `lib/journal-data.ts` actually links to (e.g. `sunrise-over-the-
  lion-rock.png`, not `sigiriya-pidurangala-refined.png`) — confirmed dead.
  `navbar_backdrop_5.png` — only `_1`–`_4` are referenced in
  `app/globals.css` — confirmed dead. Two *other* `journal/` files with a
  similar `-refined.png` naming pattern (`portal-doors-refined.png`,
  `portal-realm-refined.png`, not on the original candidate list) were
  checked too and **are** actively used — correctly left alone.

  Result: 56 files / 112 MB deleted. `public/images/` went from 443 MB to
  331 MB.

  **Correction (post-launch-prep review):** 5 of the 56 were a false
  positive — `tour-beach.png`, `tour-cultural-historical.png`,
  `tour-nature.png`, `tour-ramayana-trails.png`, `tour-romantic.png`.
  They're loaded via a dynamic template string
  (`` `/images/tour-${tour.category}.png` `` in
  `components/tours/tour-picker-card.tsx` and `tour-card.tsx`), so a
  static filename grep can't see the reference — this is exactly the
  case the "verify once more yourself" warning above was meant to catch,
  and it slipped through. Restored from git history
  (`2afc027~1` → commit `aa8f7f0`); confirmed live via dev server that
  `/tours-pricing` serves all five correctly again.

  Re-swept the whole codebase afterward for other dynamic asset-path
  patterns (template literals, object/map lookups, `url(var(...))` in
  CSS) that could hide a reference the same way — none found. The only
  other dynamic path in the app is
  `` `/videos/destinations/${slug}.mp4` ``, which is the destination
  video files intentionally left for you to add (see note at the top of
  this doc) — not a bug.

  **Takeaway for future cleanup passes:** a plain grep for a literal
  filename is not sufficient verification when assets can be referenced
  by a computed/templated path. Grep for the *static prefix* too (e.g.
  `tour-` or `/videos/destinations/`) and check anywhere it's combined
  with a variable.

  Remaining 51 deletions re-verified clean with exact-filename matching
  (not substring) against `components/`, `app/`, `lib/`, and CSS.

---

## Phase 3 — Image weight & optimization
This is the biggest real performance problem on the site.

- [x] `next.config.mjs` currently has **`images: { unoptimized: true }`**,
  which switches off all of Next.js's automatic image optimization
  (resizing, WebP/AVIF conversion, responsive `srcset`). Combined with the
  raw image weight, this means visitors are downloading full-size,
  unconverted PNGs/JPGs. Turn this off (remove the flag) once you've done
  the manual compression below, or leave it on temporarily but prioritize
  the manual pass — `unoptimized` alone won't fix files that are 6–16 MB to
  start with.

  **Done:** flag removed. `sharp` (needed for self-hosted Next.js image
  optimization) is already present in `pnpm-lock.yaml` as a resolved
  dependency, so no `package.json` change was needed.
- [x] Compress and resize the large background/hero images before upload —
  several are 6–16 MB as PNG for what's ultimately a full-bleed background
  photo (`how-it-works-exploration-bg.jpg` is 16 MB; a dozen others are
  6–8 MB). Convert decorative background PNGs to JPEG or WebP at a
  sensible quality (80–85%) and cap dimensions at roughly what's actually
  displayed (most of these don't need to be wider than ~2560px).

  **Done:** `public/images/` goes from 331 MB → 97 MB. Broken down:
  - **7 files** were named `.jpg` but actually contained raw PNG data (a
    pre-existing bug) — re-encoded as real JPEGs in place, same filenames,
    so no code changes needed. `how-it-works-exploration-bg.jpg` alone
    went from 16.7 MB → 353 KB (it's a soft parchment-texture background,
    not a detailed photo, so it compresses extremely well as JPEG).
  - **2 files** were already genuine JPEGs but oversized (4272×2848,
    3712×5568) — resized to a 2560px cap and recompressed to quality 82.
  - **45 non-transparent PNGs** (backgrounds, journal photos, decorative
    art) converted to real JPEGs, renamed `.png` → `.jpg`, resized to a
    2560px cap on the long side (the four `blend-*.png` texture strips
    kept their original 8100×360 dimensions — unusual aspect ratio,
    didn't want to risk breaking a horizontal effect). Every reference to
    each renamed file was found and updated (`app/globals.css`,
    `.tsx` components, `lib/journal-data.ts`) — verified with a
    site-wide grep afterward that no dangling `.png` references remained
    and every path referenced in code resolves to a real file on disk.
  - **25 PNGs with real transparency** (frame/border art, logos) were kept
    as PNG (JPEG doesn't support alpha) but losslessly re-compressed;
    modest gains (~5–15%) on about half of them, no change on the rest —
    that's the safe ceiling without visible quality loss on this kind of
    graphic art. Lossy PNG palette-reduction could shrink these further
    but risks visible banding on gradients — flagging as a possible
    follow-up, not done here.
  - All conversions spot-checked visually (rendered thumbnails) before
    committing; none were blank, corrupted, or visibly degraded.
  - **Found in passing, not fixed (out of scope for this phase):**
    `app/globals.css` references `/images/fine-lanka-booking-details-bg.png`
    and `/images/fine-lanka-tours-collection-bg.png` — neither file has
    ever existed in the repo (confirmed back to the initial commit), so
    these were already dead CSS rules before this cleanup started. Worth
    a look during Phase 6 (rendering & code-quality cleanup).
- [x] Re-check `sizes` props on any `next/image` usage once optimization is
  back on, so the browser isn't served a desktop-width image on mobile.

  **Done:** checked all 4 `<Image>` usages (`components/journal-page.tsx`,
  `components/home/explore-section.tsx`). 3 already have appropriate
  `sizes` props; the 4th is a 1×1 hidden preload image (`width={1}
  height={1}`, `aria-hidden`) that doesn't need one. No changes required.

  **Re-verified (post-launch-prep review):** `unoptimized` flag confirmed
  absent from `next.config.mjs`; `sharp` present as a resolved dependency;
  sampled renamed `.jpg` files confirmed genuine JPEGs within the 2560px
  cap; all 4 blend texture strips still `8100×360`; all 4 `<Image>`
  `sizes` props as documented. The 2 dangling CSS refs
  (`fine-lanka-booking-details-bg.png`, `fine-lanka-tours-collection-bg.png`)
  are still the only unresolved image paths in the codebase — pre-existing,
  already deferred to Phase 6, not a new issue. No discrepancies found.

---

## Phase 4 — Fix missing / placeholder links
Every one of these is a real `href="#"` (or unset) link right now — they
render as normal-looking buttons/links but go nowhere.

- [x] Footer → "Fine Lanka Tours" column: **Careers** and **Contact** both
  link to `#`.

  **Done:** Careers removed entirely (not hiring — revisit in future).
  "Our Designers" also removed per owner's call. Contact now links to a
  new `/contact` page (`app/contact/page.tsx`,
  `components/contact-page.tsx`) with a client-side form (same
  no-backend-yet state as the booking form/enquiry modal — see Phase 9)
  plus a sidebar showing phone numbers, emails, address, and social
  links. Reuses the booking page's existing `.booking-layout`/
  `.booking-form` CSS classes (unscoped, so no new CSS needed for the
  layout itself).
- [x] Footer → "Legal" column: **Privacy Notice**, **Booking Terms**, and
  **Cookie Policy** all link to `#`. These matter more than they might
  seem — a live site collecting names/emails/phone numbers through the
  booking and newsletter forms should have an actual privacy policy before
  launch, not just for legal reasons but because it's linked from data
  collection forms.

  **Done:** three real pages added — `/privacy`, `/booking-terms`,
  `/cookie-policy` (`app/privacy/`, `app/booking-terms/`,
  `app/cookie-policy/`, sharing one layout shell in
  `components/legal-page.tsx`). Content is a realistic first draft
  covering the standard ground (data collected/used/shared, deposit and
  cancellation terms, ETA visa responsibility, force majeure, an honest
  "no analytics cookies currently in use" statement, etc.) using the
  real business address/phone/email. **Not yet lawyer-reviewed** — flag
  this for a legal read-through before launch, same as any other
  pre-launch legal content.
- [x] Footer socials: **Facebook**, **Instagram**, **LinkedIn** icons all
  link to `#`. Either wire up the real profile URLs or remove the icons —
  a social icon that goes nowhere looks broken/unfinished to a visitor.
  (`lib/site-data.ts`, `SOCIAL_LINKS`)

  **Done:** moved to a new `lib/social-links.ts` (kept separate from
  `site-data.ts` — the one obvious place to fill these in later). Added
  a **TripAdvisor** entry alongside Facebook/Instagram/LinkedIn per
  owner's request. No real profile URLs exist yet, so all four are
  intentionally left with a blank `href` — the footer (and the new
  contact page) render these as a muted, non-interactive icon instead
  of a dead `#` link, and any entry becomes a live link automatically
  the moment a real URL is added to that file. Added a small
  `.footer-social-pending` CSS rule for the muted state.
- [x] All of the above are in one place: `lib/site-data.ts` —
  `FOOTER_COLUMNS` and `SOCIAL_LINKS`. Quick fix once you have the real
  URLs.

  **Done, restructured slightly:** `FOOTER_COLUMNS` stays in
  `site-data.ts`; `SOCIAL_LINKS` moved to its own `lib/social-links.ts`
  (see above). `SITE` in `site-data.ts` also updated with the real
  contact details: both mobile numbers (`phone` = primary, `phones` =
  full list), both emails (`email` = primary, `emails` = full list),
  the Minuwangoda business address, and the new tagline "Journey Beyond
  Expectations".

---

## Phase 5 — SEO & metadata
- [x] **The homepage has no metadata of its own.** Every other page
  (`/about`, `/destinations`, `/tours-pricing`, `/booking`) sets its own
  `<title>`/description, but `app/page.tsx` doesn't — so it falls back to
  the root layout's default, which is titled **"The Ship's Log — Fine Lanka
  Tours"** with a journal-flavored description. That means your homepage —
  the page most likely to show up in search results and get shared — is
  currently titled and described like a blog post. Add a proper `metadata`
  export to `app/page.tsx`.
- [x] No Open Graph or Twitter Card tags anywhere (`openGraph`/`twitter` in
  the `Metadata` object) — right now a link to any page shared on
  WhatsApp/Facebook/X/iMessage will show no preview image and a generic
  title. Worth adding at least a site-wide default in `app/layout.tsx`,
  plus a per-page image for the homepage.
- [x] No `robots.txt` or `sitemap.xml`. Add `app/robots.ts` and
  `app/sitemap.ts` (Next's App Router convention) so search engines know
  what to index.
- [x] No custom `not-found.tsx` — a mistyped URL currently shows Next's
  bare default 404. A styled one matching the site is a small, cheap win.
- [x] `metadata.generator: 'v0.app'` in `app/layout.tsx` reveals the
  scaffolding tool used to build the site — harmless, but worth removing
  for a polished public launch.

> **New finding, 2026-08-29** (from checking the live Vercel deployment):
> `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts` all fall back to
> `http://localhost:3000` for `NEXT_PUBLIC_SITE_URL` when it isn't set —
> which it wasn't, on the first Vercel deploy. Practical effect: the OG/
> Twitter share image, `robots.txt`'s sitemap link, and every URL in
> `sitemap.xml` were all pointing at localhost on the live site. The
> fallback and the fix were already anticipated in code comments left
> during the original Phase 5 work — just needed the env var actually
> set.
>
> **Fixed and verified, 2026-08-29:** `NEXT_PUBLIC_SITE_URL` added in
> Vercel project settings (scoped to Production), redeployed. Confirmed
> via Vercel's own Open Graph inspector (Deployment → Open Graph tab) —
> `og:image` and `twitter:image` both correctly resolve to
> `https://fine-lanka-web-rgle.vercel.app/images/...`, no localhost
> anywhere. Remember to update this variable again once a real domain
> replaces the `.vercel.app` one.

---

> **Verified against code on 2026-08-29** and checked off — this file had
> fallen behind PRs #6 and #7, which did the actual work without updating
> these boxes. Confirmed: `app/page.tsx` has its own metadata,
> `openGraph`/`twitter` are set in `app/layout.tsx`, `app/robots.ts`/
> `app/sitemap.ts`/`app/not-found.tsx` all exist, and
> `generator: 'v0.app'` is gone.

## Phase 6 — Rendering & code-quality cleanup
- [x] **Every internal link on the site is a plain `<a href="...">` instead
  of Next.js's `<Link>` component** — I checked, there are zero uses of
  `next/link` anywhere in `components/` or `app/`. This means every click
  between pages (footer links, "Book Now", destination cards, etc.) does a
  full browser page reload instead of Next's fast client-side navigation —
  you're not getting the performance Next.js is actually built to provide.
  Swap `<a href="/...">` → `<Link href="/...">` for every *internal* link
  (external links and the `#anchor` links can stay as `<a>`).
- [x] Fonts are being loaded **twice**: once properly via `next/font/google`
  (self-hosted, optimized, no render-blocking request) in `app/layout.tsx`,
  and *again* via a classic `<link href="https://fonts.googleapis.com/...">`
  tag in the same file. Pick one — since `next/font` is already set up
  correctly, just delete the three `<link>` tags (`preconnect` ×2 +
  stylesheet) and confirm the CSS variables (`--font-display` etc. in
  `globals.css`) point at the `next/font` output instead.
- [x] `app/globals.css` is **16,300+ lines / 572 KB**, all loaded on every
  single page. A lot of it is layered, superseding rewrites of the same
  selectors (e.g. `.booking-page .booking-layout` is redefined from scratch
  6+ separate times further down the file, each block overriding the last
  — only the final one actually matters, the earlier five are dead weight
  the browser still has to parse). Worth a consolidation pass: for each
  selector, keep only the last/effective declaration and delete the
  superseded versions. This won't change how the site looks (the cascade
  already ignores the dead rules) — it just cuts real weight and makes the
  file maintainable again.

  **Verified:** down to 13,323 lines / 464 KB. `.booking-page
  .booking-layout` now has exactly one top-level definition (was 6+). File
  is still large — that's a large site with a lot of custom styling, not
  something a consolidation pass alone eliminates — but the dead-weight
  duplication specifically called out here is gone.
- [x] `typescript: { ignoreBuildErrors: true }` in `next.config.mjs` means
  the production build will succeed even if there are real type errors —
  effectively flying blind. Turn this off, run a build, and fix whatever
  surfaces before launch.

---

## Phase 7 — Dependency updates & known vulnerabilities
Ran `npm audit` — **8 vulnerabilities (7 high, 1 moderate)**, all stemming
from an outdated Next.js:

- [x] Next.js is pinned to `16.2.6`; latest is `16.3.3`. The audit flags
  **7 high-severity issues** fixed in the newer version, including a
  middleware/proxy bypass, a couple of SSRF issues (server actions and
  rewrites), a cache-confusion bug, a DoS in the image optimization API,
  and unauthenticated disclosure of internal server-function endpoints.
  Update Next.js — this also pulls in a patched `postcss` (fixes an XSS +
  several path-traversal/source-map disclosure issues) as a transitive
  dependency.

  **Done:** bumped `next` to `16.3.3` and `postcss` to `^8.5.12` (the
  patched line). `pnpm install` + `pnpm audit` confirm both are resolved.
- [x] `sharp` (used by Next's image pipeline) is also flagged for
  inherited `libvips` vulnerabilities — the Next.js update should resolve
  this too since it's a transitive dependency; just confirm with a fresh
  `npm audit` after.

  **Done:** confirmed clean post-upgrade; no `sharp`/`libvips` entries in
  `pnpm audit` anymore.
- [x] Re-run `npm audit` after updating and confirm it comes back clean
  before launch.

  **Done, with a scope correction:** the project standardized on pnpm in
  Phase 1, so this was re-run as `pnpm audit` rather than `npm audit`
  (no `package-lock.json` exists anymore for `npm audit` to read). Running
  it surfaced **36 additional vulnerabilities** the original `npm audit`
  never saw — all transitive dependencies of `shadcn` (the component-CLI
  tool: `@modelcontextprotocol/sdk` → `hono`/`express`/`ajv`/etc.), plus a
  `brace-expansion` DoS via `shadcn`'s `ts-morph`. None of these ship to
  the production bundle (`shadcn` is a CLI you run locally, never
  imported by app code — confirmed via grep), but they still sit in
  `node_modules` and would show up in any future scan, so worth fixing
  now rather than leaving a 36-item audit backlog for the next person.
  Two things found along the way:
  - `shadcn` was listed in `dependencies` instead of `devDependencies` —
    moved it, since it's a build-time-only tool.
  - There was already a `pnpm.overrides` block in `package.json` pinning
    `hono`, but pnpm v10+ no longer reads overrides from that location
    (confirmed via a `[WARN]` pnpm prints on install) — it was silently
    doing nothing. Moved it to `overrides:` in `pnpm-workspace.yaml`
    (the location pnpm v10+ actually reads) and extended it to cover the
    other flagged transitive packages (`hono`, `@hono/node-server`,
    `fast-uri`, `ip-address`, `brace-expansion`, `body-parser`,
    `js-yaml`, `nanoid`) at their patched versions.

  `pnpm audit` now reports **no known vulnerabilities**. Verified
  `npx tsc --noEmit` and the existing `vitest` suite still pass clean
  after the Next.js bump.

---

## Phase 8 — Security hardening
- [x] No security headers are configured at all (`next.config.mjs` has no
  `headers()` function). Before launch, add at minimum:
  `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY` (or a `frame-ancestors` CSP directive), and a
  basic `Content-Security-Policy`.

  **Done:** added a `headers()` function to `next.config.mjs` covering all
  of the above, plus `Referrer-Policy` and `Permissions-Policy`. The site
  has no external scripts, fonts, analytics domains, or remote image
  hosts — `next/font` self-hosts Google Fonts and all images are local —
  so the CSP is strict (`'self'` for scripts/styles/connect, no external
  origins allowlisted). Specifically checked `@vercel/analytics` (which
  *is* wired up in `app/layout.tsx` for production): inspected the
  package source directly and confirmed it posts to same-origin
  `/_vercel/insights/...` paths by default, not a cross-origin domain, so
  no CSP exception was needed for it.

  Verification: `npx tsc --noEmit` passes clean. A full `pnpm build`
  couldn't complete in this sandbox — `next/font` needs to fetch
  fonts.googleapis.com at build time and that domain isn't in this
  environment's network allowlist, which is a sandbox limitation, not a
  code issue. **Please run `pnpm build && pnpm start` locally and spot
  check the headers** (`curl -I http://localhost:3000`) before launch,
  since this wasn't verified against a real running server.
- [x] All three lead-capture forms (booking, the enquiry modal, newsletter
  signup) currently have **no backend and no bot/spam protection** — see
  Phase 9. Once they're wired to a real endpoint, add a honeypot field or
  lightweight CAPTCHA (e.g. Cloudflare Turnstile) plus basic server-side
  rate limiting, or you'll get spam-submitted the day the forms go live and
  start actually sending somewhere.

  **Done as part of Phase 9** (this was blocked here until the forms had
  a real backend to protect — see the earlier note in this section,
  superseded now). All three forms have a honeypot field
  (`lib/form-guard.ts`) and their API routes rate-limit at 5
  requests/10 minutes per IP. No CAPTCHA added — the honeypot + rate
  limit is a reasonable starting point for a tourism site's realistic
  traffic; revisit if real spam shows up in practice.
- [x] Once you pick a hosting/deploy target, make sure any real secrets
  (email API key, CRM token, etc. from Phase 9) go into environment
  variables / your host's secret manager — never committed to the repo.
  Nothing is hardcoded right now (checked), just flagging it as a rule to
  keep once real integrations are added.

  Re-verified: no `.env*` files in the repo, no hardcoded API
  keys/secrets/tokens anywhere in `app/`, `components/`, `lib/`,
  `next.config.mjs`, or `package.json`.

---

## Phase 9 — Forms need a real backend
Right now the booking form, the enquiry modal, and the newsletter signup
all do client-side validation only and show a fake "Thanks, we'll be in
touch" message — **nothing is actually sent anywhere**. This is fine for a
demo but is presumably not fine for launch.

> **Decision made, not yet implemented.** Going with **Resend** (email via
> transactional API) — chosen over a CRM, a database + admin view, or a
> third-party form service (Formspree/Basin) since the site won't see
> high volume and this gives the most control for the least ongoing cost.
> Free tier (3,000 emails/month, 100/day) comfortably covers a tourism
> site's realistic traffic.
>
> **Next steps (on the user's side, before I can build this):**
> 1. Sign up at resend.com (free, no card required).
> 2. Add + verify the real domain in the Resend dashboard (DNS records at
>    the registrar) so mail sends from an address like
>    `bookings@finelankatours.com` instead of a generic Resend address —
>    skippable for early testing via `onboarding@resend.dev`, but needed
>    before real launch so mail doesn't land in spam.
> 3. Create an API key scoped to "Sending access" only.
> 4. Hand over: the API key, which address should **receive** leads,
>    which address emails should be sent **from**, and whether customers
>    should get an auto-reply confirmation.
>
> **Once that's in hand, the work is:** three API routes (booking form,
> enquiry modal, newsletter), server-side validation (not just the
> existing client-side `checkValidity()`), the honeypot spam field noted
> as blocked in Phase 8, an optional customer auto-reply, and the API key
> added as an environment variable on the hosting platform — never
> committed to the repo.

**Configuration decided, implementation starting:**
- **Receiving address:** `mprabhathm@gmail.com` — bookings and enquiries
  land here.
- **Sending address:** Resend's shared `onboarding@resend.dev` for now —
  no domain purchased yet. This means Resend will only deliver to the
  receiving address above until a real domain is verified, which is fine
  since that's the only recipient right now anyway. Revisit once a domain
  is bought — see the domain note further down this section.
- **Customer auto-reply:** yes, wanted for all form types.
- **API key:** provided in chat and used to configure the environment —
  **never committed to this repo**, not even here. It needs to be set as
  an environment variable (`RESEND_API_KEY`) on whatever platform this
  gets deployed to (Vercel/Netlify/etc. project settings → Environment
  Variables), and in a local `.env.local` for development (already
  covered by `.gitignore`).

- [x] Decide where enquiries should land — email (e.g. via Resend/Postmark/
  SendGrid), a CRM, or a simple database + admin view — and wire the
  `onSubmit` handlers in `components/booking-page.tsx`,
  `components/enquiry-modal.tsx`, and `components/home/newsletter.tsx` to
  a real API route.

  **Done.** Three routes added: `app/api/booking/route.ts`,
  `app/api/enquiry/route.ts`, `app/api/newsletter/route.ts`. Shared
  sending logic lives in `lib/mail.ts` (Resend client, team-notification
  email, customer auto-reply). All three forms now `fetch()` their route
  on submit, show a loading state on the button, and display a real
  success/error message instead of a fake one.

  Each route also includes a honeypot check
  (`lib/form-guard.ts::isHoneypotTripped`) and a best-effort in-memory
  rate limiter (5 requests / 10 minutes per IP per form) — see the
  limitations noted directly in `lib/form-guard.ts` about why the rate
  limiter isn't reliable on serverless multi-instance hosting and what to
  swap in if real abuse shows up (Upstash Redis).

  **Verification (my sandbox):** couldn't run a full `pnpm build` for the
  same font-fetch reason noted in Phase 8, and separately,
  `api.resend.com` isn't in this sandbox's network allowlist either
  (confirmed via a direct `curl` — `x-deny-reason: host_not_allowed`), so
  I couldn't verify actual email delivery myself from here. What I
  *could* verify: wrote a standalone script that called each route
  handler directly (bypassing the parts of Next.js that need network
  access I don't have) and confirmed — missing/invalid email correctly
  returns 400, a tripped honeypot returns 200 without attempting to
  send, and the 6th request from the same IP within the rate-limit
  window correctly returns 429.

  **Verified live by the user, 2026-08-29:** deployed to Vercel
  (`fine-lanka-web-rgle.vercel.app`), env vars set in Vercel project
  settings, all three forms tested on the live deployment and confirmed
  working — team notifications arriving in `mprabhathm@gmail.com`. This
  is the real end-to-end confirmation the sandbox verification above
  couldn't provide. Genuinely done.
- [x] Add server-side validation to match (don't rely on the client-side
  `checkValidity()` alone — anyone can bypass that).

  **Done** — see `lib/form-guard.ts::cleanString` /`isValidEmail`. Every
  route validates and length-caps input server-side regardless of what
  the client sent; a request with a missing name/invalid email is
  rejected with 400 even if it skips the browser entirely (verified with
  the standalone script above, bypassing the browser form).
- [x] Decide what confirmation the *customer* gets (auto-reply email?) in
  addition to your team being notified.

  **Decided and implemented:** yes, an auto-reply for all three forms
  (`lib/mail.ts::sendAutoReply`), sent as best-effort — its failure never
  blocks the request or hides a successful team notification.

  **Known limitation, current config:** since no domain is verified yet
  (sending from `onboarding@resend.dev`), Resend restricts delivery to
  the account owner's own address. Practically: the **team notification**
  works for any submission right now (it goes to `mprabhathm@gmail.com`,
  which is the account owner's address). The **customer auto-reply** will
  only actually arrive if the customer's email happens to be
  `mprabhathm@gmail.com` — for a real visitor's email, Resend will reject
  the auto-reply send, which is caught and logged
  (`console.error('... auto-reply failed', err)`) rather than surfaced to
  the customer or team. **This resolves itself automatically once a
  domain is bought and verified in Resend** — no code change needed, just
  update `LEADS_FROM_EMAIL` to an address on the verified domain.
- [ ] Not done: swap `LEADS_FROM_EMAIL` to a verified-domain address once
  a domain is purchased, so customer auto-replies actually reach real
  visitors (see the limitation above). Also not done: replacing the
  in-memory rate limiter with a shared store if real abuse shows up on
  serverless hosting (see `lib/form-guard.ts`).

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
- [x] Test the booking/enquiry/newsletter forms end-to-end after Phase 9 —
  confirm the email/CRM notification actually arrives.

  **Done, 2026-08-29:** tested live on `fine-lanka-web-rgle.vercel.app`
  after deploying to Vercel. All three forms confirmed working — team
  notifications arriving at `mprabhathm@gmail.com`. (Along the way, fixed
  a missing `.env.local` locally and a `NEXT_PUBLIC_SITE_URL` scoping
  issue on Vercel — see the Phase 5 finding above.)
- [ ] Cross-browser check (Chrome, Safari, Firefox) and mobile check —
  the site leans heavily on custom-styled form controls and layered
  background art, worth a manual look on at least one real iOS and one
  real Android device.

  **In progress, 2026-08-29** — user found two real mobile bugs on a
  real device:
  - Home page "How It Works" (flight-path animation): description cards
    packed unreadably at phone width.
  - Home page "Explore" section, video card caption: description
    rendered as only a letter or two before the ellipsis.

  First fix attempt (PR #32) replaced the "How It Works" cards with a
  separate always-visible stacked list on mobile — **reverted (PR #33)**
  after testing, since the actual ask was to keep existing mobile
  behavior (same overlay cards, same reveal animation, same positions)
  and just resize within it for more room, not change the behavior.

  Corrected fix, in review — not yet merged:
  - Explore caption: unchanged approach from the reverted PR (that part
    was already behavior-preserving, CSS-only) — widened the caption bar
    and switched to percentage-based sizing on mobile so it scales with
    the card, instead of a flat-pixel subtraction that left almost no
    room. Root cause was a real CSS ordering bug: an existing
    `@media (max-width: 980px)` rule was being silently overridden by a
    later unconditional rule further down `globals.css` with equal
    specificity.
  - How It Works: redone to keep the exact same 4 cards, positions, and
    reveal-on-arrival animation at every screen size — only the gap
    between the 4 quarter-width columns and the font size shrink on
    mobile (via CSS custom properties consumed in the existing inline
    styles), reclaiming real width without restructuring anything.
  - **Known limitation, flagged rather than hidden:** even with this
    fix, each description (~105 characters) still wraps to roughly 7
    lines at the smaller mobile size, computed against a ~350px-wide
    canvas — down from ~10 lines before the fix, but the resulting card
    can still run tall relative to the ~197px-tall mobile canvas and may
    visually crowd the flight-path animation or neighboring cards, since
    nothing here clips or scrolls independently. This should fix the
    specific complaint (illegible/cut-off text) but may not be the final
    word on this section's mobile polish.

  **User re-tested on device, found a second real bug in the Explore
  video card caption** (screenshot): the description text was
  overflowing past the visible teal caption box entirely — spilling
  onto the decorative frame artwork below and covering the pagination
  dots. Root cause: the caption box's height (derived from top/bottom %
  insets) wasn't actually enforced — with no `overflow: hidden`, a flex
  child taller than its container just overflows past it instead of
  being contained. **Fixed:** added `height: 100%; overflow: hidden` on
  the caption box as a hard containment guarantee (text can no longer
  visually escape the box regardless of exact pixel calculations), plus
  reduced the description to a more conservative 2-line clamp (down
  from 3) so it's more likely to actually fit rather than relying on
  the clip to kick in mid-sentence, and added a small reserved gap
  between the text and the dots so they can't visually touch even at
  the container's edge. The "How It Works" section was confirmed
  working correctly by the user as-is — not touched in this round.

  **User re-tested again, found two more issues** (two screenshots): on
  the smallest screens, the caption box was completely empty — no
  title, no description at all; on a slightly larger screen, the
  description showed only a couple of characters + ellipsis, and the
  pagination dots rendered inline overlapping the text instead of
  staying in their own row. Separately, the whole video card frame was
  sitting left-aligned instead of centered on the page once past the
  very smallest screen width.

  Root causes, found properly this time rather than more guessing:
  - The multi-line `-webkit-line-clamp` technique for the description
    is inherently less reliable across different content lengths and
    exact box heights than the title's existing single-line
    `white-space: nowrap` + `text-overflow: ellipsis` — proven by the
    fact the title consistently rendered correctly (`Ya...`) while the
    clamped description didn't. Combined with the previous round's
    `align-items: center` on the box, when content still didn't fit,
    the *centered* overflow got clipped symmetrically from both top and
    bottom — capable of cropping out the title too, which is exactly
    what produced the completely blank box on the smallest screens.
  - The frame's left-alignment was a genuine, pre-existing layout bug
    unrelated to any of this round's changes: `.explore-video-card` has
    an explicit width narrower than its full-width flex column
    container, and a flex item with a definite cross-axis size does not
    auto-center under the default `align-items: stretch` — it sits at
    `flex-start` (left) unless centering is requested explicitly, which
    nothing was doing.

  **Fixed:**
  - Switched the description to the exact same reliable single-line
    truncation technique as the title (`white-space: nowrap` +
    `text-overflow: ellipsis`), trading showing less text for a result
    that's guaranteed to render correctly regardless of content length
    or exact device size — no more clamp-driven blank boxes or
    half-rendered text.
  - Changed the caption box's vertical alignment from `center` to
    `flex-start`, so if anything still doesn't fit, it crops from the
    bottom only — the title stays visible from the top down in every
    case, instead of a centered crop risking hiding it entirely.
  - Added `align-items: center` to `.explore-heritage-rebuild
    .explore-studio-workbench`'s mobile flex-column rule — the actual,
    minimal fix for the centering bug, addressing the real cause
    (missing cross-axis alignment) rather than fighting it with width
    overrides.

  Still not merged — waiting on the user to confirm this on their
  device before merging, per the same caution as the last two rounds.
- [x] Confirm `robots.txt`/`sitemap.xml` (Phase 5) are reachable at their
  real URLs after deploy, and submit the sitemap in Google Search Console.

  **Partially done, 2026-08-29:** confirmed reachable and correct at the
  real URL (see the Phase 5 finding above — this was the localhost bug,
  now fixed and verified via Vercel's Open Graph inspector). **Still
  open:** submitting the sitemap in Google Search Console — needs a
  Google account and domain verification, not yet done.
