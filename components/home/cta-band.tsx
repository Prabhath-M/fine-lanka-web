import { Icon } from '@/components/icons'

/** "Tell us where in Sri Lanka" CTA band. Opens the shared enquiry
 *  modal (components/enquiry-modal.tsx, mounted in app/layout.tsx) via
 *  the delegated data-open-enquiry click listener — no local state
 *  needed here. */
export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>Tell us where in Sri Lanka, we&apos;ll work out how</h2>
        <p>Speak with a local travel designer today — no obligation, no scripts, no call centre.</p>
        <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
          <Icon name="pin" className="btn-icon" />
          Plan Your Journey
        </button>
      </div>
    </section>
  )
}
