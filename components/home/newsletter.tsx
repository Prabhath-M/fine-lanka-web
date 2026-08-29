'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'
import { HONEYPOT_FIELD } from '@/lib/form-guard'

/** Newsletter signup form — wired to POST /api/newsletter (see
 *  app/api/newsletter/route.ts). Not a real mailing-list integration —
 *  see the note in that route file. */
export function Newsletter() {
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div>
          <h2>Get travel ideas, not sales emails</h2>
          <p>
            Occasional dispatches on new routes, seasonal openings, and the rare upgrade
            reserved first for our mailing list.
          </p>
        </div>
        <div>
          <form
            className="newsletter-form"
            id="newsletter-form"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget
              const input = form.querySelector<HTMLInputElement>('input[type=email]')
              const isValid = Boolean(input && input.value && input.checkValidity())

              if (!isValid) {
                setMessage('Please enter a valid email address.')
                setIsError(true)
                return
              }

              const email = input!.value
              const honeypot = form.querySelector<HTMLInputElement>(`input[name=${HONEYPOT_FIELD}]`)

              setIsSubmitting(true)
              setMessage('')
              try {
                const res = await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, [HONEYPOT_FIELD]: honeypot?.value }),
                })
                if (!res.ok) {
                  const data = await res.json().catch(() => null)
                  throw new Error(data?.error || 'Something went wrong. Please try again.')
                }
                setMessage(`Thanks — we'll be in touch at ${email}.`)
                setIsError(false)
                form.reset()
              } catch (err) {
                setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
                setIsError(true)
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
              <label htmlFor="newsletter-company-website">Company website</label>
              <input
                type="text"
                id="newsletter-company-website"
                name={HONEYPOT_FIELD}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <input type="email" placeholder="you@example.com" required aria-label="Email address" />
            <button type="submit" className="btn btn-uikit-primary" disabled={isSubmitting}>
              <Icon name="mail" className="btn-icon" />
              {isSubmitting ? 'Signing up…' : 'Sign Up'}
            </button>
          </form>
          <p className={`newsletter-message${isError ? ' is-error' : ''}`} id="newsletter-message">
            {message}
          </p>
        </div>
      </div>
    </section>
  )
}
