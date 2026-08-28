'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons'
import { shouldRenderDestinationVideo } from '@/lib/destination-media'
import { slugify } from '@/lib/utils'
import type { Destination } from '@/lib/destinations-data'

/** A single destination card: a muted looping inline video plays behind the
 *  name/coords/region/description on the front, over a dark band so the
 *  text stays legible against whatever's playing behind it. Clicking or
 *  tapping slides a full detail drawer — highlights + an "Ask us about X" CTA —
 *  up over the video, same gilded liyawela-frame + ink-scrim drawer
 *  language as the homepage's single showcase panel (explore-section.tsx's
 *  .dest-panel), just at grid-card scale. Was a 3D-flip card before
 *  video existed for these; a literal 3D rotateY flip doesn't suit a
 *  <video> well (rendering it mid-rotation is inconsistent across
 *  browsers), so the reveal is a sliding drawer over a continuously-
 *  playing video instead — the same swap the homepage panel already
 *  made for the same reason.
 *
 *  Video begins muted, looping, and inline as soon as the browser allows.
 *  The carousel mounts media only for its active card so hidden cards do not
 *  decode the same loop in parallel. `prefers-reduced-motion` retains the
 *  poster-frame fallback. */
export function DestinationCard({
  destination,
  index,
  animate = false,
  mediaActive = true,
}: {
  destination: Destination
  index: number
  /** Adds the .reveal scroll-in treatment + a staggered --delay. Used
   *  by the homepage's featured grid (one-time render); the filterable
   *  destinations.html grid renders instantly instead, since it
   *  re-renders on every filter click — same distinction the original
   *  renderDestinationCards() made via its `animate` option. */
  animate?: boolean
  /** In the Island Carousel, only the foreground card mounts and decodes video. */
  mediaActive?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReducedMotion(mediaQuery.matches)
    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)
    return () => mediaQuery.removeEventListener('change', syncPreference)
  }, [])

  const slug = slugify(destination.name)

  useEffect(() => {
    if (reducedMotion || !mediaActive) {
      videoRef.current?.pause()
      return
    }
    videoRef.current?.play().catch(() => {
      /* The supplied poster remains a graceful fallback if a browser blocks playback. */
    })
  }, [mediaActive, reducedMotion])

  const setExpandedAndSyncVideo = (next: boolean) => setExpanded(next)

  const toggle = (e: { target: EventTarget | null }) => {
    if ((e.target as HTMLElement).closest('[data-open-enquiry]')) return
    setExpandedAndSyncVideo(!expanded)
  }

  return (
    <article
      className={`dest-card${animate ? ' reveal' : ''}${expanded ? ' is-open' : ''}`}
      style={animate ? ({ '--delay': `${index * 60}ms` } as React.CSSProperties) : undefined}
      tabIndex={0}
      role="button"
      aria-pressed={expanded}
      aria-label={`${destination.name} — show details`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        if ((e.target as HTMLElement).closest('[data-open-enquiry]')) return
        e.preventDefault()
        setExpandedAndSyncVideo(!expanded)
      }}
    >
      <img
        src="/images/dest-card-frame.png"
        alt=""
        aria-hidden="true"
        className="dest-card-frame"
        draggable={false}
      />
      <div className="dest-card-media">
        {!shouldRenderDestinationVideo(mediaActive, reducedMotion) && (
          <div
            className="dest-card-poster"
            aria-hidden="true"
          />
        )}
        {shouldRenderDestinationVideo(mediaActive, reducedMotion) && (
          <video
            ref={videoRef}
            className="dest-card-video"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={`https://picsum.photos/seed/finelanka-dest-${slug}/700/933`}
            aria-hidden="true"
          >
            <source src={`/videos/destinations/${slug}.mp4`} type="video/mp4" />
            <source src="/videos/destinations/ambient-atlas-loop.mp4" type="video/mp4" />
          </video>
        )}
        <div className="dest-card-scrim" aria-hidden="true" />
        <span className="dest-card-mark" aria-hidden="true">
          <Icon name="lotus" />
        </span>
        <span className="dest-card-toggle" aria-hidden="true">
          {expanded ? '\u2212' : '+'}
        </span>

        <div className="dest-card-front-info" aria-hidden={expanded}>
          <div className="dest-card-front-text">
            <p className="coord-label">{destination.coords}</p>
            <h3>{destination.name}</h3>
            <p className="dest-region">{destination.region}</p>
            <p className="dest-teaser">{destination.blurb}</p>
            <p className="dest-flip-hint">Tap or press Enter to explore ↴</p>
          </div>
        </div>

        <div className="dest-card-detail" aria-hidden={!expanded}>
          <p className="dest-blurb">{destination.blurb}</p>
          <ul className="dest-highlights">
            {(destination.highlights || []).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <button
            type="button"
            className="dest-back-cta"
            data-open-enquiry=""
            tabIndex={expanded ? 0 : -1}
          >
            Ask us about {destination.name}
          </button>
        </div>
      </div>
    </article>
  )
}
