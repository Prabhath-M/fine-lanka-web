import { Icon } from '@/components/icons'
import type { Adventure } from '@/lib/adventure-data'
import { ADVENTURE_ZONES, adventureStage } from '@/lib/adventure-data'

/**
 * One "field dossier" in the Adventure & Experiences section. Server-renderable:
 * no state or effects here -- the filter and the altitude gauge (later phases)
 * live in the parent and only toggle data attributes / classes.
 */
export function AdventurePanel({ adventure }: { adventure: Adventure }) {
  const zoneLabel = ADVENTURE_ZONES.find((zone) => zone.id === adventure.zone)?.label ?? ''
  const headingId = `adventure-${adventure.slug}`

  return (
    <li className="adventure-panel" data-zone={adventure.zone} data-stage={adventureStage(adventure)} aria-labelledby={headingId}>
      <span className="adventure-node" aria-hidden="true" />

      <figure className="adventure-media" aria-hidden="true">
        {/* Illustrated placeholder until the photograph is supplied (plan, phase 6). */}
        <span className="adventure-media-contours" />
        <Icon name={adventure.icon} className="adventure-media-icon" />
        <figcaption className="adventure-media-zone">{zoneLabel}</figcaption>
      </figure>

      <div className="adventure-body">
        <p className="adventure-num" aria-hidden="true">
          {adventure.number}
        </p>
        <div className="adventure-title-row">
          <span className="adventure-icon-badge" aria-hidden="true">
            <Icon name={adventure.icon} />
          </span>
          <h3 id={headingId}>{adventure.title}</h3>
        </div>
        <p className="adventure-tagline">{adventure.tagline}</p>
        <p className="adventure-copy">{adventure.body}</p>
        <div className="adventure-experience">
          <span className="adventure-experience-label">Experience</span>
          <ul className="adventure-tags">
            {adventure.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}
