'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'
import {
  ADVENTURE_CLOSING,
  ADVENTURE_INTRO,
  ADVENTURE_ZONES,
  adventureCountLabel,
  adventuresForZone,
  type AdventureZone,
} from '@/lib/adventure-data'
import { AdventurePanel } from '@/components/destinations/adventure-panel'

/**
 * "Adventure & Experiences" -- the "Sky to Underground" section of the
 * Destinations page. See docs/DESTINATIONS-ADVENTURE-SECTION-PLAN.md.
 *
 * Phase 3 adds the zone filter. The altitude gauge / background shift
 * (phase 4) builds on the hooks left here:
 * `.adventure-sky` (scroll-linked background) and `.adventure-spine` (gauge).
 */
export function AdventureSection() {
  const [zone, setZone] = useState<AdventureZone | 'all'>('all')
  const visible = adventuresForZone(zone)
  const options: { id: AdventureZone | 'all'; label: string }[] = [{ id: 'all', label: 'All' }, ...ADVENTURE_ZONES]

  return (
    <section id="adventure" className="adventure" aria-labelledby="adventure-title">
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
          <ol className="adventure-list">
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
