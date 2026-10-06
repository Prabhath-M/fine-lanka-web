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
/** Scroll-linked animations: not in every TypeScript DOM lib yet. */
type ScrollTimelineCtor = new (options: { source: Element | null }) => AnimationTimeline
type ScrollLinkedAnimation = Animation & { rangeStart: string; rangeEnd: string }

/** The pinned viewport never sits higher than this (the sticky site header's height). */
const PIN_MIN_TOP_REM = 5.75
/** Space between two neighbouring points while they are held, in rem. */
const GAP_REM = 2.5
/** How far you scroll while a point is held and builds up, as a share of the screen height. */
const HOLD_DESKTOP = 0.65
const HOLD_MOBILE = 0.55
/** The hold of a point that is already built (scrolling back up through it), as a share of the screen height. */
const HOLD_BUILT = 0.1

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
  // Once a point is built, its hold shrinks (when scrolling has stopped, with the scroll position
  // corrected by the same amount, so nothing visibly moves): scrolling back up is then not a dead stretch.
  // The stack's movement is a scroll-linked Web Animation, so the browser runs it on the compositor,
  // in step with the pinned viewport (no one-frame lag); browsers without scroll timelines fall back
  // to writing the transform from the scroll handler. Reads are batched before writes.
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
    let fullHold = 0 // scroll distance of a hold that is still to be built
    let builtHold = 0 // and of one that is already built
    let holds: number[] = [] // current hold of each point
    let starts: number[] = [] // scroll offset where each point's hold begins
    let total = 0 // scroll distance of the whole pinned stretch
    let frame = 0
    let idle = 0
    let lastY = Number.NaN
    let lastIndex = -1
    let lastW = 0
    let lastH = 0
    let docTop = Number.NaN // the track's top edge in the document
    let anim: Animation | null = null
    const ScrollTimelineApi = (window as unknown as { ScrollTimeline?: ScrollTimelineCtor }).ScrollTimeline
    const canTimeline = !!ScrollTimelineApi && typeof Animation !== 'undefined' && 'rangeStart' in Animation.prototype

    // The stack's offset at the middle of each point, and the scroll-linked animation that moves it.
    const offsetAt = (index: number) => railH / 2 - (index * step + step / 2)
    const buildAnimation = () => {
      anim?.cancel()
      anim = null
      docTop = track.getBoundingClientRect().top + window.scrollY
      if (!canTimeline || !ScrollTimelineApi) return
      let effect: ScrollLinkedAnimation | null = null
      try {
        const frames: Keyframe[] = []
        for (let i = 0; i < count; i++) {
          const transform = `translate3d(0, ${offsetAt(i)}px, 0)`
          frames.push({ offset: starts[i] / total, transform })
          frames.push({ offset: (starts[i] + holds[i]) / total, transform })
        }
        const timeline = new ScrollTimelineApi({ source: document.scrollingElement ?? document.documentElement })
        const start = docTop - railTop
        effect = list.animate(frames, { timeline, fill: 'both', easing: 'linear' } as KeyframeAnimationOptions) as ScrollLinkedAnimation
        effect.rangeStart = `${start}px`
        effect.rangeEnd = `${start + total}px`
        anim = effect
        list.style.transform = ''
      } catch {
        effect?.cancel()
        anim = null
      }
    }
    // Lay the holds out one after another, size the track, and rebuild the animation.
    const layout = () => {
      let at = 0
      starts = holds.map((hold, i) => {
        const begin = at
        at += hold + (i < count - 1 ? step : 0)
        return begin
      })
      total = at
      track.style.height = `${railH + total}px`
      lastY = Number.NaN
      buildAnimation()
    }
    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const vh = window.innerHeight
      railTop = PIN_MIN_TOP_REM * rem
      railH = Math.max(0, vh - railTop)
      const tallest = sticks.reduce((max, stick) => Math.max(max, stick ? stick.offsetHeight : 0), 0)
      step = tallest + GAP_REM * rem
      fullHold = vh * (window.innerWidth <= 900 ? HOLD_MOBILE : HOLD_DESKTOP)
      builtHold = vh * HOLD_BUILT
      holds = panels.map((panel) => ((done.get(panel) ?? 0) >= 1 ? builtHold : fullHold))
      root.style.setProperty('--rail-top', `${railTop}px`)
      root.style.setProperty('--rail-h', `${railH}px`)
      root.style.setProperty('--step', `${step}px`)
      lastW = window.innerWidth
      lastH = vh
      layout()
    }
    const scrolled = () => Math.min(total, Math.max(0, railTop - track.getBoundingClientRect().top))

    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const s = Math.min(total, Math.max(0, railTop - rect.top))
      let k = count - 1
      while (k > 0 && starts[k] > s) k--
      const f = s - starts[k]
      let u = k // which point is centred (fractional while the stack moves)
      let held = 1 // build-up progress of point k
      if (f <= holds[k]) held = holds[k] > 0 ? f / holds[k] : 1
      else u = k + (f - holds[k]) / step

      if (anim) {
        // Content above the section can change height (images, fonts): keep the timeline lined up.
        if (Math.abs(rect.top + window.scrollY - docTop) > 1) buildAnimation()
      } else {
        const y = Math.round((offsetAt(0) - u * step) * 10) / 10
        if (y !== lastY) {
          lastY = y
          list.style.transform = `translate3d(0, ${y}px, 0)`
        }
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
    // Scrolling has stopped: shrink the holds of points that are built (except the one being held right
    // now) and move the scroll position back by what was removed above it, so the view stays put.
    const compress = () => {
      idle = 0
      const s = scrolled()
      const y0 = window.scrollY
      let above = 0
      let changed = false
      const next = holds.map((hold, i) => {
        if (hold <= builtHold || (done.get(panels[i]) ?? 0) < 1) return hold
        if (starts[i] <= s && s <= starts[i] + hold) return hold
        changed = true
        if (starts[i] + hold <= s) above += hold - builtHold
        return builtHold
      })
      if (!changed) return
      holds = next
      layout()
      if (above > 0) window.scrollTo({ top: y0 - above, behavior: 'instant' as ScrollBehavior })
      schedule()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onScroll = () => {
      schedule()
      window.clearTimeout(idle)
      idle = window.setTimeout(compress, 250)
    }
    const onResize = () => {
      // Phone address bars grow and shrink the viewport while scrolling: that must not re-lay-out.
      if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 160) return
      measure()
      schedule()
    }

    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(idle)
      anim?.cancel()
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
