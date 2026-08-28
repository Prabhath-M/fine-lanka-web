'use client'

/* Contact page: mirrors the booking page's layout/CSS (page-hero,
 * .booking-layout, .booking-form-panel, .booking-sidebar*) so it matches
 * the site's visual language without adding new CSS. Form is
 * client-side only for now — same "no backend yet" state as the
 * booking form and enquiry modal (see Phase 9 of the pre-launch
 * audit); wire all three up to a real endpoint together. */
import { useState } from 'react'
import { Icon } from '@/components/icons'
import { SITE } from '@/lib/site-data'
import { SOCIAL_LINKS } from '@/lib/social-links'

export function ContactPage() {
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)

  return (
    <main className="contact-page">
      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <p className="hero-eyebrow">Get in touch</p>
          <h1>We&apos;d love to hear from you</h1>
          <p>
            Questions about a route, a date, or just where to start — reach out directly, or
            send a message and a Sri Lanka-based travel designer will follow up.
          </p>
        </div>
        <div className="mural-divider mural-divider--frieze" aria-hidden="true">
          <div className="mural-divider-inner" />
        </div>
      </section>

      {/* ============ CONTACT FORM + INFO ============ */}
      <section className="container booking-layout">
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
              // NOTE: no backend wired up yet — same placeholder state
              // as the booking form and enquiry modal.
              const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
              setMessage({
                text: `Thanks, ${name.split(' ')[0]} — we'll get back to you shortly.`,
                isError: false,
              })
              form.reset()
            }}
          >
            <div className="form-row two-col">
              <div>
                <label htmlFor="contact-name">Full name</label>
                <input type="text" id="contact-name" name="name" required />
              </div>
              <div>
                <label htmlFor="contact-email">Email address</label>
                <input type="email" id="contact-email" name="email" required />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="contact-subject">Subject</label>
              <input type="text" id="contact-subject" name="subject" />
            </div>

            <div className="form-row">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows={5} required />
            </div>

            <button type="submit" className="btn btn-uikit-primary">
              <Icon name="message" className="btn-icon" />
              Send Message
            </button>
            <p className={`booking-message${message?.isError ? ' is-error' : ''}`}>
              {message?.text ?? ''}
            </p>
          </form>
        </div>

        <aside className="booking-sidebar">
          <div className="booking-sidebar-card">
            <h3>Contact details</h3>
            <ol style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
                <Icon name="phone" className="btn-icon" /> <span>{SITE.phones.join(' · ')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
                <Icon name="mail" className="btn-icon" /> <span>{SITE.emails.join(' · ')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
                <Icon name="pin" className="btn-icon" /> <span>{SITE.address}</span>
              </li>
            </ol>
          </div>
          <div className="booking-sidebar-card">
            <h3>Follow along</h3>
            <div className="footer-socials">
              {SOCIAL_LINKS.map((social) =>
                social.href ? (
                  <a
                    key={social.key}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={social.key} />
                  </a>
                ) : (
                  <span
                    key={social.key}
                    className="footer-social-pending"
                    aria-hidden="true"
                    title={`${social.label} — coming soon`}
                  >
                    <Icon name={social.key} />
                  </span>
                ),
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
