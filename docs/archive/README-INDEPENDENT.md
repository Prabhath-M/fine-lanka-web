# Fine Lanka Tours — Independent Project Package

This is a standalone Next.js project. It does not rely on workspace-hosted images, APIs, or deployment services.

## Run locally

Install Node.js 20 or later, open a terminal in this folder, and run:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

To create a production build, run:

```bash
npm run build
npm run start
```

## Typed intro implementation

The site’s visual hero has been restored. The only new visual behavior is a first-load, full-screen black introduction that types the following copy before fading out to the existing hero video:

> THIS IS SRI LANKA.  
> WE SHOW THE ISLAND TO YOU.

| File | Purpose |
| --- | --- |
| `components/home/typed-opening.tsx` | The isolated CSS-driven typed intro markup. |
| `components/home-page.tsx` | Mounts the intro immediately before the existing hero. |
| `app/globals.css` | Adds only the typed intro styles and retains the requested 6rem header-height values. |

The existing hero component, hero video reference, hero text, calls to action, navigation, all other pages, and the rest of the site have not been visually redesigned.

## Accessibility and motion

The typed intro respects the visitor’s `prefers-reduced-motion` setting: the full wording is shown without the character-by-character animation and clears promptly to the existing hero.
