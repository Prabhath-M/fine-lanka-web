'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons'
import {
  ADVENTURE_CLOSING,
  ADVENTURE_INTRO,
  ADVENTURE_STAGES,
  ADVENTURE_ZONES,
  adventureStage,
  adventureCountLabel,
  adventuresForZone,
  type AdventureStage,
  type AdventureZone,
} from '@/lib/adventure-data'
import { AdventurePanel } from '@/components/destinations/adventure-panel'

/**
 * "Adventure & Experiences" -- the "Sky to Underground" section of the
 * Destinations page. See docs/DESTINATIONS-ADVENTURE-SECTION-PLAN.md.
 *
 * Phase 3 added the zone filter. Phase 4 added the altitude gauge, the
 * scroll-linked background shift (`data-stage` on the section drives the CSS)
 * and the staggered panel entrance. One IntersectionObserver handles both the
 * active stage and the entrance; it never touches layout, so nothing shifts.
 */
export function AdventureSection() {
  const [zone, setZone] = useState<AdventureZone | 'all'>('all')
  const visible = adventuresForZone(zone)
  const sectionRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState<AdventureStage>('sky')
  const [motion, setMotion] = useState(false)
  const stagesShown = new Set(visible.map(adventureStage))
  const options: { id: AdventureZone | 'all'; label: string }[] = [{ id: 'all', label: 'All' }, ...ADVENTURE_ZONES]

  // Entrance effects are enabled only once JS is running, so the server HTML
  // (and no-JS visitors) always see every panel.
  useEffect(() => {
    setMotion(true)
  }, [])

  // Re-run on every filter change: the visible panels are different elements.
  useEffect(() => {
    const root = sectionRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.adventure-panel'))
    if (panels.length === 0) return

    const first = panels[0].dataset.stage as AdventureStage | undefined
    if (first) setStage(first)

    // Entrance: reveal each panel once, as it comes into view.
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          reveal.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    // Gauge: whichever panel crosses the middle band of the viewport is current.
    const track = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const next = (entry.target as HTMLElement).dataset.stage as AdventureStage | undefined
          if (next) setStage(next)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    for (const panel of panels) {
      reveal.observe(panel)
      track.observe(panel)
    }
    return () => {
      reveal.disconnect()
      track.disconnect()
    }
  }, [zone])

  return (
    <section
      id="adventure"
      ref={sectionRef}
      className="adventure"
      aria-labelledby="adventure-title"
      data-stage={stage}
      data-motion={motion ? 'on' : 'off'}
    >
      <div className="adventure-tint" aria-hidden="true" />
      <div className="adventure-sky" aria-hidden="true" />

      <div className="container">
        <header className="adventure-head">
          <p className="dest-section-kicker">{ADVENTURE_INTRO.kicker}</p>
          <h2 id="adventure-title">{ADVENTURE_INTRO.title}</h2>
          <p className="adventure-lede">{ADVENTURE_INTRO.lede}</p>
        </header>

        <div className="adventure-filter">
          <div className="filter-bar" role="group" aria-label="Filter experiences by zone">
            {options.map((option) => (
              <button
                type="button"
                key={option.id}
                data-zone={option.id}
                className={zone === option.id ? 'is-active' : undefined}
                aria-pressed={zone === option.id}
                onClick={() => setZone(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="adventure-count" role="status" aria-live="polite">
            {adventureCountLabel(visible.length, zone)}
          </p>
        </div>

        <div className="adventure-track">
          <span className="adventure-spine" aria-hidden="true" />
          <div className="adventure-gauge" aria-hidden="true">
            <ol className="adventure-gauge-scale">
              {ADVENTURE_STAGES.map((entry) => (
                <li
                  key={entry.id}
                  data-stage={entry.id}
                  className={[
                    entry.id === stage ? 'is-active' : '',
                    stagesShown.has(entry.id) ? '' : 'is-dim',
                  ]
                    .filter(Boolean)
                    .join(' ') || undefined}
                >
                  <span className="adventure-gauge-tick" />
                  {entry.label}
                </li>
              ))}
            </ol>
          </div>
          <ol className="adventure-list" role="list">
            {visible.map((adventure) => (
              <AdventurePanel key={adventure.slug} adventure={adventure} />
            ))}
          </ol>
        </div>

        <div className="adventure-closing">
          <h3>{ADVENTURE_CLOSING.title}</h3>
          <p>{ADVENTURE_CLOSING.body}</p>
          <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
            <Icon name="pin" className="btn-icon" />
            Plan an adventure
          </button>
          <p className="adventure-signoff">{ADVENTURE_CLOSING.signoff}</p>
          <p className="adventure-brandline">{ADVENTURE_CLOSING.brandLine}</p>
        </div>
      </div>
    </section>
  )
}
