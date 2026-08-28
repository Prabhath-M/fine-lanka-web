# Destinations Page — Local Patch

Copy the paths in this archive into the matching paths in your local Next.js source directory.

The patch is self-contained and uses only local `/images/...` asset paths. It does not require Manus File Storage, Manus environment variables, or the full-stack scaffolding. It includes the rudder-wheel-to-chart-door reveal and the accessible Island Carousel selected for destination discovery.

This revision also includes the auto-scroll reveal, enlarged carousel-stage treatment, professional coordinate markings, a custom charted-latitude instrument, and the original Sri Lankan heritage-inspired mural border. Copy the three new WebP files from `public/images/` with the updated source files.

Changed source files:

- `app/globals.css`
- `components/destinations-page.tsx`
- `components/destinations/chart-intro.tsx`
- `components/destinations/destination-card.tsx`
- `components/destinations/destination-marquee.tsx`

Added/required local assets under `public/images/`:

- `destinations-atlas-bg.png`
- `destinations-atlas-bg-mobile.png`
- `destinations-compass-mark.png`
- `destinations-route-line.png`
- `dest-card-frame.png`
- `serendib-brass-wheel.png`
- `frieze-divider.png`

After copying, run your normal local command, for example:

```bash
npm install
npm run dev
```
