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
- [ ] **NEXT UP:** commit this final batch on `fix/optimize-media`
      (first batch — videos + portal + navbar + mural — already
      committed and pushed to that branch), push, verify GitHub
      Actions build succeeds
- [ ] Merge to `main`, confirm `deploy/production` updated
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
