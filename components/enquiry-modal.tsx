'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons'
import { HONEYPOT_FIELD } from '@/lib/form-guard'
import { useFocusTrap } from '@/lib/use-focus-trap'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'

export function EnquiryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-open-enquiry]')) {
        setIsOpen(true)
        setMessage(null)
        return
      }
      if (target.closest('[data-close-enquiry]') || target === modalRef.current) {
        setIsOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useBodyScrollLock(isOpen)

  useFocusTrap(isOpen, panelRef)

  return (
    <div
      className={`enquiry-modal${isOpen ? ' is-open' : ''}`}
      id="enquiry-modal"
      ref={modalRef}
      aria-hidden={!isOpen}
    >
      <div
        className="enquiry-modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        tabIndex={-1}
      >
        <button className="enquiry-modal-close" data-close-enquiry="" aria-label="Close">
          &times;
        </button>
        <h3 id="enquiry-modal-title">Tell us about your trip</h3>
        <p>
          Share a few details, and a Sri Lanka-based travel designer will be in touch — usually
          within one business day.
        </p>
        <form
          className="enquiry-modal-form"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            if (!form.checkValidity()) {
              form.reportValidity()
              return
            }

            const formData = new FormData(form)
            const payload = {
              name: formData.get('name'),
              email: formData.get('email'),
              destination: formData.get('destination'),
              details: formData.get('details'),
              [HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD),
            }

            setIsSubmitting(true)
            setMessage(null)
            try {
              const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              })
              if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.error || 'Something went wrong. Please try again.')
              }
              setMessage({
                text: 'Thanks — a Sri Lanka-based travel designer will be in touch, usually within one business day.',
                isError: false,
              })
              form.reset()
              setTimeout(() => setIsOpen(false), 1800)
            } catch (err) {
              setMessage({
                text: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
                isError: true,
              })
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          {/* Honeypot: real visitors never see or fill this. */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
          >
            <label htmlFor="enquiry-company-website">Company website</label>
            <input
              type="text"
              id="enquiry-company-website"
              name={HONEYPOT_FIELD}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <label className="sr-only" htmlFor="enquiry-name">
            Full name
          </label>
          <input type="text" id="enquiry-name" name="name" placeholder="Full name" required />

          <label className="sr-only" htmlFor="enquiry-email">
            Email address
          </label>
          <input
            type="email"
            id="enquiry-email"
            name="email"
            placeholder="Email address"
            required
          />

          <label className="sr-only" htmlFor="enquiry-destination">
            Where in Sri Lanka are you dreaming of?
          </label>
          <input
            type="text"
            id="enquiry-destination"
            name="destination"
            placeholder="Where in Sri Lanka are you dreaming of?"
          />

          <label className="sr-only" htmlFor="enquiry-details">
            Anything else we should know?
          </label>
          <textarea
            id="enquiry-details"
            name="details"
            rows={3}
            placeholder="Anything else we should know?"
          />

          <button type="submit" className="btn btn-uikit-primary" disabled={isSubmitting}>
            <Icon name="message" className="btn-icon" />
            {isSubmitting ? 'Sending…' : 'Send Enquiry'}
          </button>
          {message && (
            <p className={`booking-message${message.isError ? ' is-error' : ''}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
