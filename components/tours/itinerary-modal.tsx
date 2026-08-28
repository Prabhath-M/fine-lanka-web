'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@/components/icons'
import type { TourPackage } from '@/lib/tours-data'
import { useFocusTrap } from '@/lib/use-focus-trap'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'

/** Day-by-day itinerary modal for one tour package — was
 *  initItineraryModal() + itineraryModalMarkup() in main.js/render.js.
 *  Stays mounted in the DOM at all times (same as the original), only
 *  toggling `.is-open` for the fade/slide transition, so `tour` is
 *  `null` rather than the component being conditionally rendered.
 *  "Enquire About This Tour" closes this modal and lets the click
 *  bubble to the document-level listener in enquiry-modal.tsx, which
 *  opens the enquiry modal in its place — same as the original's
 *  "close itinerary, then let the click bubble for the combined
 *  enquiry-open listener" behaviour. */
export function ItineraryModal({ tour, onClose }: { tour: TourPackage | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!tour) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [tour, onClose])

  useBodyScrollLock(!!tour)

  useFocusTrap(!!tour, panelRef)

  return (
    <div
      className={`itinerary-modal${tour ? ' is-open' : ''}`}
      id="itinerary-modal"
      aria-hidden={!tour}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="itinerary-modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="itinerary-modal-title"
        tabIndex={-1}
      >
        <button type="button" className="enquiry-modal-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <h3 id="itinerary-modal-title">{tour?.name ?? 'Tour name'}</h3>
        <div className="itinerary-modal-body">
          {tour && (
            <>
              <p className="itinerary-route">{tour.route}</p>
              <p className="itinerary-meta">
                {tour.nights} nights · From ${tour.priceFrom.toLocaleString('en-US')} per person
              </p>
              <ol className="itinerary-days">
                {tour.itinerary.map((d) => (
                  <li className="itinerary-day" key={d.day}>
                    <span className="itinerary-day-num">Day {d.day}</span>
                    <div>
                      <h4>{d.title}</h4>
                      <p>{d.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <button type="button" className="btn btn-uikit-primary" data-open-enquiry="" onClick={onClose}>
                <Icon name="message" className="btn-icon" />
                Enquire About This Tour
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
