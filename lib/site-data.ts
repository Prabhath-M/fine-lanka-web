/**
 * site-data.ts
 * ------------------------------------------------------------------
 * Typed, React-side port of the site-wide content that used to live in
 * public/js/data.js (deleted in Phase 7 of MIGRATION_PLAN.md — every
 * page now reads from here instead). Covers everything EXCEPT
 * destinations and tours (see lib/destinations-data.ts and
 * lib/tours-data.ts) — those are large enough to warrant their own
 * files. This is the single source of truth for this content now.
 * ------------------------------------------------------------------
 */

export interface SiteInfo {
  brand: string
  tagline: string
  /** Primary number — used anywhere only one phone fits (header, footer,
   *  booking sidebar). Full list lives in `phones`. */
  phone: string
  phones: string[]
  /** Primary address — used anywhere only one email fits. Full list
   *  lives in `emails`. */
  email: string
  emails: string[]
  address: string
  foundedYear: number
}

export const SITE: SiteInfo = {
  brand: 'Fine Lanka Tours',
  tagline: 'Journey Beyond Expectations',
  phone: '070 193 2526',
  phones: ['070 193 2526', '077 745 1085'],
  email: 'info@finelankatours.com',
  emails: ['info@finelankatours.com', 'travel@finelankatours.com'],
  address: 'No. 38/18, Muthulanda, Dagonna Road, Boragodawaththa, Minuwangoda, Sri Lanka',
  foundedYear: 2011,
}

export interface NavChild {
  label: string
  href: string
  icon: string
}

export interface NavLink {
  label: string
  href: string
  page: string
  children?: NavChild[]
}

// `page` is matched against the active route (via usePathname() in
// components/site-header.tsx) to highlight the current nav item — same
// idea as the old data-page convention, without the manual DOM
// bookkeeping.
export const NAV_LINKS: NavLink[] = [
  {
    label: 'Destinations',
    href: '/destinations',
    page: 'destinations',
    children: [
      { label: 'Cultural Triangle', href: '/destinations?region=Cultural+Triangle', icon: 'temple' },
      { label: 'Hill Country', href: '/destinations?region=Hill+Country', icon: 'mountain' },
      { label: 'South Coast', href: '/destinations?region=South+Coast', icon: 'wave' },
      { label: 'East Coast', href: '/destinations?region=East+Coast', icon: 'compass' },
      { label: 'Wildlife & National Parks', href: '/destinations?region=Wildlife+%26+National+Parks', icon: 'elephant' },
      { label: 'Colombo & West Coast', href: '/destinations?region=Colombo+%26+West+Coast', icon: 'island' },
    ],
  },
  {
    label: 'Tours & Pricing',
    href: '/tours-pricing',
    page: 'tours-pricing',
    // icon keys mirror TOUR_CATEGORIES in lib/tours-data.ts (same
    // category = same icon everywhere on the site).
    children: [
      { label: 'Cultural & Historical', href: '/tours-pricing?category=cultural-historical', icon: 'temple' },
      { label: 'Nature', href: '/tours-pricing?category=nature', icon: 'mountain' },
      { label: 'Beach', href: '/tours-pricing?category=beach', icon: 'wave' },
      { label: 'Romantic', href: '/tours-pricing?category=romantic', icon: 'sun' },
      { label: 'Ramayana Trails', href: '/tours-pricing?category=ramayana-trails', icon: 'temple' },
      { label: 'Ayurvedic & Wellness', href: '/tours-pricing?category=ayurvedic-wellness', icon: 'leaf' },
      { label: 'Vacation — Pearl of the Indian Ocean', href: '/tours-pricing?category=vacation', icon: 'compass' },
    ],
  },
  { label: 'Journal', href: '/journal', page: 'journal' },
  { label: 'About Us', href: '/about', page: 'about' },
  { label: 'Why Fine Lanka', href: '/#why', page: 'index' },
  { label: 'Book Now', href: '/booking', page: 'booking' },
]

export interface Feature {
  icon: string
  title: string
  text: string
}

// "Why Fine Lanka Tours" feature cards.
export const FEATURES: Feature[] = [
  {
    icon: 'leaf',
    title: 'Designed around you',
    text: 'Every itinerary begins with a genuine conversation, then unfolds at your pace — never dictated by a template.',
  },
  {
    icon: 'elephant',
    title: 'Local, island-wide',
    text: 'Resident specialists and trusted driver-guides bring hard-won local knowledge to every mile of the route.',
  },
  {
    icon: 'phone',
    title: 'One call, always',
    text: 'One dependable point of contact stays close at hand, from your arrival to the moment you fly home.',
  },
  {
    icon: 'temple',
    title: 'Chosen with care',
    text: 'We recommend only the stays, guides and experiences that have truly earned their place in your journey.',
  },
]

export interface ProcessStep {
  title: string
  text: string
}

// The four-step process — order carries meaning here (1 → 4).
export const PROCESS_STEPS: ProcessStep[] = [
  { title: 'Share the shape of your trip', text: "Tell us what matters most to you — we'll ask the questions that bring your route into sharp focus." },
  { title: 'Meet your travel designer', text: 'A Sri Lanka-based specialist drafts a first route shaped around your interests, timing and travel style.' },
  { title: 'Fine-tune the details', text: 'Together, we refine the rhythm, stays and experiences until every single day feels perfectly judged.' },
  { title: 'Travel with support close by', text: 'Depart with a clear plan in hand and one trusted contact for the entire journey.' },
]

export interface Testimonial {
  quote: string
  name: string
  trip: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Every detail was considered before we thought to ask. It felt less like a booking and more like being met halfway.',
    name: 'E. Faulkner',
    trip: 'Travelled to Sigiriya & Kandy, 2026',
  },
  {
    quote:
      "We've used other agents before. This was the first time the itinerary actually matched how our family travels.",
    name: 'R. Adeyemi',
    trip: 'Travelled to Yala National Park, 2025',
  },
  {
    quote: "The kind of trip you can't build yourself from search results — the local access alone was worth it.",
    name: 'M. Solberg',
    trip: 'Travelled through the Hill Country, 2025',
  },
]

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  heading: string
  links: FooterLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Destinations', href: '/destinations' },
      { label: 'Tours & Pricing', href: '/tours-pricing' },
      { label: 'Book Now', href: '/booking' },
      { label: 'Journal', href: '/journal' },
    ],
  },
  {
    heading: 'Fine Lanka Tours',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Why Fine Lanka', href: '#why' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Notice', href: '/privacy' },
      { label: 'Booking Terms', href: '/booking-terms' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
]

// Social/review profile links now live in lib/social-links.ts — kept
// separate from the rest of this file since it's the one obvious place
// to go back and fill in real URLs later.

export interface TravelNote {
  title: string
  text: string
}

// Short practical notes for foreign travellers, shown on the
// tours-pricing page.
export const TRAVEL_NOTES: TravelNote[] = [
  {
    title: 'Visa on arrival',
    text: 'Most nationalities need an ETA (Electronic Travel Authorisation) approved before departure — we can guide you through the process.',
  },
  {
    title: 'Currency',
    text: 'The Sri Lankan Rupee (LKR). Card payments are widely accepted in cities and resorts; carry cash for smaller towns and tips.',
  },
  {
    title: 'Best time to visit',
    text: "December to March favours the south and west coasts; May to September favours the east coast — we'll route around the season for you.",
  },
  {
    title: 'Driver-guides',
    text: "Every private itinerary includes a dedicated driver-guide — tipping is customary, and we'll advise a fair local rate.",
  },
]
