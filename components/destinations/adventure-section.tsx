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
/** The pinned viewport never sits higher than this (the sticky site header's height). */
const PIN_MIN_TOP_REM = 5.75
/** Space between two neighbouring points while they are held, in rem. */
const GAP_REM = 2.5
/** How far you scroll while a point is held and builds up, as a share of the screen height. */
const HOLD_DESKTOP = 0.32
const HOLD_MOBILE = 0.28

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

  // Scroll-held points: the points sit one under another in a single pinned viewport (`.adventure-rail`)
  // and move together, at a fixed distance from each other. Scrolling is split into two kinds of
  // stretch: a hold, where nothing moves and the current point builds up (description, then tags, load
  // bar; its progress is written to the panel as `--p`, 0 to 1), and a move, where the whole stack
  // slides up by one point. So while a point is held, its neighbours are held too. The progress only
  // ever goes up, so a built point stays built; only the background scene changes with the section.
  // Reads are batched before writes.
  useEffect(() => {
    if (mode !== 'scrub') return
    const root = sectionRef.current
    const track = root?.querySelector<HTMLElement>('.adventure-track')
    const rail = root?.querySelector<HTMLElement>('.adventure-rail')
    const list = root?.querySelector<HTMLElement>('.adventure-list')
    if (!root || !track || !rail || !list) return
    const panels = Array.from(list.querySelectorAll<HTMLElement>('.adventure-panel'))
    const sticks = panels.map((panel) => panel.querySelector<HTMLElement>('.adventure-stick'))
    const count = panels.length
    if (count === 0) return
    const done = new Map<HTMLElement, number>()
    let railTop = 0
    let railH = 0
    let step = 0 // distance between two neighbouring points
    let hold = 0 // scroll distance of one hold
    let total = 0 // scroll distance of the whole pinned stretch
    let frame = 0
    let lastY = Number.NaN
    let lastIndex = -1

    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const vh = window.innerHeight
      railTop = PIN_MIN_TOP_REM * rem
      railH = Math.max(0, vh - railTop)
      const tallest = sticks.reduce((max, stick) => Math.max(max, stick ? stick.offsetHeight : 0), 0)
      step = tallest + GAP_REM * rem
      hold = vh * (window.innerWidth <= 900 ? HOLD_MOBILE : HOLD_DESKTOP)
      total = (count - 1) * (hold + step) + hold
      root.style.setProperty('--rail-top', `${railTop}px`)
      root.style.setProperty('--rail-h', `${railH}px`)
      root.style.setProperty('--step', `${step}px`)
      track.style.height = `${railH + total}px`
      lastY = Number.NaN
    }
    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const s = Math.min(total, Math.max(0, railTop - rect.top))
      const cycle = hold + step
      const k = Math.min(count - 1, Math.floor(s / cycle))
      const f = s - k * cycle
      let u = k // which point is centred (fractional while the stack moves)
      let held = 1 // build-up progress of point k
      if (f <= hold) held = hold > 0 ? f / hold : 1
      else u = k + (f - hold) / step

      const y = Math.round((railH / 2 - (u * step + step / 2)) * 10) / 10
      if (y !== lastY) {
        lastY = y
        list.style.transform = `translate3d(0, ${y}px, 0)`
      }
      panels.forEach((panel, i) => {
        const raw = i < k ? 1 : i === k ? held : 0
        const next = Math.max(done.get(panel) ?? 0, Math.round(raw * 1000) / 1000)
        if (done.get(panel) === next) return
        done.set(panel, next)
        panel.style.setProperty('--p', String(next))
        panel.classList.toggle('is-complete', next >= 1)
      })
      const index = Math.min(count - 1, Math.max(0, Math.round(u)))
      if (index !== lastIndex) {
        lastIndex = index
        const next = panels[index].dataset.stage as AdventureStage | undefined
        if (next) setStage(next)
      }
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
      list.style.transform = ''
      track.style.height = ''
      for (const name of ['--rail-top', '--rail-h', '--step']) root.style.removeProperty(name)
      panels.forEach((panel) => {
        panel.style.removeProperty('--p')
        panel.classList.remove('is-complete')
      })
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
      // While scrubbing, the scroll handler above picks the stage from the stack's position instead.
      if (mode !== 'scrub') track.observe(panel)
    }
    return () => {
      reveal.disconnect()
      track.disconnect()
    }
  }, [mode])

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
          <div className="adventure-rail">
            <span className="adventure-spine" aria-hidden="true" />
            <ol className="adventure-list" role="list">
              {ADVENTURES.map((adventure) => (
                <AdventurePanel key={adventure.slug} adventure={adventure} />
              ))}
            </ol>
          </div>
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
