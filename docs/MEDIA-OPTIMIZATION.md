# Media Optimization — Progress & Resume Guide

**Purpose of this doc:** track a large, multi-session task (compressing
this site's images/videos) so it survives across AI session limits.
Whoever (human or Claude) picks this up next should read the
**Status** section first, then **How to resume**.

---

## The problem (diagnosed 2026-09-04)

Site loads slowly on first paint — hero video, homepage images, and
the journal page's portal animation all lag noticeably behind their
CSS/JS animations, even though they're meant to load immediately.

An earlier fix (PR merged, commit `4667333`) added `loading="lazy"` /
`loading="eager"` attributes to `<img>` tags site-wide. That fix was
correct but solved a *different* problem — bandwidth contention from
below-the-fold images downloading eagerly. It did **not** fix the
reported slowness, because the real bottleneck is raw file size, not
the `loading` attribute:

- `public/videos/hero-loop.mp4` — **58 MB**, 1920×1080 H.264 at
  ~19.5 Mbps. That bitrate is Blu-ray-tier for a looping web
  background video; should be ~2–4 Mbps.
- The journal page's "portal" doorway animation is built from **CSS
  `background-image`**, not `<img>`/`next/image` — so none of the
  lazy-loading fix touches it at all. Its file set alone is ~13 MB,
  full-resolution PNGs up to 1632×2176px, fetched in full the instant
  the page loads.
- ~85 files across `public/images/` and `public/mural/` are
  full-resolution, uncompressed PNG/JPG, many 1–7 MB each, serving
  far more pixels than they're ever displayed at.
- `public/` totals **271 MB**.

**Why this wasn't caught by `next/image`:** `next/image` is only used
in `journal-page.tsx` and `explore-section.tsx`; everything else is
plain `<img>` or CSS `background-image`, neither of which get
Next's automatic resizing/compression. `next/image` itself is also
not a full fix here, since it does on-demand `sharp` processing at
*request time* — and this cPanel host already hits a hard memory
ceiling during `pnpm install`/`next build` (see
`docs/CPANEL-DEPLOY.md`), so relying on live server-side image
processing is risky on this plan.

## The fix

Pre-compress/resize assets as a **build-time** step, the same way the
site already avoids building on cPanel:
- Do the heavy lifting locally or in CI (GitHub Actions has plenty of
  memory) — convert PNG/JPG → WebP at sane quality, resize to the
  actual display resolution, re-encode the hero/destination videos at
  a reasonable bitrate.
- Commit the optimized files (or generate them as a CI step before
  the `deploy/production` push — TBD, see Open Questions).
- cPanel keeps just copying files, same as now — no new server-side
  processing added.

---

## Status

**Current phase: COMPLETE.** All planned conversions done, verified,
and ready to commit/deploy. `public/` folder: **271MB → 48MB (82%
reduction)**.

Final breakdown: `public/videos` 135MB→24MB, `public/images` 113MB→23MB,
`public/mural` 19MB→1.1MB. Also removed `public/flight-canvas-texture.png`
(5.4MB, confirmed dead — no code reference anywhere) and ~26MB of other
confirmed-dead leftover image variants across the batches below.

### Checklist — all done

- [x] Sample conversion + visual sanity check — confirmed quality
      acceptable, settings below
- [x] Hero video — 58.2MB → 7.9MB
- [x] Destination videos — anuradhapura 38.0MB→4.7MB, sigiriya
      36.9MB→10.6MB. `public/videos` total: 135MB → 24MB
- [x] Journal portal image set — 34.7MB → 4.95MB (6 in-use files);
      7 unused leftover variants deleted
- [x] Navbar backdrop set — 5.19MB → 0.57MB
- [x] Mural flipbook set — 9.19MB → 1.02MB; 6 dead `frame-*.png`
      files deleted
- [x] Tour category images (`tour-*.png`, referenced via
      `` `/images/tour-${tour.category}.png` `` in **two** places —
      `tour-picker-card.tsx` AND `tour-card.tsx` — plus **three**
      direct/non-template references in `route-map-preview.tsx` that
      an earlier pass missed and had to be fixed separately) —
      9.11MB → 0.64MB
- [x] Remaining ~45 `public/images/*` files over 250KB — batch
      converted, references updated, originals removed:
      45.66MB → 16.14MB
- [x] 14MB of confirmed-dead files removed along the way (`blend-1..4.jpg`
      in `public/images/` — distinct from the live `public/mural/blend-*`
      set — plus several unused `fine-lanka-about-bg-*`,
      `explore-*-background`, and `milk-rice-*` leftovers). Confirmed
      dead by grepping the full codebase (`.tsx`/`.ts`/`.css`/`.json`/
      `.mjs`/`.js`, node_modules and .next excluded) for the exact
      filename before deleting — nothing deleted without a zero-match
      grep first.
- [x] `flight-canvas-texture.png` (5.4MB, at `public/` root, not
      `public/images/` — easy to miss) — confirmed dead, deleted
- [x] Re-ran `npx tsc --noEmit` (clean) and `npx vitest run` (8/8
      passing) after every batch, plus a final full-repo scan for any
      leftover `.png`/`.jpg` reference to a file that no longer
      exists — clean (the only matches were in this guide's own
      historical inventory table, not real code)
- [x] Full `next build` still not run in this sandbox (network-
      restricted, can't reach fonts.googleapis.com for next/font —
      this is a sandbox limitation, not a real problem). **Verify for
      real via GitHub Actions once pushed.**
- [x] Committed final batch on `fix/optimize-media`, pushed, GitHub
      Actions build **succeeded** (run confirms the real `next build`
      — with full network access, unlike the sandbox this work was
      done in — went through cleanly with all reference updates)
- [x] Merged to `main` (commit `11705a6`)
- [x] Confirmed `deploy/production` updated to match (`0c6eb95`,
      "Deploy build of 11705a6...")
- [ ] **NEXT UP (needs a human with cPanel access — not automatable
      from here):** manual cPanel step — Git Version Control → Update
      from Remote → Deploy HEAD Commit (see `docs/CPANEL-DEPLOY.md`)
- [ ] Manual cPanel step: Git Version Control → Update from Remote →
      Deploy HEAD Commit (see `docs/CPANEL-DEPLOY.md`)
- [ ] Verify on `https://finelankatours.com` — homepage hero, journal
      page portal animation, general page-weight via browser devtools
      Network tab. Specifically re-check the tour cards/pricing page
      (categories: nature, beach, cultural-historical, romantic,
      ramayana-trails) and the route-map-preview place-card thumbnail,
      since those had the trickiest (template-literal / multi-file)
      references.

**Confirmed settings (reused across all batches):**
- **Images → WebP:** `quality=82, method=6` (Pillow
  `im.save(path, 'WEBP', quality=82, method=6)`). Gave a **2.8x–14x**
  size reduction depending on the source file, with no visible
  quality loss on any of the manually-spot-checked samples (fine
  detail like carving/gold inlay held up).
- **Video → H.264 re-encode:** `ffmpeg -c:v libx264 -preset slow -crf 26
  -maxrate 3500k -bufsize 7000k -c:a aac -b:a 96k -movflags +faststart`.
  Gave **3.6x–7.7x** reduction, frame-by-frame comparison showed no
  visible difference.

---

## Phase 3 — next/image device-size cap (2026-09-04, post-deploy report)

**The problem:** user reported the live site still felt considerably
slow despite Phases 1 and 2 both being deployed and verified. Fetched
`finelankatours.com`'s actual rendered HTML directly and found a smoking
gun: `.../​_next/image?url=%2Fimages%2Fsri-lanka-map-island-focus.webp&w=3840&q=75`
— the interactive island map (`components/home/explore-section.tsx`,
`fill` + `sizes="(max-width: 900px) 100vw, 38vw"`) was triggering
Next.js's **live, on-demand, server-side** image optimizer at a 3840px
width — exactly the kind of expensive per-request `sharp` work this
whole optimization effort was built to avoid on this memory-constrained
cPanel host (see the "why this wasn't caught by next/image" note near
the top of this doc). Worse: the source file is only **794px wide** —
Next clamps rather than upscales, so no literal 3840px image was
produced, but the request still round-tripped through the live
optimizer unnecessarily.

Root cause: the two `next/image` usages on the site
(`explore-section.tsx`, `journal-page.tsx`) were never brought in line
with the site-wide "never serve above 1600px" policy established in
Phase 2b — that policy was applied by hand to every CSS
`background-image` and plain `<img>`, but next/image generates its own
responsive variants from Next's *default* `deviceSizes` array
(`[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`), which nothing had
capped.

**Fix:** added an `images.deviceSizes` cap to `next.config.mjs`
(`[640, 750, 828, 1080, 1200, 1600]`), bringing next/image's own
responsive generation in line with the same ceiling already enforced
everywhere else. Benefits both existing `next/image` usages, not just
the map.

- [x] Diagnosed via the live site's actual rendered HTML (`web_fetch`),
      not guessed
- [x] Added the `deviceSizes` cap in `next.config.mjs`
- [x] Verified `node --check next.config.mjs` and `npx tsc --noEmit`
      pass clean
- [x] Committed, pushed, opened PR #82. GitHub Actions doesn't build on
      PRs to feature branches (only on push to `main` — see
      `.github/workflows/deploy.yml`), so manually triggered it via
      `workflow_dispatch` on the feature branch first, before merging —
      **succeeded**
      (https://github.com/Prabhath-M/fine-lanka-web/actions/runs/33857885283)
- [x] Merged to `main` (squash commit `1b3eb51`)
- [x] `main`'s own automatic deploy-workflow run also succeeded
      (confirms `deploy/production` branch is now up to date with this
      fix)
- [ ] **Manual cPanel step (needs a human with cPanel access — not
      automatable from here):** Git Version Control → Update from
      Remote → Deploy HEAD Commit
- [ ] Re-verify on `https://finelankatours.com` — re-fetch the homepage
      HTML and confirm the map's `/_next/image` URL no longer requests
      `w=3840` (should cap at `w=1600` now)

**Not done, needs a decision — see the remaining options laid out in
chat:** static-asset `Cache-Control` headers (no `.htaccess` and no
caching policy currently exist at all — every image likely re-validates
on every visit, affecting repeat page loads specifically, not first
paint), and whether to put a CDN (e.g. Cloudflare) in front of the
origin, which would help both of the above at once but needs a DNS
change at Namecheap.

---

## Phase 4 — Cache-Control headers + confirming Phase 3 was never deployed (2026-09-04)

**Discovered:** re-checked the live site directly (`web_fetch` on
`finelankatours.com`) at the start of this session and found the map
image request was still `.../​_next/image?url=...&w=3840&q=75` — Phase
3's fix (merged to `main` as `1b3eb51`, confirmed built into
`deploy/production` as of `6f470cb`) had never actually been pulled
and deployed on cPanel. Code was correct and waiting; the manual
"Deploy HEAD Commit" click just hadn't happened yet. **This means the
"little to no impact from later fixes" the user reported is at least
partly explained by Phase 3 literally not being live** — worth
re-testing once it is.

**Also implemented this session:** the Cache-Control gap flagged
above. Added `next.config.mjs` `headers()` rules:
- `/images/*`, `/videos/*`, `/mural/*`, and top-level static icons →
  `public, max-age=31536000, immutable` (1 year) — safe given this
  project's convention of swapping files under new/distinct names
  rather than overwriting content in place; revisit if that
  convention ever changes.
- `/data/route-atlas.json` → shorter `max-age=3600, must-revalidate`,
  since it's structured data that could be updated without a
  filename change, unlike the media files above.
- `/_next/static/*` and `/_next/image` output already get long-lived
  immutable caching automatically from Next.js itself — nothing
  needed there.

- [x] Diagnosed via live-site `web_fetch` — confirmed Phase 3 was
      never deployed, not just under-effective
- [x] Added Cache-Control headers to `next.config.mjs`
- [x] Verified `node --check`, `npx tsc --noEmit` (clean), `npx
      vitest run` (8/8 passing)
- [x] Committed, pushed, PR #84, GitHub Actions build succeeded,
      merged to `main`
- [x] `main`'s automatic deploy-workflow run succeeded — confirms
      `deploy/production` has both this fix AND the still-pending
      Phase 3 fix together now
- [ ] **Manual cPanel step (needs a human with cPanel access — not
      automatable from here):** Git Version Control → Update from
      Remote → Deploy HEAD Commit. This one deploy click ships BOTH
      Phase 3 (map image cap) and Phase 4 (cache headers) at once,
      since neither has reached cPanel yet.
- [ ] Re-verify on `https://finelankatours.com`:
  - Map image URL should show `w=1600` (or less), not `w=3840`
  - Browser DevTools → Network tab → click an image under
    `/images/` or `/videos/` → Response Headers should show
    `Cache-Control: public, max-age=31536000, immutable`
  - Reload the same page a second time (not hard refresh) — repeat
    page loads should now feel noticeably snappier for image-heavy
    pages, since previously-loaded assets serve straight from the
    browser's cache instead of re-validating with the server

**Still open, unchanged from before — a decision, not a fix:**
whether to put a CDN (e.g. Cloudflare) in front of the origin. Would
help both first-load (edge-cached delivery closer to visitors,
especially outside Sri Lanka) and repeat-load (works alongside the
Cache-Control headers just added, not instead of them) performance
at once, but needs a DNS change at Namecheap — a bigger, separate
decision from the code-only fixes above.

---

## Phase 2 — Responsive sizing (started 2026-09-04, post-launch)

**The problem (diagnosed post-launch, live-site QA):** Phase 1 above
compressed format + quality (PNG/JPG → WebP, quality 82) but did
**not resize pixel dimensions**. Every image is still served at its
original resolution regardless of how small it's actually rendered.
Confirmed on live QA: home page cards, the explore section's map/video
card, About Us, Book Now, and Tours & Pricing all still load
noticeably slowly.

Evidence: cards render at ~280–340px wide (per CSS), but e.g.
`about-page.tsx`'s hero photo ships at 1707×2560px, `dest-panel-frame.webp`
at 2304×1536, `tours-kandyan-night-register.webp` at 2560×1440 — 6–9x
more pixels than the card ever displays. Only two places in the
codebase (`explore-section.tsx`, `journal-page.tsx`) use `next/image`
with a `sizes` prop, which does generate right-sized variants on
request (Node/Passenger server + matching-arch `sharp`, per
`docs/CPANEL-DEPLOY.md` — this actually works at runtime here). Every
other image is a plain `<img>` or CSS `background-image`, which gets
zero responsive treatment — full file, every device, every time.

**The fix (chosen approach — build-time, no live server-side
resizing):** same philosophy as Phase 1 — do the work offline, keep
runtime free of extra sharp/memory load given the cPanel host's known
memory ceiling. Pre-generate multiple WebP width variants (480w /
960w / 1600w, quality 82, never upscaling past the original) for
every image over ~150KB, then:
- `<img>` card/hero photos → add `srcset` + `sizes` pointing at the
  generated variants.
- CSS decorative card frames (dest-card-frame, dest-panel-frame,
  navbar backdrop, mural set, journal portal frames) → swap the
  `url()` reference to a single appropriately-sized variant (these
  render at a consistent small/medium size everywhere, so one variant
  covers it — no need for full responsive complexity).
- CSS full-bleed section backgrounds (milk-rice booking/tours field
  notes, destinations atlas, how-it-works, serendib map, ves-dance
  heritage) → add a mobile breakpoint media query serving the smaller
  variant below ~760px, since these are genuinely full-viewport-width
  on desktop but massive overkill on a 390px phone screen.

### Checklist

- [x] Diagnose actual cause (dimensions, not format/quality) —
      confirmed via `PIL`/CSS width comparison
- [x] Write/run the width-variant generation script (480w/960w/1600w,
      quality 82, never upscaling) — ran for every file over 150KB in
      `public/images/` + `public/mural/` (59 source files → 163
      variant files, `public/` 48MB → 67MB; more files but far less
      transferred per page view)
- [x] Convert `<img>` usages to `srcset`/`sizes`:
  - `about-page.tsx` — hero photo + origin photo
  - `destination-card.tsx` — `dest-card-frame` overlay
  - `site-header.tsx` — header mural frame (was hardcoded to the full
    1900×360 original, eager-loaded on **every page**; also removed
    the now-dead `MURAL_FRAMES[1..6]` array, only frame `[0]` was ever
    rendered)
- [x] Swap the two highest-traffic card-frame CSS refs to sized
      variants: `dest-panel-frame` (the Explore section's video-window
      frame the QA report specifically flagged — background + both
      mask-image layers, 960w by default with a 1400px+ media-query
      bump to 1600w for large screens)
- [x] Add mobile-first sizing for the Book Now / Tours & Pricing
      full-bleed canvases: `.section-fixed-canvas--booking` /
      `--tours` (`milk-rice-*-field-notes`) now serve the 960w variant
      by default, full-res only above 1400px; also switched the
      booking page's `sri-lanka-ves-dance-heritage-background` layer
      to 960w
- [x] Re-ran `npx tsc --noEmit` (clean once `pnpm install` picked up
      the `resend` dependency added upstream since this branch's last
      install) and `npx vitest run` (8/8 passing)
- [ ] **Deferred, lower priority** (not flagged as slow in this QA
      round, revisit if reported): tour category cards
      (`tour-card.tsx`/`tour-picker-card.tsx`, already a modest 1024px
      native so less urgent), `destinations-cloud-frame` (already
      under 100KB, skipped), journal portal frame set (unchanged since
      Phase 1 — journal wasn't reported slow this round), remaining
      mural `blend-2..6`/`frame-*` files (only `blend-1` is actually
      rendered — see `site-header.tsx`, `MURAL_FRAMES` array removed)
- [ ] Commit, push, PR, verify GitHub Actions build succeeds
- [ ] Merge to `main` (**confirm with human first — site is live now**)
- [ ] Manual cPanel step: Git Version Control → Update from Remote →
      Deploy HEAD Commit
- [ ] Re-verify on `https://finelankatours.com` — home, about, booking,
      tours-pricing, explore section, Network tab page-weight check

### Phase 2b — correction (same day, post-deploy report)

Human tested on a 2K laptop screen after deploying Phase 2 and
reported backgrounds *still* somewhat slow. Investigation found two
real problems with the Phase 2 work above:

1. **Introduced bug:** the `.section-fixed-canvas--booking`/`--tours`
   large-screen (`≥1400px`) override pointed at the **full original**
   file instead of the `1600w` variant — so on exactly the kind of
   screen (2K/1440p+) that triggers that breakpoint, this made things
   *worse* than before Phase 2 for that element.
2. **Fixed the wrong selector:** `.section-fixed-canvas--booking`/
   `--tours` turned out to be dead CSS — never applied to any element
   in the actual JSX. The real, live Tours & Pricing background is
   `.tours-page .tour-collection` (confirmed via
   `grep` against `tours-pricing-page.tsx`), which Phase 2 never
   touched — it was still shipping the full 302KB/2560px original,
   unconditionally, on every screen size including mobile.
3. **Much wider gap:** ~35 other background-image references across
   About Us, Home, and other pages already had `480w`/`960w`/`1600w`
   variants generated (from the Phase 2 batch script) but the CSS
   still pointed at the full-size originals — Phase 2 only wired up
   2–3 of them.

**Fix applied:** a repo-wide script-driven pass over `globals.css` —
every `url('/images/X.webp')` background reference is now capped at
its `1600w` variant (falling back to `960w` for images whose original
was already under 1600px wide, so no `1600w` file exists). No
background image on the site now ever serves anything larger than
1600px wide, regardless of screen size — 78 references updated across
the file. `.tours-page .tour-collection` additionally got the same
tiered treatment as the other full-bleed canvases (960w default /
1600w on ≥1400px / 480w on ≤720px mobile).

Net result: the 52 unique background images actually referenced in
`globals.css` now total ~9.9MB combined (down from the un-capped
originals), and — critically — nothing is ever served above 1600px
wide anymore, closing the "still slow on a big screen" gap.

**Known remaining dead code, not touched:** `.section-fixed-canvas--
booking`/`--tours` and `.booking-page .booking-layout::before` (the
latter sets `background-image` then immediately resets it with
`background: none` in the same rule, so it was never fetched even
before Phase 2). Harmless to leave, but worth removing in a cleanup
pass since they're confusing to read.

- [ ] Deploy this correction, re-verify Tours & Pricing / Book Now on
      a large/2K screen specifically this time
- [ ] Consider a follow-up cleanup PR to delete the dead
      `.section-fixed-canvas--*` rules

---

## How to resume (if a session runs out)

1. Re-clone or `cd` into the repo, `git status` to see what's
   committed vs. still local/uncommitted.
2. Re-read the **Checklist** above and this file's **Status** section
   — update Status by hand or ask Claude to re-check actual file
   sizes/branch state and update it before continuing.
3. Assets already converted don't need redoing — check file sizes
   (`du -sh public/images/*.webp` etc.) against the **Full asset
   inventory** table below to see what's done vs. pending.
4. Continue down the checklist in order.

---

## Full asset inventory (as of 2026-09-04, before any optimization)

### Videos

| File | Size | Resolution/bitrate | Notes |
|---|---|---|---|
| `public/videos/hero-loop.mp4` | 58.2 MB | 1920×1080, ~19.5 Mbps | Homepage hero background loop — highest priority |
| `public/videos/destinations/anuradhapura.mp4` | 38.0 MB | — | |
| `public/videos/destinations/sigiriya.mp4` | 36.9 MB | — | |
| `public/videos/destinations/ambient-atlas-loop.mp4` | 1.5 MB | — | Already reasonably sized |

### Images over 300 KB (85 files, `public/images/` + `public/mural/`)

Largest first — full list, for checking off as each is converted:

```
6.71 MB  images/journal-portal-doors-coordinated-final.png     [journal portal]
6.62 MB  images/fine-lanka-route-atlas-all-hubs.png
5.33 MB  flight-canvas-texture.png
4.79 MB  images/navbar_backdrop_4.png                          [navbar backdrop]
4.78 MB  images/journal-portal-arch-frame-final.png            [journal portal]
4.78 MB  images/journal-portal-arch-frame-fit-final.png        [journal portal]
4.74 MB  images/fine-lanka-explore-video-frame-motif.png
4.63 MB  images/fine-lanka-explore-video-frame-temple-ledger-description-panel.png
3.96 MB  images/dest-panel-frame.png
2.99 MB  images/journal-portal-arch-frame-gapless.png          [journal portal]
2.99 MB  images/journal-portal-arch-frame-fitted.png           [journal portal]
2.98 MB  images/journal-portal-arch-frame-gapless-v2.png       [journal portal]
2.81 MB  images/journal-portal-door-seam-trim-final-v2.png     [journal portal]
2.32 MB  images/journal-portal-arch-frame-inner-edge-aligned.png [journal portal]
2.30 MB  images/milk-rice-compass-grain-mark.png
2.28 MB  images/fine-lanka-explore-video-frame-portrait.png
2.07 MB  images/fine-lanka-explore-video-frame-heritage.png
2.06 MB  mural/frame-5.png                                     [mural]
1.91 MB  mural/frame-6.png                                     [mural]
1.88 MB  images/tour-nature.png
1.88 MB  images/tour-cultural-historical.png
1.88 MB  images/destinations-route-line.png
1.87 MB  images/tour-beach.png
1.84 MB  images/fine-lanka-explore-video-frame-sigiri-sithuwam-header.png
1.83 MB  images/journal-portal-arch-frame-door-height.png      [journal portal]
1.80 MB  images/tour-ramayana-trails.png
1.72 MB  images/dest-card-frame.png
1.68 MB  images/tour-romantic.png
1.55 MB  mural/blend-1.png                                     [mural]
1.54 MB  mural/blend-4.png                                     [mural]
1.54 MB  mural/blend-3.png                                     [mural]
1.53 MB  mural/blend-6.png                                     [mural]
1.52 MB  mural/blend-5.png                                     [mural]
1.51 MB  mural/blend-2.png                                     [mural]
1.49 MB  images/logo-site.png
1.39 MB  mural/frame-3.png                                     [mural]
1.36 MB  mural/frame-2.png                                     [mural]
1.35 MB  mural/frame-1.png                                     [mural]
1.16 MB  mural/frame-4.png                                     [mural]
0.96 MB  images/fine-lanka-cultural-route-panel.jpg
0.94 MB  images/fine-lanka-sigiriya-fresco-passage.jpg
0.88 MB  images/blend-1.jpg
0.87 MB  images/blend-3.jpg
0.86 MB  images/journal/portal-doors-refined.jpg                [journal portal]
0.86 MB  images/blend-4.jpg
0.86 MB  images/destinations-light-sigiriya-sithuwam-tourism-background.jpg
0.86 MB  images/blend-2.jpg
0.84 MB  images/fine-lanka-arugam-bay-surf.jpg
0.78 MB  images/frieze-divider.jpg
0.70 MB  images/fine-lanka-about-heritage-hero.jpg
0.68 MB  images/destinations-atlas-bg-mobile.jpg
0.68 MB  images/journal-portal-stone-wall-background.jpg        [journal portal]
0.67 MB  images/milk-rice-pricing-field-notes.jpg
0.66 MB  images/serendib-brass-wheel.png
0.64 MB  images/fine-lanka-home-route-folio-background.jpg
0.61 MB  images/fine-lanka-process-route-background-tall.jpg
0.60 MB  images/destinations-atlas-bg.jpg
0.59 MB  images/fine-lanka-explore-section-wide-background.jpg
0.59 MB  images/fine-lanka-esala-perahera.jpg
0.57 MB  images/serendib-ancient-map.jpg
0.57 MB  images/fine-lanka-explore-atlas-background.jpg
0.56 MB  images/destinations-cloud-frame.png
0.54 MB  images/fine-lanka-about-bg-hero.jpg
0.53 MB  images/tours-moonstone-route-paper.jpg
0.52 MB  images/tours-temple-path-cover.jpg
0.52 MB  images/fine-lanka-explore-heritage-background.jpg
0.52 MB  images/fine-lanka-about-bg-principles-left.jpg
0.51 MB  images/modal-mural.jpg
0.51 MB  images/journal/portal-realm-refined.jpg                [journal portal]
0.50 MB  images/fine-lanka-journey-blue-lily-background.jpg
0.49 MB  images/tours-kandyan-night-register.jpg
0.48 MB  images/journal-portal-frame-coordinated-final.jpg       [journal portal]
0.48 MB  images/fine-lanka-about-bg-principles.jpg
0.46 MB  images/fine-lanka-why-craft-background.jpg
0.46 MB  images/fine-lanka-about-bg-origin.jpg
0.45 MB  images/fine-lanka-kandyan-dancers.jpg
0.45 MB  images/fine-lanka-about-bg-origin-left.jpg
0.43 MB  images/milk-rice-tours-field-notes.jpg
0.38 MB  images/sri-lanka-map-island-focus.jpg
0.38 MB  images/sri-lanka-map-full.jpg
0.38 MB  images/destinations-atlas-mist.png
0.36 MB  images/milk-rice-booking-field-notes.jpg
0.36 MB  images/fine-lanka-about-bg-invitation.jpg
0.36 MB  images/fine-lanka-booking-bg.jpg
0.34 MB  images/fine-lanka-liyawel-border.jpg
0.34 MB  images/how-it-works-exploration-bg.jpg
0.32 MB  images/liyawel-gold.jpg
```

`public/` total: **271 MB** as of 2026-09-04, before any optimization.

---

## Open questions / decisions still needed

- **Commit optimized files to the repo, or generate them as a CI
  step?** Committing is simpler and keeps `main` self-contained;
  generating in CI keeps the repo smaller but adds build time and
  complexity. Leaning towards committing pre-optimized files directly
  (swap in place), since these are one-time conversions, not
  per-build variables.
- **Format choice:** WebP is broadly supported and simple; AVIF
  compresses better but is slower to encode and has (rare) older
  browser gaps. Default plan: WebP for images, keep MP4/H.264 for
  video (re-encoded at a sane bitrate) since it has the widest
  compatibility.
- **Do old CSS/code references need updating for new extensions?**
  Yes — if `.png` becomes `.webp`, every `url(...)` and `src=` using
  that filename needs updating too. This is why files are being
  swapped in batches (portal set together, mural set together, etc.)
  rather than one at a time — easier to grep-and-replace per batch.

## Related docs

- `docs/CPANEL-DEPLOY.md` — the deploy pipeline (GitHub Actions builds
  → `deploy/production` branch → manual cPanel pull/deploy click).
  Nothing about that pipeline changes for this task; optimized assets
  just ride through the same path.
