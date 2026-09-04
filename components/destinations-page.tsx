'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@/components/icons'
import { DestinationMarquee } from '@/components/destinations/destination-marquee'
import { ChartIntro } from '@/components/destinations/chart-intro'
import { DESTINATIONS, type DestinationRegion } from '@/lib/destinations-data'
import { usePreloadImages } from '@/lib/use-preload-images'

const REGIONS = Array.from(new Set(DESTINATIONS.map((d) => d.region))) as DestinationRegion[]

// Everything below-the-fold-of-the-ritual that's a CSS background-image
// rather than an <img>/next/image — so none of the lazy-loading work
// from docs/MEDIA-OPTIMIZATION.md touches it. The brass rudder wheel
// itself is deliberately NOT in this list: it's already warmed from the
// Home page (see docs/OPENING-ANIMATION-PRELOAD-PLAN.md, Section 1 +
// "Decisions made mid-plan") since that gives it a longer head start
// than starting here ever could.
const DESTINATIONS_PRELOAD_IMAGES = [
  '/images/destinations-atlas-bg-1600w.webp',
  '/images/destinations-atlas-bg-mobile-1600w.webp',
  '/images/dest-panel-frame-960w.webp',
  '/images/dest-panel-frame-1600w.webp',
  '/images/frieze-divider-1600w.webp',
  '/images/destinations-cloud-frame.webp',
  '/images/destinations-atlas-mist.webp',
]

/**
 * Destinations page — Archival Cartography direction.
 *
 * Scope note: the desktop explorer is a Sigiriya Cloud Court: a quiet
 * heritage chart well with a top navigation strip, regional registers,
 * centred destination cards, rudder, and bearing ledger. DestinationCard
 * and DestinationMarquee behavior remain deliberately untouched.
 */
export function DestinationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Starts the moment the page mounts, i.e. during the chart-intro
  // ritual (~3.6s wheel-turn minimum, see ChartIntro) — dead time from
  // a network point of view that the ritual is already spending on the
  // wheel image; this covers the atlas/panel/frame imagery the ritual
  // doesn't gate on but that renders immediately once the doors open.
  usePreloadImages(DESTINATIONS_PRELOAD_IMAGES)

  const regionParam = searchParams.get('region')
  const activeRegion: DestinationRegion | 'All' =
    regionParam && (REGIONS as string[]).includes(regionParam) ? (regionParam as DestinationRegion) : 'All'

  const list = useMemo(
    () => (activeRegion === 'All' ? DESTINATIONS : DESTINATIONS.filter((d) => d.region === activeRegion)),
    [activeRegion],
  )

  const scrollToCarousel = useCallback(() => {
    // Keep the mobile page at the top after the chart ritual. The compact
    // atlas stacks the carousel and rudder in normal flow; auto-scrolling to
    // the stage makes the rudder appear to jump away on initial load.
    if (window.matchMedia('(max-width: 760px)').matches) return

    window.requestAnimationFrame(() => {
      const stage = document.getElementById('destination-carousel-stage')
      if (!stage) return

      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const breathingRoom = 18
      const destinationTop = window.scrollY + stage.getBoundingClientRect().top - headerHeight - breathingRoom

      window.scrollTo({ top: Math.max(0, destinationTop), behavior: 'smooth' })
    })
  }, [])

  const setRegion = (region: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (region === 'All') {
      params.delete('region')
    } else {
      params.set('region', region)
    }
    const query = params.toString()
    router.replace(query ? `/destinations?${query}` : '/destinations', { scroll: false })
  }

  const renderFilter = (region: string) => (
    <button
      type="button"
      key={region}
      data-region={region}
      className={activeRegion === region ? 'is-active' : undefined}
      aria-pressed={activeRegion === region}
      onClick={() => setRegion(region)}
    >
      {region}
    </button>
  )

  return (
    <ChartIntro onReveal={scrollToCarousel}>
      <main className="destinations-page">
        <div className="dest-map-scene">
          <div className="dest-map-bg" aria-hidden="true">
            <div className="dest-map-bg-image" />
            <div className="dest-map-bg-grid" />
          </div>

          <section className="page-hero page-hero--map">
            <div className="container">
              <div className="dest-hero-grid">
                <div className="dest-hero-copy">
                  <p className="hero-eyebrow">Serendib / route atlas</p>
                  <h1>
                    Sri Lanka, <em>drawn by place.</em>
                  </h1>
                  <p className="dest-hero-lede">
                    Thirteen coordinates our designers keep returning to. Start with a coastline, a
                    mountain, or the long way around — then shape the route around what you most
                    want to remember.
                  </p>
                  <div className="dest-hero-actions">
                    <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
                      <Icon name="pin" className="btn-icon" />
                      Plot a route
                    </button>
                    <span className="dest-hero-note">A considered way through the island</span>
                  </div>
                </div>

                <aside className="dest-hero-aside" aria-label="Chart details">
                  <div className="dest-hero-instrument">
                    <img
                      src="/images/destinations-latitude-instrument-clean.webp"
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      width={640}
                      height={640}
                      loading="eager"
                    />
                  </div>
                  <div className="dest-hero-aside-copy">
                    <p className="dest-hero-aside-label">Charted latitude</p>
                    <p className="dest-hero-aside-value">06° 55′ N</p>
                    <p className="dest-hero-aside-caption">One island, many ways to arrive.</p>
                  </div>
                </aside>
              </div>

              <div className="dest-hero-meta" aria-label="Destination summary">
                <span><strong>{DESTINATIONS.length}</strong> coordinates</span>
                <span><strong>{REGIONS.length}</strong> regions</span>
                <span>North / 07° N</span>
                <span className="dest-hero-meta-status"><i /> Ready to explore</span>
              </div>
            </div>
            <div className="mural-divider mural-divider--frieze" aria-hidden="true">
              <div className="mural-divider-inner" />
            </div>
          </section>

          <section id="destination-carousel" className="destinations destinations--map">
            <div className="container">
              <div className="destinations-atlas-layout">
                <div className="destinations-atlas-mist" aria-hidden="true" />
                <div className="destinations-atlas-heading">
                  <div>
                    <p className="dest-section-kicker">Serendib route table</p>
                    <h2>Find a bearing through the island.</h2>
                  </div>
                  <p className="destinations-atlas-heading-copy">
                    Turn through the island&apos;s cultural heartlands, its cloud-wreathed tea country
                    and its coastal waters.
                  </p>
                  <p className="destinations-atlas-heading-status">
                    <strong>{list.length.toString().padStart(2, '0')}</strong> of {DESTINATIONS.length.toString().padStart(2, '0')} plotted
                  </p>
                  <div className="destinations-atlas-filters">
                    <div className="filter-bar" id="region-filters" aria-label="Filter destinations by region">
                      {['All', ...REGIONS].map(renderFilter)}
                    </div>
                  </div>
                </div>

                <div className="destinations-atlas-window">
                  <div className="destinations-toolbar">
                    <div className="destinations-toolbar-note">
                      <span className="destinations-toolbar-label">Viewing</span>
                      <strong>{list.length.toString().padStart(2, '0')}</strong>
                      <span className="destinations-toolbar-total">of {DESTINATIONS.length.toString().padStart(2, '0')}</span>
                      <span className="destinations-toolbar-word">plotted</span>
                    </div>
                  </div>

                  <DestinationMarquee destinations={list} />
                </div>

              </div>
            </div>
          </section>
        </div>

        <section className="cta-band destinations-cta">
          <div className="destinations-cta-mark" aria-hidden="true">
            <img
              src="/images/destinations-route-line.webp"
              alt=""
              draggable={false}
              width={2304}
              height={1536}
              loading="lazy"
            />
          </div>
          <p className="dest-section-kicker">A route can start anywhere</p>
          <h2>Not sure which region fits your trip?</h2>
          <p>
            Tell us how much time you have and what you&apos;re after — we&apos;ll suggest a considered
            route across the places that fit.
          </p>
          <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
            <Icon name="pin" className="btn-icon" />
            Plot my journey
          </button>
        </section>
      </main>
    </ChartIntro>
  )
}
