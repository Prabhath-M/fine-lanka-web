export interface JournalEntry {
  slug: string
  title: string
  date: string
  location: string
  coords: string
  tags: string[]
  image: string
  excerpt: string
  body: string[]
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: 'sunrise-over-the-lion-rock',
    title: 'Sunrise Over the Lion Rock',
    date: 'March 2026',
    location: 'Sigiriya',
    coords: '7.9570° N, 80.7603° E',
    tags: ['Cultural Triangle', 'Sunrise'],
    image: '/images/journal/sunrise-over-the-lion-rock.jpg',
    excerpt:
      'The climb everyone recommends is up Sigiriya itself. The one nobody tells you about is the rock across from it.',
    body: [
      'Most visitors climb Sigiriya in the cool of early morning and are back down by the time the day turns hot. Fewer climb Pidurangala instead, the smaller rock directly opposite, arriving in the dark to watch the sun come up over the fortress rather than from it.',
      'The path is steeper and rougher near the top — a short scramble over boulders in the last stretch — but the reward is the view every photograph of Sigiriya is actually taken from: the rock fortress rising alone out of the jungle canopy, catching the first light while the plains around it are still grey.',
      'We build a short stop at Pidurangala into most Cultural Triangle routes now, timed so guests are back at the hotel for breakfast before the site itself gets busy.',
    ],
  },
  {
    slug: 'the-slow-train-to-ella',
    title: 'The Slow Train to Ella',
    date: 'January 2026',
    location: 'Nuwara Eliya to Ella',
    coords: '6.8667° N, 81.0466° E',
    tags: ['Hill Country', 'Train'],
    image: '/images/journal/the-slow-train-to-ella.jpg',
    excerpt:
      "It's often called one of the world's most beautiful train journeys. It's also, reliably, three hours late.",
    body: [
      'The line between Nuwara Eliya and Ella climbs through tea estate after tea estate, the train slow enough that pickers barely look up as it passes a few metres from where they are working. Windows stay open the whole way; nobody minds.',
      'Tickets for the observation carriage sell out weeks ahead, and unreserved second class is a genuine option — arrive early, and you will likely find a spot in an open doorway with your legs hanging out over the drop, which is where most of the photographs you have seen were taken from.',
      'Our advice is always the same: build in slack either side. The scenery is worth it; the timetable is a suggestion.',
    ],
  },
  {
    slug: 'whales-before-breakfast',
    title: 'Whales Before Breakfast',
    date: 'December 2025',
    location: 'Mirissa',
    coords: '5.9483° N, 80.4589° E',
    tags: ['South Coast', 'Wildlife'],
    image: '/images/journal/whales-before-breakfast.jpg',
    excerpt:
      'Boats leave Mirissa harbour before six, chasing blue whales while the rest of the coast is still asleep.',
    body: [
      "Sri Lanka's south coast sits close to a deep continental shelf, which is the reason blue whales pass within a few kilometres of shore between December and April. Boats leave early to catch calmer water and better light, well before the beach cafés have opened.",
      "Sightings aren't guaranteed on any single morning, but the season's odds are good, and most operators we work with will offer a second attempt if the first comes up empty.",
      'Back on land by mid-morning, with the whole day still ahead — which is usually spent doing very little on Mirissa beach, which is exactly the point.',
    ],
  },
  {
    slug: 'a-night-at-the-temple-of-the-tooth',
    title: 'A Night at the Temple of the Tooth',
    date: 'August 2025',
    location: 'Kandy',
    coords: '7.2906° N, 80.6337° E',
    tags: ['Hill Country', 'Culture'],
    image: '/images/journal/a-night-at-the-temple-of-the-tooth.jpg',
    excerpt:
      'Every evening, drummers and dancers perform outside the temple that holds Buddhism\u2019s most sacred relic in Sri Lanka.',
    body: [
      'The Temple of the Sacred Tooth Relic sits on Kandy Lake, and every evening drummers gather outside ahead of the evening ritual, joined most nights by a traditional Kandyan dance performance nearby — masked, acrobatic, and unmistakably different from anything else on the island.',
      "If your dates line up with the Esala Perahera festival in July or August, the town transforms entirely for ten nights: elephants in ceremonial dress, fire dancers and drummers processing through streets lined several people deep. It's one of the few times we'd actively recommend booking a year ahead.",
      'Outside festival season, an evening in Kandy is a quieter thing — a walk around the lake, the temple lit up after dark, and the hill air a welcome change after the coast.',
    ],
  },
  {
    slug: 'tracking-leopards-in-yala',
    title: 'Tracking Leopards in Yala',
    date: 'October 2025',
    location: 'Yala National Park',
    coords: '6.3724° N, 81.5165° E',
    tags: ['Wildlife', 'Safari'],
    image: '/images/journal/tracking-leopards-in-yala.jpg',
    excerpt:
      'Yala has one of the highest densities of leopards anywhere on earth. It still takes patience to see one.',
    body: [
      'Block 1 of Yala National Park gets crowded at peak season — jeeps radioing each other the moment a leopard is spotted, a small convoy following soon after. It is a fair trade for the odds: this is widely considered the best place on the planet to see a wild leopard.',
      "Dawn and dusk drives give the best chance, when the park's elephants, sloth bears and crocodiles are also most active. A good tracker reads the terrain as much as the radio — a startled deer or an alarm call from langurs overhead is often the first real clue.",
      "For travellers who'd rather trade a slightly lower leopard-density for a quieter park, we often route through Wilpattu or Udawalawe instead — same principle, fewer jeeps.",
    ],
  },
  {
    slug: 'following-the-ramayana-trail-to-mannar',
    title: 'Following the Ramayana Trail to Mannar',
    date: 'February 2026',
    location: 'Mannar',
    coords: '8.9810° N, 79.9042° E',
    tags: ['Ramayana Trail', 'North'],
    image: '/images/journal/following-the-ramayana-trail-to-mannar.jpg',
    excerpt:
      'The chain of shoals between Sri Lanka and India is said, in the Ramayana, to be the bridge Rama\u2019s army built.',
    body: [
      'Mannar sits at the island\u2019s far north-west, a quiet, sparsely visited peninsula best known among birders for its flamingos and among pilgrims for its place in the Ramayana — the Hanuman Bridge, or Adam\u2019s Bridge, a chain of limestone shoals stretching toward India, said in the epic to have been built to reach Sita.',
      'The old baobab trees here, brought centuries ago by Arabian traders, are as much a landmark as anything ancient — several are over 700 years old and wide enough to fit a small room inside their trunks.',
      'It is one of the quieter stretches on our Ramayana Trail routes — no crowds, no queues, just a long flat coastline and a story that predates most of what else is on the itinerary.',
    ],
  },
]
