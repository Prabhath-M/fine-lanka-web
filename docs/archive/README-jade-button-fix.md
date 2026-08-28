# Fine Lanka — Tours & Pricing redesign + jade button fix

Two files here. Drop them back into your project at the same paths,
overwriting the originals:

- `components/tours/tour-card.tsx` → `components/tours/tour-card.tsx`
- `globals.css` → `app/globals.css`

## This round's changes

**Sigiriya fresco shade on the tour cards** — `tour-card-body` now carries
a very faint, low-opacity (16%) rendering of `jade-fresco.png` — the same
maiden-and-lotus rock-art image already used inside your jade buttons — as
a soft radial-vignette texture behind the card copy, instead of a flat
paper colour. It's tuned low enough and masked into one soft patch (not a
picture spanning the whole card) so it never fights with the route/blurb
text sitting on top of it — it just reads as a quiet, intentional art
motif tying the cards back to the same cultural imagery as the buttons.

**"Plan a Journey" (header) and "Plot a route" / "Plot my journey"
(destinations page)** — all three were using the right `btn-uikit-primary`
class already, but the header and the destinations page each had their own
page-scoped override that flattened it to a plain solid-colour button
(plain teal in the header, plain sea-glass on destinations), losing the
jade-glass-and-gold-frame look the same button has in the hero, the tours
CTA, and the itinerary modal. Added one final override that restores the
real jade background/border/shadow/hover on all three, while leaving each
page's own button sizing (the header's compact nav height, its narrow-
screen icon-only mode) untouched.

Everything from the previous round (filter tabs, card layout/buttons) is
unchanged — this just adds to that same "TOURS & PRICING — REDESIGN" /
new final block at the end of the file.
