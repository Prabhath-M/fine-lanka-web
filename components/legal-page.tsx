import type { ReactNode } from 'react'

/** Shared shell for the three legal pages (Privacy Notice, Booking
 *  Terms, Cookie Policy) — same page-hero + prose body treatment for
 *  all three, so there's one layout to touch, not three. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}) {
  return (
    <main className="legal-page">
      <section className="page-hero">
        <div className="container">
          <p className="hero-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        <div className="mural-divider mural-divider--frieze" aria-hidden="true">
          <div className="mural-divider-inner" />
        </div>
      </section>
      <div className="container legal-page-body">{children}</div>
    </main>
  )
}
