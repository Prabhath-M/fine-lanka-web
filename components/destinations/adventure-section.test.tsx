import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ADVENTURES } from '@/lib/adventure-data'
import { AdventureSection } from './adventure-section'

describe('AdventureSection', () => {
  const html = renderToStaticMarkup(<AdventureSection />)

  it('renders the section with its heading and the anchor id', () => {
    expect(html).toContain('id="adventure"')
    expect(html).toContain('aria-labelledby="adventure-title"')
    expect(html).toContain('Go beyond the ordinary.')
  })

  it('renders one panel per experience, with verbatim titles and numbers', () => {
    expect(html.match(/class="adventure-panel"/g)).toHaveLength(ADVENTURES.length)
    for (const a of ADVENTURES) {
      expect(html).toContain(`id="adventure-${a.slug}"`)
      expect(html).toContain(a.title.replace('&', '&amp;'))
      expect(html).toContain(a.tagline)
    }
  })

  it('renders every experience tag', () => {
    for (const a of ADVENTURES) for (const tag of a.tags) expect(html).toContain(`<li>${tag}</li>`)
  })

  it('renders the closing copy and the enquiry button', () => {
    expect(html).toContain('A Little More Adventure. A Lot More Sri Lanka.')
    expect(html).toContain('Explore Sri Lanka. Experience More.')
    expect(html).toContain('data-open-enquiry')
  })

  it('uses unique element ids', () => {
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('renders the zone filter with All active and a live count', () => {
    for (const label of ['All', 'Air', 'Land', 'Water', 'Underground']) expect(html).toContain(`>${label}</button>`)
    expect(html).toMatch(/data-zone="all" class="is-active" aria-pressed="true"/)
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('Showing all 8 experiences')
  })

  it('renders the altitude gauge (decorative) with all five stages', () => {
    expect(html).toContain('class="adventure-gauge" aria-hidden="true"')
    for (const label of ['Sky', 'Canopy', 'Land', 'Water', 'Depth']) expect(html).toContain(`</span>${label}</li>`)
    expect(html).toContain('data-stage="sky"')
  })

  it('tags every panel with its gauge stage and keeps entrance effects off in server HTML', () => {
    expect(html.match(/class="adventure-panel"[^>]*data-stage="/g)).toHaveLength(ADVENTURES.length)
    expect(html).toContain('data-motion="off"')
  })

  it('keeps a valid heading order: one h2, then h3s only', () => {
    const levels = [...html.matchAll(/<h([1-6])[ >]/g)].map((m) => Number(m[1]))
    expect(levels[0]).toBe(2)
    expect(levels.filter((level) => level === 2)).toHaveLength(1)
    expect(levels.slice(1).every((level) => level === 3)).toBe(true)
    expect(levels).toHaveLength(1 + ADVENTURES.length + 1)
  })

  it('keeps list semantics on the unstyled lists and hides decoration from assistive tech', () => {
    expect(html).toContain('class="adventure-list" role="list"')
    expect(html.match(/class="adventure-tags" role="list"/g)).toHaveLength(ADVENTURES.length)
    expect(html.match(/class="adventure-media" aria-hidden="true"/g)).toHaveLength(ADVENTURES.length)
    expect(html).toContain('class="adventure-tint" aria-hidden="true"')
  })
})
