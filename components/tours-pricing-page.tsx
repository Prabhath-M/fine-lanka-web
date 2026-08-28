'use client'

/* Ceylon Field Notes: the collection scrolls over a section-scoped fixed
   landscape background, leaving the original top hero entirely untouched. */
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@/components/icons'
import { ItineraryModal } from '@/components/tours/itinerary-modal'
import { TourCard } from '@/components/tours/tour-card'
import { TourPickerCarousel } from '@/components/tours/tour-picker-carousel'
import { TRAVEL_NOTES } from '@/lib/site-data'
import { TOUR_CATEGORIES, TOUR_PACKAGES, type TourPackage } from '@/lib/tours-data'

/** Tours & pricing page: page hero, category filter bar + intro copy +
 *  package grid, travel notes, CTA band, itinerary modal. Replaces
 *  public/tours-pricing.html + initTourPricingPage()/
 *  initItineraryModal() in main.js. The category filter reads/writes
 *  the `?category=` query param the same way the destinations page's
 *  region filter does (see components/destinations-page.tsx). */
export function ToursPricingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTour, setActiveTour] = useState<TourPackage | null>(null)
  // Which package is shown as the one big featured card. Deliberately not
  // reset via an effect: it's derived fresh each render, so switching the
  // category filter (which changes `list` below) falls straight back to
  // the first result in the new list whenever the previous pick isn't in it.
  const [featuredSlug, setFeaturedSlug] = useState<string | null>(null)

  const categoryParam = searchParams.get('category')
  const activeSlug = categoryParam && TOUR_CATEGORIES.some((c) => c.slug === categoryParam) ? categoryParam : 'All'
  const activeCategory = TOUR_CATEGORIES.find((c) => c.slug === activeSlug)

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'All') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    const query = params.toString()
    router.replace(query ? `/tours-pricing?${query}` : '/tours-pricing', { scroll: false })
  }

  const list = activeSlug === 'All' ? TOUR_PACKAGES : TOUR_PACKAGES.filter((t) => t.category === activeSlug)
  const priceFloor = Math.min(...TOUR_PACKAGES.map((tour) => tour.priceFrom))
  const featuredTour = list.find((t) => t.slug === featuredSlug) ?? list[0]

  return (
    <main className="tours-page">
      <section className="tours-hero">
        <div className="container tours-hero-grid">
          <div className="tours-hero-copy">
            <p className="tours-kicker">The Fine Lanka collection</p>
            <h1>
              Journeys with a <em>clearer beginning.</em>
            </h1>
            <p className="tours-hero-lede">
              These itineraries are considered starting points for travelling Sri Lanka. Choose
              the rhythm that feels closest to you, then let a local designer make it entirely
              your own.
            </p>
            <div className="tours-hero-actions">
              <a href="#tour-collection" className="btn btn-uikit-primary">
                Browse the collection
              </a>
              <span>Indicative prices, re-quoted around your dates and stays.</span>
            </div>
          </div>
          <aside className="tours-hero-ledger" aria-label="Collection overview">
            <p className="tours-ledger-label">Collection ledger</p>
            <div className="tours-ledger-rule" aria-hidden="true" />
            <dl>
              <div>
                <dt>{TOUR_PACKAGES.length}</dt>
                <dd>crafted starting routes</dd>
              </div>
              <div>
                <dt>{TOUR_CATEGORIES.length}</dt>
                <dd>ways into the island</dd>
              </div>
              <div>
                <dt>From ${priceFloor.toLocaleString('en-US')}</dt>
                <dd>per person, twin share</dd>
              </div>
            </dl>
            <p className="tours-ledger-note">Every route is private, flexible, and backed by local support throughout.</p>
          </aside>
        </div>
        <div className="mural-divider mural-divider--frieze" aria-hidden="true">
          <div className="mural-divider-inner" />
        </div>
      </section>

      <section className="tour-collection" id="tour-collection">
        <div className="container">
          <div className="tour-collection-intro">
            <div>
              <p className="section-label">Find your pace</p>
              <h2>Choose a route by the feeling you want to follow.</h2>
            </div>
            <p>
              Coastlines, kingdoms, cloud forests and slow mornings for two — the collection is
              a starting point for conversation, not a fixed list of packages.
            </p>
          </div>

          <div className="tour-filter-deck">
            <p className="tour-filter-label">Travel style</p>
            <div className="filter-bar" id="type-filters" aria-label="Filter sample itineraries by travel style">
              {[{ slug: 'All', name: 'All', icon: 'compass' }, ...TOUR_CATEGORIES].map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  data-category={c.slug}
                  className={activeSlug === c.slug ? 'is-active' : undefined}
                  aria-pressed={activeSlug === c.slug}
                  onClick={() => setCategory(c.slug)}
                >
                  <Icon name={c.icon} aria-hidden="true" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
            <div className="tour-filter-context" id="category-intro" aria-live="polite">
              <div>
                <p className="tour-filter-current">{activeSlug === 'All' ? 'All travel styles' : activeCategory?.name}</p>
                {activeCategory && <p className="category-intro">{activeCategory.intro}</p>}
              </div>
              <p className="tour-filter-count">
                <strong>{list.length.toString().padStart(2, '0')}</strong> routes shown
              </p>
            </div>
          </div>

          <div className="tour-packages-grid" id="tour-packages-grid">
            {activeCategory?.comingSoon ? (
              <div className="tour-empty tour-curated-empty">
                <p className="tours-kicker">In development</p>
                <h3>{activeCategory.name} journeys are being drawn up.</h3>
                <p>
                  Tell us the pace, places and kind of stay you have in mind, and we&apos;ll sketch
                  a private route while this collection continues to take shape.
                </p>
                <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
                  Start a private brief
                </button>
              </div>
            ) : list.length && featuredTour ? (
              <div className="tour-showcase">
                <TourCard tour={featuredTour} onOpenItinerary={setActiveTour} />
                {list.length > 1 && (
                  <TourPickerCarousel tours={list} activeSlug={featuredTour.slug} onSelect={setFeaturedSlug} />
                )}
              </div>
            ) : (
              <p className="tour-empty">No packages match that filter yet — try another category.</p>
            )}
          </div>
        </div>
      </section>

      <section className="travel-notes-section tours-notes-section">
        <div className="container">
          <div className="tours-notes-heading">
            <div>
              <p className="section-label">Before you go</p>
              <h2 className="section-heading">The practical details, clearly covered.</h2>
            </div>
            <p>We walk you through the particulars before you travel, so the route feels easy to say yes to.</p>
          </div>
          <div className="travel-notes-grid" id="travel-notes">
            {TRAVEL_NOTES.map((n) => (
              <div className="travel-note" key={n.title}>
                <h4>{n.title}</h4>
                <p>{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band tours-cta-band">
        <p className="tours-kicker">A route can start anywhere</p>
        <h2>Not seeing the exact way you want to travel?</h2>
        <p>
          Share the time you have and what you want the island to feel like — we&apos;ll turn that
          into a considered, private route, built from scratch.
        </p>
        <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
          <Icon name="pin" className="btn-icon" />
          Plan Your Journey
        </button>
      </section>

      <ItineraryModal tour={activeTour} onClose={() => setActiveTour(null)} />
    </main>
  )
}
