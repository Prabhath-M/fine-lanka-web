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
/** The pinned stage never sits higher than this (the sticky site header's height). */
const PIN_MIN_TOP_REM = 5.75

export function AdventureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState<AdventureStage>('sky')
  // 'off': server HTML / no JS (everything visible). 'reveal': reduced motion, a simple fade-in per panel.
  // 'scrub': each point holds in place while it builds up with scroll.
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

  // Scroll-held points: each panel keeps its normal size and spacing, plus a short stretch of extra
  // height (padding) during which its stage (`.adventure-stick`) stays put, centred in the viewport.
  // Scrolling through that stretch builds the point up (photo, heading, copy, tags, load bar); then the
  // stage releases and the page carries on. The progress is written to the panel as `--p` (0 to 1).
  // It only ever goes up, so a point that has been built stays built (also when scrolling back up);
  // only the background scene changes with the section. Reads are batched before writes.
  useEffect(() => {
    if (mode !== 'scrub') return
    const root = sectionRef.current
    if (!root) return
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.adventure-panel'))
    const sticks = panels.map((panel) => panel.querySelector<HTMLElement>('.adventure-stick'))
    const done = new Map<HTMLElement, number>()
    let pins: number[] = []
    let frame = 0

    // Where each stage pins: centred in the viewport, but never under the sticky site header.
    const measure = () => {
      const vh = window.innerHeight
      const header = PIN_MIN_TOP_REM * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16)
      pins = sticks.map((stick) => (stick ? Math.max(header, (vh - stick.offsetHeight) / 2) : 0))
      panels.forEach((panel, i) => panel.style.setProperty('--pin', `${pins[i]}px`))
    }
    const update = () => {
      frame = 0
      const next = panels.map((panel, i) => {
        const stick = sticks[i]
        if (!stick) return 1
        const rect = panel.getBoundingClientRect()
        const hold = rect.height - stick.offsetHeight // how far the stage stays pinned
        const raw = hold > 0 ? Math.min(1, Math.max(0, (pins[i] - rect.top) / hold)) : 1
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
    const onResize = () => {
      measure()
      schedule()
    }

    measure()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
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
