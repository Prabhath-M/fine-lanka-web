# Tours & Pricing update — phased guide

Source of truth: [`docs/source/Website_Edits.docx`](source/Website_Edits.docx)
(section **2. TOURS & PRICING**). Section 1 (Home Page) is **out of scope** here
and needs its own plan.

This is written so it can be executed across several sessions. Each phase is
one branch + one PR, small enough to finish and review on its own. Tick the
box in the tracker when a phase merges.

> **Deploy warning:** `.github/workflows/deploy.yml` runs on every push to
> `main`. Never push phase work straight to `main` — use a branch and PR.

## Progress tracker

| Phase | Branch (suggested) | Scope | Status |
|---|---|---|---|
| 0 | — | Confirm open questions (below) | [ ] |
| 1 | `tours/remove-prices` | Remove price data + copy | [x] |
| 2 | `tours/bigger-itinerary-box` | Enlarge itinerary modal (CSS only) | [x] |
| 3 | `tours/culture-content` | Culture tours 1.1–1.3 | [x] |
| 4 | `tours/nature-content` | Nature tours 2.1–2.3 | [x] |
| 5 | `tours/beach-content` | Beach tours 3.1–3.3 | [x] |
| 6 | `tours/romantic-ramayana-content` | Romantic 4.1–4.3 + Ramayana 5 | [x] |
| 7 | `tours/route-map-sync` | `route-atlas.json` + map tests | [x] |
| 8 | `tours/final-qa` | Blurbs, cross-references, full QA | [ ] |

Every phase: `pnpm lint && pnpm test && pnpm build` must pass before the PR.

## Where things live

| What | File |
|---|---|
| Categories, packages, itineraries, nights, route strings, blurbs | `lib/tours-data.ts` (single source of truth) |
| Data sanity test (asserts `priceFrom > 0`) | `lib/tours-data.test.ts` |
| Tours page, hero + "collection ledger" | `components/tours-pricing-page.tsx` |
| Card, picker, carousel | `components/tours/tour-card.tsx`, `tour-picker-*.tsx` |
| Itinerary popup | `components/tours/itinerary-modal.tsx` |
| Itinerary popup styles | `app/globals.css` (`.itinerary-modal*`, ~line 3212–3280) |
| Booking form tour dropdown (reads `TOUR_PACKAGES`) | `components/booking-page.tsx` |
| Route map data (13 itineraries, 47 markers) | `public/data/route-atlas.json` |
| Route map tests | `lib/route-atlas-data.test.ts` |
| Route map component | `components/route-map-preview.tsx` |

Tour slugs stay unchanged throughout (they are used by booking pre-select,
the map, and URLs).

## Phase 0 — Open questions to settle first

Found while comparing the doc with the repo. Defaults in **bold** are what to
do if nobody answers.

1. **Night counts that contradict the day list.**
   - *3.3 Sun and Fun*: route says Sigiriya (2N) … Bentota (1N) = 10, but the
     day list gives Sigiriya 1N and Bentota 2N (still 10 total). **Follow the
     route line; adjust day text to match, or confirm the day list is right.**
   - *4.2 Tales of Love*: route nights sum to 8 but the doc says "9 nights"
     and the day list implies Ella = 2N. **Treat Ella as (2N) → 9 nights.**
2. **"Remove prices"** — the site already shows "Contact us for current
   pricing" (modal, card, hero ledger); only the `priceFrom` field remains in
   data. **Remove the field; keep the "Contact us for current pricing" line.**
   (The doc shows that line for most tours but not 4.1 — **show it on all**.)
3. **Category names** — doc says "Culture Tours" / "Ramayana"; repo says
   "Cultural & Historical" / "Ramayana Trails". **Keep repo names.**
4. **Two "coming soon" categories** (Ayurvedic & Wellness, Vacation) are not
   in the doc. **Keep them as they are.**
5. **Tour names** — doc uses "&" in two names; repo uses "and". **Keep repo
   names.**
6. **Typos in the doc to fix as we go:** "Orghanage", "Enroye", "Haputhale",
   "Udawalawa/Udawalawe", "Rathnapura/Ratnapura", "Kandy" casing. **"Eco-National Park"** (1.1 Day 2) is
   the Eco National Park near Habarana — resolved: written into the day text and
   added to the map as an `eco-national-park` marker (secondary stop on 1.1).
7. **Abbreviations** in doc routes expand to: Anu = Anuradhapura, Mahi =
   Mahiyanganaya, Tissa = Tissamaharama, Col = Colombo.
8. **Map stops that don't exist yet** (see Phase 7): Udawalawe, Yala,
   Hiriketiya. **Resolved: real markers were added** (Udawalawe, Yala, Hiriketiya).

## Phase 1 — Remove prices

- `lib/tours-data.ts`: delete `priceFrom` from `TourPackage` and every package.
- `lib/tours-data.test.ts`: drop the `priceFrom > 0` assertion.
- Grep for any remaining `priceFrom`, `$`, "from USD", "per person" copy
  (`tours-pricing-page.tsx`, `tour-card.tsx`, `itinerary-modal.tsx`,
  `booking-page.tsx`, `app/tours-pricing/page.tsx` metadata, `sitemap`, JSON-LD).
- Make the "Contact us for current pricing" line consistent on all cards/modal.

Done when: no price field or figure anywhere; tests + build green.

## Phase 2 — Bigger itinerary box

CSS only, in `app/globals.css` `.itinerary-modal-panel` (currently
`max-width: 640px; max-height: 85vh`).

- Widen (target ~900–960px) and raise max-height (~90vh); keep mobile
  full-width behaviour and safe scroll.
- Re-check `.itinerary-day` grid, `.itinerary-route`, and the mural
  background at the new size; check typography sizes from the typography
  refinement work still read well.
- Verify at 375 / 768 / 1280 / 1920px widths.

## Phases 3–6 — Content by category

For each tour edit **`lib/tours-data.ts`**: `route` (with night numbers),
`nights`, itinerary `days` (titles/text/count) and any blurb that becomes
untrue. Keep the map data in sync in Phase 7, not here. Expand
abbreviations and fix typos from Phase 0.

Legend: **R** = route string change, **N** = nights change, **D** = day text
changed, **NEW** = days largely replaced.

### Phase 3 — Culture (branch `tours/culture-content`)

| Tour | Changes |
|---|---|
| 1.1 Cultural Triangle Escape | D: Day 1 drop "afternoon"; Day 2 safari wording (Minneriya/Kaudulla + "Eco-National Park"? see Q6); Day 4 "Kandy Market" → "Kandy city tour with Gem Museum". Blurb says "five days" — still true. |
| 1.2 Heritage and Serenity | D: Day 2 add early-morning Wilpaththu safari; Day 4 add cultural dance show; Day 6 remove "Kandyan cultural show"; Day 7 "Pinnawala" → spice garden + Giragama tea plantations. |
| 1.3 Through Ancient Kingdoms | **R:** `Airport → Anuradhapura (2N) → Sigiriya (2N) → Kandy (2N) → Nuwara Eliya (1N) → Ella (1N) → Mahiyanganaya (1N) → Tissamaharama (2N) → Airport` (=11N ✓). D: Day 4 add cultural dance; Day 5 add Nalanda Gedige + Matale spice garden; Day 6 city tour with gem museum. |

### Phase 4 — Nature (branch `tours/nature-content`)

| Tour | Changes |
|---|---|
| 2.1 Highlands & Waterfalls | D: Day 1 add Pinnawala + spice garden; Day 2 add botanical garden, Temple of the Tooth, Kandy city tour + gem museum; Day 4 add Nine Arches Bridge; Day 5 via Ravana & Diyaluma Falls and Ratnapura. |
| 2.2 Serene Bliss Exploration | **R:** `Airport → Sigiriya (1N) → Knuckles (2N) → Kandy (1N) → Nallathanni (1N) → Nuwara Eliya (2N) → Haputale (1N) → Ella (2N) → Airport` (=10N ✓). No new day text in doc — existing days already fit these nights. |
| 2.3 Thrills & Tranquility | **R + NEW:** `Airport → Nallathanni (1N) → Nuwara Eliya (1N) → Haputale (1N) → Ella (2N) → Udawalawe (1N) → Ratnapura (1N) → Negombo (1N) → Airport` (=8N ✓). **Kitulgala, Knuckles and Sigiriya are removed.** Replace Days 6–9 (Udawalawe + Diyaluma; Udawalawe→Ratnapura with safari, gem mines, waterfalls; Negombo lagoon boat ride; departure); Day 1 → "Nallathanni via Kitulgala"; Day 4 is only the Haputale→Ella train. Rewrite blurb (no Knuckles/Sigiriya now). |

### Phase 5 — Beach (branch `tours/beach-content`)

| Tour | Changes |
|---|---|
| 3.1 Northern Horizons | **R:** `Airport → Kalpitiya (2N) → Mannar (1N) → Jaffna (2N) → Trincomalee (1N) → Sigiriya (1N) → Negombo (2N) → Airport` (=9N ✓). Doc has no day text; existing days already fit. |
| 3.2 Southern Coastal Bliss | **R + N + NEW:** 7 → **8 nights**. `Airport → Bentota (1N) → Galle (2N) → Mirissa (1N) → Hiriketiya (2N) → Yala (1N) → Colombo (1N) → Airport`. Replace all days (9 days incl. departure). Rewrite blurb (old one describes Kandy/Nuwara Eliya route). |
| 3.3 Sun and Fun | **R + N + D:** 9 → **10 nights**. `Airport → Sigiriya (2N) → Pasikudah (2N) → Arugam Bay (2N) → Tissamaharama (1N) → Tangalle (1N) → Mirissa (1N) → Bentota (1N) → Airport`. 11 days incl. departure; Day 1 Pinnawala + Dambulla; Day 2 Sigiriya climb, village tour, elephant safari, dance; Day 9 Mirissa→Bentota via Galle; Day 10 Bentota water sports. **See Q1 — night mismatch.** |

### Phase 6 — Romantic + Ramayana (branch `tours/romantic-ramayana-content`)

| Tour | Changes |
|---|---|
| 4.1 Romantic Getaway | **R:** `Airport → Kandy (2N) → Nuwara Eliya (1N) → Bentota (2N) → Airport` (=5N ✓; repo currently says Bentota 1N which doesn't add up). No new day text. |
| 4.2 Tales of Love | **R:** `Airport → Sigiriya (2N) → Kandy (1N) → Nuwara Eliya (1N) → Ella (?N) → Udawalawe (1N) → Mirissa (2N) → Airport`. **See Q1 — Ella must be 2N for 9 nights.** Days already match the doc; verify only. |
| 4.3 Sri Lanka Honeymoon | **R + D:** `Airport → Negombo (1N) → Trincomalee (2N) → Sigiriya (2N) → Kandy (1N) → Nuwara Eliya (1N) → Ella (1N) → Arugam Bay (2N) → Airport` (=10N ✓). Sigiriya becomes 2 days (village tour + Ayurvedic treatment; Pidurangala, elephant safari, dance); Kandy becomes 1 day (drop the separate dance day). Days total 11 ✓. |
| 5 Ramayana Legacy | **R + D:** `Airport → Negombo (1N) → Mannar (1N) → Trincomalee (2N) → Sigiriya (2N) → Kandy (1N) → Nuwara Eliya (1N) → Ella (2N) → Unawatuna (1N) → Airport` (=11N ✓). D: Day 7 (Dambulla + spice garden, Temple of the Tooth, Bahirawa hill); Day 8 (Hanuman, tea plantations, Sita Amman, Gregory Lake); Day 10 drop Ravana Falls/Cave; Day 11 add Ravana Falls, Ravana Cave, Diyaluma. |

## Phase 7 — Route map sync

`public/data/route-atlas.json` holds one entry per tour: `route` string,
`waypoints` (`role: airport | main | secondary`, `nights` only on `main`),
`markers`. The map is built from a hand-labelled illustrated map (markers
carry pixel x/y; recent work added per-marker sprites), so this is the
riskiest phase — do it after content is settled.

- Update `route` strings to match Phases 3–6 exactly.
- Update `waypoints` + `nights` per tour. `main` = overnight stops.
  Tours: 1.3, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5 change; 1.1, 1.2, 2.1
  only if their secondary stops change (e.g. 2.1 adds Pinnawala).
- **Missing markers** (not in the 47): Udawalawe (2.3, 4.2), Yala (3.2, 4.3
  day 11), Hiriketiya (3.2). Existing map stops are Ratnapura, Nallathanni,
  Haputale, Meemure, etc. Per Q8: either add markers (needs x/y from the map
  image, `kind`, `gridCell`, sprite, and a bump of `networkStats` and
  `audit`) or map to the nearest existing marker.
- Remove now-unused stops from 2.3 (Kitulgala/Knuckles/Sigiriya).
- Keep tests green: `lib/route-atlas-data.test.ts` requires 13 itineraries,
  airport first, `main` waypoints with `nights > 0`, and counts matching
  `networkStats`.
- Manual check on `/map-preview` and the tours page map for every tour.

## Phase 8 — Final QA

- Re-read every blurb against its new route (1.1–5).
- Grep for old strings: "Kitulgala" (2.3), "Knuckles / Meemure", removed
  activities, old night counts.
- Check other places that mention tours: `lib/destinations-data.ts`,
  `lib/journal-data.ts`, `lib/site-data.ts`, `app/destinations/page.tsx`.
- Booking page dropdown lists the right tours; ledger counts
  (`TOUR_PACKAGES.length`) still make sense.
- Night totals: for each tour, `sum(route nights) === nights` and
  `days.length === nights + 1`. Consider adding this as a unit test in
  `lib/tours-data.test.ts` so it can't regress.
- Full pass: `pnpm lint && pnpm test && pnpm build`, then click through
  desktop + mobile.

## How to resume in a new session

1. Clone the repo and read this file and `docs/source/Website_Edits.docx`.
2. Find the first unticked phase in the tracker.
3. Branch from up-to-date `main`, do only that phase, run lint/test/build.
4. Open a PR, tick the phase here in the same PR, merge, repeat.
