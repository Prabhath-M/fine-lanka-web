'use client'

// Design reminder: the Home route is an editorial Sri Lankan heritage journey;
// the typed arrival is reserved for a true route arrival, not a target section.
import { useEffect } from 'react'
import { CtaBand } from '@/components/home/cta-band'
import { ExploreSection } from '@/components/home/explore-section'
import { Features } from '@/components/home/features'
import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { Newsletter } from '@/components/home/newsletter'
import { Process } from '@/components/home/process'
import { Testimonials } from '@/components/home/testimonials'
import { TypedOpening } from '@/components/home/typed-opening'

export function HomePage() {
  // ---- Fades/slides elements with the .reveal class in as they enter
  // view (was initScrollReveal() in main.js — global in the original
  // too). Covers Features and Process. The explore-window is
  // deliberately excluded here and manages its own reveal state inside
  // ExploreSection instead: that component re-renders on every pin/dot
  // click (index/open/fading state), and since this effect adds
  // "is-visible" imperatively via classList outside React, a re-render
  // would recompute className from JSX and wipe it straight back off —
  // the panel would appear to vanish the first time it was clicked. ----
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll('.reveal')).filter(
      (el) => !el.closest('.explore-map-section'),
    )

    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <TypedOpening />
      <Hero />
      <Features />
      <Intro />
      <ExploreSection />
      <Process />
      <Testimonials />
      <CtaBand />
      <Newsletter />
    </main>
  )
}
