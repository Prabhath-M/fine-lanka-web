'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons'
import {
  ADVENTURES,
  ADVENTURE_CLOSING,
  ADVENTURE_INTRO,
  type AdventureStage,
} from '@/lib/adventure-data'
import { AdventurePanel } from '@/components/destinations/adventure-panel'
import { AdventureScenes } from '@/components/destinations/adventure-scenes'

/**
 * "Adventure & Experiences" -- the "Sky to Underground" section of the
 * Destinations page. See docs/DESTINATIONS-ADVENTURE-SECTION-PLAN.md.
 *
 * The background is a set of animated scenes (see adventure-scenes.tsx), one per stage, and
 * `data-stage` on the section also drives the text colours. One IntersectionObserver handles both the
 * active stage and the entrance; it never touches layout, so nothing shifts.
 */
/** A point starts building when its top edge rises above this share of the viewport height. */
const BUILD_START = 0.92

export function AdventureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState<AdventureStage>('sky')
  // 'off': server HTML / no JS (everything visible). 'reveal': reduced motion, a simple fade-in per panel.
  // 'scrub': each point builds up as it scrolls into view.
  const [mode, setMode] = useState<'off' | 'reveal' | 'scrub'>('off')

  // Effects are enabled only once JS is running, so the server HTML (and no-JS visitors) always see
  // every panel. Reduced-motion visitors keep the plain fade-in.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setMode(query.matches ? 'reveal' : 'scrub')
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  // Scroll-built points: as a panel rises through the viewport its content builds up (photo, then
  // heading, copy, tags, with a load bar filling), finishing once the panel is centred. The progress
  // is written to the panel as `--p`. It only ever goes up, so a point that has been built stays built
  // (also when scrolling back up); only the background scene changes with the section. Reads are
  // batched before writes.
  useEffect(() => {
    if (mode !== 'scrub') return
    const root = sectionRef.current
    if (!root) return
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.adventure-panel'))
    const done = new Map<HTMLElement, number>()
    let frame = 0

    const update = () => {
      frame = 0
      const vh = window.innerHeight
      const start = vh * BUILD_START
      const next = panels.map((panel) => {
        const rect = panel.getBoundingClientRect()
        const end = vh * 0.5 - rect.height / 2 // panel centred in the viewport
        const range = Math.max(start - end, 1)
        const raw = Math.min(1, Math.max(0, (start - rect.top) / range))
        return Math.max(done.get(panel) ?? 0, Math.round(raw * 1000) / 1000)
      })
      panels.forEach((panel, i) => {
        if (done.get(panel) === next[i]) return
        done.set(panel, next[i])
        panel.style.setProperty('--p', String(next[i]))
        panel.classList.toggle('is-complete', next[i] >= 1)
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [mode])

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
  }, [])

  return (
    <section
      id="adventure"
      ref={sectionRef}
      className="adventure"
      aria-labelledby="adventure-title"
      data-stage={stage}
      data-motion={mode === 'reveal' ? 'on' : 'off'}
      data-scrub={mode === 'scrub' ? 'on' : 'off'}
    >
      <div className="adventure-tint" aria-hidden="true">
        <AdventureScenes stage={stage} />
      </div>
      <div className="adventure-sky" aria-hidden="true" />

      <div className="container">
        <header className="adventure-head">
          <p className="dest-section-kicker">{ADVENTURE_INTRO.kicker}</p>
          <h2 id="adventure-title">{ADVENTURE_INTRO.title}</h2>
          <p className="adventure-lede">{ADVENTURE_INTRO.lede}</p>
        </header>

        <div className="adventure-track">
          <span className="adventure-spine" aria-hidden="true" />
          <ol className="adventure-list" role="list">
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
