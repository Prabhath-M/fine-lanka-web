import { renderToStaticMarkup } from 'react-dom/server'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
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
    for (const a of ADVENTURES) for (const tag of a.tags) expect(html).toMatch(new RegExp(`<li[^>]*>${tag}</li>`))
  })

  it('renders the closing copy and the enquiry button', () => {
    expect(html).toContain('A Little More Adventure. A Lot More Sri Lanka.')
    expect(html).toContain('Explore Sri Lanka. Experience More.')
    expect(html).toContain('data-open-enquiry')
  })

  it('wraps each point in a stage that can pin, gives it a load bar, and starts with scrub mode off', () => {
    expect(html.match(/class="adventure-stick"/g)).toHaveLength(ADVENTURES.length)
    expect(html.match(/class="adventure-load" aria-hidden="true"/g)).toHaveLength(ADVENTURES.length)
    expect(html).toContain('data-scrub="off"')
  })

  it('uses unique element ids', () => {
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has no zone filter or zone labels', () => {
    expect(html).not.toContain('filter-bar')
    expect(html).not.toContain('aria-pressed')
    expect(html).not.toContain('adventure-media-zone')
    expect(html).not.toContain('Showing')
  })

  it('has no altitude gauge, but keeps the stage that drives the background shift', () => {
    expect(html).not.toContain('adventure-gauge')
    expect(html).toContain('class="adventure-tint" aria-hidden="true"')
    expect(html).toContain('data-stage="sky"')
  })

  it('renders one backdrop scene per stage, with only the first one on', () => {
    for (const stage of ['sky', 'canopy', 'land', 'water', 'ocean', 'depth']) {
      expect(html).toContain(`class="adventure-scene${stage === 'sky' ? ' is-on' : ''}"`)
      expect(html).toContain(`data-stage="${stage}"`)
    }
    expect(html.match(/class="adventure-scene is-on"/g)).toHaveLength(1)
    expect(html).toContain('adv-cloud') // sky: clouds
    expect(html).toContain('adv-bird') // canopy and land: birds
    expect(html).toContain('adv-ripple') // water: photographic light on moving rapids
    expect(html).toContain('adv-splash') // water: camera-facing splash bursts
    expect(html).toContain('adv-fish') // ocean: fish
    expect(html).toContain('adv-jelly') // ocean: jellyfish
    expect(html).toContain('adv-bubble') // ocean: bubbles
    expect(html).toContain('adv-firefly') // cave: fireflies
  })

  it('uses a separate existing background plate for every adventure stage', () => {
    const styles = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')
    const stages = ['sky', 'canopy', 'land', 'water', 'ocean', 'depth']
    const backgrounds = stages.map((stage) => {
      const filename = `adventure-background-${stage}.webp`
      const scene = styles.match(new RegExp(`\\.adventure-scene\\[data-stage='${stage}'\\] \\{([\\s\\S]*?)\\n\\}`))
      expect(scene?.[1]).toContain(`--scene-image: url('/images/${filename}')`)
      expect(existsSync(join(process.cwd(), 'public/images', filename))).toBe(true)
      return filename
    })
    expect(new Set(backgrounds).size).toBe(stages.length)
    expect(styles).toContain('background-color: #000;')
    expect(styles).toContain('background-color: #0a4560;')
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
    // Panels with a photo expose it (with alt text); only placeholders are hidden.
    expect(html.match(/class="adventure-media"><img /g)).toHaveLength(ADVENTURES.length)
    expect(html).toContain('class="adventure-tint" aria-hidden="true"')
  })
})
