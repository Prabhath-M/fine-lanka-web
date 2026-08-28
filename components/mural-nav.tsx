'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Hand-painted "living mural" flipbook that plays behind the nav bar.
 * The brief describes a stop-motion slideshow of Sigiriya-fresco frames
 * that morph from a Kandyan dancer/drummer into ocean waves and back.
 * We emulate that by cross-fading a set of illustrated banner frames.
 *
 * The frames are ultra-wide (4:1) and use `object-cover` so they always
 * fill the nav bar at any width/height — the animation stays reactive to
 * the container size.
 */
const FRAMES = [
  '/mural/frame-1.png',
  '/mural/frame-2.png',
  '/mural/frame-3.png',
  '/mural/frame-4.png',
  '/mural/frame-5.png',
  '/mural/frame-6.png',
]

// Time each frame is held before cross-fading to the next (ms).
const FRAME_DURATION = 1400

const NAV_ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'Destinations', href: '#' },
  { label: 'Journal', href: '#' },
  { label: 'Tours & Pricing', href: '#' },
  { label: 'Booking', href: '#' },
]

export function MuralNav() {
  const [active, setActive] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion.current) return

    // Preload frames so cross-fades don't flash a blank layer.
    FRAMES.forEach((src) => {
      const img = new Image()
      img.src = src
    })

    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % FRAMES.length)
    }, FRAME_DURATION)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header className="relative isolate overflow-hidden rounded-2xl border border-[var(--sl-brass)]/40 shadow-lg">
      {/* --- Flipbook background layers --- */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {FRAMES.map((src, i) => (
          <img
            key={src}
            src={src || '/placeholder.svg'}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
        {/* Ink wash + parchment grain for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--sl-ink-deep)]/85 via-[var(--sl-ink)]/55 to-[var(--sl-ink-deep)]/85" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--sl-ink-deep)]/70 to-transparent" />
      </div>

      {/* --- Nav content --- */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 text-[var(--sl-text-on-dark)]">
          <span
            className="text-xl text-[var(--sl-gold)]"
            aria-hidden="true"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
          >
            &#10022;
          </span>
          <span
            className="font-serif text-lg font-semibold tracking-wide md:text-xl"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.55)' }}
          >
            Ceylon Heritage
          </span>
        </a>

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors ${
                    i === 0
                      ? 'text-[var(--sl-gold)]'
                      : 'text-[var(--sl-text-on-dark-muted)] hover:text-[var(--sl-text-on-dark)]'
                  }`}
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span
            className="hidden font-sans text-sm text-[var(--sl-text-on-dark-muted)] lg:inline"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            +94 11 234 5678
          </span>
          <button
            type="button"
            className="rounded-full border border-[var(--sl-brass-light)]/60 bg-[var(--sl-brass)] px-4 py-2 font-sans text-sm font-semibold text-[var(--sl-ink-deep)] shadow-md transition-transform hover:scale-[1.03] hover:bg-[var(--sl-brass-light)]"
          >
            Plan a Journey
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--sl-brass-light)]/50 text-[var(--sl-text-on-dark)] md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className="absolute left-0 top-0 h-0.5 w-full bg-current transition-transform"
                style={mobileOpen ? { transform: 'translateY(5px) rotate(45deg)' } : undefined}
              />
              <span
                className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current transition-opacity"
                style={mobileOpen ? { opacity: 0 } : undefined}
              />
              <span
                className="absolute bottom-0 left-0 h-0.5 w-full bg-current transition-transform"
                style={mobileOpen ? { transform: 'translateY(-5px) rotate(-45deg)' } : undefined}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-[var(--sl-brass)]/30 bg-[var(--sl-ink-deep)]/90 px-5 py-3 backdrop-blur-sm md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 font-sans text-sm ${
                    i === 0
                      ? 'text-[var(--sl-gold)]'
                      : 'text-[var(--sl-text-on-dark-muted)] hover:text-[var(--sl-text-on-dark)]'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
