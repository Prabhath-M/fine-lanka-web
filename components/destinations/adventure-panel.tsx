import { Icon } from '@/components/icons'
import type { Adventure } from '@/lib/adventure-data'
import { adventureStage } from '@/lib/adventure-data'

/**
 * One "field dossier" in the Adventure & Experiences section. Server-renderable:
 * no state or effects here -- the filter and the altitude gauge (later phases)
 * live in the parent and only toggle data attributes / classes.
 */
export function AdventurePanel({ adventure }: { adventure: Adventure }) {
  const headingId = `adventure-${adventure.slug}`

  return (
    <li className="adventure-panel" data-zone={adventure.zone} data-stage={adventureStage(adventure)} aria-labelledby={headingId}>
      <span className="adventure-node" aria-hidden="true" />

      <figure className="adventure-media" aria-hidden={adventure.image ? undefined : 'true'}>
        {adventure.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${adventure.image}-960w.webp`}
            srcSet={`${adventure.image}-480w.webp 480w, ${adventure.image}-960w.webp 960w, ${adventure.image}-1600w.webp 1600w`}
            sizes="(min-width: 900px) 45vw, 92vw"
            width={1600}
            height={1000}
            alt={adventure.imageAlt ?? adventure.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            {/* Illustrated placeholder for an experience without a photograph yet. */}
            <span className="adventure-media-contours" />
            <Icon name={adventure.icon} className="adventure-media-icon" />
          </>
        )}
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
          <ul className="adventure-tags" role="list">
            {adventure.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}
