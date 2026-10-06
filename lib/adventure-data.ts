/**
 * Copy and structure for the Destinations "Adventure & Experiences" section.
 * See docs/DESTINATIONS-ADVENTURE-SECTION-PLAN.md. Wording is verbatim from the
 * approved source copy -- change it there first, not here.
 */

export type AdventureZone = 'air' | 'land' | 'water' | 'underground'

export type AdventureIconKey =
  | 'helicopter'
  | 'zipline'
  | 'horse'
  | 'kayak'
  | 'raft'
  | 'dive'
  | 'atv'
  | 'cave'

export interface Adventure {
  /** Two-digit display number, "01"–"08". */
  number: string
  slug: string
  title: string
  tagline: string
  body: string
  /** The "Experience:" chips. */
  tags: string[]
  zone: AdventureZone
  icon: AdventureIconKey
  /** Base path (no extension/size suffix) of the photo, once supplied. */
  image?: string
}

export const ADVENTURE_ZONES: { id: AdventureZone; label: string }[] = [
  { id: 'air', label: 'Air' },
  { id: 'land', label: 'Land' },
  { id: 'water', label: 'Water' },
  { id: 'underground', label: 'Underground' },
]

export const ADVENTURE_INTRO = {
  kicker: 'Adventure & Experiences',
  title: 'Go beyond the ordinary.',
  lede: 'From soaring above breathtaking landscapes to exploring hidden caves and rushing through mountain rivers, discover a more adventurous side of Sri Lanka with Fine Lanka Tours.',
}

export const ADVENTURE_CLOSING = {
  title: 'A Little More Adventure. A Lot More Sri Lanka.',
  body: 'Whether you want to fly above the mountains, ride through the countryside, paddle through hidden waterways or venture beneath the earth, Fine Lanka Tours brings you closer to the adventurous spirit of the island.',
  signoff: 'Explore Sri Lanka. Experience More.',
  brandLine: 'Fine Lanka Tours – A Journey Beyond Expectations.',
}

export const ADVENTURES: Adventure[] = [
  {
    number: '01',
    slug: 'helicopter-tours',
    title: 'Helicopter Tours',
    tagline: 'See Sri Lanka from a whole new perspective.',
    body: 'Take to the skies and experience Sri Lanka’s spectacular landscapes from above. Fly over lush mountains, golden coastlines, ancient landmarks and beautiful countryside for an unforgettable aerial adventure.',
    tags: ['Scenic aerial tour', 'Private experience', 'Luxury adventure'],
    zone: 'air',
    icon: 'helicopter',
  },
  {
    number: '02',
    slug: 'ella-zip-line',
    title: 'Ella Zip Line',
    tagline: 'Fly above the heart of Ella.',
    body: 'Soar across the magnificent Ella Valley on an exhilarating zip-line experience. With sweeping views of green mountains, tea plantations and valleys below, this is adventure with a spectacular view.',
    tags: ['Adrenaline', 'Mountain views', 'Ella'],
    zone: 'air',
    icon: 'zipline',
  },
  {
    number: '03',
    slug: 'horse-riding',
    title: 'Horse Riding',
    tagline: 'Discover Sri Lanka at a different pace.',
    body: 'Ride through scenic countryside, tea plantations, forests or along beautiful beaches. Whether you’re an experienced rider or trying it for the first time, horse riding offers an intimate way to experience Sri Lanka’s landscapes.',
    tags: ['Nature', 'Countryside', 'Beach riding'],
    zone: 'land',
    icon: 'horse',
  },
  {
    number: '04',
    slug: 'kayaking',
    title: 'Kayaking',
    tagline: 'Paddle into the wild.',
    body: 'Glide through calm rivers, tranquil lagoons and lush mangrove waterways while discovering Sri Lanka from the water. Kayaking is the perfect combination of adventure, nature and peaceful exploration.',
    tags: ['Rivers', 'Lagoons', 'Mangroves', 'Nature'],
    zone: 'water',
    icon: 'kayak',
  },
  {
    number: '05',
    slug: 'white-water-rafting',
    title: 'White-Water Rafting',
    tagline: 'Let the river lead the way.',
    body: 'Head into the adventure capital of Kitulgala and take on Sri Lanka’s thrilling white-water rapids. Surrounded by tropical rainforest, this is an exhilarating experience for adventure seekers and groups alike.',
    tags: ['Adrenaline', 'Rapids', 'Kitulgala', 'Rainforest'],
    zone: 'water',
    icon: 'raft',
  },
  {
    number: '06',
    slug: 'scuba-diving-snorkelling',
    title: 'Scuba Diving & Snorkelling',
    tagline: 'Discover the world beneath the waves.',
    body: 'Dive into Sri Lanka’s tropical waters and discover colourful marine life, coral reefs and fascinating underwater landscapes. From relaxed snorkelling to deeper diving adventures, the island offers unforgettable experiences beneath the surface.',
    tags: ['Marine life', 'Coral reefs', 'Diving', 'Snorkelling'],
    zone: 'water',
    icon: 'dive',
  },
  {
    number: '07',
    slug: 'atv-quad-bike-adventures',
    title: 'ATV & Quad Bike Adventures',
    tagline: 'Take the road less travelled.',
    body: 'Leave the usual tourist trails behind and take on rugged tracks, countryside paths and off-road terrain on an exciting ATV adventure. Perfect for those who want to add a little more adrenaline to their Sri Lankan journey.',
    tags: ['Off-road', 'Adrenaline', 'Countryside', 'Adventure'],
    zone: 'land',
    icon: 'atv',
  },
  {
    number: '08',
    slug: 'cave-exploration',
    title: 'Cave Exploration',
    tagline: 'Step into the hidden side of Sri Lanka.',
    body: 'Venture beyond the surface and explore Sri Lanka’s fascinating caves and underground landscapes. Discover natural rock formations, hidden passages and ancient environments while experiencing a side of the island few travellers get to see.',
    tags: ['Exploration', 'Nature', 'History', 'Adventure'],
    zone: 'underground',
    icon: 'cave',
  },
]

export function adventuresForZone(zone: AdventureZone | 'all'): Adventure[] {
  return zone === 'all' ? ADVENTURES : ADVENTURES.filter((a) => a.zone === zone)
}

/** Altitude gauge stages, top (sky) to bottom (depth). */
export type AdventureStage = 'sky' | 'canopy' | 'land' | 'water' | 'depth'

export const ADVENTURE_STAGES: { id: AdventureStage; label: string }[] = [
  { id: 'sky', label: 'Sky' },
  { id: 'canopy', label: 'Canopy' },
  { id: 'land', label: 'Land' },
  { id: 'water', label: 'Water' },
  { id: 'depth', label: 'Depth' },
]

/** Where an experience sits on the gauge. The zip line is the only "canopy" entry. */
export function adventureStage(adventure: Pick<Adventure, 'zone' | 'slug'>): AdventureStage {
  if (adventure.slug === 'ella-zip-line') return 'canopy'
  switch (adventure.zone) {
    case 'air':
      return 'sky'
    case 'land':
      return 'land'
    case 'water':
      return 'water'
    case 'underground':
      return 'depth'
  }
}
