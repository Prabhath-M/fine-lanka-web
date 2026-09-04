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

**Current phase:** Sample conversions done and visually verified —
proceeding to full batch conversion.

**Confirmed settings (visually checked, safe to reuse for the rest):**
- **Images → WebP:** `quality=82, method=6` (Pillow `im.save(path, 'WEBP', quality=82, method=6)`).
  On the 3 samples tested (journal portal doors, navbar backdrop,
  mural frame) this gave **~9–14x size reduction with no visible
  quality loss** even on fine detail (carving, gold inlay).
- **Video → H.264 re-encode:** `ffmpeg -c:v libx264 -preset slow -crf 26
  -maxrate 3500k -bufsize 7000k -c:a aac -b:a 96k -movflags +faststart`.
  On `hero-loop.mp4`: **58.2 MB → 7.9 MB (7.7x smaller)**, frame-by-frame
  comparison showed no visible difference.

Nothing has been swapped into `public/` yet as of this writing — only
tested in `/tmp`. Next step is running this across the full asset
list and swapping files in.

### Checklist — do in this order

- [x] Sample conversion + visual sanity check (2–3 files, before
      doing all ~90) — confirmed quality is acceptable, settings above
- [x] Hero video (`public/videos/hero-loop.mp4`) — 58.2MB → 7.9MB
- [x] Destination videos — `anuradhapura.mp4` 38.0MB→4.7MB,
      `sigiriya.mp4` 36.9MB→10.6MB. `ambient-atlas-loop.mp4` (1.5MB)
      left as-is, already small. **`public/videos` total: 135MB → 24MB**
- [x] Journal portal image set — 6 files actually referenced in code
      converted to WebP (34.7MB → 4.95MB combined); 7 more files in
      that family were unused leftover variants (arch-frame-final,
      -fit-final, -gapless, -fitted, -inner-edge-aligned,
      -door-height, journal/portal-doors-refined.jpg) — confirmed via
      grep no code/CSS references them, deleted outright rather than
      converted. `portal-doors.jpg` (221KB, unused) and
      `portal-realm.jpg` (167KB, used, already small) left alone.
- [x] Navbar backdrop set — only `navbar_backdrop_4.png` was the
      outlier (4.78MB); 1–3 were already small (~130-150KB each).
      All 4 converted to WebP for consistency. **5.19MB → 0.57MB**
- [x] Mural set — `blend-1..6.png` (the active flipbook frames,
      referenced in `site-header.tsx`) converted to WebP: 9.19MB →
      1.02MB. `frame-1..6.png` (~10MB) were dead files — confirmed no
      code reference (grepped for any `mural` usage beyond
      `blend-N`), deleted outright.
- [x] Re-ran `npx tsc --noEmit` (clean) and `npx vitest run` (8/8
      passing) after the above changes — done as a checkpoint before
      continuing to the remaining images.
- [ ] **NEXT UP:** remaining `public/images/*` over 300 KB (~65 files
      not yet touched — see full list below, minus the journal
      portal/navbar/mural files already done above)
- [ ] Full `next build` verification (couldn't run in this sandbox —
      network-restricted, can't reach fonts.googleapis.com for
      next/font; not a real issue, just this container. Verify for
      real once pushed and GitHub Actions runs the build.)
- [ ] Commit remaining work on `fix/optimize-media` branch (already
      created; hero/destination videos + journal portal + navbar +
      mural batch is the first commit on it, not yet pushed as of
      this checkpoint), verify GitHub Actions build succeeds
- [ ] Merge to `main`, confirm `deploy/production` updated
- [ ] Manual cPanel step: Git Version Control → Update from Remote →
      Deploy HEAD Commit (see `docs/CPANEL-DEPLOY.md`)
- [ ] Verify on `https://finelankatours.com` — homepage hero, journal
      page portal animation, general page-weight via browser devtools
      Network tab

**Running total so far:** `public/` 271MB → 106MB
(videos 135MB→24MB, mural 19MB→1.1MB, images 113MB→76MB — images
still has the bulk of the remaining ~65 files to do).

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
