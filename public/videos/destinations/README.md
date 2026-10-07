# Destination videos go here

Both the destinations-grid cards (`components/destinations/destination-card.tsx`)
and the homepage showcase panel (`components/home/explore-section.tsx`) load a
short muted/looping clip per destination from this folder, named off the same
slug used for map pins:

```
sigiriya.mp4
ella-and-the-hill-country.mp4
mirissa-and-the-south-coast.mp4
yala-national-park.mp4
galle-fort.mp4
kandy.mp4
anuradhapura.mp4
nuwara-eliya.mp4
udawalawe-national-park.mp4
trincomalee.mp4
arugam-bay.mp4
colombo.mp4
negombo.mp4
```

Each destination card now requests its matching clip as a muted, looping,
inline autoplay video. `ambient-atlas-loop.mp4` is a supplied, non-location-
specific local fallback, so autoplay remains functional before destination-
specific footage is added. Drop the matching file in here per destination
(recommend: 6–15s, no audio track needed since playback is always muted, ideally
cropped close to a 3:4 portrait frame so `object-fit: cover` doesn't crop off
anything important) and the browser will prefer it over the fallback without
further code changes. Users with reduced-motion preferences retain the poster-
frame fallback.

`lib/utils.ts`'s `slugify()` is the single source of truth for turning a
destination's `name` into its slug/filename — if a destination's name ever
changes, its expected filename here changes with it.
