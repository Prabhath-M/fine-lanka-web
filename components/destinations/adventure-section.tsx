import { Icon } from '@/components/icons'
import { ADVENTURES, ADVENTURE_CLOSING, ADVENTURE_INTRO } from '@/lib/adventure-data'
import { AdventurePanel } from '@/components/destinations/adventure-panel'

/**
 * "Adventure & Experiences" -- the "Sky to Underground" section of the
 * Destinations page. See docs/DESTINATIONS-ADVENTURE-SECTION-PLAN.md.
 *
 * Phase 2: static structure only. The zone filter (phase 3) and the altitude
 * gauge / background shift (phase 4) build on the hooks left here:
 * `.adventure-sky` (scroll-linked background) and `.adventure-spine` (gauge).
 */
export function AdventureSection() {
  return (
    <section id="adventure" className="adventure" aria-labelledby="adventure-title">
      <div className="adventure-sky" aria-hidden="true" />

      <div className="container">
        <header className="adventure-head">
          <p className="dest-section-kicker">{ADVENTURE_INTRO.kicker}</p>
          <h2 id="adventure-title">{ADVENTURE_INTRO.title}</h2>
          <p className="adventure-lede">{ADVENTURE_INTRO.lede}</p>
        </header>

        <div className="adventure-track">
          <span className="adventure-spine" aria-hidden="true" />
          <ol className="adventure-list">
            {ADVENTURES.map((adventure) => (
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
