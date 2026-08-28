'use client'

import { useRef, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TourPickerCard } from '@/components/tours/tour-picker-card'
import type { TourPackage } from '@/lib/tours-data'

/** Small picker tiles arranged as a horizontal stacked deck — the same
 *  coverflow language as the destinations page's Island Carousel (see
 *  components/destinations/destination-marquee.tsx: relativePosition +
 *  the --island-x/--island-scale/--island-rotate/--island-opacity
 *  transform recipe). The active tile sits centred at full size; its
 *  neighbours fan out behind it to left and right, each layer further
 *  out a little smaller, dimmer and rotated. Unlike the destinations
 *  carousel this one is a controlled component — `activeSlug` and
 *  `onSelect` are owned by the parent page, since the same pick also
 *  drives the big featured TourCard above it.
 *
 *  Navigation: drag/swipe, the keyboard (left/right arrows), the dots
 *  below, or an actual horizontal scroll gesture — a trackpad swipe or
 *  shift+wheel is read from onWheel and stepped the same as a drag. */

const DRAG_THRESHOLD = 42
const WHEEL_THRESHOLD = 60

function relativePosition(index: number, activeIndex: number, length: number) {
  let distance = index - activeIndex
  if (distance > length / 2) distance -= length
  if (distance < -length / 2) distance += length
  return distance
}

export function TourPickerCarousel({
  tours,
  activeSlug,
  onSelect,
}: {
  tours: TourPackage[]
  activeSlug: string
  onSelect: (slug: string) => void
}) {
  const pointerStart = useRef<number | null>(null)
  const wheelAccum = useRef(0)

  const activeIndex = Math.max(
    tours.findIndex((t) => t.slug === activeSlug),
    0,
  )

  const go = (direction: number) => {
    const length = tours.length
    const next = ((activeIndex + direction) % length + length) % length
    onSelect(tours[next].slug)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return
    const delta = event.clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(delta) < DRAG_THRESHOLD) return
    go(delta > 0 ? -1 : 1)
  }

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    // Trackpads (and shift+wheel on a mouse) report horizontal intent as
    // deltaX. Accumulate until it crosses a threshold, then step exactly
    // one card, so a single scroll gesture doesn't fly through the deck.
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : 0
    if (!delta) return
    event.preventDefault()
    wheelAccum.current += delta
    if (Math.abs(wheelAccum.current) > WHEEL_THRESHOLD) {
      go(wheelAccum.current > 0 ? 1 : -1)
      wheelAccum.current = 0
    }
  }

  if (!tours.length) return null

  return (
    <div className="tour-picker-coverflow-wrap">
      <p className="tour-shelf-hint">Drag, scroll, or use the handles to browse the deck.</p>
      <button
        type="button"
        className="tour-picker-coverflow-handle tour-picker-coverflow-handle--prev"
        onClick={() => go(-1)}
        aria-label="Show previous route"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="tour-picker-coverflow-handle tour-picker-coverflow-handle--next"
        onClick={() => go(1)}
        aria-label="Show next route"
      >
        <ChevronRight aria-hidden="true" />
      </button>
      <div
        className="tour-picker-coverflow"
        role="listbox"
        aria-label="Browse other routes"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerStart.current = null
        }}
        onWheel={onWheel}
      >
        {tours.map((tour, index) => {
          const distance = relativePosition(index, activeIndex, tours.length)
          const absoluteDistance = Math.abs(distance)
          const direction = Math.sign(distance) || 1
          const visible = absoluteDistance <= 2
          const x = distance === 0 ? 0 : direction * (absoluteDistance === 1 ? 58 : 102)
          const scale = distance === 0 ? 1 : absoluteDistance === 1 ? 0.86 : 0.74
          const rotate = distance === 0 ? 0 : direction * (absoluteDistance === 1 ? 4 : 7)
          const opacity = distance === 0 ? 1 : absoluteDistance === 1 ? 0.78 : 0.42
          const style = {
            '--tpc-x': `${x}%`,
            '--tpc-scale': scale,
            '--tpc-rotate': `${rotate}deg`,
            '--tpc-opacity': opacity,
            '--tpc-z': 10 - absoluteDistance,
          } as CSSProperties

          return (
            <div
              key={tour.slug}
              className={`tour-picker-coverflow-slot${distance === 0 ? ' is-active' : ''}`}
              style={style}
              aria-hidden={!visible}
              inert={distance !== 0 ? true : undefined}
            >
              <TourPickerCard tour={tour} active={distance === 0} onSelect={() => onSelect(tour.slug)} />
            </div>
          )
        })}
      </div>
      {tours.length > 1 && (
        <div className="tour-picker-coverflow-dots" aria-label="Choose a route">
          {tours.map((tour, index) => (
            <button
              type="button"
              key={tour.slug}
              onClick={() => onSelect(tour.slug)}
              className={index === activeIndex ? 'is-active' : undefined}
              aria-label={`Show ${tour.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
