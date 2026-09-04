'use client'

import { forwardRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { TourPackage } from '@/lib/tours-data'

/** Small, detail-free picker tile used under the one big featured
 *  TourCard — click one to make it the featured tour. Visual language
 *  matches tour-card.tsx (same --tc-* variables, same photographic
 *  category images), just compressed to an image + title + nights so
 *  the row reads as a quick way to browse, not a second copy of the
 *  full card. Styling lives alongside the big card's rules, in the
 *  "TOURS & PRICING — CARVED IVORY CARD" block in globals.css.
 *
 *  Arranged by the parent as leaning "field notebooks" resting on a
 *  shelf (see .tour-picker-shelf in globals.css): each tile gets a
 *  slight, deterministic tilt from `index`, and forwards its ref so
 *  the parent's scroll listener can tell which one is centred under
 *  the shelf and promote it to the featured card above. */
export const TourPickerCard = forwardRef<
  HTMLButtonElement,
  {
    tour: TourPackage
    index: number
    active: boolean
    onSelect: () => void
  }
>(function TourPickerCard({ tour, index, active, onSelect }, ref) {
  const tilt = TOUR_PICKER_TILTS[index % TOUR_PICKER_TILTS.length]

  return (
    <button
      ref={ref}
      type="button"
      data-slug={tour.slug}
      onClick={onSelect}
      aria-pressed={active}
      style={{ '--tc-tilt': tilt } as React.CSSProperties}
      className={`tc-focus tour-picker-card group relative shrink-0 overflow-hidden rounded-2xl text-left transition-all duration-500 ease-[var(--tc-ease-out)] active:scale-[0.98] ${
        active ? 'tour-picker-card--active' : ''
      }`}
    >
      <span className="tour-picker-spine" aria-hidden="true" />
      <img
        src={`/images/tour-${tour.category}.webp`}
        alt=""
        aria-hidden="true"
        className="h-40 w-full object-cover transition-transform duration-500 ease-[var(--tc-ease-out)] group-hover:scale-[1.04] sm:h-44"
        width={1024}
        height={1024}
        loading="lazy"
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(5,39,33,0.8)_100%)]" />
      <span className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3 text-white">
        <span>
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--tc-brass)]">
            {tour.nights} nights
          </span>
          <span className="tc-display mt-1 block text-xl leading-none">{tour.name}</span>
        </span>
        <span
          className={`mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            active ? 'bg-[var(--tc-brass)] text-[var(--tc-monsoon-deep)]' : 'border border-white/40 bg-white/10 text-white'
          }`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </span>
    </button>
  )
})

/** Small, non-repeating set of rotation values so neighbouring tiles
 *  never land on the same lean — cycled by index rather than random so
 *  server and client render identically. */
const TOUR_PICKER_TILTS = ['-3deg', '2.5deg', '-1.5deg', '3deg', '-2deg', '1.5deg']
