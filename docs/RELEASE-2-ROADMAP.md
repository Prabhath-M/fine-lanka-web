# Release 2 roadmap — Home, Destinations & Tours redesign

`release_1` (branch, commit `8ad6d19`) is the locked snapshot of what's
live. Everything below is planning for what comes after — audited
against the actual codebase before writing a single line, the same way
`TYPOGRAPHY-REFINEMENT-PLAN.md` was. No implementation has started.

## The three changes, in the client's words

1. **Home page:** the Explore section becomes a full-page-width,
   landscape video showcase auto-switching between all destination
   videos, in a new container with blurred/blended semi-transparent
   edges that melt into the background. The map is removed. The
   section currently above Explore becomes a new "Things to do in Sri
   Lanka" teaser (ziplining, bungee jumping, zip-line walking,
   helicopter rides, kayaking) — brief copy + image per activity,
   image click → Destinations page.
2. **Destinations page:** video cards are removed entirely. The full
   interactive map (currently only on Tours & Pricing) appears here
   instead. Clicking a marker shows a full description + image for
   that place. Below the map, the same "Things to do" concept repeats
   with fuller descriptions and images.
3. **Tours & Pricing page:** itineraries get rewritten. Each of the 13
   itineraries gets its own zoomed/cropped view of the Sri Lanka map,
   showing only that itinerary's own stops — no other markers or
   places visible.

## What audit found — this changes the plan's shape substantially

Three findings that materially reduce risk and change the recommended
approach. Read these before the phase list; they're why the phases
are ordered and scoped the way they are.

### 1. The destination videos already exist, and they're already in the right shape

`public/videos/destinations/` has all 13 files, one per destination,
already named to `slugify()`'s convention:

| File | Dimensions | Duration |
|---|---|---|
| 12 of 13 | 2560×1440 (16:9 landscape) | ~8–9s |
| `anuradhapura.mp4` | 1920×1080 (16:9 landscape) | 15.2s |
| `sigiriya.mp4` | 2560×1440 | **32.1s** (outlier) |
| `ambient-atlas-loop.mp4` (fallback) | 720×1280 (**9:16 portrait**) | 6.0s |

The README currently tells contributors to crop clips to 3:4 portrait
— that's guidance for the *current* cropped-card display, not a
constraint on the source files, which are already landscape. **No new
video sourcing needed** for the home-page showcase. Two things worth
fixing while touching this:
- The fallback clip is portrait and would look wrong in a landscape
  full-width container. Needs a landscape replacement or a different
  fallback strategy (e.g. a static landscape image + poster frame)
  before this ships.
- Sigiriya's clip is ~4x longer than the others. If auto-switching
  runs on a fixed timer (the current homepage panel uses one — see
  below), decide whether Sigiriya loops within its slot, gets
  trimmed, or gets its own longer slot.

### 2. The Tours & Pricing map already does marker-click-to-detail

`components/route-map-preview.tsx` (560 lines) + `lib/route-atlas-data.ts`
+ `public/data/route-atlas.json` (1,511 lines) is a working, shipped
interactive map. Clicking a marker **already** opens a detail panel
with image, name, description, place type, and metadata (`onClick` at
line 498, popup render at line 529 — this is exactly the interaction
the Destinations page needs). This is not a "build from scratch"
task; it's **reuse and adapt**.

Two decisions this raises, not yet made:
- This component also has itinerary-selection and category-filter
  chrome built for the Tours & Pricing context. Does the Destinations
  page get a simplified variant (map + markers + detail popup only),
  or the full interactive feature set? Recommend simplified — the
  itinerary-filtering UI doesn't make sense outside Tours & Pricing.
- Right now it lives as a page-specific component
  (`components/route-map-preview.tsx`, imported only by
  `tours-pricing-page.tsx`). It needs to become a shared component
  both pages import, with page-specific props for which chrome shows.

### 3. The per-itinerary "13 cropped maps" already has a working mechanism — don't build 13 image files

The map already supports zoomed regional views via `zoomRegions` (in
`route-map-preview.tsx`): six named regions (Overview, North, Cultural
Triangle, Central Highlands, South & East, West Coast), each just an
`{ x, y, width, height }` crop rectangle applied to **one shared base
map image** — not six separate cropped image files. This is exactly
the mechanism the "13 different edited maps" request needs, just
scaled from 6 hand-picked regions to 13 itinerary-specific ones.

**Recommendation: don't manually create 13 cropped image files.**
Instead, extend this same pattern — compute (or hand-tune) one crop
rectangle per itinerary from that itinerary's own waypoint coordinates,
reusing the single base map graphic. This is far more maintainable:
when an itinerary's stops change, the crop is a data edit, not a
re-export from a design tool. It also matches how the codebase already
solved the closely-related "show me just this region" problem.

The "remove any other markers" half of the request is **not yet
built**: `activeMarkerIds` currently only adds an "Included in
{itinerary}" badge to relevant markers (line 269, 550) — it doesn't
hide the rest. Extending highlight-only to filter-and-hide is a real
but modest change to existing logic, not new architecture.

### 4. "Things to do in Sri Lanka" is entirely new — zero existing content

Searched for ziplining/bungee/kayak/helicopter/adventure content and
imagery sitewide. Found nothing except an unrelated "Adventure stop"
marker-category label. This section needs:
- Copy (activity name + brief blurb per activity, ×2 — short for
  Home, fuller for Destinations)
- A photo per activity (ziplining, bungee jumping, zip-line walking,
  helicopter rides, kayaking — 5 named so far; confirm final list and
  whether more get added later)
- A data model (`lib/activities-data.ts` or similar) so both the Home
  teaser and the Destinations full version read from one source, the
  same pattern `lib/destinations-data.ts` already establishes

This is the one piece of the whole roadmap that's genuinely
ground-up work rather than reuse — budget accordingly.

### 5. The blended/blurred edge container is a new visual technique

No existing `mask-image` usage anywhere in the codebase (checked). The
"edges blend into the background, semi-transparent" effect the client
described is a standard, well-understood CSS technique (a
`mask-image` gradient, or a soft box-shadow/gradient overlay
approach) — low technical risk, but it's new, not an extension of
something already built. Budget a design-iteration pass: this is a
visual/taste call, similar to Phase 1 of the typography plan, and
should be looked at rendered before being called done.

## Open questions — need answers before implementation starts

1. **Auto-switch timing.** The current homepage panel switches on a
   fixed timer (`ROTATE_MS`, — likely 8000ms based on
   `explore-section.tsx`). With 13 videos of varying length (8s–32s),
   does auto-switch wait for each video to finish, or run on a fixed
   interval regardless of video length? Fixed interval is simpler but
   will cut some videos off and under-use others.
2. **Fallback video.** Replace `ambient-atlas-loop.mp4` with a
   landscape version, or handle a missing destination video a
   different way (static poster image) in the new design?
3. **Destinations page map: full feature set or simplified?** (See
   finding 2.) Recommend simplified; needs confirmation.
4. **"Things to do" final activity list and copy/photo sourcing.** Is
   ziplining/bungee/zip-line-walking/helicopter/kayaking the final
   five, or a starting point? Who's supplying the photos — client,
   stock licensing, or should this session help source/generate
   placeholders to iterate against?
5. **Per-itinerary map crops: automatic or hand-tuned?** Computing a
   bounding box from each itinerary's waypoint coordinates
   automatically is fast but may produce awkward crops (too tight, bad
   aspect ratio, marker right at the edge). Hand-tuning per itinerary
   gives better results but takes longer — recommend automatic first
   pass, then a manual review/adjustment pass per itinerary rather
   than fully manual from the start.
6. **Revised itinerary content.** "A revised itineraries [set] will be
   given" — is that content ready now, or still being written? This
   gates most of the Tours & Pricing phase.

## Phased build plan

Following the same principle that made the typography plan work:
**small phases, one concern each, verify against real rendered output
before moving on** — not because these changes are risky in the same
way, but because three separate major page redesigns bundled into one
effort is exactly how things get missed.

### Phase A — Shared map component extraction
Split the map out of `route-map-preview.tsx` into a shared component
both Tours & Pricing and Destinations import, with a prop controlling
which chrome shows (full itinerary/filter UI vs. simplified
markers-and-detail-popup only). No visual or behavioral change to
Tours & Pricing in this phase — pure refactor, verify Tours & Pricing
still works identically before building anything new on top.

### Phase B — Destinations page: swap in the map
Replace `DestinationMarquee` (the rudder/video carousel) on the
Destinations page with the shared map component from Phase A. Remove
the video-card path. Verify marker-click detail popups work in this
new context.

### Phase C — "Things to do" data model + Home teaser
Build the shared data model, source/confirm the 5 activities' copy
and photos, build the brief Home version with image-click →
Destinations navigation. This unblocks both Home and Destinations
work since they share the data.

### Phase D — Home page: video showcase container
Build the new full-width landscape video container with blended
edges, wire it to auto-switch across all 13 destination videos,
replace the current Explore section. Resolve the fallback-video and
Sigiriya-duration open questions before or during this phase.

### Phase E — Home page: replace Intro with "Things to do" teaser
Swap the current `Intro` component (the compact "how it works"
preview — confirmed its full content already lives on in the
`Process` section further down the page, so nothing is lost) for the
Phase C teaser component.

### Phase F — Destinations page: full "Things to do" section
Add the fuller version of the same section below the map, using the
same Phase C data model with the expanded copy/description variant.

### Phase G — Tours & Pricing: revised itinerary content
Once the new itinerary content is ready (Open Question 6), update
`lib/tours-data.ts` and `public/data/route-atlas.json` waypoint data
to match.

### Phase H — Tours & Pricing: per-itinerary map crops + marker filtering
Extend `zoomRegions`' crop-rectangle pattern to compute one crop per
itinerary from Phase G's waypoint data (automatic first pass per Open
Question 5), and extend `activeMarkerIds` from highlight-only to
filter-and-hide so only the selected itinerary's own stops show.

---

Each phase ships as its own PR, verified against real rendered output
(Playwright screenshots of actual markup, not descriptions) before
merging, same discipline as the typography work. Given the scale here,
recommend resolving the open questions above — especially 3, 4 and
6 — before Phase A starts, since several later phases depend on those
answers.
