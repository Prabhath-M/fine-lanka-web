import { SITE } from '@/lib/site-data'

/**
 * Design reminder: this compact companion follows Why Fine Lanka. It is a
 * concise travel-method statement on a clean Sigiriya-and-bera-dancer mural,
 * with no oversized panels or repeated feature-card treatment.
 */
const JOURNEY_STEPS = [
  ['01', 'Start with a real conversation'],
  ['02', 'Shape the rhythm around you'],
  ['03', 'Travel with support close by'],
]

export function Intro() {
  return (
    <section className="intro intro-compact intro-blue-lily" id="journey-design">
      <div className="container intro-compact-shell">
        <div className="intro-compact-lead">
          <p className="section-label">The Fine Lanka way</p>
          <p className="intro-compact-kicker">
            Sri Lanka-based travel design · Since <span data-founded>{SITE.foundedYear}</span>
          </p>
          <h2>Designed with you. Carried by us.</h2>
          <p className="intro-compact-copy">
            An island journey paced with intention, with a local team close at hand from the
            very first route to the very last day.
          </p>
        </div>

        <div className="intro-compact-method">
          <p className="intro-compact-method-label">How a journey takes shape</p>
          <ol>
            {JOURNEY_STEPS.map(([number, title]) => (
              <li key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
              </li>
            ))}
          </ol>
        </div>

        <a href="#process" className="intro-compact-link">
          See the journey process <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
