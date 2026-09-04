'use client'

import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Map, MapPin, MessageSquareText, Sparkles } from 'lucide-react'
import { Icon } from '@/components/icons'
import { TOUR_CATEGORIES, type TourPackage } from '@/lib/tours-data'

/** A single tour package card — "Carved Ivory / Monsoon Green" redesign
 *  (integrated from the Lanka Journeys card concept). "View Itinerary"
 *  opens the shared itinerary modal (managed by the parent page);
 *  "Enquire Now" opens the global enquiry modal via the usual delegated
 *  data-open-enquiry click. Field mapping onto the existing TourPackage
 *  data: eyebrow chip is a fixed label, the brass kicker above the title
 *  is the tour's category name, and the three numbered "stops" tags are
 *  drawn from the first three days of the tour's own itinerary — no new
 *  content fields were needed. Styling lives in the "TOURS & PRICING —
 *  CARVED IVORY CARD" block at the end of globals.css, scoped entirely
 *  under .tour-card-v2 so it doesn't touch the legacy .tour-card rules
 *  still present earlier in the file. */
export function TourCard({
  tour,
  onOpenItinerary,
  onViewOnMap,
  onPrevious,
  onNext,
}: {
  tour: TourPackage
  onOpenItinerary: (tour: TourPackage) => void
  onViewOnMap: (tour: TourPackage) => void
  onPrevious?: () => void
  onNext?: () => void
}) {
  const category = TOUR_CATEGORIES.find((c) => c.slug === tour.category)
  const stops = tour.itinerary.slice(0, 3).map((day) => day.title)

  return (
    <article className="tour-card-v2 group relative overflow-hidden rounded-[28px] bg-[var(--tc-ivory)] text-[var(--tc-monsoon-deep)] ring-1 ring-[rgba(14,81,69,0.13)] transition-transform duration-300 ease-[var(--tc-ease-out)] hover:-translate-y-1">
      <div className="relative isolate min-h-[300px] overflow-hidden sm:min-h-[380px]">
        <img
          src={`/images/tour-${tour.category}.png`}
          alt={`${tour.name} — Sri Lanka`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--tc-ease-out)] group-hover:scale-[1.015]"
          width={1024}
          height={1024}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,39,33,0.5)_0%,rgba(5,39,33,0.05)_42%,rgba(5,39,33,0.84)_100%)]" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-7">
          <div className="flex items-center gap-3 text-white/90">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/45 bg-white/10 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--tc-brass)]" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/90">Sample itinerary</span>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-[var(--tc-ivory)] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--tc-monsoon)] shadow-sm">
            <CalendarDays className="h-3.5 w-3.5 text-[var(--tc-brass)]" strokeWidth={1.7} />
            {tour.nights} nights
          </span>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-6 pb-6 sm:px-7 sm:pb-7">
          {category && (
            <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--tc-brass)]">
              <span className="h-px w-9 bg-[var(--tc-brass)]/80" />
              {category.name}
            </div>
          )}
          <h3 className="tc-display relative max-w-[560px] text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[0.95] text-[var(--tc-ivory)]">
            {tour.name}
          </h3>
        </div>
      </div>

      <div className="tc-paper relative px-6 py-7 sm:px-7 sm:py-8">
        <div className="relative">
          <div className="flex items-start gap-3 text-[var(--tc-ink-soft)]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tc-brass)]" strokeWidth={1.5} />
            <p className="tc-mono line-clamp-1 max-w-[720px] text-[11px] leading-[1.8] sm:text-xs">{tour.route}</p>
          </div>

          <div className="my-6 tc-carved-rule" />

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(230px,0.8fr)] lg:gap-9">
            <div>
              <p className="line-clamp-4 min-h-[102px] max-w-[620px] text-[15px] leading-[1.7] text-[var(--tc-monsoon)] sm:min-h-[109px] sm:text-base">{tour.blurb}</p>
              <div className="mt-6 h-[84px] overflow-hidden">
                {stops.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--tc-ink-soft)]">
                    {stops.map((stop, index) => (
                      <span className="flex items-center gap-2" key={`${tour.slug}-stop-${index}`}>
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--tc-brass)]/60 text-[9px] text-[var(--tc-brass)]">
                          0{index + 1}
                        </span>
                        <span className="line-clamp-1">{stop}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:border-l lg:border-[var(--tc-line)] lg:pl-8">
              <p className="tc-eyebrow">From / per person</p>
              <p className="tc-display mt-1 text-4xl leading-none text-[var(--tc-monsoon)] sm:text-[2.5rem]">
                ${tour.priceFrom.toLocaleString('en-US')}
              </p>
              <p className="mt-2 text-xs text-[var(--tc-ink-soft)]">Twin share · thoughtfully paced</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  className="tc-focus group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[rgba(14,81,69,0.3)] bg-transparent px-5 text-sm font-extrabold text-[var(--tc-monsoon)] transition-all duration-200 ease-[var(--tc-ease-out)] hover:border-[var(--tc-monsoon)] hover:bg-[rgba(14,81,69,0.06)] active:scale-[0.97]"
                  onClick={() => onOpenItinerary(tour)}
                  type="button"
                >
                  View itinerary
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-[var(--tc-ease-out)] group-hover/button:translate-x-1" strokeWidth={1.8} />
                </button>
                <button
                  className="tc-focus group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[rgba(14,81,69,0.3)] bg-transparent px-5 text-sm font-extrabold text-[var(--tc-monsoon)] transition-all duration-200 ease-[var(--tc-ease-out)] hover:border-[var(--tc-monsoon)] hover:bg-[rgba(14,81,69,0.06)] active:scale-[0.97]"
                  onClick={() => onViewOnMap(tour)}
                  type="button"
                >
                  View on map
                  <Map className="h-4 w-4 transition-transform duration-200 ease-[var(--tc-ease-out)] group-hover/button:-translate-y-0.5" strokeWidth={1.7} />
                </button>
                <button
                  className="tc-focus group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--tc-monsoon)] px-5 text-sm font-extrabold text-[var(--tc-ivory)] shadow-[0_10px_20px_rgba(14,81,69,0.16)] transition-all duration-200 ease-[var(--tc-ease-out)] hover:bg-[var(--tc-monsoon-deep)] hover:shadow-[0_14px_24px_rgba(14,81,69,0.22)] active:scale-[0.97]"
                  data-open-enquiry=""
                  type="button"
                >
                  Enquire now
                  <MessageSquareText className="h-4 w-4 transition-transform duration-200 ease-[var(--tc-ease-out)] group-hover/button:-translate-y-0.5" strokeWidth={1.7} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--tc-line)] bg-[rgba(14,81,69,0.035)] px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--tc-ink-soft)] sm:px-7">
        <span className="flex items-center gap-2">
          {category && <Icon name={category.icon} className="tc-footer-icon" />}
          {category?.name ?? 'Fine Lanka Tours'}
        </span>
        {onPrevious && onNext ? (
          <div className="flex items-center gap-2" role="group" aria-label="Browse routes">
            <button
              type="button"
              className="tc-focus inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--tc-line)] bg-transparent text-[var(--tc-monsoon)] transition-colors hover:border-[var(--tc-brass)] hover:bg-[rgba(180,138,70,0.12)]"
              onClick={onPrevious}
              aria-label="Show previous route"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="tc-focus inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--tc-line)] bg-transparent text-[var(--tc-monsoon)] transition-colors hover:border-[var(--tc-brass)] hover:bg-[rgba(180,138,70,0.12)]"
              onClick={onNext}
              aria-label="Show next route"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        ) : (
          <ChevronRight className="h-4 w-4 text-[var(--tc-brass)]" strokeWidth={1.5} />
        )}
      </div>
    </article>
  )
}
