import { TESTIMONIALS } from '@/lib/site-data'

/** Guest testimonial cards. Static markup. */
export function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="section-label">Guest accounts</p>
            <h2 className="section-heading">What it&apos;s like to travel with Fine Lanka Tours</h2>
          </div>
        </div>
        <div className="testimonials-track" id="testimonials-track">
          {TESTIMONIALS.map((t) => (
            <blockquote className="testimonial-card" key={t.name}>
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-trip">{t.trip}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
