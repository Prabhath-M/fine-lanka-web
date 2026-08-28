import { Icon } from '@/components/icons'
import { FEATURES } from '@/lib/site-data'

/**
 * Design reminder: the Why Fine Lanka section is a premium travel-standard
 * statement—editorial restraint, grounded local confidence, and a single
 * clear visual hierarchy. Avoid ornamental clutter or a generic feature grid.
 */
const SUPPORTING_MOMENTS = [
  {
    image: '/images/fine-lanka-arugam-bay-surf.jpg',
    alt: 'Aerial view of the Arugam Bay shoreline and surf craft',
    place: 'Arugam Bay',
    theme: 'East coast ease',
  },
  {
    image: '/images/fine-lanka-kandyan-dancers.jpg',
    alt: 'A Sri Lankan Kandyan dancer in traditional costume',
    place: 'Kandy',
    theme: 'Culture in motion',
  },
]

export function Features() {
  return (
    <section className="features why-professional" id="why">
      <div className="why-professional-backdrop" aria-hidden="true" />
      <div className="container why-professional-shell">
        <header className="why-professional-header">
          <div className="why-professional-intro">
            <p className="section-label">Why Fine Lanka</p>
            <p className="why-professional-eyebrow">A local standard for better travel</p>
            <h2>Travel Sri Lanka with the people who know how the island moves.</h2>
            <p>
              We craft considered, made-to-measure journeys shaped by local insight — from the
              very first conversation to the moment you board your flight home.
            </p>
          </div>
          <aside className="why-professional-stamp" aria-label="Fine Lanka local travel standard">
            <span>Fine Lanka</span>
            <strong>Local knowledge,<br />held personally.</strong>
            <i aria-hidden="true" />
            <small>Since 2011 · Sri Lanka</small>
          </aside>
        </header>

        <div className="why-professional-main">
          <figure className="why-professional-hero">
            <img
              src="/images/fine-lanka-esala-perahera.jpg"
              alt="Illuminated elephant procession at Kandy Esala Perahera"
            />
            <figcaption>
              <span>For the moments you cannot plan from afar</span>
              <small>Kandy Esala Perahera</small>
            </figcaption>
          </figure>

          <div className="why-professional-promises">
            <div className="why-professional-promises-head">
              <span>Our travel standard</span>
              <i aria-hidden="true" />
            </div>
            {FEATURES.map((feature, index) => (
              <article className="why-professional-promise" key={feature.title}>
                <span className="why-professional-number">0{index + 1}</span>
                <span className="why-professional-icon" aria-hidden="true">
                  <Icon name={feature.icon || 'compass'} />
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className="why-professional-footer">
          <p>
            Every route is built around the places, pace and people that matter most to you —
            never a fixed itinerary, never an impersonal handover.
          </p>
          <div className="why-professional-moments" aria-label="Sri Lankan travel moments">
            {SUPPORTING_MOMENTS.map((moment) => (
              <figure key={moment.place}>
                <img src={moment.image} alt={moment.alt} />
                <figcaption>
                  <span>{moment.place}</span>
                  <small>{moment.theme}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </footer>
      </div>
    </section>
  )
}
