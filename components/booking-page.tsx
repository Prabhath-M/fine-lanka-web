'use client'

/* Ceylon Field Notes: the enquiry content stays in document flow over a
   section-scoped fixed background; the original top hero remains untouched. */
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@/components/icons'
import { DESTINATIONS } from '@/lib/destinations-data'
import { PROCESS_STEPS, SITE } from '@/lib/site-data'
import { TOUR_CATEGORIES, TOUR_PACKAGES } from '@/lib/tours-data'

/** Booking page: page hero, booking form + "what happens next" sidebar.
 *  Replaces public/booking.html + initBookingForm()/renderBookingProcess()
 *  in main.js/render.js.
 *
 *  The tour-select and destination-checkboxes preselects (`?tour=` /
 *  `?destination=`) are read once via useSearchParams() — same query
 *  params the original read straight from location.search — but unlike
 *  the destinations/tours-pricing filters, booking doesn't write the
 *  param back to the URL, so this stays a plain (uncontrolled) form,
 *  matching the original's mostly-native-HTML-form approach. */
export function BookingPage() {
  const searchParams = useSearchParams()
  const preselectTour = searchParams.get('tour')
  const preselectDestination = searchParams.get('destination')

  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)

  const categoriesWithPackages = TOUR_CATEGORIES.filter((c) =>
    TOUR_PACKAGES.some((t) => t.category === c.slug),
  )

  return (
    <main className="booking-page">
      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <p className="hero-eyebrow">Start planning</p>
          <h1>Tell us about your trip</h1>
          <p>
            This isn&apos;t an instant checkout — it&apos;s the start of a conversation. Share as
            much or as little as you know so far, and a Sri Lanka-based designer will follow up
            with a considered first-draft route.
          </p>
        </div>
        <div className="mural-divider mural-divider--frieze" aria-hidden="true">
          <div className="mural-divider-inner" />
        </div>
      </section>

      {/* ============ BOOKING FORM + SIDEBAR ============ */}
      <section className="container booking-layout">
        <p className="booking-section-index" aria-hidden="true">01 / YOUR BRIEF</p>
        <div className="booking-form-panel">
          <form
            className="booking-form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              if (!form.checkValidity()) {
                form.reportValidity()
                return
              }
              // NOTE: no backend wired up yet — placeholder for a future
              // session to connect to a real enquiry/CRM endpoint, same
              // pattern as the newsletter form.
              const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
              setMessage({
                text: `Thanks, ${name.split(' ')[0]} — a Sri Lanka-based travel designer will be in touch within one business day.`,
                isError: false,
              })
              form.reset()
            }}
          >
            <div className="form-row two-col">
              <div>
                <label htmlFor="booking-name">Full name</label>
                <input type="text" id="booking-name" name="name" required />
              </div>
              <div>
                <label htmlFor="booking-email">Email address</label>
                <input type="email" id="booking-email" name="email" required />
              </div>
            </div>

            <div className="form-row two-col">
              <div>
                <label htmlFor="booking-phone">Phone (with country code)</label>
                <input type="tel" id="booking-phone" name="phone" placeholder="+1 555 000 0000" />
              </div>
              <div>
                <label htmlFor="booking-travellers">Number of travellers</label>
                <input
                  type="number"
                  id="booking-travellers"
                  name="travellers"
                  min={1}
                  max={20}
                  placeholder="2"
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div>
                <label htmlFor="booking-dates">Preferred travel dates</label>
                <input
                  type="text"
                  id="booking-dates"
                  name="dates"
                  placeholder="e.g. Mar 2027, or flexible"
                />
              </div>
              <div>
                <label htmlFor="booking-nights">Trip length (nights)</label>
                <input type="number" id="booking-nights" name="nights" min={1} max={60} placeholder="10" />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="booking-tour">Tour package you&apos;re interested in</label>
              <select
                id="booking-tour"
                name="tour"
                defaultValue={
                  preselectTour && TOUR_PACKAGES.some((t) => t.slug === preselectTour)
                    ? preselectTour
                    : ''
                }
              >
                <option value="">Not sure yet — help me choose</option>
                {categoriesWithPackages.map((c) => (
                  <optgroup key={c.slug} label={c.name}>
                    {TOUR_PACKAGES.filter((t) => t.category === c.slug).map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.name} ({t.nights} nights)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Destinations you&apos;d like to include (optional)</label>
              <div className="checkbox-grid">
                {DESTINATIONS.map((d) => (
                  <label className="checkbox-pill" key={d.name}>
                    <input
                      type="checkbox"
                      name="destinations"
                      value={d.name}
                      defaultChecked={preselectDestination === d.name}
                    />
                    {d.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="booking-budget">Approximate budget per person</label>
              <select id="booking-budget" name="budget" defaultValue="">
                <option value="">Prefer not to say / not sure yet</option>
                <option value="under-1500">Under $1,500</option>
                <option value="1500-2500">$1,500 – $2,500</option>
                <option value="2500-4000">$2,500 – $4,000</option>
                <option value="4000-plus">$4,000+</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="booking-details">Anything else we should know?</label>
              <textarea
                id="booking-details"
                name="details"
                rows={4}
                placeholder="Interests, occasions, accessibility needs, past trips you loved..."
              />
            </div>

            <button type="submit" className="btn btn-uikit-primary">
              <Icon name="message" className="btn-icon" />
              Send Enquiry
            </button>
            <p className={`booking-message${message?.isError ? ' is-error' : ''}`}>
              {message?.text ?? ''}
            </p>
          </form>
        </div>

        <aside className="booking-sidebar">
          <div className="booking-sidebar-card">
            <h3>What happens next</h3>
            <ol>
              {PROCESS_STEPS.map((s) => (
                <li key={s.title}>{s.text}</li>
              ))}
            </ol>
          </div>
          <div className="booking-sidebar-contact">
            <Icon name="phone" className="btn-icon" />
            <div>
              Prefer to talk it through first?
              <strong>{SITE.phone}</strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
