# Typography refinement — phased plan

Follow-up to #97 ("replace boxed/monospace font with rounded font, bump
small font sizes site-wide"). That PR swapped `--font-mono` from Space
Mono to Nunito and bumped every sub-1rem size by 2.5px, but small label
text still reads as boxed, and several places are still too small or too
faint to read comfortably.

## Why #97 didn't fix the "boxed" look

Swapping the font family was only half the cause. **93 of the 125
`--font-mono` rules in `app/globals.css` also carry
`text-transform: uppercase` plus wide `letter-spacing` (0.05em–0.28em).**
All-caps + wide tracking is what actually produces the rigid,
stencil/code-block appearance — it reads as boxed in *any* typeface,
rounded or not. Nunito softened the letterforms but left the
uppercase + tracking structure untouched, so the overall impression
barely changed.

So the fix is per-rule (spacing, case, weight, size), not another
single-variable swap. Hence phasing.

## Scope, measured

| Thing | Count |
|---|---|
| `--font-mono` rules in `app/globals.css` | 125 |
| …of those, also `text-transform: uppercase` (the boxed set) | 93 |
| `--font-mono` rules in `route-map-preview.module.css` | 14 |
| `app/globals.css` total lines | 13,826 |

Boxed rules by area — these define the session boundaries:

| Area | Rules |
|---|---|
| Destinations | 25 |
| Home | 22 |
| Journal | 11 |
| Tours & Pricing | 11 |
| Shared buttons/labels (`.btn`, `.sl-btn`, `.section-label`) | 5 |
| Header/nav | 3 |
| Footer | 3 |
| Booking/contact | 1 |
| Other/uncategorised | 12 |

### Two findings worth acting on

1. **`app/fresco-nav.css` (479 lines) is dead code.** It defines a full
   `.fresco-*` nav — bar, links, dropdown, brand — but is never
   imported, and none of its classes appear in any component. It was
   also skipped by #97 (its sizes still end in round decimals like
   `0.55rem`, versus #97's telltale `0.776rem`). Don't spend a session
   restyling a nav nobody sees. The live nav is `.sl-nav-*` in
   `globals.css`. Delete it in Phase 0, or leave it and note it — but
   don't style it.

2. **The founding year is wrong and duplicated.** `lib/site-data.ts`
   has `foundedYear: 2011`; the company started in **2015**.
   `site-footer.tsx`, `home/intro.tsx`, `home/hero.tsx` and
   `app/layout.tsx` all read it correctly from `SITE.foundedYear`, but
   `components/home/features.tsx:47` hardcodes `Since 2011 · Sri Lanka`,
   bypassing the shared value. Note that `layout.tsx` feeds it to
   `foundingDate` in the site's structured data, so this is an SEO
   correctness issue too, not only a copy one.

---

## Phase 0 — Quick wins (small, safe, ship first)

Independent of the typography work; no visual risk worth staging.

- [ ] `lib/site-data.ts`: `foundedYear: 2011` → `2015`.
- [ ] `components/home/features.tsx:47`: replace the hardcoded
      `Since 2011 · Sri Lanka` with the shared `SITE.foundedYear`
      value, matching how the other four usages do it, so this can't
      drift again.
- [ ] Verify the change reaches all five surfaces, including the
      JSON-LD `foundingDate`.
- [ ] Decide on `app/fresco-nav.css`: delete as dead code, or keep with
      a comment saying it's unused. (Deleting is cleaner; it's 479
      lines of confusion for the next person.)

## Phase 1 — Agree the type rules on one section

**Don't start with a sweep.** Pick `.why-professional-*` in
`app/globals.css` (~lines 8140–8300) — it's the section that prompted
this, and it contains one of each problem type:

| Element | Selector | Now | Problem |
|---|---|---|---|
| "Since 2011 · Sri Lanka" | `.why-professional-stamp small` | `0.616rem`, uppercase, `0.1em` | Too small **and** boxed |
| "Our travel standard" | `.why-professional-promises-head` | `0.726rem`, uppercase, wide tracking | Boxed |
| "A local standard for better travel" | `.why-professional-eyebrow` | `0.776rem`, uppercase, `0.15em` | Boxed |
| "We craft considered, made-to-measure…" | `.why-professional-intro > p:last-child` | `1rem`, body font | Not boxed — just low contrast (`rgba(33,70,64,0.76)`) and light |

Note the fourth one is a **different problem**: it's body copy in
`--font-inter`, not a `--font-mono` label. It doesn't need the curved
font or de-boxing — it needs size/weight/contrast. Keep the two issues
separate or the sweep will over-apply.

Decide here, then write the decisions into this doc as the rule other
phases follow:

- [ ] How far to de-box: drop `text-transform: uppercase` entirely, or
      keep caps and cut `letter-spacing` to ~`0.04em`? (Dropping caps
      is the softer, more "curved" result; keeping caps preserves the
      label/eyebrow hierarchy. This is a taste call — get it looked at
      on a real screen before propagating.)
- [ ] Whether small labels move to `--font-display` (Fraunces, the
      curved serif used by big headings) or stay Nunito. Fraunces at
      ~0.8rem can get spindly; check before committing.
- [ ] A minimum readable size floor (suggest ~0.8rem / 12.8px) and a
      weight floor for anything below 0.9rem (suggest 600).
- [ ] A minimum contrast for muted body text — several are at 0.65–0.76
      alpha, which is where "not visible enough" comes from.
- [ ] Ship Phase 1 alone and **look at it deployed** before Phase 2.

## Phase 2 — Shared primitives (highest blast radius)

`.btn`, `.sl-btn`, `.section-label`, `.dropdown-heading span`,
`.intro-professional-assurance-label`, `.intro-compact-method-label` —
5–6 rules that appear on **every page**. Small count, widest reach, so
they get their own phase.

- [ ] Apply the Phase 1 rules.
- [ ] Buttons have fixed padding — check labels don't wrap or overflow
      at larger sizes, especially the nav CTA and mobile widths.
- [ ] Check every page after, not just the homepage.

## Phase 3 — Header/nav

Explicitly requested: nav bar buttons need to be larger.

- [ ] `.sl-nav-links a` — `0.876rem` → larger (~`0.95rem`), cut
      `letter-spacing: 0.12em`.
- [ ] `.sl-nav-cta` (`0.876rem`) to match.
- [ ] `.sl-nav-brand-text small` (`0.736rem`, `0.18em`).
- [ ] The nav is horizontal with a fixed bar height: verify links don't
      collide or wrap at ~860px and below, where the layout switches.
- [ ] Ignore `app/fresco-nav.css` (dead — see Phase 0).

## Phase 4 — Home (22 rules)

- [ ] `.why-professional-*` should already be done in Phase 1; sweep the
      rest (hero, intro, explore, process, features).
- [ ] Hero text sits over video/imagery — contrast matters more here
      than anywhere else.

## Phase 5 — Destinations (25 rules, largest)

- [ ] `.dest-*`, `.chart-*`, `.island-*`, `.dest-marquee-*`.
- [ ] Several sit inside fixed-size cards, the rudder control, and the
      animated chart intro. Highest risk of cramped/overflowing text at
      larger sizes — budget the most checking time here.
- [ ] `.chart-ritual-footer` / `.chart-ritual-kicker` use px
      (`11.5px`, `12.5px`) rather than rem — convert while in there.

## Phase 6 — Journal (11 rules)

- [ ] `.journal-*`, `.chronicle-*`, `.reader-*`, `.portal-*`.
- [ ] The journal has its own opening animation and a threshold/kicker
      sequence — confirm text changes don't disturb animation timing or
      measured element heights.

## Phase 7 — Tours & Pricing (11 rules + module CSS)

- [ ] `.tour-*`, `.itinerary-*`, `.filter-bar button`,
      `.tour-nights-badge`.
- [ ] `components/route-map-preview.module.css` — 14 `--font-mono`
      rules, 4 uppercase. Separate file, easy to miss.
- [ ] `components/tours/tour-card.tsx` mixes Tailwind utility sizes with
      the plain CSS; #97 hand-converted those to arbitrary values, so
      check both places when changing tour card text.
- [ ] Badges/pills here are the tightest fixed-width elements on the
      site — check overflow carefully.

## Phase 8 — Footer, booking/contact, leftovers

- [ ] Footer (3), booking/contact (1), and the ~12 uncategorised rules.
- [ ] Final pass: grep for remaining `text-transform: uppercase` with
      wide `letter-spacing` and confirm each was either changed or
      deliberately kept.

---

## Working notes

- **One phase per session, one PR per phase.** Each is independently
  revertible; a bad sweep doesn't take the others down with it.
- **`tsc` and `vitest` prove nothing here.** They passed on #97 and the
  visual problem shipped anyway. These are CSS-only changes — automated
  checks can't catch cramped fixed-height elements, badge overflow, or
  changed wrapping. Every phase needs eyes on the deployed result.
- **Check mobile explicitly.** Most of these rules have `clamp()`
  responsive sizes; #97 bumped both bounds and wrapped the `vw` term in
  `calc(… + 2.5px)`. Larger minimums bite hardest on narrow screens.
- **Don't re-sweep by variable.** The instinct is another global
  find-and-replace like #97; that's what produced a change which passed
  every check and still missed the point. Per-rule, per-section, looked
  at.
- Remember the deploy gap: merging to `main` builds to
  `deploy/production`, but cPanel still needs a manual pull + "Deploy
  HEAD Commit" + restart before anything is actually live.
