import Link from 'next/link'

/**
 * Design reminder: About is a focused Sri Lankan travel-studio profile.
 * Keep a spare editorial rhythm—one meaningful image per story movement,
 * concise copy, and carefully restrained heritage texture.
 */
const PRINCIPLES = [
  {
    number: '01',
    title: 'Begin with context',
    text: 'We listen closely for pace, curiosities and the quiet pauses that make a route feel genuinely your own.',
  },
  {
    number: '02',
    title: 'Know the island well',
    text: 'Deep local knowledge of seasons, distances and everyday rhythms informs every recommendation we make.',
  },
  {
    number: '03',
    title: 'Stay close to detail',
    text: 'One trusted point of contact keeps the journey clear, from the first conversation to the flight home.',
  },
]

export function AboutPage() {
  return (
    <main className="about-page about-refined">
      <section className="about-hero">
        <div className="about-hero-wash" aria-hidden="true" />
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <p className="about-eyebrow">Fine Lanka Tours · Sri Lanka based</p>
            <h1>
              Travel begins
              <em> with listening.</em>
            </h1>
            <p className="about-hero-lede">
              Fine Lanka is a local travel studio for travellers seeking a more considered way
              through Sri Lanka — shaped by genuine conversation, cultural depth, and the time
              to truly notice the island.
            </p>
            <div className="about-hero-actions">
              <Link className="btn btn-uikit-primary" href="/booking">
                Plan a journey
              </Link>
            </div>
          </div>
          <figure className="about-hero-photo">
            <img
              src="/images/fine-lanka-esala-perahera.jpg"
              alt="Illuminated elephant procession at the Kandy Esala Perahera"
            />
            <figcaption>
              <span>Kandy, after dark</span>
              <small>Esala Perahera</small>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-origin" id="our-way">
        <div className="container about-origin-grid">
          <div className="about-origin-title">
            <p className="about-eyebrow">How we work</p>
            <h2>A considered route, not a catalogue.</h2>
          </div>
          <div className="about-origin-copy">
            <p>
              Sri Lanka is compact on a map and expansive in experience. A temple at dawn, a train
              through the hills and a late coast-side dinner can all belong to one journey — when
              the rhythm is right.
            </p>
            <p>
              We shape that rhythm with practical clarity and room for discovery, always in a way
              that respects the communities and landscapes that make this island extraordinary.
            </p>
          </div>
          <figure className="about-origin-photo">
            <img
              src="/images/fine-lanka-kandyan-dancers.jpg"
              alt="A Kandyan dancer wearing traditional Sri Lankan ceremonial costume"
            />
            <figcaption>Living tradition · Kandy</figcaption>
          </figure>
        </div>
      </section>

      <section className="about-principles">
        <div className="container">
          <div className="about-principles-heading">
            <div>
              <p className="about-eyebrow">What guides us</p>
              <h2>Depth, clarity and care.</h2>
            </div>
            <p>We are deliberate about what belongs in an itinerary, what should stay open to chance, and who you can rely on once the journey becomes real life.</p>
          </div>
          <div className="about-principles-grid">
            {PRINCIPLES.map((principle) => (
              <article className="about-principle" key={principle.number}>
                <span className="about-principle-number">{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-invitation">
        <div className="container about-invitation-inner">
          <p className="about-eyebrow">The first conversation</p>
          <h2>Tell us what stays with you. We will help find the route.</h2>
          <p>A place you have long wanted to see, a kind of day you would like more of, or simply the time you have available — any of these is enough to begin.</p>
          <button className="btn btn-uikit-primary" data-open-enquiry="" type="button">
            Begin the conversation
          </button>
        </div>
      </section>
    </main>
  )
}
