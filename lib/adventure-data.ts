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
  | 'surf'
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
  /** Base path (no extension/size suffix) of the photo: `<image>-480w.webp`, `-960w`, `-1600w`. */
  image?: string
  /** Alt text for the photo. */
  imageAlt?: string
  /** CSS `object-position` for the photo when the frame crops it (default: centred). */
  imagePosition?: string
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
    image: '/images/adventure-helicopter-tours',
    imageAlt: 'A red helicopter flying over forest and a rock fortress at sunset',
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
    image: '/images/adventure-ella-zip-line',
    imageAlt: 'A rider in an orange helmet gliding along a zip line above the forest',
    imagePosition: '50% 0%', // keep the top (cable and carabiner) in frame when the box crops the photo
  },
  {
    number: '03',
    slug: 'atv-quad-bike-adventures',
    title: 'ATV & Quad Bike Adventures',
    tagline: 'Take the road less travelled.',
    body: 'Leave the usual tourist trails behind and take on rugged tracks, countryside paths and off-road terrain on an exciting ATV adventure. Perfect for those who want to add a little more adrenaline to their Sri Lankan journey.',
    tags: ['Off-road', 'Adrenaline', 'Countryside', 'Adventure'],
    zone: 'land',
    icon: 'atv',
    image: '/images/adventure-atv-quad-bike-adventures',
    imageAlt: 'A rider in a helmet on a yellow quad bike on the beach',
  },
  {
    number: '04',
    slug: 'horse-riding',
    title: 'Horse Riding',
    tagline: 'Discover Sri Lanka at a different pace.',
    body: 'Ride through scenic countryside, tea plantations, forests or along beautiful beaches. Whether you’re an experienced rider or trying it for the first time, horse riding offers an intimate way to experience Sri Lanka’s landscapes.',
    tags: ['Nature', 'Countryside', 'Beach riding'],
    zone: 'land',
    icon: 'horse',
    image: '/images/adventure-horse-riding',
    imageAlt: 'A smiling child riding a horse, led by a guide',
  },
  {
    number: '05',
    slug: 'kayaking',
    title: 'Kayaking',
    tagline: 'Paddle into the wild.',
    body: 'Glide through calm rivers, tranquil lagoons and lush mangrove waterways while discovering Sri Lanka from the water. Kayaking is the perfect combination of adventure, nature and peaceful exploration.',
    tags: ['Rivers', 'Lagoons', 'Mangroves', 'Nature'],
    zone: 'water',
    icon: 'kayak',
    image: '/images/adventure-kayaking',
    imageAlt: 'A kayaker carrying a yellow kayak along a beach',
  },
  {
    number: '06',
    slug: 'surfing-kite-surfing',
    title: 'Surfing & Kite Surfing',
    tagline: 'Ride the wind and the waves.',
    body: 'Sri Lanka’s coastline is made for life on the water. Paddle out at famous surf breaks like Arugam Bay and Weligama, or let the wind pull you across the lagoons of Kalpitiya on a kite surfing session. Whether you’re standing up on your first wave or chasing the next big ride, the island has a beach for you.',
    tags: ['Surf breaks', 'Kite surfing', 'Coastline', 'Adrenaline'],
    zone: 'water',
    icon: 'surf',
    image: '/images/adventure-surfing-kite-surfing',
    imageAlt: 'A kite surfer riding a wave, spray flying',
  },
  {
    number: '07',
    slug: 'white-water-rafting',
    title: 'White-Water Rafting',
    tagline: 'Let the river lead the way.',
    body: 'Head into the adventure capital of Kitulgala and take on Sri Lanka’s thrilling white-water rapids. Surrounded by tropical rainforest, this is an exhilarating experience for adventure seekers and groups alike.',
    tags: ['Adrenaline', 'Rapids', 'Kitulgala', 'Rainforest'],
    zone: 'water',
    icon: 'raft',
    image: '/images/adventure-white-water-rafting',
    imageAlt: 'A group in helmets paddling a blue raft through white-water rapids',
  },
  {
    number: '08',
    slug: 'scuba-diving-snorkelling',
    title: 'Scuba Diving & Snorkelling',
    tagline: 'Discover the world beneath the waves.',
    body: 'Dive into Sri Lanka’s tropical waters and discover colourful marine life, coral reefs and fascinating underwater landscapes. From relaxed snorkelling to deeper diving adventures, the island offers unforgettable experiences beneath the surface.',
    tags: ['Marine life', 'Coral reefs', 'Diving', 'Snorkelling'],
    zone: 'water',
    icon: 'dive',
    image: '/images/adventure-scuba-diving-snorkelling',
    imageAlt: 'A diver swimming beside a school of fish in deep blue water',
  },
  {
    number: '09',
    slug: 'cave-exploration',
    title: 'Cave Exploration',
    tagline: 'Step into the hidden side of Sri Lanka.',
    body: 'Venture beyond the surface and explore Sri Lanka’s fascinating caves and underground landscapes. Discover natural rock formations, hidden passages and ancient environments while experiencing a side of the island few travellers get to see.',
    tags: ['Exploration', 'Nature', 'History', 'Adventure'],
    zone: 'underground',
    icon: 'cave',
    image: '/images/adventure-cave-exploration',
    imageAlt: 'An explorer with a headlamp standing in a vast cave',
  },
]

export function adventuresForZone(zone: AdventureZone | 'all'): Adventure[] {
  return zone === 'all' ? ADVENTURES : ADVENTURES.filter((a) => a.zone === zone)
}

/**
 * Background scenes, top (sky) to bottom (cave). Each stage has its own animated backdrop:
 * sky = clouds, canopy and land = birds, water = waves and splashes, ocean = fish and jellyfish,
 * depth = darkness and fireflies.
 */
export type AdventureStage = 'sky' | 'canopy' | 'land' | 'water' | 'ocean' | 'depth'

export const ADVENTURE_STAGES: { id: AdventureStage; label: string }[] = [
  { id: 'sky', label: 'Sky' },
  { id: 'canopy', label: 'Canopy' },
  { id: 'land', label: 'Land' },
  { id: 'water', label: 'Water' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'depth', label: 'Depth' },
]

/** Which backdrop an experience scrolls over. The zip line is the only "canopy" entry; scuba is the only "ocean" one. */
export function adventureStage(adventure: Pick<Adventure, 'zone' | 'slug'>): AdventureStage {
  if (adventure.slug === 'ella-zip-line') return 'canopy'
  if (adventure.slug === 'scuba-diving-snorkelling') return 'ocean'
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
