'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'

/** Newsletter signup form — client-side validation + placeholder
 *  "submit" only (was initNewsletterForm() in main.js). No backend
 *  wired up yet, same as the original. */
export function Newsletter() {
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

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
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const input = form.querySelector<HTMLInputElement>('input[type=email]')
              const isValid = Boolean(input && input.value && input.checkValidity())

              if (!isValid) {
                setMessage('Please enter a valid email address.')
                setIsError(true)
                return
              }

              setMessage(`Thanks — we'll be in touch at ${input!.value}.`)
              setIsError(false)
              form.reset()
            }}
          >
            <input type="email" placeholder="you@example.com" required aria-label="Email address" />
            <button type="submit" className="btn btn-uikit-primary">
              <Icon name="mail" className="btn-icon" />
              Sign Up
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
