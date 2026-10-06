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
})
