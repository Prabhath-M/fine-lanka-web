# Destinations: "Adventure & Experiences" section – implementation plan

Branch: `feat/destinations-adventure-section`. Work is split into small phases (below); each phase is one
session, ends in its own commit, and leaves the branch building and passing tests.

## Goal

Add an "Adventure & Experiences" section to the Destinations page that presents eight experiences
(helicopter tours, Ella zip line, horse riding, kayaking, white-water rafting, scuba diving &
snorkelling, ATV & quad bikes, cave exploration) in a unique, professional and creative way that
matches the existing site design.

## Concept: "Sky to Underground"

The eight experiences sit on one vertical depth axis, from helicopters high above to caves under the
earth. While scrolling, the section background shifts from pale dawn sky, through ink navy, to a deep
teal-black. A thin brass altitude gauge on the left tracks the current zone
(Sky, Canopy, Land, Water, Depth).

It contrasts with the light parchment atlas above it, and it reuses the existing design tokens
(`--ink`, `--brass`, `--teal`, Fraunces headings, mono labels) so it stays consistent and professional.

## Placement

A new `<section id="adventure">` in `components/destinations-page.tsx`, after the region atlas
(`#destination-carousel`) and before the "Not sure which region fits your trip?" CTA band
(`.destinations-cta`). A short "Adventure & Experiences" anchor link in the page hero jumps to it.

## Layout

1. **Header block.** Brass kicker "Adventure & Experiences", H2 "Go beyond the ordinary.", then the
   intro paragraph.
2. **Zone chips.** All / Air / Land / Water / Underground, reusing the existing filter-bar styling.
   - Air: Helicopter Tours, Ella Zip Line
   - Land: Horse Riding, ATV & Quad Bike Adventures
   - Water: Kayaking, White-Water Rafting, Scuba Diving & Snorkelling
   - Underground: Cave Exploration
3. **Eight "field-dossier" panels** along the gauge. Each has:
   - large mono numeral (01–08)
   - custom line icon (replaces the emoji in the source copy)
   - title, italic tagline and body copy, word for word
   - the "Experience" tags as small brass chips
   - a photo frame with a duotone treatment that reveals full colour on hover/focus
   Panels alternate sides on desktop.
4. **Closing band.** "A Little More Adventure. A Lot More Sri Lanka." with its paragraph, a
   "Plan an adventure" button that opens the existing enquiry modal (`data-open-enquiry`), and the
   sign-offs "Explore Sri Lanka. Experience More." and
   "Fine Lanka Tours – A Journey Beyond Expectations."

## Technical plan

- **Data:** `lib/adventure-data.ts` – typed entries (number, title, tagline, body, tags, zone, image),
  copied verbatim from the approved copy.
- **Components:** `components/destinations/adventure-section.tsx` (client component: filter + scroll
  gauge) and `components/destinations/adventure-panel.tsx`. Eight new inline SVG line icons matching
  the existing icon style in `components/icons.tsx`.
- **Styles:** `.adventure-*` rules scoped under `.destinations-page` in `app/globals.css`, following the
  file's existing convention.
- **Scroll effect:** `IntersectionObserver` drives the gauge and background shift. No new libraries.
- **Mobile:** the gauge becomes a slim horizontal progress bar and panels stack. Type sizes are checked
  against the recently reduced mobile map pin/label sizes.
- **Accessibility:** proper heading order and list semantics, keyboard-operable filters, visible focus
  states, contrast check on the dark background, all effects disabled under `prefers-reduced-motion`.
- **Tests:** a small data test, like `components/destinations/destination-card.test.ts`.
- **Delivery:** work stays on `feat/destinations-adventure-section`; merge to `main` only after review.

## Phases

Each phase is self-contained: it ends with `tsc` + `vitest` green, a commit, and a push. Phases 2 onward
change the page; nothing merges to `main` until Phase 6 is approved.

| # | Phase | Status |
|---|-------|--------|
| 0 | Plan | Done |
| 1 | Data and copy | Done |
| 2 | Icons and static section | Done |
| 3 | Zone filter and hero link | Done (zone filter later removed by request; hero link kept) |
| 4 | Sky-to-Underground gauge and effects | Done |
| 5 | Responsive, accessibility, reduced motion | Done (width check in a browser still to do) |
| 6 | Photos, QA and merge | Not started |

### Phase 1 – Data and copy
- Add `lib/adventure-data.ts`: typed `ADVENTURES` (number, slug, title, tagline, body, tags, zone, icon key,
  image) plus section header/closing copy, all verbatim from the source copy below.
- Add `lib/adventure-data.test.ts`: 8 entries, numbers 01–08 in order, unique slugs, every zone valid,
  no empty copy.
- Exit: tests green; no UI change.

### Phase 2 – Icons and static section
- Add 8 inline SVG line icons (helicopter, zip line, horse, kayak, raft, dive, ATV, cave) in the style of
  `components/icons.tsx`.
- Add `components/destinations/adventure-section.tsx` and `adventure-panel.tsx` (server-renderable, no
  effects yet): header block, 8 dossier panels (numeral, icon, title, tagline, body, tag chips, photo
  frame with illustrated placeholder), closing band with the enquiry button.
- Insert into `components/destinations-page.tsx` between the atlas and the CTA band; add `.adventure-*`
  desktop styles under `.destinations-page` in `app/globals.css`.
- Exit: section renders on `/destinations` at desktop width; tsc and tests green.

### Phase 3 – Zone filter and hero link
- Zone chips (All / Air / Land / Water / Underground) reusing the filter-bar styling, keyboard operable,
  with an `aria-live` count.
- "Adventure & Experiences" anchor link in the page hero (`#adventure`) with smooth scroll.
- Exit: filtering and the anchor work; tests green.

### Phase 4 – Sky-to-Underground gauge and effects
- Sticky brass altitude gauge (Sky, Canopy, Land, Water, Depth) driven by an `IntersectionObserver`.
- Scroll-linked background shift from dawn sky to ink navy to deep teal-black.
- Panel hover/focus reveal (duotone to full colour, brass contour lines); staggered entrance.
- Exit: effects smooth on desktop; no layout shift; tests green.

### Phase 5 – Responsive, accessibility, reduced motion
- Mobile layout: gauge becomes a slim horizontal progress bar, panels stack; check against the smaller
  mobile map sizes and the new mobile nav.
- Accessibility pass: heading order, list semantics, focus states, contrast on the dark background.
- `prefers-reduced-motion`: all scroll and entrance effects off.
- Exit: verified at 360, 390, 768, 1024 and 1440 px widths.

### Phase 6 – Photos, QA and merge
- Integrate the 8 photos (webp 480w / 960w / 1600w, lazy-loaded, alt text) when supplied; otherwise keep
  the placeholders.
- Final QA: `tsc`, `vitest`, `next build`, Lighthouse spot check on `/destinations`.
- Review on the branch, then merge to `main`.

## Open points

- **Photos:** the repo has no adventure photos. Each of the 8 needs one (ideally 16:10, ~1600px wide),
  converted to the site's usual webp sizes (480w / 960w / 1600w). Build can start with duotone
  illustrated placeholders so the layout is not blocked.
- **Optional safety note:** a small line such as "Activities are subject to season, weather and
  availability". Only added if requested.
- **Wording:** keep the supplied copy exactly as written, apart from replacing emoji with icons.

## Source copy (verbatim)

**Adventure & Experiences – Go beyond the ordinary.**
From soaring above breathtaking landscapes to exploring hidden caves and rushing through mountain
rivers, discover a more adventurous side of Sri Lanka with Fine Lanka Tours.

**01. Helicopter Tours** – See Sri Lanka from a whole new perspective.
Take to the skies and experience Sri Lanka's spectacular landscapes from above. Fly over lush
mountains, golden coastlines, ancient landmarks and beautiful countryside for an unforgettable aerial
adventure.
Experience: Scenic aerial tour | Private experience | Luxury adventure

**02. Ella Zip Line** – Fly above the heart of Ella.
Soar across the magnificent Ella Valley on an exhilarating zip-line experience. With sweeping views of
green mountains, tea plantations and valleys below, this is adventure with a spectacular view.
Experience: Adrenaline | Mountain views | Ella

**03. Horse Riding** – Discover Sri Lanka at a different pace.
Ride through scenic countryside, tea plantations, forests or along beautiful beaches. Whether you're an
experienced rider or trying it for the first time, horse riding offers an intimate way to experience
Sri Lanka's landscapes.
Experience: Nature | Countryside | Beach riding

**04. Kayaking** – Paddle into the wild.
Glide through calm rivers, tranquil lagoons and lush mangrove waterways while discovering Sri Lanka
from the water. Kayaking is the perfect combination of adventure, nature and peaceful exploration.
Experience: Rivers | Lagoons | Mangroves | Nature

**05. White-Water Rafting** – Let the river lead the way.
Head into the adventure capital of Kitulgala and take on Sri Lanka's thrilling white-water rapids.
Surrounded by tropical rainforest, this is an exhilarating experience for adventure seekers and groups
alike.
Experience: Adrenaline | Rapids | Kitulgala | Rainforest

**06. Scuba Diving & Snorkelling** – Discover the world beneath the waves.
Dive into Sri Lanka's tropical waters and discover colourful marine life, coral reefs and fascinating
underwater landscapes. From relaxed snorkelling to deeper diving adventures, the island offers
unforgettable experiences beneath the surface.
Experience: Marine life | Coral reefs | Diving | Snorkelling

**07. ATV & Quad Bike Adventures** – Take the road less travelled.
Leave the usual tourist trails behind and take on rugged tracks, countryside paths and off-road terrain
on an exciting ATV adventure. Perfect for those who want to add a little more adrenaline to their
Sri Lankan journey.
Experience: Off-road | Adrenaline | Countryside | Adventure

**08. Cave Exploration** – Step into the hidden side of Sri Lanka.
Venture beyond the surface and explore Sri Lanka's fascinating caves and underground landscapes.
Discover natural rock formations, hidden passages and ancient environments while experiencing a side
of the island few travellers get to see.
Experience: Exploration | Nature | History | Adventure

**A Little More Adventure. A Lot More Sri Lanka.**
Whether you want to fly above the mountains, ride through the countryside, paddle through hidden
waterways or venture beneath the earth, Fine Lanka Tours brings you closer to the adventurous spirit of
the island.
Explore Sri Lanka. Experience More.
Fine Lanka Tours – A Journey Beyond Expectations.
