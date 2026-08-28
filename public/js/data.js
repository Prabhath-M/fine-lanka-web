/**
 * data.js
 * ------------------------------------------------------------------
 * All editable site CONTENT lives here, separate from markup (index.html),
 * behaviour (main.js) and rendering (render.js).
 *
 * To add a destination, testimonial, nav item, etc. in a future session,
 * edit the arrays/objects below — you should rarely need to touch
 * index.html or render.js just to add content.
 * ------------------------------------------------------------------
 */

const SITE = {
  brand: "Fine Lanka Tours",
  tagline: "Tailor-Made Journeys Across Sri Lanka",
  phone: "+94 11 234 5678",
  email: "hello@finelankatours.com",
  foundedYear: 2011,
};

// Primary navigation. `children` is optional — used for dropdown menus.
// `page` marks the interior page a link belongs to, so renderNav() can
// highlight the active item without fragile URL parsing.
const NAV_LINKS = [
  {
    label: "Destinations",
    href: "destinations.html",
    page: "destinations",
    children: [
      { label: "Cultural Triangle", href: "destinations.html?region=Cultural+Triangle", icon: "temple" },
      { label: "Hill Country", href: "destinations.html?region=Hill+Country", icon: "mountain" },
      { label: "South Coast", href: "destinations.html?region=South+Coast", icon: "wave" },
      { label: "East Coast", href: "destinations.html?region=East+Coast", icon: "compass" },
      { label: "Wildlife & National Parks", href: "destinations.html?region=Wildlife+%26+National+Parks", icon: "elephant" },
      { label: "Colombo & West Coast", href: "destinations.html?region=Colombo+%26+West+Coast", icon: "island" },
    ],
  },
  {
    label: "Tours & Pricing",
    href: "tours-pricing.html",
    page: "tours-pricing",
    // icon keys mirror TOUR_CATEGORIES below (same category = same icon
    // everywhere on the site) rather than introducing a second mapping.
    children: [
      { label: "Cultural & Historical", href: "tours-pricing.html?category=cultural-historical", icon: "temple" },
      { label: "Nature", href: "tours-pricing.html?category=nature", icon: "mountain" },
      { label: "Beach", href: "tours-pricing.html?category=beach", icon: "wave" },
      { label: "Romantic", href: "tours-pricing.html?category=romantic", icon: "sun" },
      { label: "Ramayana Trails", href: "tours-pricing.html?category=ramayana-trails", icon: "temple" },
      { label: "Ayurvedic & Wellness", href: "tours-pricing.html?category=ayurvedic-wellness", icon: "leaf" },
      { label: "Vacation — Pearl of the Indian Ocean", href: "tours-pricing.html?category=vacation", icon: "compass" },
    ],
  },
  { label: "Journal", href: "/journal", page: "journal" },
  { label: "Why Fine Lanka", href: "index.html#why", page: "index" },
  { label: "Book Now", href: "booking.html", page: "booking" },
];

// All destinations. `region` deliberately matches the six categories in
// NAV_LINKS' "Destinations" dropdown, so destinations.html can filter by
// the exact same taxonomy. `featured: true` marks the six shown on
// destinations.html's flip-card system first (that page still renders
// the full list regardless). `mapX`/`mapY` are percentage positions
// (0–100, left/top of the FULL image) for the homepage's "Explore the
// map" section — measured directly off images/sri-lanka-map-full.jpg
// (the full illustrated parchment artwork used as that section's
// background, title/border/figures included) by locating each pin's
// colour and computing the centroid of its lower tip triangle (see the
// note above initExploreSection() in main.js for how). Only
// destinations that are actually pinned on that illustration have
// mapX/mapY — that's what initExploreSection() uses to decide which
// destinations appear in the map showcase (12 of the 13 here; the
// illustration doesn't include Ella). `icon` refers to a key in ICONS
// (see icons.js). `highlights` are shown on the back of each
// destination card once it's flipped/tapped open (destinations.html)
// or in the map showcase's detail drawer (index.html).
const DESTINATIONS = [
  {
    name: "Sigiriya",
    region: "Cultural Triangle",
    coords: "7.9570° N, 80.7603° E",
    icon: "temple",
    blurb: "Climb the fifth-century rock fortress and explore ancient frescoes at dawn, before the crowds arrive.",
    highlights: ["Sunrise hike up Pidurangala Rock", "Sigiriya frescoes and the Mirror Wall", "Sigiriya village tour by bullock cart", "Elephant-back safari option"],
    featured: true,
    mapX: 75.75,
    mapY: 39.16,
  },
  {
    name: "Ella & the Hill Country",
    region: "Hill Country",
    coords: "6.8667° N, 81.0466° E",
    icon: "leaf",
    blurb: "Tea estates, mist-covered ridgelines and a slow train ride through the clouds.",
    highlights: ["Nine Arches Bridge", "Little Adam's Peak and Ella Rock", "Ravana Ella Falls and zip line", "Scenic hill-country train ride"],
    featured: true,
    // No mapX/mapY: not pinned on images/sri-lanka-map-full.jpg, so
    // it's excluded from the homepage map showcase. Still appears on
    // destinations.html and anywhere else DESTINATIONS is used.
  },
  {
    name: "Mirissa & the South Coast",
    region: "South Coast",
    coords: "5.9483° N, 80.4589° E",
    icon: "wave",
    blurb: "Whale watching at dawn, palm-lined beaches and stilt fishermen at dusk.",
    highlights: ["Dawn whale and dolphin watching", "Coconut Tree Hill and Parrot Rock", "Secret Beach at sunset", "Turtles at Madiha Beach"],
    featured: true,
    mapX: 76.76,
    mapY: 87.11,
  },
  {
    name: "Yala National Park",
    region: "Wildlife & National Parks",
    coords: "6.3724° N, 81.5165° E",
    icon: "elephant",
    blurb: "The world's highest density of leopards, alongside elephants, sloth bears and crocodiles.",
    highlights: ["Private 4x4 leopard-tracking safari", "Nearby Kataragama sacred temple", "Dawn and dusk game drives", "Sloth bear and elephant sightings"],
    featured: true,
    mapX: 87.92,
    mapY: 68.95,
  },
  {
    name: "Galle Fort",
    region: "South Coast",
    coords: "6.0300° N, 80.2167° E",
    icon: "compass",
    blurb: "Cobbled ramparts, Dutch colonial villas and boutique stays inside a 16th-century fort.",
    highlights: ["Dutch Reformed Church", "Galle Fort lighthouse and ramparts", "Maritime Archaeology Museum", "Bike tours through the old town"],
    featured: true,
    mapX: 66.93,
    mapY: 80.66,
  },
  {
    name: "Kandy",
    region: "Hill Country",
    coords: "7.2906° N, 80.6337° E",
    icon: "sun",
    blurb: "The Temple of the Sacred Tooth Relic, lakeside walks and the last hill capital of the Kandyan kings.",
    highlights: ["Temple of the Sacred Tooth Relic", "Peradeniya Royal Botanical Gardens", "Kandy Lake walk", "Kandyan cultural dance show"],
    featured: true,
    mapX: 74.09,
    mapY: 53.12,
  },
  {
    name: "Anuradhapura",
    region: "Cultural Triangle",
    coords: "8.3114° N, 80.4037° E",
    icon: "temple",
    blurb: "Sri Lanka's first ancient capital — vast dagobas and sacred bo trees dating back over two millennia.",
    highlights: ["Ruwanwelisaya dagoba", "Sri Maha Bodhi sacred tree", "Jethawanaramaya monastery", "Mihintale, the birthplace of Buddhism in Sri Lanka"],
    mapX: 69.34,
    mapY: 30.76,
  },
  {
    name: "Nuwara Eliya",
    region: "Hill Country",
    coords: "6.9497° N, 80.7891° E",
    icon: "mountain",
    blurb: "Cool colonial-era hill station among manicured tea gardens, waterfalls and strawberry fields.",
    highlights: ["Horton Plains and World's End", "Gregory Lake", "Working tea estate and factory visit", "Hakgala Botanical Garden"],
    mapX: 75.91,
    mapY: 63.28,
  },
  {
    name: "Udawalawe National Park",
    region: "Wildlife & National Parks",
    coords: "6.4394° N, 80.8983° E",
    icon: "elephant",
    blurb: "Open grassland plains with one of the island's largest wild elephant populations.",
    highlights: ["Open-plain elephant safari", "Elephant Transit Home", "Birdwatching across the reservoir", "Quieter alternative to Yala"],
    mapX: 77.34,
    mapY: 75.00,
  },
  {
    name: "Trincomalee",
    region: "East Coast",
    coords: "8.5874° N, 81.2152° E",
    icon: "wave",
    blurb: "Deep natural harbour, calm turquoise bays and some of the island's best diving and snorkelling.",
    highlights: ["Koneswaram Kovil on Fort Frederick", "Pigeon Island snorkelling", "Natural hot springs", "Marble Beach"],
    mapX: 83.50,
    mapY: 34.47,
  },
  {
    name: "Arugam Bay",
    region: "East Coast",
    coords: "6.8400° N, 81.8360° E",
    icon: "wave",
    blurb: "A laid-back surf town with some of South Asia's best point breaks, busiest May to September.",
    highlights: ["Main Point surf break", "Laid-back beach-town pace", "Nearby Kumana National Park", "Best May to September"],
    mapX: 91.99,
    mapY: 57.32,
  },
  {
    name: "Colombo",
    region: "Colombo & West Coast",
    coords: "6.9271° N, 79.8612° E",
    icon: "compass",
    blurb: "The island's buzzing commercial capital — colonial architecture, street food and a growing gallery scene.",
    highlights: ["Colonial-era Fort district", "Independence Square", "Street food and local markets", "Usual arrival/departure base"],
    mapX: 64.23,
    mapY: 61.62,
  },
  {
    name: "Negombo",
    region: "Colombo & West Coast",
    coords: "7.2083° N, 79.8358° E",
    icon: "pin",
    blurb: "A relaxed beach town by the airport, fishing boats and a Dutch canal, easing you in or out of the island.",
    highlights: ["Negombo Dutch Fort and canal", "Fish market at dawn", "Catholic churches along the coast", "Jet-skiing and watersports"],
    mapX: 63.61,
    mapY: 52.05,
  },
];

// Tour categories, matching the seven packs in the current tour-ops
// document. `comingSoon: true` means the itinerary hasn't been drafted
// yet — the page shows an enquiry prompt instead of package cards.
const TOUR_CATEGORIES = [
  { slug: "cultural-historical", name: "Cultural & Historical", icon: "temple", intro: "Ancient kingdoms, cave temples and living Buddhist heritage, from Anuradhapura to Kandy." },
  { slug: "nature", name: "Nature", icon: "mountain", intro: "Waterfalls, cloud forest and highland trails through the island's wildest interior." },
  { slug: "beach", name: "Beach", icon: "wave", intro: "The coastline end to end — kite-surfing in the north-west, whales in the south, surf in the east." },
  { slug: "romantic", name: "Romantic", icon: "sun", intro: "Slower-paced routes built for two, from a short escape to a full honeymoon circuit." },
  { slug: "ramayana-trails", name: "Ramayana Trails", icon: "temple", intro: "Sites across the island linked to the Ramayana legend, from Mannar to Ella." },
  { slug: "ayurvedic-wellness", name: "Ayurvedic & Wellness", icon: "leaf", intro: "Meditation, yoga and traditional Ayurvedic treatment — itineraries currently in development.", comingSoon: true },
  { slug: "vacation", name: "Vacation — Pearl of the Indian Ocean", icon: "compass", intro: "A flagship island-wide circuit for a first visit to Sri Lanka — itinerary currently in development.", comingSoon: true },
];

// Tour packages for tours-pricing.html, grouped by `category` (a
// TOUR_CATEGORIES slug). Prices are indicative per-person, twin-share
// estimates based on trip length — every itinerary is re-quoted
// individually once dates, stays and pace are set. `itinerary` entries
// are intentionally condensed to one line per day; the full day-by-day
// brief lives in the source tour-ops document.
const TOUR_PACKAGES = [
  {
    slug: "cultural-triangle-escape",
    category: "cultural-historical",
    name: "Cultural Triangle Escape",
    icon: "temple",
    nights: 4,
    priceFrom: 1150,
    route: "Airport → Sigiriya (2N) → Kandy (2N) → Airport",
    blurb: "A compact first taste of the Cultural Triangle — Sigiriya's rock fortress and Kandy's Temple of the Sacred Tooth Relic in five days.",
    itinerary: [
      { day: 1, title: "Airport to Sigiriya", text: "Transfer via Pinnawala Elephant Orphanage; afternoon climb of Sigiriya Rock Fortress." },
      { day: 2, title: "Sigiriya", text: "Sunrise at Pidurangala Rock, then an afternoon safari at Minneriya or Kaudulla National Park." },
      { day: 3, title: "Sigiriya to Kandy", text: "Dambulla Cave Temple and a spice garden en route; afternoon at the Temple of the Sacred Tooth Relic." },
      { day: 4, title: "Kandy", text: "Peradeniya Royal Botanical Gardens, the Bahirawakanda Buddha viewpoint and Kandy Market." },
      { day: 5, title: "Kandy to Airport", text: "Optional tea factory visit in Giragama before transferring to the airport." },
    ],
  },
  {
    slug: "heritage-and-serenity",
    category: "cultural-historical",
    name: "Heritage and Serenity Getaway",
    icon: "temple",
    nights: 6,
    priceFrom: 1650,
    route: "Airport → Anuradhapura (2N) → Sigiriya (2N) → Kandy (2N) → Airport",
    blurb: "Three ancient kingdoms in one route — Anuradhapura, Polonnaruwa and Kandy — at an unhurried pace.",
    itinerary: [
      { day: 1, title: "Airport to Anuradhapura", text: "Yapahuwa Rock Fortress en route to Anuradhapura." },
      { day: 2, title: "Anuradhapura & Mihintale", text: "The sacred city's ancient dagobas and Sri Maha Bodhi, then Mihintale, the birthplace of Buddhism in Sri Lanka." },
      { day: 3, title: "Aukana & Ritigala to Sigiriya", text: "The 12-metre Aukana Buddha statue and Ritigala forest monastery en route to Sigiriya." },
      { day: 4, title: "Polonnaruwa & Sigiriya", text: "The ruins of Polonnaruwa, Sri Lanka's second kingdom, then a climb of Sigiriya Lion Rock." },
      { day: 5, title: "Sigiriya to Kandy", text: "A village tour by bullock cart, Dambulla Cave Temple and Matale's Aluviharaya Temple en route to Kandy." },
      { day: 6, title: "Kandy", text: "Temple of the Sacred Tooth Relic, Kandy Lake, Peradeniya Gardens and a Kandyan cultural show." },
      { day: 7, title: "Kandy to Airport", text: "Pinnawala Elephant Orphanage before transferring to the airport." },
    ],
  },
  {
    slug: "through-ancient-kingdoms",
    category: "cultural-historical",
    name: "Through Ancient Kingdoms",
    icon: "temple",
    nights: 11,
    priceFrom: 2950,
    route: "Airport → Anuradhapura → Sigiriya → Kandy → Nuwara Eliya → Ella → Mahiyanganaya → Tissamaharama → Airport",
    blurb: "The full heritage-and-highlands circuit — ancient kingdoms, hill country and a Yala safari finish, over twelve days.",
    itinerary: [
      { day: 1, title: "Airport to Anuradhapura", text: "Yapahuwa Rock Fortress en route to Anuradhapura." },
      { day: 2, title: "Anuradhapura & Mihintale", text: "Ancient stupas, the Sri Maha Bodhi, and Mihintale's hilltop views." },
      { day: 3, title: "Aukana & Ritigala to Sigiriya", text: "The Aukana Buddha statue and Ritigala's forest monastery." },
      { day: 4, title: "Polonnaruwa & Sigiriya", text: "Polonnaruwa's ancient ruins and a Sigiriya Lion Rock climb." },
      { day: 5, title: "Sigiriya to Kandy", text: "Village tour, Dambulla Cave Temple, Nalanda Gedige and Matale en route." },
      { day: 6, title: "Kandy", text: "Temple of the Sacred Tooth Relic, Botanical Gardens and a cultural show." },
      { day: 7, title: "Kandy to Nuwara Eliya", text: "Hanuman Temple and Sita Amman Temple en route to the hill country." },
      { day: 8, title: "Nuwara Eliya to Ella", text: "A city tour, then one of the world's most scenic train rides to Ella." },
      { day: 9, title: "Ella to Mahiyanganaya", text: "Nine Arches Bridge, Little Adam's Peak and Dunhinda Waterfall en route." },
      { day: 10, title: "Mahiyanganaya to Tissamaharama", text: "A visit to the Dambana indigenous Vedda village." },
      { day: 11, title: "Tissamaharama", text: "Kataragama Temple and a Yala National Park safari." },
      { day: 12, title: "Departure", text: "Transfer to the airport." },
    ],
  },
  {
    slug: "highlands-and-waterfalls",
    category: "nature",
    name: "Highlands and Waterfalls Getaway",
    icon: "mountain",
    nights: 4,
    priceFrom: 1100,
    route: "Airport → Kandy (1N) → Nuwara Eliya (1N) → Ella (2N) → Airport",
    blurb: "A short, scenic run through the hill country — tea country, a cloud-forest train ride and Ella's waterfalls.",
    itinerary: [
      { day: 1, title: "Airport to Kandy", text: "Arrival and transfer to Kandy." },
      { day: 2, title: "Kandy to Nuwara Eliya", text: "Transfer into the tea-country highlands." },
      { day: 3, title: "Nuwara Eliya to Ella", text: "The scenic hill-country train ride to Ella." },
      { day: 4, title: "Ella", text: "Zip-lining, Ravana Cave and Ravana Falls." },
      { day: 5, title: "Ella to Airport", text: "Transfer via Diyaluma Falls and Ratnapura." },
    ],
  },
  {
    slug: "serene-bliss-exploration",
    category: "nature",
    name: "Serene Bliss Exploration",
    icon: "mountain",
    nights: 10,
    priceFrom: 2650,
    route: "Airport → Sigiriya → Knuckles/Meemure → Kandy → Nallathanni → Nuwara Eliya → Haputale → Ella → Airport",
    blurb: "A deep hill-country and Knuckles-range circuit for travellers who want to properly walk the highlands.",
    itinerary: [
      { day: 1, title: "Sigiriya", text: "Sigiriya Rock and Dambulla Cave Temple." },
      { day: 2, title: "To Knuckles / Meemure", text: "Transfer via Matale into the Knuckles range, overnight in Meemure village." },
      { day: 3, title: "Meemure", text: "A full day exploring the village and surrounding forest." },
      { day: 4, title: "To Kandy", text: "A Kandy city tour." },
      { day: 5, title: "To Nallathanni", text: "Ambuluwawa Tower en route." },
      { day: 6, title: "Adam's Peak to Nuwara Eliya", text: "Pre-dawn Adam's Peak climb for sunrise, then transfer to Nuwara Eliya." },
      { day: 7, title: "Nuwara Eliya", text: "Pidurutalagala mountain, Shanthipura village and a city tour." },
      { day: 8, title: "Horton Plains to Haputale", text: "A Horton Plains safari, then the scenic train to Haputale." },
      { day: 9, title: "To Ella", text: "Lipton's Seat and Dunhinda Falls en route." },
      { day: 10, title: "Ella", text: "Little Adam's Peak, zip line and Ella's sights." },
      { day: 11, title: "Departure", text: "Diyaluma and Ravana Falls, Ella Rock, then transfer to the airport." },
    ],
  },
  {
    slug: "thrills-and-tranquility",
    category: "nature",
    name: "Thrills and Tranquility",
    icon: "mountain",
    nights: 8,
    priceFrom: 2150,
    route: "Airport → Kitulgala → Nuwara Eliya → Haputale → Ella → Knuckles → Sigiriya → Negombo → Airport",
    blurb: "The active version of the hill country — white-water rafting, an Adam's Peak sunrise and a Knuckles trek, ending on the beach.",
    itinerary: [
      { day: 1, title: "Kitulgala", text: "White-water rafting, overnight near Adam's Peak base." },
      { day: 2, title: "Adam's Peak to Nuwara Eliya", text: "Pre-dawn climb for sunrise, then transfer." },
      { day: 3, title: "Horton Plains to Haputale", text: "A safari, then the scenic train." },
      { day: 4, title: "To Ella", text: "Lipton's Seat and Dunhinda Falls en route." },
      { day: 5, title: "Ella", text: "Little Adam's Peak, zip line, Ella Rock and Ravana Falls." },
      { day: 6, title: "Knuckles", text: "A day of hiking and trekking in the range." },
      { day: 7, title: "To Sigiriya", text: "Spice gardens and Aluvihara Temple in Matale en route." },
      { day: 8, title: "Negombo", text: "Jet-skiing and a leisurely beach day." },
      { day: 9, title: "Departure", text: "Transfer to the airport." },
    ],
  },
  {
    slug: "northern-horizons",
    category: "beach",
    name: "Northern Horizons and Coastal Charms",
    icon: "wave",
    nights: 9,
    priceFrom: 2350,
    route: "Airport → Kalpitiya → Mannar → Jaffna → Trincomalee → Sigiriya → Negombo → Airport",
    blurb: "The island's lesser-visited north — kite-surfing, Mannar's flamingos and Jaffna, looping back via Trincomalee.",
    itinerary: [
      { day: 1, title: "To Kalpitiya", text: "Transfer to Kalpitiya." },
      { day: 2, title: "Kalpitiya", text: "Kite-surfing and traditional fishing." },
      { day: 3, title: "To Mannar", text: "Transfer to Mannar." },
      { day: 4, title: "Mannar to Jaffna", text: "Flamingo watching, Mannar Peak, the Hanuman Bridge and a baobab tree en route." },
      { day: 5, title: "Jaffna", text: "A full day of Jaffna sightseeing." },
      { day: 6, title: "To Trincomalee", text: "Via Anuradhapura, with hot springs en route." },
      { day: 7, title: "Trincomalee to Sigiriya", text: "Trincomalee's sights, then transfer." },
      { day: 8, title: "Sigiriya to Negombo", text: "A village tour, optional Lion Rock climb, then on to Negombo via Pinnawala." },
      { day: 9, title: "Negombo", text: "A free day on Negombo's beaches." },
      { day: 10, title: "Departure", text: "Transfer to the airport." },
    ],
  },
  {
    slug: "southern-coastal-bliss",
    category: "beach",
    name: "Southern Coastal Bliss",
    icon: "wave",
    nights: 7,
    priceFrom: 1850,
    route: "Airport → Kandy → Nuwara Eliya → Mirissa (2N) → Galle → Bentota (2N) → Airport",
    blurb: "Hill country into the south coast — whale watching in Mirissa, Galle Fort and river life in Bentota.",
    itinerary: [
      { day: 1, title: "To Kandy", text: "Pinnawala, a spice garden, the Temple of the Tooth and a cultural dance." },
      { day: 2, title: "To Nuwara Eliya", text: "Ambuluwawa Tower, Hanuman and Sita Amman temples en route." },
      { day: 3, title: "To Mirissa", text: "Via Kitulgala for white-water rafting, then Coconut Tree Hill, Secret Beach and Parrot Rock." },
      { day: 4, title: "Mirissa", text: "Morning whale and dolphin watching." },
      { day: 5, title: "To Galle", text: "Galle Fort's ramparts, Dutch church, lighthouse and maritime museum." },
      { day: 6, title: "Bentota", text: "Turtle Hatchery, a Madu River boat ride and a fish massage." },
      { day: 7, title: "Bentota", text: "A second day at leisure in Bentota." },
      { day: 8, title: "Departure", text: "Transfer to the airport." },
    ],
  },
  {
    slug: "sun-and-fun",
    category: "beach",
    name: "Sun and Fun",
    icon: "wave",
    nights: 9,
    priceFrom: 2350,
    route: "Airport → Sigiriya → Pasikudah (2N) → Arugam Bay (2N) → Tissamaharama → Tangalle → Mirissa (2N) → Airport",
    blurb: "An east-to-south beach circuit for surfers and sun-seekers, with a Yala safari built in along the way.",
    itinerary: [
      { day: 1, title: "Sigiriya", text: "Pinnawala and a Sigiriya Rock climb." },
      { day: 2, title: "To Pasikudah", text: "Via Polonnaruwa." },
      { day: 3, title: "Pasikudah", text: "Sun, sand and surf." },
      { day: 4, title: "Arugam Bay", text: "Surfing at one of South Asia's best point breaks." },
      { day: 5, title: "Arugam Bay", text: "A second day surfing and unwinding." },
      { day: 6, title: "To Tissamaharama", text: "A Yala National Park safari and Kataragama Temple." },
      { day: 7, title: "To Tangalle", text: "Transfer to Tangalle." },
      { day: 8, title: "To Mirissa", text: "Coconut Tree Hill, Secret Beach, Parrot Rock and turtles at Madiha Beach." },
      { day: 9, title: "Mirissa", text: "Morning whale and dolphin watching." },
      { day: 10, title: "Departure", text: "Transfer to the airport via Galle Fort." },
    ],
  },
  {
    slug: "romantic-getaway",
    category: "romantic",
    name: "Romantic Getaway",
    icon: "sun",
    nights: 5,
    priceFrom: 1350,
    route: "Airport → Kandy (2N) → Nuwara Eliya (1N) → Bentota (1N) → Airport",
    blurb: "A short, unhurried route for two — Kandy's temples, tea country and a river-and-beach finish in Bentota.",
    itinerary: [
      { day: 1, title: "To Kandy", text: "Pinnawala, a spice garden and Sembuwatta Lake en route." },
      { day: 2, title: "Kandy", text: "Handicraft centres, the gem museum, Botanical Gardens, the Temple of the Tooth and a cultural dance." },
      { day: 3, title: "To Nuwara Eliya", text: "Ambuluwawa Tower, Hanuman and Sita Amman temples en route." },
      { day: 4, title: "To Bentota", text: "Via Kitulgala for white-water rafting." },
      { day: 5, title: "Bentota", text: "Turtle Hatchery, a Madu River boat ride and a fish massage." },
      { day: 6, title: "Departure", text: "Transfer to the airport via Galle Fort." },
    ],
  },
  {
    slug: "tales-of-love",
    category: "romantic",
    name: "Tales of Love and Timeless Beauty",
    icon: "sun",
    nights: 9,
    priceFrom: 2350,
    route: "Airport → Sigiriya → Kandy → Nuwara Eliya → Ella → Udawalawe → Mirissa (2N) → Airport",
    blurb: "A fuller romantic circuit — heritage, hill country, a private safari and whale watching to close.",
    itinerary: [
      { day: 1, title: "Sigiriya", text: "Pinnawala and a Sigiriya Rock climb." },
      { day: 2, title: "Sigiriya", text: "Village tour, elephant-back safari, Dambulla Cave Temple and Pidurangala Rock." },
      { day: 3, title: "To Kandy", text: "Sembuwatta Lake and a spice garden en route; the Temple of the Tooth and a cultural dance." },
      { day: 4, title: "To Nuwara Eliya", text: "Ambuluwawa Tower, Hanuman and Sita Amman temples en route." },
      { day: 5, title: "Nuwara Eliya to Ella", text: "The scenic train ride." },
      { day: 6, title: "Ella", text: "Nine Arches Bridge, Little Adam's Peak, Ella Rock and Ravana Falls." },
      { day: 7, title: "Udawalawe", text: "A private safari." },
      { day: 8, title: "To Mirissa", text: "Coconut Tree Hill, Secret Beach, Parrot Rock and turtles at Madiha Beach." },
      { day: 9, title: "Mirissa", text: "Morning whale and dolphin watching." },
      { day: 10, title: "Departure", text: "Transfer to the airport via Galle Fort." },
    ],
  },
  {
    slug: "sri-lanka-honeymoon",
    category: "romantic",
    name: "Sri Lanka Honeymoon — Romance and Adventure Awaits",
    icon: "sun",
    nights: 10,
    priceFrom: 3250,
    route: "Airport → Negombo → Trincomalee (2N) → Sigiriya → Kandy (2N) → Nuwara Eliya → Ella → Arugam Bay (2N) → Yala → Airport",
    blurb: "The signature honeymoon route — the east coast's beaches and reefs, the Cultural Triangle and hill country, ending on safari.",
    itinerary: [
      { day: 1, title: "Arrival, Negombo", text: "Beaches, the Dutch fort and canal-side restaurants." },
      { day: 2, title: "Trincomalee", text: "Koneswaram Kovil, Fort Frederick and Marble Beach." },
      { day: 3, title: "Trincomalee", text: "Hot springs and snorkelling off Pigeon Island." },
      { day: 4, title: "Sigiriya", text: "A climb of the Lion Rock Fortress." },
      { day: 5, title: "Kandy", text: "Spice gardens, handicraft centres and the Temple of the Sacred Tooth Relic." },
      { day: 6, title: "Kandy", text: "A Kandyan cultural dance performance." },
      { day: 7, title: "Nuwara Eliya", text: "Via Ambuluwawa and Ramboda Falls." },
      { day: 8, title: "Ella", text: "The scenic train, Nine Arches Bridge, Little Adam's Peak and Ravana Falls." },
      { day: 9, title: "Arugam Bay", text: "Surf-town downtime." },
      { day: 10, title: "Arugam Bay", text: "A second day at leisure." },
      { day: 11, title: "Yala, departure", text: "A Yala National Park safari and Kataragama Kovil, then transfer to the airport." },
    ],
  },
  {
    slug: "ramayana-legacy",
    category: "ramayana-trails",
    name: "Ramayana Legacy in Sri Lanka",
    icon: "temple",
    nights: 11,
    priceFrom: 2950,
    route: "Airport → Negombo → Mannar → Trincomalee → Sigiriya (2N) → Kandy → Nuwara Eliya → Ella → Unawatuna (2N) → Airport",
    blurb: "Sites across the island linked to the Ramayana legend, woven through a full heritage-and-coast circuit.",
    itinerary: [
      { day: 1, title: "Arrival, Negombo", text: "Transfer to Negombo." },
      { day: 2, title: "To Mannar", text: "Munneswaram Kovil in Chilaw en route." },
      { day: 3, title: "Mannar to Trincomalee", text: "Flamingo watching, Mannar Peak and the Hanuman Bridge (Adam's Bridge)." },
      { day: 4, title: "Trincomalee", text: "A full day of sightseeing." },
      { day: 5, title: "Sigiriya", text: "Transfer and a Lion Rock climb." },
      { day: 6, title: "Sigiriya", text: "Village tour, elephant-back safari, Dambulla Cave Temple and Pidurangala Rock." },
      { day: 7, title: "To Kandy", text: "Sembuwatta Lake and a spice garden en route; the Temple of the Tooth and a cultural dance." },
      { day: 8, title: "To Nuwara Eliya", text: "Ambuluwawa Tower, Hanuman and Sita Amman temples en route." },
      { day: 9, title: "Nuwara Eliya to Ella", text: "The scenic train ride." },
      { day: 10, title: "Ella", text: "Nine Arches Bridge, Little Adam's Peak, Ella Rock, zip line, Ravana Falls and Ravana Cave." },
      { day: 11, title: "To Unawatuna", text: "Transfer to the south coast." },
      { day: 12, title: "Unawatuna, departure", text: "Rumassala and the beach, then transfer to the airport via Galle Fort." },
    ],
  },
];

// Short practical notes for foreign travellers, shown on tours-pricing.html.
const TRAVEL_NOTES = [
  { title: "Visa on arrival", text: "Most nationalities need an ETA (Electronic Travel Authorisation) approved before departure — we can guide you through it." },
  { title: "Currency", text: "The Sri Lankan Rupee (LKR). Card payments are common in cities and resorts; carry cash for smaller towns and tips." },
  { title: "Best time to visit", text: "December to March suits the south and west coasts; May to September suits the east coast — we'll route around the season." },
  { title: "Driver-guides", text: "Every private itinerary includes a dedicated driver-guide — tipping is customary and we'll advise a fair local rate." },
];

// Journal entries for journal.html, presented as a ship's log. Images are
// Lorem Picsum placeholders (seeded, so they stay stable across reloads) —
// swap the `image` URLs for real photography whenever it's available.
const JOURNAL_ENTRIES = [
  {
    slug: "sunrise-over-the-lion-rock",
    title: "Sunrise Over the Lion Rock",
    date: "March 2026",
    location: "Sigiriya",
    coords: "7.9570° N, 80.7603° E",
    tags: ["Cultural Triangle", "Sunrise"],
    image: "images/journal/sunrise-over-the-lion-rock.png",
    excerpt: "The climb everyone recommends is up Sigiriya itself. The one nobody tells you about is the rock across from it.",
    body: [
      "Most visitors climb Sigiriya in the cool of early morning and are back down by the time the day turns hot. Fewer climb Pidurangala instead, the smaller rock directly opposite, arriving in the dark to watch the sun come up over the fortress rather than from it.",
      "The path is steeper and rougher near the top — a short scramble over boulders in the last stretch — but the reward is the view every photograph of Sigiriya is actually taken from: the rock fortress rising alone out of the jungle canopy, catching the first light while the plains around it are still grey.",
      "We build a short stop at Pidurangala into most Cultural Triangle routes now, timed so guests are back at the hotel for breakfast before the site itself gets busy.",
    ],
  },
  {
    slug: "the-slow-train-to-ella",
    title: "The Slow Train to Ella",
    date: "January 2026",
    location: "Nuwara Eliya to Ella",
    coords: "6.8667° N, 81.0466° E",
    tags: ["Hill Country", "Train"],
    image: "images/journal/the-slow-train-to-ella.png",
    excerpt: "It's often called one of the world's most beautiful train journeys. It's also, reliably, three hours late.",
    body: [
      "The line between Nuwara Eliya and Ella climbs through tea estate after tea estate, the train slow enough that pickers barely look up as it passes a few metres from where they're working. Windows stay open the whole way; nobody minds.",
      "Tickets for the observation carriage sell out weeks ahead, and unreserved second class is a genuine option — arrive early, and you'll likely find a spot in an open doorway with your legs hanging out over the drop, which is where most of the photographs you've seen were taken from.",
      "Our advice is always the same: build in slack either side. The scenery is worth it; the timetable is a suggestion.",
    ],
  },
  {
    slug: "whales-before-breakfast",
    title: "Whales Before Breakfast",
    date: "December 2025",
    location: "Mirissa",
    coords: "5.9483° N, 80.4589° E",
    tags: ["South Coast", "Wildlife"],
    image: "images/journal/whales-before-breakfast.png",
    excerpt: "Boats leave Mirissa harbour before six, chasing blue whales while the rest of the coast is still asleep.",
    body: [
      "Sri Lanka's south coast sits close to a deep continental shelf, which is the reason blue whales pass within a few kilometres of shore between December and April. Boats leave early to catch calmer water and better light, well before the beach cafés have opened.",
      "Sightings aren't guaranteed on any single morning, but the season's odds are good, and most operators we work with will offer a second attempt if the first comes up empty.",
      "Back on land by mid-morning, with the whole day still ahead — which is usually spent doing very little on Mirissa's beach, which is exactly the point.",
    ],
  },
  {
    slug: "a-night-at-the-temple-of-the-tooth",
    title: "A Night at the Temple of the Tooth",
    date: "August 2025",
    location: "Kandy",
    coords: "7.2906° N, 80.6337° E",
    tags: ["Hill Country", "Culture"],
    image: "images/journal/a-night-at-the-temple-of-the-tooth.png",
    excerpt: "Every evening, drummers and dancers perform outside the temple that holds Buddhism's most sacred relic in Sri Lanka.",
    body: [
      "The Temple of the Sacred Tooth Relic sits on Kandy Lake, and every evening drummers gather outside ahead of the evening ritual, joined most nights by a traditional Kandyan dance performance nearby — masked, acrobatic, and unmistakably different from anything else on the island.",
      "If your dates line up with the Esala Perahera festival in July or August, the town transforms entirely for ten nights: elephants in ceremonial dress, fire dancers and drummers processing through streets lined several people deep. It's one of the few times we'd actively recommend booking a year ahead.",
      "Outside festival season, an evening in Kandy is a quieter thing — a walk around the lake, the temple lit up after dark, and the hill air a welcome change after the coast.",
    ],
  },
  {
    slug: "tracking-leopards-in-yala",
    title: "Tracking Leopards in Yala",
    date: "October 2025",
    location: "Yala National Park",
    coords: "6.3724° N, 81.5165° E",
    tags: ["Wildlife", "Safari"],
    image: "images/journal/tracking-leopards-in-yala.png",
    excerpt: "Yala has one of the highest densities of leopards anywhere on earth. It still takes patience to see one.",
    body: [
      "Block 1 of Yala National Park gets crowded at peak season — jeeps radioing each other the moment a leopard is spotted, a small convoy following soon after. It's a fair trade for the odds: this is widely considered the best place on the planet to see a wild leopard.",
      "Dawn and dusk drives give the best chance, when the park's elephants, sloth bears and crocodiles are also most active. A good tracker reads the terrain as much as the radio — a startled deer or an alarm call from langurs overhead is often the first real clue.",
      "For travellers who'd rather trade a slightly lower leopard-density for a quieter park, we often route through Wilpattu or Udawalawe instead — same principle, fewer jeeps.",
    ],
  },
  {
    slug: "following-the-ramayana-trail-to-mannar",
    title: "Following the Ramayana Trail to Mannar",
    date: "February 2026",
    location: "Mannar",
    coords: "8.9810° N, 79.9042° E",
    tags: ["Ramayana Trail", "North"],
    image: "images/journal/following-the-ramayana-trail-to-mannar.png",
    excerpt: "The chain of shoals between Sri Lanka and India is said, in the Ramayana, to be the bridge Rama's army built.",
    body: [
      "Mannar sits at the island's far north-west, a quiet, sparsely visited peninsula best known among birders for its flamingos and among pilgrims for its place in the Ramayana — the Hanuman Bridge, or Adam's Bridge, a chain of limestone shoals stretching toward India, said in the epic to have been built to reach Sita.",
      "The old baobab trees here, brought centuries ago by Arabian traders, are as much a landmark as anything ancient — several are over 700 years old and wide enough to fit a small room inside their trunks.",
      "It's one of the quieter stretches on our Ramayana Trail routes — no crowds, no queues, just a long flat coastline and a story that predates most of what else is on the itinerary.",
    ],
  },
];

// "Why Fine Lanka Tours" feature cards. `icon` keys into ICONS (icons.js)
// and drives the new circular icon badge (Sri Lanka UI-kit pass).
const FEATURES = [
  {
    icon: "leaf",
    title: "Unique to You",
    text: "Every itinerary is drafted from a single conversation with your travel designer, never a template.",
  },
  {
    icon: "elephant",
    title: "On the Ground, Island-Wide",
    text: "Resident specialists and drivers based across Sri Lanka mean local knowledge, not guesswork.",
  },
  {
    icon: "phone",
    title: "24/7 During Travel",
    text: "One number to call, day or night, for the length of your trip around the island.",
  },
  {
    icon: "temple",
    title: "Considered, Not Curated-for-Show",
    text: "We turn down more guesthouses and guides than we recommend. Every stay is vetted in person.",
  },
];

// The four-step process, ordered — order carries meaning here, so a
// numbered/route treatment in render.js is intentional.
const PROCESS_STEPS = [
  { title: "Share Your Brief", text: "Tell us the shape of the Sri Lanka trip you want — we'll ask the rest." },
  { title: "Meet Your Designer", text: "A Sri Lanka-based specialist drafts a route matched to your brief." },
  { title: "Refine the Route", text: "We adjust pace, stays and detail until it's exactly right." },
  { title: "Travel, Supported", text: "You depart with a single number to call for anything at all, anywhere on the island." },
];

const TESTIMONIALS = [
  {
    quote: "Every detail was considered before we thought to ask. It felt less like a booking and more like being met halfway.",
    name: "E. Faulkner",
    trip: "Travelled to Sigiriya & Kandy, 2026",
  },
  {
    quote: "We've used other agents before. This was the first time the itinerary actually matched how our family travels.",
    name: "R. Adeyemi",
    trip: "Travelled to Yala National Park, 2025",
  },
  {
    quote: "The kind of trip you can't build yourself from search results — the local access alone was worth it.",
    name: "M. Solberg",
    trip: "Travelled through the Hill Country, 2025",
  },
];

const FOOTER_COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Destinations", href: "destinations.html" },
      { label: "Tours & Pricing", href: "tours-pricing.html" },
      { label: "Book Now", href: "booking.html" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    heading: "Fine Lanka Tours",
    links: [
      { label: "Why Fine Lanka", href: "#why" },
      { label: "Our Designers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Notice", href: "#" },
      { label: "Booking Terms", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];
