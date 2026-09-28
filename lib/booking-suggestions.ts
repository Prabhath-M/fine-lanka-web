/**
 * booking-suggestions.ts
 * ------------------------------------------------------------------
 * Suggested destinations for the booking form's "add to your trip" box.
 *
 *  - No tour chosen  -> a fixed set of headline Sri Lanka sights.
 *  - Tour chosen     -> major sights that are NOT already on that tour,
 *                       nearest to its route first (map distance from the
 *                       route atlas, the same data the tours page map uses).
 *
 * Deliberately a short curated list, not every stop on the map.
 * ------------------------------------------------------------------
 */
import atlas from '../public/data/route-atlas.json'

export interface SuggestedDestination {
  /** Route-atlas marker id. */
  id: string
  /** Short label shown on the pill and sent with the enquiry. */
  label: string
}

/** Max pills shown — keeps the box the same size as before. */
export const MAX_SUGGESTIONS = 12

/** Major sights we're happy to suggest (atlas marker id -> label). */
export const MAJOR_SITES: readonly SuggestedDestination[] = [
  { id: 'sigiriya', label: 'Sigiriya' },
  { id: 'dambulla', label: 'Dambulla' },
  { id: 'polonnaruwa', label: 'Polonnaruwa' },
  { id: 'anuradhapura', label: 'Anuradhapura' },
  { id: 'mihintale', label: 'Mihintale' },
  { id: 'kandy', label: 'Kandy' },
  { id: 'pinnawala', label: 'Pinnawala' },
  { id: 'nuwara-eliya', label: 'Nuwara Eliya' },
  { id: 'ella', label: 'Ella' },
  { id: 'haputale', label: 'Haputale' },
  { id: 'yala', label: 'Yala National Park' },
  { id: 'udawalawe', label: 'Udawalawe National Park' },
  { id: 'galle', label: 'Galle Fort' },
  { id: 'mirissa', label: 'Mirissa' },
  { id: 'unawatuna', label: 'Unawatuna' },
  { id: 'bentota', label: 'Bentota' },
  { id: 'tangalle', label: 'Tangalle' },
  { id: 'trincomalee', label: 'Trincomalee' },
  { id: 'pasikudah', label: 'Pasikudah' },
  { id: 'arugam-bay', label: 'Arugam Bay' },
  { id: 'jaffna', label: 'Jaffna' },
  { id: 'colombo', label: 'Colombo' },
  { id: 'negombo', label: 'Negombo' },
  { id: 'kalpitiya', label: 'Kalpitiya' },
]

/** Shown when no tour is selected. */
const DEFAULT_IDS = [
  'sigiriya',
  'kandy',
  'ella',
  'nuwara-eliya',
  'galle',
  'mirissa',
  'yala',
  'udawalawe',
  'anuradhapura',
  'polonnaruwa',
  'trincomalee',
  'arugam-bay',
] as const

type AtlasMarker = { id: string; x: number; y: number }
type AtlasItinerary = { id: string; waypoints: { markerId: string; role: string }[] }

const markerById = new Map((atlas.markers as AtlasMarker[]).map((marker) => [marker.id, marker]))
const itineraryBySlug = new Map((atlas.itineraries as AtlasItinerary[]).map((it) => [it.id, it]))
const siteById = new Map(MAJOR_SITES.map((site) => [site.id, site]))

export const DEFAULT_SUGGESTIONS: readonly SuggestedDestination[] = DEFAULT_IDS.map((id) => siteById.get(id)!)

/** Marker ids a tour already visits (overnights and side visits). */
export function stopsOfTour(tourSlug: string): Set<string> {
  const itinerary = itineraryBySlug.get(tourSlug)
  return new Set((itinerary?.waypoints ?? []).filter((w) => w.role !== 'airport').map((w) => w.markerId))
}

function distanceToRoute(id: string, stops: Set<string>): number {
  const marker = markerById.get(id)
  if (!marker) return Infinity
  let best = Infinity
  for (const stopId of stops) {
    const stop = markerById.get(stopId)
    if (!stop) continue
    best = Math.min(best, Math.hypot(marker.x - stop.x, marker.y - stop.y))
  }
  return best
}

/** Suggestions for the box: headline sights, or sights near the chosen tour's route. */
export function suggestDestinations(tourSlug: string | null | undefined): SuggestedDestination[] {
  if (!tourSlug || !itineraryBySlug.has(tourSlug)) return [...DEFAULT_SUGGESTIONS]
  const onTour = stopsOfTour(tourSlug)
  return MAJOR_SITES.map((site, order) => ({ site, order, distance: distanceToRoute(site.id, onTour) }))
    .filter(({ site }) => !onTour.has(site.id))
    .sort((a, b) => a.distance - b.distance || a.order - b.order)
    .slice(0, MAX_SUGGESTIONS)
    .map(({ site }) => site)
}
