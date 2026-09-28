/**
 * tours-data.ts
 * ------------------------------------------------------------------
 * Typed, React-side port of TOUR_CATEGORIES + TOUR_PACKAGES from the
 * now-deleted public/js/data.js. Single source of truth for this
 * content.
 * ------------------------------------------------------------------
 */

export type TourCategorySlug =
  | 'cultural-historical'
  | 'nature'
  | 'beach'
  | 'romantic'
  | 'ramayana-trails'
  | 'ayurvedic-wellness'
  | 'vacation'

export interface TourCategory {
  slug: TourCategorySlug
  name: string
  icon: string
  intro: string
  /** True when the itinerary hasn't been drafted yet — the page shows
   *  an enquiry prompt instead of package cards for this category. */
  comingSoon?: boolean
}

// Matches the seven packs in the current tour-ops document.
export const TOUR_CATEGORIES: TourCategory[] = [
  {
    slug: 'cultural-historical',
    name: 'Cultural & Historical',
    icon: 'temple',
    intro: 'Ancient kingdoms, cave temples and living Buddhist heritage, woven from Anuradhapura to Kandy.',
  },
  {
    slug: 'nature',
    name: 'Nature',
    icon: 'mountain',
    intro: "Waterfalls, cloud forest and highland trails through the island's wildest, most untamed interior.",
  },
  {
    slug: 'beach',
    name: 'Beach',
    icon: 'wave',
    intro: 'The coastline end to end — kite-surfing in the north-west, whale watching in the south, world-class surf in the east.',
  },
  {
    slug: 'romantic',
    name: 'Romantic',
    icon: 'sun',
    intro: 'Slower-paced routes designed for two, from a short escape to a full honeymoon circuit.',
  },
  {
    slug: 'ramayana-trails',
    name: 'Ramayana Trails',
    icon: 'temple',
    intro: 'Sites across the island bound to the Ramayana legend, traced from Mannar to Ella.',
  },
  {
    slug: 'ayurvedic-wellness',
    name: 'Ayurvedic & Wellness',
    icon: 'leaf',
    intro: 'Meditation, yoga and traditional Ayurvedic treatment — itineraries currently taking shape.',
    comingSoon: true,
  },
  {
    slug: 'vacation',
    name: 'Vacation — Pearl of the Indian Ocean',
    icon: 'compass',
    intro: 'A flagship island-wide circuit for a first visit to Sri Lanka — itinerary currently taking shape.',
    comingSoon: true,
  },
]

export interface ItineraryDay {
  day: number
  title: string
  text: string
}

export interface TourPackage {
  slug: string
  category: TourCategorySlug
  name: string
  icon: string
  nights: number
  route: string
  blurb: string
  itinerary: ItineraryDay[]
}

export const TOUR_PACKAGES: TourPackage[] = [
  {
    slug: 'cultural-triangle-escape',
    category: 'cultural-historical',
    name: 'Cultural Triangle Escape',
    icon: 'temple',
    nights: 4,
    route: 'Airport → Sigiriya (2N) → Kandy (2N) → Airport',
    blurb:
      "A compact first taste of the Cultural Triangle — Sigiriya's rock fortress and Kandy's Temple of the Sacred Tooth Relic in five days.",
    itinerary: [
      { day: 1, title: 'Airport to Sigiriya', text: 'Transfer via Pinnawala Elephant Orphanage; climb of Sigiriya Rock Fortress.' },
      { day: 2, title: 'Sigiriya', text: 'Sunrise at Pidurangala Rock, then a safari at Minneriya or Kaudulla National Park and the Eco National Park near Habarana.' },
      { day: 3, title: 'Sigiriya to Kandy', text: 'Dambulla Cave Temple and a spice garden en route; afternoon at the Temple of the Sacred Tooth Relic.' },
      { day: 4, title: 'Kandy', text: 'Peradeniya Royal Botanical Gardens, the Bahirawakanda Buddha viewpoint and a Kandy city tour with the Gem Museum.' },
      { day: 5, title: 'Kandy to Airport', text: 'Optional tea factory visit in Giragama before transferring to the airport.' },
    ],
  },
  {
    slug: 'heritage-and-serenity',
    category: 'cultural-historical',
    name: 'Heritage and Serenity Getaway',
    icon: 'temple',
    nights: 6,
    route: 'Airport → Anuradhapura (2N) → Sigiriya (2N) → Kandy (2N) → Airport',
    blurb: 'Three ancient kingdoms in one route — Anuradhapura, Polonnaruwa and Kandy — at an unhurried pace.',
    itinerary: [
      { day: 1, title: 'Airport to Anuradhapura', text: 'Yapahuwa Rock Fortress en route to Anuradhapura.' },
      { day: 2, title: 'Anuradhapura & Mihintale', text: 'Early-morning Wilpaththu safari, then the sacred city and Sri Maha Bodhi, and Mihintale, the birthplace of Buddhism in Sri Lanka.' },
      { day: 3, title: 'Aukana & Ritigala to Sigiriya', text: 'The 12-metre Aukana Buddha statue and Ritigala forest monastery en route to Sigiriya.' },
      { day: 4, title: 'Polonnaruwa & Sigiriya', text: "The ruins of Polonnaruwa, Sri Lanka's second kingdom, then a climb of Sigiriya Lion Rock and a cultural dance show." },
      { day: 5, title: 'Sigiriya to Kandy', text: "A village tour by bullock cart, Dambulla Cave Temple and Matale's Aluviharaya Temple en route to Kandy." },
      { day: 6, title: 'Kandy', text: 'Temple of the Sacred Tooth Relic, Kandy Lake, Peradeniya Gardens.' },
      { day: 7, title: 'Kandy to Airport', text: 'A spice garden and the Giragama tea plantations before transferring to the airport.' },
    ],
  },
  {
    slug: 'through-ancient-kingdoms',
    category: 'cultural-historical',
    name: 'Through Ancient Kingdoms',
    icon: 'temple',
    nights: 11,
    route: 'Airport → Anuradhapura (2N) → Sigiriya (2N) → Kandy (2N) → Nuwara Eliya (1N) → Ella (1N) → Mahiyanganaya (1N) → Tissamaharama (2N) → Airport',
    blurb:
      'The full heritage-and-highlands circuit — ancient kingdoms, hill country and a Yala safari finish, over twelve days.',
    itinerary: [
      { day: 1, title: 'Airport to Anuradhapura', text: 'Yapahuwa Rock Fortress en route to Anuradhapura.' },
      { day: 2, title: 'Anuradhapura & Mihintale', text: "Ancient stupas, the Sri Maha Bodhi, and Mihintale's hilltop views." },
      { day: 3, title: 'Aukana & Ritigala to Sigiriya', text: "The Aukana Buddha statue and Ritigala's forest monastery." },
      { day: 4, title: 'Polonnaruwa & Sigiriya', text: "Polonnaruwa's ancient ruins, a Sigiriya Lion Rock climb and a cultural dance show." },
      { day: 5, title: 'Sigiriya to Kandy', text: 'Village tour, Dambulla Cave Temple and Nalanda Gedige, then on to Matale with a spice garden visit en route to Kandy.' },
      { day: 6, title: 'Kandy', text: 'Temple of the Sacred Tooth Relic, the Botanical Gardens and a Kandy city tour with the Gem Museum.' },
      { day: 7, title: 'Kandy to Nuwara Eliya', text: 'Hanuman Temple and Sita Amman Temple en route to the hill country.' },
      { day: 8, title: 'Nuwara Eliya to Ella', text: "A city tour, then one of the world's most scenic train rides to Ella." },
      { day: 9, title: 'Ella to Mahiyanganaya', text: "Nine Arches Bridge, Little Adam's Peak and Dunhinda Waterfall en route." },
      { day: 10, title: 'Mahiyanganaya to Tissamaharama', text: 'A visit to the Dambana indigenous Vedda village.' },
      { day: 11, title: 'Tissamaharama', text: 'Kataragama Temple and a Yala National Park safari.' },
      { day: 12, title: 'Departure', text: 'Transfer to the airport.' },
    ],
  },
  {
    slug: 'highlands-and-waterfalls',
    category: 'nature',
    name: 'Highlands and Waterfalls Getaway',
    icon: 'mountain',
    nights: 4,
    route: 'Airport → Kandy (1N) → Nuwara Eliya (1N) → Ella (2N) → Airport',
    blurb: "A short, scenic run through the hill country — tea country, a cloud-forest train ride and Ella's waterfalls.",
    itinerary: [
      { day: 1, title: 'Airport to Kandy', text: 'Arrival and transfer to Kandy, visiting the Pinnawala Elephant Orphanage and a spice garden en route.' },
      { day: 2, title: 'Kandy to Nuwara Eliya', text: 'The botanical garden, Temple of the Sacred Tooth Relic and a Kandy city tour with the Gem Museum, then transfer into the tea-country highlands.' },
      { day: 3, title: 'Nuwara Eliya to Ella', text: 'The scenic hill-country train ride to Ella.' },
      { day: 4, title: 'Ella', text: 'Zip-lining, the Nine Arches Bridge, Ravana Cave and Ravana Falls.' },
      { day: 5, title: 'Ella to Airport', text: 'Transfer to the airport via Ravana and Diyaluma Falls and Ratnapura.' },
    ],
  },
  {
    slug: 'serene-bliss-exploration',
    category: 'nature',
    name: 'Serene Bliss Exploration',
    icon: 'mountain',
    nights: 10,
    route: 'Airport → Sigiriya (1N) → Knuckles (2N) → Kandy (1N) → Nallathanni (1N) → Nuwara Eliya (2N) → Haputale (1N) → Ella (2N) → Airport',
    blurb: 'A deep hill-country and Knuckles-range circuit for travellers who want to properly walk the highlands.',
    itinerary: [
      { day: 1, title: 'Sigiriya', text: 'Sigiriya Rock and Dambulla Cave Temple.' },
      { day: 2, title: 'To Knuckles / Meemure', text: 'Transfer via Matale into the Knuckles range, overnight in Meemure village.' },
      { day: 3, title: 'Meemure', text: 'A full day exploring the village and surrounding forest.' },
      { day: 4, title: 'To Kandy', text: 'A Kandy city tour.' },
      { day: 5, title: 'To Nallathanni', text: 'Ambuluwawa Tower en route.' },
      { day: 6, title: "Adam's Peak to Nuwara Eliya", text: "Pre-dawn Adam's Peak climb for sunrise, then transfer to Nuwara Eliya." },
      { day: 7, title: 'Nuwara Eliya', text: 'Pidurutalagala mountain, Shanthipura village and a city tour.' },
      { day: 8, title: 'Horton Plains to Haputale', text: 'A Horton Plains safari, then the scenic train to Haputale.' },
      { day: 9, title: 'To Ella', text: "Lipton's Seat and Dunhinda Falls en route." },
      { day: 10, title: 'Ella', text: "Little Adam's Peak, zip line and Ella's sights." },
      { day: 11, title: 'Departure', text: 'Diyaluma and Ravana Falls, Ella Rock, then transfer to the airport.' },
    ],
  },
  {
    slug: 'thrills-and-tranquility',
    category: 'nature',
    name: 'Thrills and Tranquility',
    icon: 'mountain',
    nights: 8,
    route: 'Airport → Nallathanni (1N) → Nuwara Eliya (1N) → Haputale (1N) → Ella (2N) → Udawalawe (1N) → Ratnapura (1N) → Negombo (1N) → Airport',
    blurb:
      "The active version of the hill country — white-water rafting, an Adam's Peak sunrise and Ella's trails, then an Udawalawe safari, Ratnapura's gem country and a lagoon-side finish in Negombo.",
    itinerary: [
      { day: 1, title: 'Nallathanni via Kitulgala', text: "White-water rafting, overnight near Adam's Peak base." },
      { day: 2, title: "Adam's Peak to Nuwara Eliya", text: 'Pre-dawn climb for sunrise, then transfer.' },
      { day: 3, title: 'Horton Plains to Haputale', text: 'Hiking and trekking in Horton Plains, then the scenic train to Haputale.' },
      { day: 4, title: 'To Ella', text: 'The scenic train ride from Haputale to Ella.' },
      { day: 5, title: 'Ella', text: "Little Adam's Peak, zip line, Ella Rock and Ravana Falls." },
      { day: 6, title: 'Udawalawe', text: 'A visit to Diyaluma Falls en route.' },
      { day: 7, title: 'Udawalawe to Ratnapura', text: 'A wildlife safari, then on to Ratnapura for a visit to natural gem mines and waterfalls.' },
      { day: 8, title: 'Negombo', text: 'Lagoon boat ride and a leisurely beach day.' },
      { day: 9, title: 'Departure', text: 'Transfer to the airport.' },
    ],
  },
  {
    slug: 'northern-horizons',
    category: 'beach',
    name: 'Northern Horizons and Coastal Charms',
    icon: 'wave',
    nights: 9,
    route: 'Airport → Kalpitiya (2N) → Mannar (1N) → Jaffna (2N) → Trincomalee (1N) → Sigiriya (1N) → Negombo (2N) → Airport',
    blurb: "The island's lesser-visited north — kite-surfing, Mannar's flamingos and Jaffna, looping back via Trincomalee.",
    itinerary: [
      { day: 1, title: 'To Kalpitiya', text: 'Transfer to Kalpitiya.' },
      { day: 2, title: 'Kalpitiya', text: 'Kite-surfing and traditional fishing.' },
      { day: 3, title: 'To Mannar', text: 'Transfer to Mannar.' },
      { day: 4, title: 'Mannar to Jaffna', text: "Flamingo watching, Mannar Peak, the Hanuman Bridge and a baobab tree en route." },
      { day: 5, title: 'Jaffna', text: 'A full day of Jaffna sightseeing.' },
      { day: 6, title: 'To Trincomalee', text: 'Via Anuradhapura, with hot springs en route.' },
      { day: 7, title: 'Trincomalee to Sigiriya', text: "Trincomalee's sights, then transfer." },
      { day: 8, title: 'Sigiriya to Negombo', text: 'A village tour, optional Lion Rock climb, then on to Negombo via Pinnawala.' },
      { day: 9, title: 'Negombo', text: "A free day on Negombo's beaches." },
      { day: 10, title: 'Departure', text: 'Transfer to the airport.' },
    ],
  },
  {
    slug: 'southern-coastal-bliss',
    category: 'beach',
    name: 'Southern Coastal Bliss',
    icon: 'wave',
    nights: 8,
    route: 'Airport → Bentota (1N) → Galle (2N) → Mirissa (1N) → Hiriketiya (2N) → Yala (1N) → Colombo (1N) → Airport',
    blurb: "The south coast at an unhurried pace — Bentota's river life, Galle Fort, whale watching from Mirissa and Hiriketiya's beach, with a Yala safari before a Colombo finish.",
    itinerary: [
      { day: 1, title: 'Bentota', text: 'Transfer to Bentota Beach.' },
      { day: 2, title: 'To Galle', text: 'A serene glide on the Madu River and a visit to a turtle hatchery en route to Galle.' },
      { day: 3, title: 'Galle', text: 'Jungle Beach and Rumassala, then a sunset stroll around Galle Fort.' },
      { day: 4, title: 'Mirissa', text: "Unawatuna beach, then time to relax in Mirissa with its exotic cafés and nightlife." },
      { day: 5, title: 'To Hiriketiya', text: 'Early-morning whale and dolphin watching, then transfer to Hiriketiya.' },
      { day: 6, title: 'Hiriketiya', text: 'A day to rest on the beach at Hiriketiya.' },
      { day: 7, title: 'Yala', text: 'A Yala National Park safari.' },
      { day: 8, title: 'Colombo', text: 'Transfer to Colombo and a city tour.' },
      { day: 9, title: 'Departure', text: 'Transfer to the airport.' },
    ],
  },
  {
    slug: 'sun-and-fun',
    category: 'beach',
    name: 'Sun and Fun',
    icon: 'wave',
    nights: 10,
    route: 'Airport → Sigiriya (2N) → Pasikudah (2N) → Arugam Bay (2N) → Tissamaharama (1N) → Tangalle (1N) → Mirissa (1N) → Bentota (1N) → Airport',
    blurb: 'An east-to-south beach circuit for surfers and sun-seekers, with a Yala safari built in along the way.',
    itinerary: [
      { day: 1, title: 'Sigiriya', text: 'Pinnawala en route, then the Dambulla Cave Temple and transfer to Sigiriya.' },
      { day: 2, title: 'Sigiriya', text: 'Climb Sigiriya Rock, then enjoy a village tour, an elephant-back safari and a cultural dance.' },
      { day: 3, title: 'To Pasikudah', text: 'Transfer to Pasikudah.' },
      { day: 4, title: 'Pasikudah', text: 'Sun, sand and surf.' },
      { day: 5, title: 'Arugam Bay', text: "Surfing at one of South Asia's best point breaks." },
      { day: 6, title: 'Arugam Bay', text: 'A second day surfing and unwinding.' },
      { day: 7, title: 'To Tissamaharama', text: 'A Yala National Park safari and Kataragama Temple.' },
      { day: 8, title: 'To Tangalle', text: 'Transfer to Tangalle.' },
      { day: 9, title: 'To Mirissa', text: 'Coconut Tree Hill, Secret Beach, Parrot Rock and turtles at Madiha Beach.' },
      { day: 10, title: 'Mirissa to Bentota', text: 'Morning whale and dolphin watching, then on to Bentota via Galle Fort (ramparts, lighthouse and museum), finishing with water sports and a serene glide on the Madu River.' },
      { day: 11, title: 'Departure', text: 'Transfer to the airport.' },
    ],
  },
  {
    slug: 'romantic-getaway',
    category: 'romantic',
    name: 'Romantic Getaway',
    icon: 'sun',
    nights: 5,
    route: 'Airport → Kandy (2N) → Nuwara Eliya (1N) → Bentota (2N) → Airport',
    blurb: "A short, unhurried route for two — Kandy's temples, tea country and a river-and-beach finish in Bentota.",
    itinerary: [
      { day: 1, title: 'To Kandy', text: 'Pinnawala, a spice garden and Sembuwatta Lake en route.' },
      { day: 2, title: 'Kandy', text: 'Handicraft centres, the gem museum, Botanical Gardens, the Temple of the Tooth and a cultural dance.' },
      { day: 3, title: 'To Nuwara Eliya', text: 'Ambuluwawa Tower, Hanuman and Sita Amman temples en route.' },
      { day: 4, title: 'To Bentota', text: 'Via Kitulgala for white-water rafting.' },
      { day: 5, title: 'Bentota', text: 'Turtle Hatchery, a Madu River boat ride and a fish massage.' },
      { day: 6, title: 'Departure', text: 'Transfer to the airport via Galle Fort.' },
    ],
  },
  {
    slug: 'tales-of-love',
    category: 'romantic',
    name: 'Tales of Love and Timeless Beauty',
    icon: 'sun',
    nights: 9,
    route: 'Airport → Sigiriya (2N) → Kandy (1N) → Nuwara Eliya (1N) → Ella (2N) → Udawalawe (1N) → Mirissa (2N) → Airport',
    blurb: 'A fuller romantic circuit — heritage, hill country, a private safari and whale watching to close.',
    itinerary: [
      { day: 1, title: 'Sigiriya', text: 'Pinnawala and a Sigiriya Rock climb.' },
      { day: 2, title: 'Sigiriya', text: 'Village tour, elephant-back safari, Dambulla Cave Temple and Pidurangala Rock.' },
      { day: 3, title: 'To Kandy', text: 'Sembuwatta Lake and a spice garden en route; the Temple of the Tooth and a cultural dance.' },
      { day: 4, title: 'To Nuwara Eliya', text: 'Ambuluwawa Tower, Hanuman and Sita Amman temples en route.' },
      { day: 5, title: 'Nuwara Eliya to Ella', text: 'The scenic train ride.' },
      { day: 6, title: 'Ella', text: 'Nine Arches Bridge, Little Adam\'s Peak, Ella Rock and Ravana Falls.' },
      { day: 7, title: 'Udawalawe', text: 'A private safari.' },
      { day: 8, title: 'To Mirissa', text: 'Coconut Tree Hill, Secret Beach, Parrot Rock and turtles at Madiha Beach.' },
      { day: 9, title: 'Mirissa', text: 'Morning whale and dolphin watching, then a Galle Fort tour.' },
      { day: 10, title: 'Departure', text: 'Transfer to the airport via Bentota.' },
    ],
  },
  {
    slug: 'sri-lanka-honeymoon',
    category: 'romantic',
    name: 'Sri Lanka Honeymoon — Romance and Adventure Awaits',
    icon: 'sun',
    nights: 10,
    route: 'Airport → Negombo (1N) → Trincomalee (2N) → Sigiriya (2N) → Kandy (1N) → Nuwara Eliya (1N) → Ella (1N) → Arugam Bay (2N) → Airport',
    blurb:
      "The signature honeymoon route — the east coast's beaches and reefs, the Cultural Triangle and hill country, ending on safari.",
    itinerary: [
      { day: 1, title: 'Arrival, Negombo', text: 'Beaches, the Dutch fort and canal-side restaurants.' },
      { day: 2, title: 'Trincomalee', text: 'Koneswaram Kovil, Fort Frederick and Marble Beach.' },
      { day: 3, title: 'Trincomalee', text: 'Hot springs and snorkelling off Pigeon Island.' },
      { day: 4, title: 'Sigiriya', text: 'A climb of the Lion Rock Fortress, a Sigiriya village tour and an Ayurvedic treatment.' },
      { day: 5, title: 'Sigiriya', text: 'An early-morning Pidurangala Rock hike, then an elephant-back safari and a cultural dance.' },
      { day: 6, title: 'Kandy', text: 'Spice gardens, handicraft centres and the Temple of the Sacred Tooth Relic.' },
      { day: 7, title: 'Nuwara Eliya', text: 'Via Ambuluwawa and Ramboda Falls.' },
      { day: 8, title: 'Ella', text: "The scenic train, Nine Arches Bridge, Little Adam's Peak and Ravana Falls." },
      { day: 9, title: 'Arugam Bay', text: 'Surf-town downtime.' },
      { day: 10, title: 'Arugam Bay', text: 'A second day at leisure.' },
      { day: 11, title: 'Yala, departure', text: 'A Yala National Park safari and Kataragama Kovil, then transfer to the airport.' },
    ],
  },
  {
    slug: 'ramayana-legacy',
    category: 'ramayana-trails',
    name: 'Ramayana Legacy in Sri Lanka',
    icon: 'temple',
    nights: 11,
    route: 'Airport → Negombo (1N) → Mannar (1N) → Trincomalee (2N) → Sigiriya (2N) → Kandy (1N) → Nuwara Eliya (1N) → Ella (2N) → Unawatuna (1N) → Airport',
    blurb: 'Sites across the island linked to the Ramayana legend, woven through a full heritage-and-coast circuit.',
    itinerary: [
      { day: 1, title: 'Arrival, Negombo', text: 'Transfer to Negombo.' },
      { day: 2, title: 'To Mannar', text: 'Munneswaram Kovil in Chilaw en route.' },
      { day: 3, title: 'Mannar to Trincomalee', text: "Flamingo watching, Mannar Peak and the Hanuman Bridge (Adam's Bridge)." },
      { day: 4, title: 'Trincomalee', text: 'A full day of sightseeing.' },
      { day: 5, title: 'Sigiriya', text: 'Transfer and a Lion Rock climb.' },
      { day: 6, title: 'Sigiriya', text: 'Pidurangala Rock, a village tour, an elephant-back safari and a cultural dance.' },
      { day: 7, title: 'To Kandy', text: 'Transfer to Kandy, visiting the Dambulla Cave Temple and a spice garden en route, then the Temple of the Sacred Tooth Relic and Bahirawa hill in Kandy.' },
      { day: 8, title: 'To Nuwara Eliya', text: 'The Hanuman Temple and tea plantations en route; in Nuwara Eliya, the Sita Amman Temple and Gregory Lake.' },
      { day: 9, title: 'Nuwara Eliya to Ella', text: 'The scenic train ride.' },
      { day: 10, title: 'Ella', text: "Nine Arches Bridge, Little Adam's Peak, Ella Rock and a zip line." },
      { day: 11, title: 'To Unawatuna', text: 'Transfer to the south coast, visiting Ravana Falls, Ravana Cave and Diyaluma Falls en route.' },
      { day: 12, title: 'Unawatuna, departure', text: 'Rumassala and the beach, then transfer to the airport via Galle Fort.' },
    ],
  },
]
