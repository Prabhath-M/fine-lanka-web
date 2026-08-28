import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found — Fine Lanka Tours',
  description: "The page you're looking for doesn't exist or has moved.",
}

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="page-hero">
        <div className="container">
          <p className="hero-eyebrow">404</p>
          <h1>This path hasn&apos;t been charted yet.</h1>
          <p>
            The page you&apos;re looking for doesn&apos;t exist or has moved. Head back to the
            homepage, or explore our destinations and tours instead.
          </p>
          <div className="not-found-actions">
            <a className="btn btn-uikit-primary" href="/">
              Back to home
            </a>
            <a className="btn btn-uikit-primary" href="/destinations">
              Explore destinations
            </a>
          </div>
        </div>
        <div className="mural-divider mural-divider--frieze" aria-hidden="true">
          <div className="mural-divider-inner" />
        </div>
      </section>
    </main>
  )
}
