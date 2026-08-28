# Fine Lanka Tours — Local Destinations Page Update

This archive contains the portable source for the updated Fine Lanka Tours website. It does **not** depend on Manus-managed storage URLs, Manus runtime helpers, or Manus-specific environment variables.

## What changed

Only the destinations page experience was refined. The existing ship rudder-wheel opening animation remains in place, then opens paired chart doors directly onto the destination experience. The destination card component and its ornate card design remain intact. The page now presents destinations through an accessible Island Carousel with arrow controls, swipe gestures, keyboard navigation, region filtering, a reduced-motion fallback, and an editorial atlas background.

The latest refinement scrolls smoothly to the carousel immediately after the chart doors resolve (except when reduced motion is enabled), enlarges the active destination card, and adds three optimized local WebP assets under `public/images/`: `destinations-carousel-stage-bg.webp`, `destinations-latitude-instrument-clean.webp`, and `destinations-heritage-mural-border.webp`. These provide the cartographic card-stage background, coordinate instrument, and Sri Lankan heritage-inspired frieze respectively.

## Local asset paths

The destinations page uses local assets under `public/images/`:

- `destinations-atlas-bg.png`
- `destinations-atlas-bg-mobile.png`
- `destinations-compass-mark.png`
- `destinations-route-line.png`
- `dest-card-frame.png`
- `serendib-brass-wheel.png`
- `frieze-divider.png`

No `/manus-storage/` URL is required by the destinations page.

## Apply the update

If you want the full source, extract this archive over a copy of your local project and preserve your own `.env*` files. Do not copy `node_modules/` or `.next/`; they are not included.

If you prefer a smaller patch, use the companion `destinations-page-update.zip`. Copy its files into the matching paths in your project, then run your normal local install and development commands.

```bash
npm install
npm run dev
```

The original project is a Next.js application. This local archive intentionally keeps that runtime independent of Manus-specific full-stack scaffolding. File Storage is not required to run the portable destinations-page update locally.
