# Opening Animations + Asset Preload — Plan & Progress

**Purpose of this doc:** same convention as `docs/MEDIA-OPTIMIZATION.md` —
track a multi-session, multi-page task so it survives across sessions.
Read **Status** first if resuming.

Branch: `develop` (cut from `main` at `739677d`). Work happens here in
sections, each as its own commit (or small PR into `develop`), until the
whole thing is reviewed and `develop` is merged into `main` for a single
production deploy.

---

## The idea

Every "heavy" page opens with a ritual/animation (typewriter text on
Home, a portal reveal on Journal, a brass-wheel ritual on Destinations)
before the real content is visible. That opening window is dead time
from a network point of view — nothing else is competing for bandwidth
yet. Use it to **kick off fetching the page's heavy images in the
background** while the animation is playing, so by the time the
animation ends and the real content renders, the images are already in
the browser cache instead of triggering a fresh request.

This does **not** replace the media-optimization work already done
(`docs/MEDIA-OPTIMIZATION.md` — files are already compressed/resized).
This is about *when* the browser starts downloading them, not their
size.

## Current state (audited 2026-09-04, before this branch)

| Page | Opening animation today | Preloading today |
|---|---|---|
| **Home** (`app/page.tsx` → `home-page.tsx`) | `TypedOpening` (`components/home/typed-opening.tsx`) — real character-by-character typewriter via `useTypingProgress`. Fires `HERO_OPENING_COMPLETE_EVENT` after ~5.36s (or ~580ms if `prefers-reduced-motion`). | Event is used for exactly one thing: `hero.tsx` waits for it to call `video.play()`. `preload="auto"` was already fixed on the hero video (branch `fix/first-load-media-races`, already in `main`). Nothing else on the page is preloaded during the typing window. |
| **Journal** (`journal-page.tsx`) | Its own typewriter via `useTypingProgress` directly (not the shared `TypedOpening` component) driving a "portal" reveal built from `next/image`. | Portal images use `next/image`, which has its own lazy/priority handling, but nothing is explicitly preloaded ahead of the typing sequence. |
| **Destinations** (`destinations-page.tsx` → `ChartIntro`) | Not a typewriter — a brass ship's-wheel ritual (`components/destinations/chart-intro.tsx`). Already gates opening the "doors" on the wheel image (`onLoad`/`onError`) **and** the first destination video being ready, with a `WHEEL_MS` (2650ms) minimum and a `MAX_EXTRA_WAIT_MS` (4000ms) hard cap so a slow/cold load never hangs forever (this gating is also from `fix/first-load-media-races`, already in `main`). | The wheel image (`/images/serendib-brass-wheel.webp`) only starts fetching when `ChartIntro` itself mounts — i.e. right as the visitor lands on the page, with no head start. On a cold cache this is exactly the "rudder wheel doesn't finish loading before the ritual's minimum time is up" symptom reported — the gate logic is correct, but the image has no earlier opportunity to start downloading. |
| **Tours & Pricing** (`app/tours-pricing`, `tours-pricing-page.tsx`) | **None currently.** No typewriter, no ritual — content renders immediately. | N/A |

Also relevant: `app/tours-pricing` and the "Tours" and "Pricing" pages
the person mentioned are the same route/component
(`ToursPricingPage`) — there's one combined page, not two.

## Scope

Add/extend an opening animation on **Destinations** (enhance existing
ritual) and **Tours & Pricing** (net-new), and on all four pages use
the opening window to preload each page's heavy assets:

- background images (large CSS `background-image` sections)
- "site images" (hero-adjacent, feature imagery)
- container/window-frame images (the decorative frame art around
  cards/panels — e.g. `dest-panel-frame-*.webp`)
- section-end border images (e.g. `frieze-divider-*.webp`,
  `fine-lanka-liyawel-border-1600w.webp`)
- Destinations' brass rudder wheel specifically (both the one-time
  ritual instance and the persistent carousel-control instance in
  `destination-marquee.tsx`)

**Non-goals** (explicitly out of scope for this branch, to keep it
reviewable):
- Re-compressing/resizing any image — already done in
  `docs/MEDIA-OPTIMIZATION.md`.
- Changing the visual design of the existing Home/Journal animations.
- Video preloading beyond what `fix/first-load-media-races` already
  did (hero video, first destination card video) — those are already
  handled by the existing gating logic.

## Shared mechanism

One small reusable piece, used the same way on every page:

```ts
// lib/use-preload-images.ts (new)
export function usePreloadImages(urls: string[], start: boolean) {
  useEffect(() => {
    if (!start) return
    urls.forEach((url) => {
      const img = new Image()
      img.src = url
    })
  }, [start, urls])
}
```

- `start` ties it to the animation actually beginning (not just the
  component mounting) so this stays consistent across pages.
- Deliberately plain `Image()` prefetch, not `<link rel="preload">` in
  `<head>` — the set of images differs per page and this needs to be
  scoped to the page component, not global markup in `app/layout.tsx`.
- Respects the same `prefers-reduced-motion` reality the existing
  animations already check: if the animation is skipped, this should
  still fire (just without a window to hide inside) — reduced motion
  means "skip the show," not "skip the network optimization."
- Only the images visible in the **first viewport or two** after the
  animation ends go in each page's list — not the entire page's image
  budget. Preloading everything defeats the point (see the "how much
  to preload" caution from the earlier discussion in this chat).

## Page-by-page plan

### 1. Home
`TypedOpening` already exposes `HERO_OPENING_COMPLETE_EVENT` and, more
usefully, already starts its timers the moment it mounts — so preload
can start immediately on mount rather than waiting for completion.
Add `usePreloadImages` to `home-page.tsx` (or `hero.tsx`) for:
`sri-lanka-map-island-focus.webp`, `fine-lanka-esala-perahera.webp`,
`fine-lanka-process-route-background-tall.webp`, plus the top 2-3
`fine-lanka-*-1600w.webp` background images that land in the first
couple of scroll sections. Confirm against `app/globals.css` for the
exact section order before finalizing the list.

### 2. Journal
Same pattern: kick off `usePreloadImages` for the portal image set
(`/images/journal/portal-realm-refined.webp` and any sibling frames
it uses) at the same time `useTypingProgress` starts, not gated on
typing completion.

### 3. Destinations
Two changes:
- Move the brass wheel image (`serendib-brass-wheel.webp`) preload
  **earlier than page mount** — add `<link rel="prefetch" as="image"
  href="/images/serendib-brass-wheel.webp">` to the site-wide nav
  component (`site-header.tsx`) or trigger a prefetch on hover/focus
  of the "Destinations" nav link, so it's already warm by the time
  `ChartIntro` mounts. This is the direct fix for the reported
  first-load symptom.
- Add `usePreloadImages` inside `ChartIntro` (or `destinations-page.tsx`)
  for the atlas/panel/frame images used right after the doors open:
  `destinations-atlas-bg-1600w.webp` (+ its mobile variant),
  `dest-panel-frame-960w.webp`/`-1600w.webp`, `frieze-divider-1600w.webp`,
  `destinations-cloud-frame.webp`, `destinations-atlas-mist.webp`.

### 4. Tours & Pricing
This page has no opening animation at all today, so this is net-new
work, not just adding a preload hook:
- Build a short opening (reuse the shared `TypedOpening`-style
  component rather than inventing a fourth animation style — same
  typewriter mechanism, page-appropriate copy) gating the tour grid's
  reveal the same way Home gates its hero video.
- Preload during it: `tours-temple-path-cover-1600w.webp`,
  `tours-kandyan-night-register-1600w.webp`, the `tour-*.png`/`.webp`
  category images already covered in `MEDIA-OPTIMIZATION.md`, and
  `fine-lanka-liyawel-border-1600w.webp`.

## Execution workflow

1. Work section by section, in the order above (Home → Journal →
   Destinations → Tours & Pricing), each as its own commit on
   `develop`.
2. After each section: `npx tsc --noEmit` and `npx vitest run` clean,
   plus a quick visual check (dev server) that the animation timing
   still feels right and nothing regressed.
3. Update the **Status** section below after each section.
4. Once all four are done and `develop` is stable, merge `develop` →
   `main` (a single PR, referencing this doc).
5. Merging to `main` triggers the existing GitHub Actions build
   (`docs/CPANEL-DEPLOY.md`), which pushes built output to
   `deploy/production`.
6. Final manual step (needs cPanel access, same as every prior
   deploy): cPanel → Git™ Version Control → the `deploy/production`
   repo → **Update from Remote** → **Deploy HEAD Commit**.

## Open questions / assumptions to confirm before Section 4

- Tours & Pricing having **no** existing opening animation means that
  section is meaningfully bigger than the other three (new component,
  new copy, new timing) — flagging this now rather than discovering
  scope creep mid-branch. Happy to proceed with a copy consistent with
  the Home page's tone unless there's specific wording wanted.
- Destinations' ritual is wheel-based, not typewriter text. **Confirmed:**
  keep the existing wheel ritual as-is (not replaced with typed text) —
  just fix the preload gap and slow the wheel turn, as done in Section 1.

## Decisions made mid-plan (superseding original Section 3 sketch)

- Rather than the nav-hover/`<link rel="prefetch">` idea originally
  sketched for Destinations, the brass rudder wheel
  (`/images/serendib-brass-wheel.webp`) is preloaded from the **Home
  page** instead, via the new shared `usePreloadImages` hook
  (`lib/use-preload-images.ts`) — Home is where most visitors land
  first, so this gives the wheel the longest possible head start
  regardless of whether/how someone navigates to Destinations
  afterward. Section 3 (when it happens) should not duplicate this;
  it only needs the other Destinations assets (atlas/panel/frame
  images), since the wheel is already covered.
- The wheel-turn animation itself was slowed from 2.65s to 3.6s
  (`chartWheelTurnSmooth` in `app/globals.css`) specifically to give
  page loading more time before the ritual's minimum-time gate is
  satisfied. `WHEEL_MS` in `components/destinations/chart-intro.tsx`
  was updated to match (2650 → 3600) — these two values must always
  move together. The dead base-rule `chartWheelTurn` (2.4s, not
  actually active since `[data-chart-ritual]` always overrides it)
  was bumped to 3.6s too, for consistency/no confusion if it's ever
  reused without that wrapper.

---

## Status

**Current phase: IN PROGRESS — Section 1 done.**

- [x] Section 1 — Home preload. Added `lib/use-preload-images.ts`
      (shared hook, fires on mount, ignores reduced-motion since
      that's about skipping animation, not skipping network warmup).
      `home-page.tsx` now preloads the Destinations rudder wheel plus
      Home's own `sri-lanka-map-island-focus`,
      `fine-lanka-esala-perahera`, and
      `fine-lanka-process-route-background-tall` images the moment
      the page mounts. Also slowed the rudder wheel's turn animation
      (2.65s → 3.6s) and its matching `WHEEL_MS` gate (2650 → 3600) so
      the ritual's own dead time is longer too. `tsc --noEmit` and
      `vitest run` both clean (8/8 passing).
- [ ] Section 2 — Journal preload
- [ ] Section 3 — Destinations preload (atlas/panel/frame images only
      — wheel already covered by Section 1, see "Decisions made
      mid-plan" above)
- [ ] Section 4 — Tours & Pricing opening animation + preload
- [ ] Full `tsc`/`vitest` pass on `develop`
- [ ] Merge `develop` → `main`
- [ ] Confirm GitHub Actions build succeeded, `deploy/production` updated
- [ ] Manual cPanel deploy click (needs human with cPanel access)
- [ ] Confirm live on `https://finelankatours.com`
