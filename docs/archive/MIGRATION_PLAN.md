# Fine Lanka Tours — Migration Plan

## Where things stand today

This project is already a Next.js 16 / React 19 / Tailwind v4 app (`app/`,
`components/`, `lib/`), but only one route was actually rebuilt as React:

- **`/journal`** → real React: `app/journal/page.tsx` → `components/journal-page.tsx`
  + `lib/journal-data.ts`. This is the target pattern for everything else.
- **`/`** → `app/page.tsx` just does `redirect('/index.html')`, which is served
  as a static file from `public/`.
- **`booking.html`, `destinations.html`, `tours-pricing.html`** → static files
  in `public/`, never touched by the Next.js router at all.
- All four static pages share `public/css/style.css` and four vanilla-JS
  files loaded as plain `<script>` tags on every page:
  - `public/js/data.js` — all site content (nav, destinations, tours,
    testimonials, footer, etc.) as JS objects/arrays
  - `public/js/icons.js` — inline SVG icon markup as strings
  - `public/js/render.js` — functions that stuff `data.js` content into DOM
    nodes by `id`
  - `public/js/main.js` — event listeners / interactions (mobile nav, modal,
    map pins, filters, forms) — already has a compatibility shim so it can
    run either on a plain static page *or* injected into the Next.js
    `/journal` page

**Target state:** everything lives under `app/` as real React routes, sharing
one design system (`app/globals.css` + shadcn/ui, same tokens `journal-page`
already uses), one typed content layer under `lib/`, and no `public/*.html`
or `public/js/*.js` left. The vanilla JS is retired page-by-page instead of
in one big rewrite, so the site stays shippable between sessions.

## How to use this file

Each step below has a `Status:` line. Update it in place as work happens:

```
Status: TODO           ← not started
Status: IN PROGRESS     ← currently being worked on (only one at a time per phase, ideally)
Status: DONE            ← merged/working, legacy file(s) for that step removed if the step says so
```

Work top to bottom — later phases assume earlier ones are `DONE`. Each
numbered step is sized to be one session's worth of work. Don't jump ahead
to deleting a legacy file until its replacement has been visually checked
against the original.

---

## Phase 0 — Prep
**Status: DONE**

- [x] 0.1 Inventory existing project, confirm which routes are real React
      vs static HTML, write this plan.
      **Status: DONE**
- [x] 0.2 Decide design-token strategy: keep `public/css/style.css` classes
      as-is during migration (fastest), and only fold matching rules into
      `app/globals.css` / Tailwind utilities during Phase 9 polish, rather
      than trying to convert every class up front.
      **Status: DONE**
- [x] 0.3 Create empty route stubs so the folders exist:
      `app/destinations/`, `app/booking/`, `app/tours-pricing/`.
      **Status: DONE** — each is a `page.tsx` returning `null` with a
      `TODO(Phase N — see MIGRATION_PLAN.md)` comment pointing at the
      phase that fills it in. Nothing links to these routes yet (all
      nav/footer hrefs still point at the `*.html` files), so they're
      inert until then.

> **Note found during Phase 1:** `public/js/data.js` also defines a
> `JOURNAL_ENTRIES` array (used by `render.js`'s `renderJournalIndex` /
> `main.js`'s `initJournalPage`), duplicating `lib/journal-data.ts`. It
> looks like dead code left over from before `/journal` was ported to
> React — `components/journal-page.tsx` doesn't call into that vanilla
> code path. Not touched in Phase 1; flagged for removal alongside the
> rest of the unused vanilla JS in Phase 7.

---

## Phase 1 — Shared content layer
*Port `data.js` into typed `lib/` modules, same pattern as `journal-data.ts`.*

- [x] 1.1 `lib/site-data.ts` — `SITE` (brand, phone, email, foundedYear) and
      `NAV_LINKS` (with nested `children` for dropdowns).
      **Status: DONE**
- [x] 1.2 `lib/destinations-data.ts` — the destinations array (region,
      mapX/mapY coords, images, copy).
      **Status: DONE**
- [x] 1.3 `lib/tours-data.ts` — `TOUR_CATEGORIES` + tour/pricing entries.
      **Status: DONE**
- [x] 1.4 `lib/site-data.ts` (extend) — testimonials, footer columns,
      "why us" features, process steps, travel notes, social links.
      **Status: DONE**
- [x] 1.5 `components/icons.tsx` — convert `icons.js`'s string-returning
      icon functions into small React components (or one `<Icon name="…" />`
      lookup component).
      **Status: DONE**

**Phase 1 output:** `lib/site-data.ts`, `lib/destinations-data.ts`,
`lib/tours-data.ts`, `components/icons.tsx` — all additive, typed, and
not yet imported anywhere. `public/js/data.js` and `public/js/icons.js`
are untouched and still power every static page. Nothing to visually
QA yet since nothing consumes these files until Phase 2.

---

## Phase 2 — Shared layout (header, footer, modal)
*Replaces `render.js`'s nav/footer rendering and `main.js`'s
`initMobileNav` / `initEnquiryModal`.*

- [x] 2.1 `components/site-header.tsx` — desktop nav, dropdowns, mobile
      drawer, phone number, "Plan a Journey" button. Reads `NAV_LINKS` from
      `lib/site-data.ts`; active-page highlighting via `usePathname()`
      instead of `data-page`.
      **Status: DONE** — also sets `body[data-page]` itself (see note
      below), since `public/css/style.css` has page-scoped rules that
      key off that attribute.
- [x] 2.2 `components/site-footer.tsx` — brand blurb, footer columns,
      socials, copyright line.
      **Status: DONE**
- [x] 2.3 `components/enquiry-modal.tsx` — client component; open/close
      state instead of `classList` toggling. Still listens globally for
      `[data-open-enquiry]` / `[data-close-enquiry]` clicks (same as the
      original `initEnquiryModal()`), so any button anywhere — header,
      hero, CTA bands built in later phases — can open it with no prop
      drilling.
      **Status: DONE**
- [x] 2.4 Wire header/footer/modal into `app/layout.tsx` so every route
      gets them for free, and move the `style.css` `<link>` + Google
      Fonts `<link>` tags there too (previously duplicated on every
      static page and in `journal-page.tsx`).
      **Status: DONE** — `app/page.tsx`'s redirect is untouched, so `/`
      still goes straight to `/index.html` until Phase 3.

> **Notes from Phase 2:**
> - `public/css/style.css` has a couple of rules scoped to
>   `body[data-page="index"]` (an index-only `.nav-toggle` treatment).
>   `SiteHeader` now sets `body.dataset.page` itself from the current
>   route, replacing the per-page `useEffect`/inline `data-page` attribute
>   every page used to set by hand — one place instead of five.
> - `components/journal-page.tsx` no longer renders its own header/nav/
>   mobile-drawer/enquiry-modal markup, no longer loads
>   `/js/data.js` / `icons.js` / `render.js` / `main.js` via `next/script`,
>   and dropped the `scriptsLoaded` state that sequenced those loads. It
>   now relies entirely on the shared components from `app/layout.tsx`.
>   **`/journal` is the first page to visually QA** — check the header
>   (nav, dropdowns, mobile drawer, scroll style), footer, and "Plan a
>   Journey" enquiry modal there against how they looked before.
> - Fixed a latent bug while doing this: the old inline
>   `--btn-icon-left: url('../images/plan.png')` on the journal page's
>   header button was a relative path with nothing to actually be
>   relative *to* on a `/journal` route (it only "worked" by accident on
>   static pages sitting at the `public/` root). `SiteHeader` now uses an
>   absolute `/images/<name>.png` path.
> - The original static pages weren't fully consistent here either —
>   `index.html`/`destinations.html` used `plan.png` for that button,
>   `booking.html`/`tours-pricing.html` used `direction.png`.
>   `SiteHeader` takes a `planIcon` prop (default `'plan.png'`) so each
>   page migrated in Phases 3–6 can match its old icon if desired.
> - `public/js/data.js`, `icons.js`, `render.js`, `main.js` and
>   `public/css/style.css` are all still untouched and still power every
>   static HTML page — nothing is deleted until Phase 7.

**Phase 2 output:** `components/site-header.tsx`, `site-footer.tsx`,
`enquiry-modal.tsx`, wired into `app/layout.tsx`. `/journal` is now the
only route rendering the new React header/footer/modal instead of the
vanilla-JS-driven ones; `/`, `/destinations`, `/tours-pricing`,
`/booking` either redirect to static HTML or render an empty stub, so
there's nothing new to see on those yet.

---

## Phase 3 — Migrate homepage
*Replaces `public/index.html` + its home-only bits of `main.js`
(`initExploreSection`, `positionMapPins`, `initScrollReveal`).*

- [x] 3.1 Build real `app/page.tsx` (Hero, Features, Intro, Explore-Map,
      Process, Testimonials, CTA band, Newsletter) as React components
      under `components/home/`, using Phase 1 data.
      **Status: DONE** — `components/home/hero.tsx`, `features.tsx`,
      `intro.tsx`, `explore-section.tsx`, `process.tsx`,
      `testimonials.tsx`, `cta-band.tsx`, `newsletter.tsx`, composed by
      `components/home-page.tsx` (same top-level-component pattern as
      `journal-page.tsx`). All content comes from `lib/site-data.ts` /
      `lib/destinations-data.ts`; icons via `components/icons.tsx`.
      Newsletter form keeps the same client-side-only validation +
      placeholder "submit" as the original (no backend wired up).
- [x] 3.2 Port the interactive map-pin positioning and hero reveal-on-scroll
      logic into a small client hook/component.
      **Status: DONE** — `components/home/explore-section.tsx` ports
      `positionMapPins()`/`parseObjectPosition()` and the 8s
      auto-rotate/fade/detail-drawer behaviour from `initExploreSection()`
      as React state + refs (pin px positions recomputed on image
      load/resize via `requestAnimationFrame`, same as the original).
      `components/home-page.tsx` ports `initScrollReveal()` as a single
      `IntersectionObserver` effect covering every `.reveal` element
      (Features cards, Process steps, the explore-window), same
      reduced-motion/no-`IntersectionObserver` fallback as the original.
- [x] 3.3 Visual QA against the old `index.html` side by side, then delete
      `public/index.html` and remove the `redirect('/index.html')` from
      `app/page.tsx`.
      **Status: DONE** — QA approved by the project owner; `public/index.html`
      deleted. (Video/map-pin poster assets under `public/videos/` don't
      exist in this repo snapshot — same gap as the original static page,
      not something this migration introduced.)

> **Notes from Phase 3:**
> - No `node_modules` / network access in this session, so this couldn't
>   be verified with `next build` or a browser — only by careful manual
>   review and a standalone bracket/paren balance check on every new
>   file. Run `pnpm install && pnpm build` (or `pnpm dev`) as the first
>   step of finishing 3.3.
> - All internal links (`destinations.html?region=…`,
>   `tours-pricing.html?category=…`, etc.) initially still pointed at the
>   `*.html` files, matching `SiteHeader`/`SiteFooter`'s existing
>   `NAV_LINKS`/`FOOTER_COLUMNS` convention at the time — swapped to real
>   routes in Phase 8.
> - Image/video paths use absolute `/images/...` / `/videos/...` (not
>   the static page's old relative `images/...`), same fix as
>   `SiteHeader`'s `planIcon` in Phase 2.
> - **Bug found during QA:** clicking a destination pin made the whole
>   explore-window panel vanish instead of switching destinations. Cause:
>   `home-page.tsx`'s scroll-reveal observer added `is-visible` to
>   `#explore-window` imperatively via `classList`, outside React — but
>   `ExploreSection` re-renders on every pin/dot click (`index`/`open`/
>   `fading` state), and each re-render recomputes `className` from JSX,
>   wiping the externally-added class straight back off. Fixed by giving
>   `ExploreSection` its own `revealed` state + `IntersectionObserver`
>   (so it survives its own re-renders) and excluding
>   `.explore-map-section` from the page-level observer's targets.

---

## Phase 4 — Migrate destinations page
*Replaces `public/destinations.html` + `initDestinationsPage` /
`initDestinationFlip`.*

- [x] 4.1 Build `app/destinations/page.tsx` + `components/destinations-page.tsx`.
      **Status: DONE** — `components/destinations-page.tsx` (page hero,
      filter bar + grid, CTA band) plus a reusable
      `components/destinations/destination-card.tsx` flip card (local
      `flipped` state instead of the old delegated-click class toggle;
      hover-flip on pointer-fine devices is still pure CSS, untouched).
      `app/destinations/page.tsx` sets its own `metadata` (title/
      description) matching the original static page, since
      `app/layout.tsx`'s metadata is journal-specific.
- [x] 4.2 Support the `?region=` filter (was read straight from
      `location.search`; use `useSearchParams()`).
      **Status: DONE** — reads the region from `useSearchParams()` and
      writes it back with `router.replace(..., { scroll: false })`
      (App Router's equivalent of the old `history.replaceState`).
      `app/destinations/page.tsx` wraps the client component in
      `<Suspense>`, which `useSearchParams()` requires.
- [x] 4.3 QA against original, then delete `public/destinations.html`.
      **Status: DONE** — QA approved by the project owner; nav/footer/
      homepage links repointed to `/destinations` in Phase 8;
      `public/destinations.html` deleted.

> **Notes from Phase 4:**
> - `featured` on `Destination` is unused dead data in the original (the
>   comment in `render.js` referencing "the homepage's featured grid"
>   describes a section that doesn't actually exist in `index.html`) —
>   left as-is, not read by the new destinations page either.
> - The CTA band's markup here deliberately has no `.container` wrapper
>   around its heading/paragraph/button (unlike the homepage's CTA
>   band, which does) — that's an inconsistency in the original static
>   site itself, kept faithfully rather than "fixed".

---

## Phase 5 — Migrate tours & pricing page
*Replaces `public/tours-pricing.html` + `initTourPricingPage`.*

- [x] 5.1 Build `app/tours-pricing/page.tsx` + `components/tours-pricing-page.tsx`.
      **Status: DONE** — `components/tours-pricing-page.tsx` (page hero,
      filter bar + category intro + package grid, travel notes, CTA
      band), plus `components/tours/tour-card.tsx` and
      `components/tours/itinerary-modal.tsx`. The itinerary modal stays
      mounted at all times (`tour: TourPackage | null`, toggling
      `.is-open`) rather than being conditionally rendered, matching the
      original's CSS-transition approach. `app/tours-pricing/page.tsx`
      sets its own `metadata`, same pattern as Phase 4.
- [x] 5.2 Support the `?category=` filter via `useSearchParams()`.
      **Status: DONE** — same `useSearchParams()` +
      `router.replace(..., { scroll: false })` pattern as the
      destinations page's region filter; wrapped in `<Suspense>`.
- [x] 5.3 QA, then delete `public/tours-pricing.html`.
      **Status: DONE** — QA approved by the project owner; nav repointed
      to `/tours-pricing` in Phase 8; `public/tours-pricing.html` deleted.

> **Notes from Phase 5:**
> - **Fixed a latent bug from Phase 2 while doing this:** `SiteHeader`'s
>   `planIcon` prop was never actually usable — it's mounted once in
>   `app/layout.tsx` with no prop passed, so every route was silently
>   getting `plan.png` regardless of the original page's icon. Since
>   `tours-pricing.html` (and `booking.html`, Phase 6) used
>   `direction.png`, this would have been a visible regression the
>   moment this page went live. Fixed by having `SiteHeader` derive the
>   icon from its own `currentPage` (which it already computes via
>   `usePathname()`) instead of relying on a prop nobody could pass —
>   `planIcon` is kept as an optional override, not removed.
> - `TOUR_CATEGORIES` with `comingSoon: true` (Ayurvedic & Wellness,
>   Vacation) render the same "still being drafted" enquiry prompt as
>   the original instead of a package grid — ported as-is.

---

## Phase 6 — Migrate booking page
*Replaces `public/booking.html` + `initBookingForm`.*

- [x] 6.1 Build `app/booking/page.tsx` + `components/booking-page.tsx`.
      **Status: DONE** — `components/booking-page.tsx` (page hero, booking
      form + "what happens next" sidebar). The tour `<select>` and
      destination checkbox grid are built from `TOUR_CATEGORIES`/
      `TOUR_PACKAGES`/`DESTINATIONS`, replacing the innerHTML-building half
      of `initBookingForm()`; `?tour=`/`?destination=` preselects come from
      `useSearchParams()` (read-once, via `defaultValue`/`defaultChecked` —
      unlike the destinations/tours-pricing filters, booking never writes
      the param back to the URL, so the form stays uncontrolled). Submit
      handling ports the same `checkValidity()`/`reportValidity()` +
      placeholder "thanks" message pattern, no backend wired up yet, same
      as the original and same as `EnquiryModal`'s form. Sidebar reuses
      `PROCESS_STEPS`/`SITE.phone` from `lib/site-data.ts` (same data the
      homepage's Process section uses) rather than duplicating that copy —
      replaces `renderBookingProcess()`. `app/booking/page.tsx` wraps in
      `<Suspense>` (required by `useSearchParams()`) and sets its own
      `metadata`, same pattern as Phases 4–5.
- [x] 6.2 QA, then delete `public/booking.html`.
      **Status: DONE** — QA approved by the project owner; nav/footer
      repointed to `/booking` in Phase 8; `public/booking.html` deleted.

> **Notes from Phase 6:**
> - **Caught before it shipped:** `.booking-message` has `min-height: 1.2em`
>   in `style.css` specifically to reserve space so the form doesn't jump
>   when the success message appears. First pass conditionally rendered
>   the `<p>` only once a message existed, which would've dropped that
>   reserved space — fixed to always render the element (empty string by
>   default), matching the original's always-present-but-empty `<p>`.
> - `budget` stays a plain uncontrolled `<select>` (`defaultValue=""`) —
>   nothing pre-fills it from a query param in the original either.

---

## Phase 7 — Retire the vanilla JS/CSS
*Only start this once Phases 3–6 are all `DONE` — `journal-page.tsx`
currently loads these same files via `next/script`, so check it isn't
still depending on something before deleting.*

- [x] 7.1 Confirm no remaining page references `public/js/*.js` or
      `public/css/style.css`.
      **Status: DONE** — grepped `app/`, `components/`, `lib/` for both;
      the only hits were doc comments (harmless provenance notes, e.g.
      "was initBookingForm() in main.js") and `app/layout.tsx`'s
      `<link rel="stylesheet" href="/css/style.css">`, handled in 7.3.
- [x] 7.2 Delete `public/js/data.js`, `icons.js`, `render.js`, `main.js`.
      **Status: DONE**
- [x] 7.3 Fold any still-needed CSS rules (animations, keyframes not yet
      covered by Tailwind utilities) into `app/globals.css`; delete
      `public/css/style.css`.
      **Status: DONE** — every class in `style.css` is still in active
      use (nothing was dead), so the whole ~1,800-line file was folded
      into `app/globals.css` as plain CSS (not yet converted to Tailwind
      utilities — that conversion is still Phase 9, per the Phase 0.2
      decision). Verified zero top-level class-name collisions between
      the two files before merging, and that both files' `:root` custom
      properties use disjoint names (style.css's `--ink`/`--brass`/etc.
      vs. globals.css's shadcn `--background`/`--primary`/etc.) so having
      two `:root` blocks in one file is harmless. `public/css/style.css`
      deleted, its `<link>` removed from `app/layout.tsx` — the Google
      Fonts `<link>` stays, since the merged CSS still references literal
      `"Fraunces"`/`"Inter"`/`"Space Mono"` family names independent of
      `next/font`'s CSS variables.
- [x] 7.4 Remove the `next/script` loads and the boot-twice compatibility
      shim from `components/journal-page.tsx` now that nothing else needs
      the vanilla scripts.
      **Status: DONE** — already true as of Phase 2 (nothing to remove);
      confirmed with a grep for `next/script`/`scriptsLoaded`/`bootSite`
      across `app/`, `components/`, `lib/` — zero hits.

---

## Phase 8 — Routing & link cleanup

- [x] 8.1 Update every internal link (nav data, footer, in-page anchors)
      from `*.html` to real route paths (`/`, `/destinations`,
      `/tours-pricing`, `/booking`, `/journal`).
      **Status: DONE** — `lib/site-data.ts` (`NAV_LINKS`,
      `FOOTER_COLUMNS`), `components/home/hero.tsx` (quicklinks),
      `components/home/explore-section.tsx` ("View all destinations").
      Query strings preserved (`?region=…`, `?category=…`). In-page
      anchors (`#destinations`, `#why`) untouched — those already worked
      relative to whichever page they're on. Verified with a
      whole-project grep for any remaining relative `*.html` href —
      zero matches.
- [x] 8.2 Add redirects in `next.config.mjs` from the old `*.html` URLs to
      the new routes, in case anything external links to them.
      **Status: DONE** — permanent redirects for all four retired URLs;
      query strings forward automatically since none of the destinations
      specify their own.

---

## Phase 9 — Polish & parity pass

- [ ] 9.1 Cross-browser / responsive QA on all five routes.
      **Status: TODO**
- [x] 9.2 Accessibility pass — aria labels, focus states, keyboard nav for
      the mobile drawer and modal.
      **Status: DONE** — `lib/use-focus-trap.ts` adds a shared focus-trap
      hook (moves focus in, cycles Tab/Shift+Tab within the container,
      restores focus to the trigger on close), applied to
      `enquiry-modal.tsx`, `tours/itinerary-modal.tsx`, and the mobile
      drawer in `site-header.tsx`. Both modals now have
      `role="dialog"`/`aria-modal`/`aria-labelledby`, and the enquiry
      form's placeholder-only inputs got paired `sr-only` `<label>`s
      (placeholders alone aren't a reliable accessible name). The mobile
      drawer gained the same dialog semantics, `aria-hidden` toggling,
      and an Escape-to-close handler it was missing. The desktop nav
      dropdowns were hover-only with no keyboard path to reveal them —
      added `:focus-within` alongside `:hover` in `globals.css` plus
      `aria-haspopup` on the trigger links. `destination-card.tsx`'s
      flip card now marks whichever face isn't showing `aria-hidden`
      and removes its back-face CTA button from the tab order when
      hidden, since `backface-visibility: hidden` alone doesn't hide
      content from assistive tech. Checked booking form, footer social
      links, tour cards, and explore-section map pins/toggle — already
      correctly labelled, left as-is.
      **Not done here:** no `next build`/browser run in this session
      (no `node_modules`/pnpm available), so this is a manual-review
      pass verified by brace/paren balance checks on every edited file,
      not a live test — worth a real screen-reader + keyboard pass
      before shipping.
- [x] 9.3 Swap `<img>` tags for `next/image` where practical.
      **Status: DONE** — all three remaining raw `<img>`s converted:
      `journal-page.tsx`'s chronicle-card thumbnail and reader-hero
      image, and `explore-section.tsx`'s map background. All three sit
      inside a `position: relative` box with a fixed/aspect-ratio height
      already (`.chronicle-card-media`, `.explore-bg`), so `fill` +
      `sizes` was a direct swap with no markup restructuring — added
      `position: relative; overflow: hidden` to `.reader-hero` in
      `globals.css`, the one box that didn't already have it.
      `explore-section.tsx` keeps its `imgRef`/native `load`-event-based
      pin-repositioning logic unchanged — `next/image` forwards the ref
      to a real `<img>`, so `naturalWidth`/`complete`/`load` all still
      work the same way. `next.config.mjs`'s existing
      `images.unoptimized: true` is untouched, so this is a lazy-loading/
      layout-stability/semantics win, not a resizing one — nothing here
      is served through Next's image-optimization endpoint.
- [x] 9.4 Remove now-unused placeholder assets from `public/`.
      **Status: DONE** — checked every file under `public/images/` (and
      the four `public/placeholder-*` scaffold files) against every
      `lib/*-data.ts` field and component for both literal and
      dynamically-built (`` `/images/${x}` ``) references before
      deleting anything. Removed 15 orphaned images from
      `public/images/` (`carved-stone.png`, the four
      `dropdown-crest-*`/`dropdown-frame-*` files, `lotus-badge.png`,
      `mural-emboss.png`, a duplicate `sri-lanka-map.jpg` — the real one,
      `sri-lanka-map-full.jpg`, is still in use — and the five unused
      `tour-*.png` category images, since `TOUR_CATEGORIES`/
      `TOUR_PACKAGES` render icons via `components/icons.tsx`, not these
      files) plus `placeholder-logo.png/.svg` and `placeholder-user.jpg`
      and `placeholder.jpg` at the `public/` root (~14.4 MB total).
      `placeholder.svg` stays — `journal-page.tsx` actively falls back
      to it (`entry.image || '/placeholder.svg'`). All 6
      `public/images/journal/*` files are referenced from
      `lib/journal-data.ts` and were left alone.

---

## Phase 10 — Final cleanup

- [x] 10.1 Tidy `lib/utils.ts`, prune unused `components/ui/*` stubs.
      **Status: DONE** — `lib/utils.ts` was already minimal (just `cn()`);
      nothing to tidy there. `components/ui/button.tsx` (the only file
      under `components/ui/`) had zero imports anywhere in `app/`,
      `components/`, or `lib/` — every page's buttons use the original
      `.btn`/`.btn-uikit-*` classes from `globals.css`, not this
      shadcn-generated component — so it (and the now-empty
      `components/ui/` directory) was removed. Left `@base-ui/react` and
      `class-variance-authority` in `package.json` and `components.json`
      untouched, even though this was their only consumer: `components.json`
      still targets shadcn's `base-nova` style for whatever gets added
      next, and that style depends on both packages, so pulling them
      would work against Phase 0.2's "keep shadcn available" decision
      rather than actually tidy anything.
- [x] 10.2 Update `package.json` metadata and this project's own README.
      **Status: DONE** — `package.json`'s `name`/`version` were still the
      v0 scaffold defaults (`"my-project"`/`"0.1.0"`); changed to
      `"fine-lanka-tours"`/`"1.0.0"`. Added a top-level `README.md`
      (routes table, getting-started commands, project-structure
      overview, pointer to this file for migration history) — there
      wasn't one before.
- [ ] 10.3 Final production build (`next build`) and manual smoke test of
      every route.
      **Status: BLOCKED** — no `node_modules`/pnpm/network access to the
      registry in this session, so `next build` couldn't actually be run
      here. Every change across 9.2/9.3/9.4/10.1 was checked by hand
      (grepped for remaining references before deleting anything,
      brace/paren-balanced every edited file) but none of it has been
      through a real compiler or browser yet. This step still needs to
      happen — `pnpm install && pnpm build`, then click through all five
      routes — before calling the migration done.

---

## Quick status snapshot

| Phase | What | Status |
|---|---|---|
| 0 | Prep | DONE (all steps) |
| 1 | Content layer (`lib/*.ts`) | DONE |
| 2 | Shared header/footer/modal | DONE |
| 3 | Homepage | DONE |
| 4 | Destinations page | DONE |
| 5 | Tours & pricing page | DONE |
| 6 | Booking page | DONE |
| 7 | Retire vanilla JS/CSS | DONE |
| 8 | Routing/link cleanup | DONE |
| 9 | Polish & parity | DONE except 9.1 (needs a real browser) |
| 10 | Final cleanup | IN PROGRESS (10.1, 10.2 done; 10.3 blocked — needs `pnpm install`/build env) |
