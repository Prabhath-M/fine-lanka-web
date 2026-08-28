import { MuralNav } from '@/components/mural-nav'

export default function NavPreviewPage() {
  return (
    <main className="min-h-screen bg-[var(--sl-ink)] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--sl-brass-light)]">
            Standalone Preview
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-[var(--sl-text-on-dark)] md:text-3xl">
            Living Mural Navigation
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty font-sans text-sm leading-relaxed text-[var(--sl-text-on-dark-muted)]">
            A hand-painted Sigiriya-fresco flipbook cross-fades behind the nav bar, morphing from a
            Kandyan dancer and Geta Bera drummer into ocean waves and back. Resize the window to see
            the frames stay fitted to the bar.
          </p>
        </header>

        {/* Full-width bar */}
        <MuralNav />

        {/* Narrow bar to confirm the animation stays reactive to size */}
        <div className="mx-auto mt-10 max-w-md">
          <p className="mb-3 text-center font-sans text-xs uppercase tracking-[0.2em] text-[var(--sl-text-on-dark-muted)]">
            Narrow container
          </p>
          <MuralNav />
        </div>
      </div>
    </main>
  )
}
