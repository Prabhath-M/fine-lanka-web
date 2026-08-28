# Typewriter intro fix — changed files only

## What was wrong
On narrow/mobile screens, the second line of the typing intro
("WE SHOW THE ISLAND TO YOU.") could wrap mid-word — e.g. splitting
into "...TO Y" / "OU." — because each character was rendered as its
own `display: inline-block` span (needed for the sweeping cursor-box
effect), and browsers treat adjacent inline-block boxes as valid
line-break points even with no whitespace between them.

## The fix
- `components/home/typed-opening.tsx`: character spans belonging to
  the same word are now grouped inside one wrapper span, so the line
  can only break between words, never inside one. Per-character
  timing/delay math is unchanged.
- `app/globals.css`: added a small `.typed-opening-word` rule
  (`display: inline-block; white-space: nowrap;`) right before the
  existing `.typed-opening-character-slot` rule (around line 6400).

## Files in this package
- `components/home/typed-opening.tsx` — full updated file, drop-in replacement.
- `app/globals.css` — full file (only the ~4 lines above were added; see the .patch for the exact diff).
- `typed-opening.tsx.patch` — unified diff of the component change.
- `globals.css.patch` — unified diff of the CSS change (context around line 6400).

Nothing else in the project was touched.
