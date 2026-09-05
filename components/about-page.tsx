'use client'

import Link from 'next/link'
import { usePreloadImages } from '@/lib/use-preload-images'

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

// No opening animation on this page, so nothing to time this against —
// these just start fetching as soon as the page mounts, same as any
// other page load (docs/OPENING-ANIMATION-PRELOAD-PLAN.md's approach,
// applied here without the animation half of it). Verified against the
// actual cascade winners in app/globals.css: `.about-refined` (also on
// this page's <main>) overrides the plain `.about-hero`/`.about-origin`/
// `.about-principles` background rules, so these are the images that
// really render, not the ones the base rules alone would suggest.
// `.about-hero-photo`'s <img> is already `loading="eager"`, so it's left
// out here — nothing to gain preloading what's already prioritized.
const ABOUT_PRELOAD_IMAGES = [
  '/images/fine-lanka-about-bg-hero-1600w.webp',
  '/images/fine-lanka-about-bg-origin-left-1600w.webp',
  '/images/fine-lanka-kandyan-dancers-960w.webp',
  '/images/fine-lanka-about-bg-invitation-1600w.webp',
  '/images/fine-lanka-about-bg-principles-left-1600w.webp',
]

export function AboutPage() {
  usePreloadImages(ABOUT_PRELOAD_IMAGES)

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
              src="/images/fine-lanka-esala-perahera-960w.webp"
              srcSet="/images/fine-lanka-esala-perahera-480w.webp 480w, /images/fine-lanka-esala-perahera-960w.webp 960w, /images/fine-lanka-esala-perahera-1600w.webp 1600w, /images/fine-lanka-esala-perahera.webp 1707w"
              sizes="(max-width: 900px) 100vw, 480px"
              alt="Illuminated elephant procession at the Kandy Esala Perahera"
              width={1707}
              height={2560}
              loading="eager"
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
              src="/images/fine-lanka-kandyan-dancers-960w.webp"
              srcSet="/images/fine-lanka-kandyan-dancers-480w.webp 480w, /images/fine-lanka-kandyan-dancers-960w.webp 960w, /images/fine-lanka-kandyan-dancers-1600w.webp 1600w, /images/fine-lanka-kandyan-dancers.webp 2560w"
              sizes="(max-width: 900px) 100vw, 640px"
              alt="A Kandyan dancer wearing traditional Sri Lankan ceremonial costume"
              width={2560}
              height={1707}
              loading="lazy"
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
