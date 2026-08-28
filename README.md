# Fine Lanka Tours

A Next.js marketing/booking site for Fine Lanka Tours — a Sri Lanka travel
company. Pages: home, destinations, tours & pricing, booking, about, and
journal.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- pnpm (this project's package manager — see below)

## Getting started

This project uses **pnpm**. Install Node.js 20+ and pnpm, then:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
pnpm build
pnpm start
```

## Project structure

- `app/` — routes (App Router)
- `components/` — page and shared UI components
- `lib/` — data and utilities
- `public/` — static assets (images, mural art, videos)

## Status

This project is pre-launch. See the project's pre-launch checklist for the
current list of outstanding work (image optimization, SEO metadata, form
backends, security headers, dependency updates, etc.).

## Historical notes

`docs/archive/` holds older planning docs, patch notes, and README variants
from earlier development rounds. They're kept for reference but don't
describe the current state of the project — this file does.
