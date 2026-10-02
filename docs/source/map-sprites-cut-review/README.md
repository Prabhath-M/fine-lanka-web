# Map sprite re-cut — review batch

Raw cutouts extracted from `sri-lanka-illustrations-clean-transparent-exact.png`
(the clean, label-free reference supplied for this branch), using the same
connected-component approach described in the original per-marker sprite
commits: detect each red ring, cluster nearby non-transparent artwork to its
nearest ring, crop with an alpha mask.

**Staging only** — nothing here is wired into `map-sprites-by-marker-id.json`,
`map-sprites-manifest.json` or any component yet. `_contact-sheet.png` is the
labeled grid for quick visual review.

## Status

**34 look solid and name-matched correctly:** alu-vihara, anuradhapura,
arugam-bay, bandaranaike-airport, batticaloa, bentota, chilaw, colombo,
dambulla, elephant-pass, ella, galle, jaffna, kandy, kataragama, kilinochchi,
madhu-road-national-park, mahiyanganaya, mannar, meemure, mihintale,
mullaittivu, nallathanni, nuwara-eliya, pasikudah, pigeon-island, polonnaruwa,
pulmoddai, ratnapura, sigiriya, tangalle, tissamaharama, unawatuna,
avissawella.

**1 known mismatch:** `pinnawala.png` is actually a parasailer-and-dolphins
illustration, not elephants — wrong for the elephant orphanage. The real
Pinnawala art is likely further from its ring than the matching radius
reached. Needs a manual re-cut or a wider search.

**12 came back blank** (no illustration found within reach of the ring):
badulla, haputale, kalpitiya, kurunegala, matale, mirissa, negombo,
point-pedro, trincomalee, vavuniya, habanara, [and avissawella/others as
re-checked]. Several of these already have real art in the live sprite set
(e.g. trincomalee), so this is most likely the matching radius missing the
art rather than the source lacking it.

## Next steps

- Confirm the 34 solid cuts against the live map.
- Decide whether to widen the matching radius for the 12 blanks or re-cut
  them by hand.
- Re-cut `pinnawala` correctly.
- Once confirmed, convert to `.webp`, move into `public/images/map-sprites/`,
  and update `map-sprites-by-marker-id.json` / `map-sprites-manifest.json`.
