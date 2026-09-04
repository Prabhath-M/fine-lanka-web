'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@/components/icons'
import { SITE } from '@/lib/site-data'
import { HERO_OPENING_COMPLETE_EVENT } from '@/components/home/typed-opening'

/**
 * Homepage hero — the video is deliberately held on its poster frame until
 * the TypedOpening reports that the complete typing-and-dissolve sequence has
 * ended. This keeps the first visual arrival calm and intentional.
 *
 * preload="auto" (not "metadata") is deliberate: the typed opening runs for
 * several seconds before beginHeroVideo() is ever called, which is a real
 * buffering head start. With "metadata" the browser fetches nothing beyond
 * duration/dimensions ahead of play(), so playback raced the download and
 * reliably stalled ~2s in once the small initial buffer was consumed —
 * exactly during the window a slower/first-load connection hasn't caught
 * up yet. "auto" lets that idle time actually be spent buffering.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Home can be mounted again through client-side navigation. Reset any
    // retained media state before the new opening sequence starts so a prior
    // visit cannot leak playback into the arrival ritual.
    video.pause()
    try {
      video.currentTime = 0
    } catch {
      // The media metadata may not be available yet; the poster remains safe.
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let hasStarted = false
    const beginHeroVideo = () => {
      if (hasStarted || reducedMotionQuery.matches) return
      hasStarted = true
      video.play().catch(() => {
        /* The poster frame remains the intentional fallback if autoplay is unavailable. */
      })
    }

    const opening = document.querySelector<HTMLElement>('.typed-opening')
    const openingIsBypassed = !opening || getComputedStyle(opening).display === 'none'

    if (openingIsBypassed) {
      beginHeroVideo()
    } else {
      window.addEventListener(HERO_OPENING_COMPLETE_EVENT, beginHeroVideo, { once: true })
    }

    const stopForReducedMotion = () => {
      if (reducedMotionQuery.matches) video.pause()
    }
    reducedMotionQuery.addEventListener('change', stopForReducedMotion)

    return () => {
      window.removeEventListener(HERO_OPENING_COMPLETE_EVENT, beginHeroVideo)
      reducedMotionQuery.removeEventListener('change', stopForReducedMotion)
    }
  }, [])

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero-video"
        muted
        loop
        playsInline
        preload="auto"
        poster="https://picsum.photos/seed/finelanka-hero/1600/900"
      >
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay" />
      <svg
        className="hero-route"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path className="route-line" d="M60,560 C260,480 340,300 560,260 C760,225 820,120 1040,90" />
        <circle cx="60" cy="560" r="4" />
        <circle cx="560" cy="260" r="4" />
        <circle cx="1040" cy="90" r="4" />
      </svg>

      <div className="container hero-inner">
        <p className="hero-eyebrow">
          6.9271° N, 79.8612° E — Colombo, Est. <span data-founded>{SITE.foundedYear}</span>
        </p>
        <h1>Tailor-made journeys across Sri Lanka</h1>
        <p className="hero-sub">
          A dedicated local travel designer maps your route through ancient citadels, mist-veiled
          tea country, wildlife reserves and sun-drenched southern shores — then stays on call for
          every mile of the journey. No templates. No call centres.
        </p>

        <div className="hero-actions">
          <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
            <Icon name="pin" className="btn-icon" />
            Start Planning
          </button>
          <a href="#destinations" className="btn btn-uikit-secondary">
            Explore Sri Lanka
          </a>
        </div>
      </div>
    </section>
  )
}
