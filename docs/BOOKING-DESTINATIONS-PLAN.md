# Booking form — suggested destinations (plan)

Status: **implemented on branch `feat/booking-trip-sketch-plan`, not yet merged.**
Follows the Tours & Pricing update (`TOURS-PRICING-UPDATE-PLAN.md`, merged in #109).

> This replaces an earlier, much bigger idea (a "Trip sketch" mini-map with a route
> ribbon and all 37 stops). Dropped on purpose: the booking form should stay light and
> nudge guests to get in touch, and the site already has a map.

## 1. The problem

The booking form's "Destinations you'd like to include" box was a fixed list of 13
destinations from `lib/destinations-data.ts`:

- It didn't tally with the tour packages (different labels, e.g. "Ella & the Hill
  Country" vs "Ella"; many places the tours visit were missing).
- It ignored the selected tour, so a guest couldn't tell what their tour already covers
  or what else might be worth adding.

## 2. The change

Keep the **same box** (same pills, same styling, no bigger than before — at most 12
pills) and make its contents smart, in a short, low-key way:

| Situation | What the box suggests | Heading |
|---|---|---|
| **No tour chosen** | 12 headline sights: Sigiriya, Kandy, Ella, Nuwara Eliya, Galle Fort, Mirissa, Yala, Udawalawe, Anuradhapura, Polonnaruwa, Trincomalee, Arugam Bay | "Popular places — tap any you'd like us to work in (optional)" |
| **Tour chosen** | Up to 12 major sights that are **not already on that tour**, nearest to its route first | "Popular stops close to your route — tap any you'd like us to work in (optional)" |

- Wording nudges guests to talk to us ("work in") without saying "contact us".
- Changing the tour swaps the suggestions; picks that are no longer suggested are dropped.
- Picks are sent to the team exactly as before (`destinations`, a list of labels), so
  **no API or email change was needed**.
- No new map, no per-stop details, no extra fields.

## 3. How suggestions are chosen (`lib/booking-suggestions.ts`)

- A curated pool of 23 **major sights** (each an atlas marker id + short label), not all
  51 map markers.
- A tour's own stops (overnights + side visits) come from `route-atlas.json`, which is
  already kept in sync with `tours-data.ts` by a test.
- Candidates not on the tour are ranked by map distance to the nearest stop on the
  tour, top 12 shown. Ties keep the pool's order.
- Pure functions, no React; unit-tested in `lib/booking-suggestions.test.ts`:
  ids exist on the map, every tour gets 10–12 suggestions, none already on the tour,
  nearby sights rank first, no-tour list is the fixed 12.

## 4. Files

| File | Change |
|---|---|
| `lib/booking-suggestions.ts` (+ test) | New: curated pool, default list, nearest-to-route ranking |
| `components/booking-page.tsx` | Tour select is now controlled; the destination pills come from `suggestDestinations(tour)`; heading changes with the tour; state resets after a successful submit |
| `docs/BOOKING-DESTINATIONS-PLAN.md` | This file |

`lib/destinations-data.ts` is untouched (still used by the Destinations page).

## 5. Check before merging

- Look at `/booking`: pick a few tours and confirm the suggestions make sense; the box
  should look the same size as before (12 pills max vs 13 before).
- `?tour=<slug>` links still preselect the tour and show its suggestions.
- Submit a test enquiry: the team email lists the picked destinations.

## 6. Later

- **Activities** (Kitulgala rafting, Adam's Peak, Horton Plains, …) — a separate session.
- Optionally show the tour *name* instead of its slug in the team email.
