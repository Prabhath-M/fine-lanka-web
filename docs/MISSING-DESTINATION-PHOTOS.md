# Missing destination photos — route map popup

## The problem

36 of the 47 markers on the route atlas map (`public/data/route-atlas.json`)
have no dedicated photo in `locationDetails` (`components/route-map-preview.tsx`)
and fall back to a generic category image — most land on
`tour-cultural-historical.webp`, which shows Sigiriya-style rock/temple
scenery. 28 of those 36 are real destinations (not minor route-junction
"hub" markers), and are the ones worth sourcing a proper photo for.

## Why this doc exists instead of the photos themselves

This sandbox has no network access to image-hosting domains (its egress is
locked to a handful of code-package registries — npm, PyPI, GitHub, etc.) and
the web-fetch tool can't retrieve binary images from most photo sources
either (Wikimedia Commons, for instance, is blocked as cache-only). So the
actual file bytes can't be pulled in here — a human needs to download and
add them.

## License note

Wikimedia Commons files are almost always CC-BY-SA or CC-BY (occasionally
public domain) — **check each specific file's license panel before using
it** and keep the attribution text somewhere reasonable (an image credits
section, or in a code comment near where it's referenced). Pexels/Unsplash
links are typically royalty-free for commercial use with no attribution
required, but confirm on the specific image page.

## Verified candidates

- **Jaffna** — "Sunset seen from Jaffna fort" (CC-BY-SA-4.0, 3987×2658):
  https://commons.wikimedia.org/wiki/Category:Jaffna_fort
- **Meemure** — "Meemure Village Sri Lanka.jpg":
  https://commons.wikimedia.org/wiki/File:Meemure_Village_Sri_Lanka.jpg

## Everything else — starting points to browse

These are constructed Wikimedia Commons category URLs following standard
naming conventions — not individually verified, so a few may 404 or be
thin on photos (especially the smaller/more obscure spots, flagged below).
A Pexels search link is included for every one as a fallback.

| Marker id | Name | Wikimedia Commons category | Pexels fallback |
|---|---|---|---|
| point-pedro | Point Pedro | https://commons.wikimedia.org/wiki/Category:Point_Pedro | https://www.pexels.com/search/point%20pedro%20sri%20lanka/ |
| mullaittivu | Mullaittivu | https://commons.wikimedia.org/wiki/Category:Mullaitivu | https://www.pexels.com/search/mullaitivu%20sri%20lanka/ |
| mannar | Mannar | https://commons.wikimedia.org/wiki/Category:Mannar,_Sri_Lanka | https://www.pexels.com/search/mannar%20sri%20lanka/ |
| madhu-road-national-park | Madhu Road National Park | https://commons.wikimedia.org/wiki/Category:Madhu_Road_National_Park (⚠ likely thin — small park) | https://www.pexels.com/search/sri%20lanka%20national%20park/ |
| aukana | Aukana | https://commons.wikimedia.org/wiki/Category:Aukana_Buddha_statue | https://www.pexels.com/search/aukana%20buddha/ |
| trincomalee | Trincomalee | https://commons.wikimedia.org/wiki/Category:Trincomalee (try the Koneswaram Temple / Trincomalee Bay subcategories for scenic shots) | https://www.pexels.com/search/trincomalee/ |
| pigeon-island | Pigeon Island | https://commons.wikimedia.org/wiki/Category:Pigeon_Island_National_Park | https://www.pexels.com/search/pigeon%20island%20sri%20lanka/ |
| mihintale | Mihintale | https://commons.wikimedia.org/wiki/Category:Mihintale | https://www.pexels.com/search/mihintale/ |
| pasikudah | Pasikudah Beach | https://commons.wikimedia.org/wiki/Category:Pasikudah | https://www.pexels.com/search/pasikudah%20beach/ |
| kurunegala | Kurunegala | https://commons.wikimedia.org/wiki/Category:Kurunegala | https://www.pexels.com/search/kurunegala/ |
| alu-vihara | Alu Vihara | https://commons.wikimedia.org/wiki/Category:Aluvihare_Rock_Temple (note the more common spelling "Aluvihare") | https://www.pexels.com/search/aluvihare%20temple/ |
| batticaloa | Batticaloa | https://commons.wikimedia.org/wiki/Category:Batticaloa | https://www.pexels.com/search/batticaloa/ |
| bandaranaike-airport | Bandaranaike Int'l Airport | https://commons.wikimedia.org/wiki/Category:Bandaranaike_International_Airport | https://www.pexels.com/search/colombo%20airport/ |
| bentota | Bentota | https://commons.wikimedia.org/wiki/Category:Bentota | https://www.pexels.com/search/bentota%20beach/ |
| kataragama | Kataragama | https://commons.wikimedia.org/wiki/Category:Kataragama | https://www.pexels.com/search/kataragama%20temple/ |
| unawatuna | Unawatuna Beach | https://commons.wikimedia.org/wiki/Category:Unawatuna | https://www.pexels.com/search/unawatuna%20beach/ |
| tangalle | Tangalle | https://commons.wikimedia.org/wiki/Category:Tangalle | https://www.pexels.com/search/tangalle%20beach/ |
| negombo | Negombo | https://commons.wikimedia.org/wiki/Category:Negombo | https://www.pexels.com/search/negombo/ |
| kilinochchi | Kilinochchi | https://commons.wikimedia.org/wiki/Category:Kilinochchi (⚠ likely thin — mostly civil-war-era content, look for landscape/lagoon shots specifically) | https://www.pexels.com/search/sri%20lanka%20countryside/ |
| vavuniya | Vavuniya | https://commons.wikimedia.org/wiki/Category:Vavuniya | https://www.pexels.com/search/vavuniya/ |
| polonnaruwa | Polonnaruwa | https://commons.wikimedia.org/wiki/Category:Polonnaruwa | https://www.pexels.com/search/polonnaruwa/ |
| mahiyanganaya | Mahiyanganaya | https://commons.wikimedia.org/wiki/Category:Mahiyangana (note the shorter common spelling) | https://www.pexels.com/search/mahiyangana%20stupa/ |
| nallathanni | Nallathanni | ⚠ very obscure (near Horton Plains) — Commons category unlikely to exist, go straight to Pexels | https://www.pexels.com/search/horton%20plains%20sri%20lanka/ |
| haputale | Haputale | https://commons.wikimedia.org/wiki/Category:Haputale | https://www.pexels.com/search/haputale/ |
| tissamaharama | Tissamaharama | https://commons.wikimedia.org/wiki/Category:Tissamaharama | https://www.pexels.com/search/tissamaharama/ |
| kalpitiya | Kalpitiya | https://commons.wikimedia.org/wiki/Category:Kalpitiya | https://www.pexels.com/search/kalpitiya/ |

## Next steps once photos are added

1. Drop files into `public/images/tours-and-pricing/<marker-id>.webp`
   (convert to WebP first if the source isn't already) — matches the
   existing naming pattern for the images already in that folder.
2. Add an entry per marker to the `locationDetails` object in
   `components/route-map-preview.tsx`, following the existing pattern
   (`image` path + a short `description`).
3. Let Claude know the branch name — it'll generate the 480/960/1600w
   responsive variants, wire up `POPUP_IMAGE_WIDTHS`, verify, and open a PR
   (same pipeline as the rest of this work).
