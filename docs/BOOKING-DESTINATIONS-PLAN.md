# Booking form — "Trip sketch" destinations picker (plan)

Status: **plan only, no code yet.** Branch: `feat/booking-trip-sketch-plan`.
Follows the Tours & Pricing update (`TOURS-PRICING-UPDATE-PLAN.md`, merged in #109).

## 1. What's wrong today

On `/booking`, "Destinations you'd like to include (optional)" is a flat grid of
checkbox pills built from `DESTINATIONS` (`lib/destinations-data.ts`).

| Problem | Detail |
|---|---|
| **Too few options** | 13 destinations. The tours actually visit **37 stops** (35 places + Ratnapura, Matale, Chilaw hubs — see `route-atlas.json`), and the map has 51 markers. |
| **Doesn't tally with the tour packages** | Labels differ from tour routes ("Ella & the Hill Country" vs "Ella", "Mirissa & the South Coast" vs "Mirissa", "Galle Fort" vs "Galle"). Places the tours visit are missing entirely: Pinnawala, Dambulla, Polonnaruwa, Mihintale, Aukana, Haputale, Nallathanni, Meemure, Mannar, Jaffna, Kalpitiya, Pasikudah, Tangalle, Bentota, Unawatuna, Hiriketiya, Ratnapura, Tissamaharama, Kataragama, Pigeon Island, Mahiyanganaya, Eco National Park. |
| **Tour and destinations are unrelated** | Picking a tour doesn't touch the destination pills. The guest can't see what the tour already includes, or what they could add. |
| **Presentation** | One undifferentiated wrap of pills; no order, no nights, no region, no map. |
| **Email to the team** | Sends the tour **slug** (`tales-of-love`) and a comma list of destination names — hard to read, no distinction between "in the package" and "guest added". |

## 2. Goal

Selecting a tour package should immediately answer two questions for the guest:

1. **What's already in my trip?** (the stops, in route order, with nights)
2. **What else can I add?** (suggested first by proximity to the route, then everything else by region)

…and the team should receive a clear "package + guest additions" summary.

## 3. Source of truth

Use the **route atlas** (`public/data/route-atlas.json`), not `DESTINATIONS`:

- It's already what the tours' `route` strings and the map are synced to (Phase 7),
  and `lib/route-atlas-data.test.ts` keeps it consistent with `tours-data.ts`.
- Each itinerary already lists its stops: `main` (overnights, with `nights`) and
  `secondary` (side visits, e.g. Pinnawala, Dambulla, Galle).
- Markers carry `x/y` (for "near your route" ranking and the mini-map), `kind`, and
  most have a sprite illustration (`map-sprites-by-marker-id.json`; **Haputale and
  Hiriketiya have none** → fall back to a plain pin).
- `DESTINATIONS` stays as-is for the Destinations page. It is not used by the picker.

New pure-logic module **`lib/booking-stops.ts`** (unit-tested, no React):

- `BOOKABLE_STOPS` — curated allow-list of marker ids offered in the picker. Start
  with the 37 stops the tours use (airport excluded). See open question Q2 for extras.
- Short display labels: "Anuradhapura Ancient City" → "Anuradhapura", "Mirissa Beach"
  → "Mirissa", "Pasikudah Beach" → "Pasikudah", "Unawatuna Beach" → "Unawatuna",
  "Pinnawala Elephant Orphanage" → "Pinnawala", "Meemure Village" → "Meemure (Knuckles)".
- `region` per stop (proposed 7 groups, easy to adjust):
  - **Cultural Triangle:** Anuradhapura, Mihintale, Aukana, Polonnaruwa, Sigiriya, Dambulla, Matale, Eco National Park
  - **Hill Country:** Kandy, Nuwara Eliya, Nallathanni, Haputale, Ella, Meemure, Mahiyanganaya, Ratnapura, Pinnawala
  - **South Coast:** Bentota, Galle, Unawatuna, Mirissa, Hiriketiya, Tangalle
  - **Wildlife & National Parks:** Yala, Udawalawe, Tissamaharama, Kataragama
  - **East Coast:** Trincomalee, Pigeon Island, Pasikudah, Arugam Bay
  - **Colombo & West Coast:** Colombo, Negombo, Chilaw
  - **North & North-West:** Jaffna, Mannar, Kalpitiya
- `stopsForTour(slug)` → ordered included stops `{ id, label, role: main|secondary, nights?, order }`.
- `suggestAddOns(slug)` → candidates **not** in the tour, ranked by map distance to the
  nearest included stop ("Near your route" = top ~6), the rest grouped by region.
- `toursFittingStops(ids)` → tours ranked by overlap, for the no-tour flow.
- `buildBookingSummary(tourSlug, addOnIds)` → the structured summary sent to the API.

## 4. The design — "Trip sketch"

Replace the pill grid with a small illustrated panel that sits under the tour dropdown
and reacts to it. Brand look: the existing "Ceylon Field Notes" style (parchment, jade,
gold `#e0ba68`, mono labels).

**A. Mini-map (left on desktop, top on mobile)** — the island on the new base map
(`sri-lanka-base-map-v2.webp`, a ~960 px derivative for weight). Pins on 2 layers:
- **In your tour:** numbered gold pins in route order (same idea as the route map's
  main/secondary pins), locked.
- **Added by you:** teal pins with a "+" and a small sprite illustration that
  "drops in" (respecting `prefers-reduced-motion`).
- Unselected offered stops: faint dots, tappable/hoverable with the stop name.

**B. Stop lists (right on desktop, below on mobile)**
1. **Your route** — a ribbon of locked chips in order:
   `① Negombo · 1N → ② Trincomalee · 2N → …`, with side visits in a lighter style
   ("also visits Pinnawala, Dambulla"). Heading shows `Tales of Love · 9 nights · 8 stops`.
2. **Near your route** — add-on chips ranked by proximity, each with a `+`.
3. **More places to add** — collapsible region groups (7 above) with the rest.
4. **Your additions** — chips with `×` to remove; live counter `+2 added`.

**C. States**
- **No tour ("Not sure yet")** — empty map, prompt "Pick a package above, or tap places
  to sketch your own trip". Picking places shows **"Tours that fit"**: up to 3 tours
  ranked by overlap ("Covers 4 of your 5 places") with a one-tap "Use this tour".
- **Tour selected** — as above. Changing the tour keeps add-ons that aren't already
  in the new tour and drops the ones that now are (with a brief "already included" note).
- **`?tour=` preselect** — works as today (the select becomes controlled).
- **`?destination=`** — nothing in the app links to it now; keep a tiny alias map so old
  links still preselect a place, or drop it (Q4).

**D. Trip length** — when a tour is chosen, prefill "Trip length (nights)" with the
tour's nights (still editable). Adding places does not change it automatically; the
summary just says "+2 places — we'll fit them in and confirm nights".

**E. Accessibility / performance**
- Real checkboxes underneath every chip (keyboard, screen readers, form semantics);
  the map is an enhancement, `aria-hidden` pins with an equivalent list.
- Locked chips are non-interactive text with clear "Included" labelling.
- Mobile: one column, map above, sticky one-line summary; chips ≥ 44 px targets.
- No new heavy assets: ~960 px map derivative; sprites only for pins, lazy-loaded;
  none for stops that lack one.

## 5. Payload, API and email

Client sends: `tour` (slug), `addOns` (marker ids), and, for backward compatibility,
`destinations` (labels of picked places).

`app/api/booking/route.ts`:
- **Derives included stops from the tour slug on the server** (never trusts the client),
  and validates `addOns` against `BOOKABLE_STOPS`; unknown ids are dropped; length capped.
- Team email fields become:
  - Tour package: `Tales of Love and Timeless Beauty (9 nights)` (name, not slug)
  - Route: the tour's route string
  - Guest added: `Bentota, Pinnawala`
  - Places (no package): only when no tour chosen
- Auto-reply email unchanged.
- Old cached clients that still send only `destinations` keep working.

## 6. Files

| File | Change |
|---|---|
| `lib/booking-stops.ts` (+ `.test.ts`) | New: allow-list, labels, regions, ranking, summary |
| `components/booking/trip-sketch.tsx` + `.module.css` | New: mini-map, route ribbon, add-on chips |
| `components/booking-page.tsx` | Tour select → controlled; replace the checkbox grid with `<TripSketch>`; prefill nights |
| `app/api/booking/route.ts` | Accept `addOns`, server-side derivation/validation, clearer email |
| `public/images/sri-lanka-base-map-v2-960w.webp` | New downscaled map for the sketch |
| `app/globals.css` | Remove/retire the old `.booking-page .checkbox-pill` destination styles if unused elsewhere |
| `docs/BOOKING-DESTINATIONS-PLAN.md` | This file; tick phases as done |

## 7. Phases

| Phase | Scope | Done when |
|---|---|---|
| 1 | `lib/booking-stops.ts` + tests | Every tour's included stops equal its atlas `main`+`secondary`; every allow-listed id exists in the atlas; every stop has a region and label; ranking is deterministic |
| 2 | API: `addOns`, server-side derivation, email format | Invalid ids dropped; old payload still accepted; email reads clearly (tested with a mocked mailer) |
| 3 | `TripSketch` UI, no map yet (route ribbon + chips + regions), wired into the form | Selecting a tour shows included vs addable stops; add/remove works; form submits |
| 4 | Mini-map layer (pins, drop-in animation, hover names) + base-map derivative | Pins match the route map's positions; reduced-motion respected; no layout shift |
| 5 | No-tour flow: "Tours that fit" + nights prefill + `?tour=` / `?destination=` | Each flow verified in the browser |
| 6 | QA: keyboard, screen reader labels, 375 / 768 / 1280 px, Lighthouse a11y, `vitest`, `tsc`, CI build | All green; visual check of every tour |

Ship as one PR after all phases; each phase is its own commit so it can be reviewed
or reverted separately.

## 8. Risks

- **Map/pin drift:** pins reuse atlas x/y in the 1664×2080 space (same 4:5 as the new
  base map), so they should align; verified visually in Phase 4.
- **Region assignments are judgement calls** (e.g. Bentota → South Coast, Pinnawala →
  Hill Country). One table, easy to change.
- **Places named only in day text have no marker** (Kitulgala, Ambuluwawa, Diyaluma,
  Horton Plains, Adam's Peak, Nine Arches). They won't appear as add-ons unless we add
  markers (out of scope; see Q3).
- **Bundle size:** the picker imports the atlas JSON (~34 KB). Acceptable; can be
  fetched lazily if needed.

## 9. Open questions

1. **Locked vs skippable:** should included stops be strictly locked, or can a guest
   mark "skip this stop"? (Plan assumes locked; add-ons only.)
2. **Extra places beyond the tours:** offer Batticaloa, Alu Vihara, Madhu Road National
   Park, Kurunegala too? (Plan assumes only the 37 stops tours already use.) Pure
   pass-through towns (Point Pedro, Mullaittivu, Kilinochchi, Vavuniya) stay out.
3. **Experiences (Kitulgala rafting, Adam's Peak, Horton Plains…):** add a second
   "Experiences" strip later, or keep places only?
4. **`?destination=` links:** keep a compatibility alias map, or drop it?
5. **Extra nights per added place:** do we want an optional "+1 night here" on each
   add-on, or leave nights to the designer's follow-up? (Plan: leave to follow-up.)
