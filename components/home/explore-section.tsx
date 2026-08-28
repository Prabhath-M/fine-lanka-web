'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/icons'
import { DESTINATIONS } from '@/lib/destinations-data'
import { slugify } from '@/lib/utils'

/**
 * Design reminder: Explore is a connected destination interface.
 * The video introduces a place and the right-side interactive map locates it,
 * so both containers always read as two parts of a single journey action.
 */
function parseObjectPosition(value: string) {
  const keywordX: Record<string, number> = { left: 0, center: 0.5, right: 1 }
  const keywordY: Record<string, number> = { top: 0, center: 0.5, bottom: 1 }
  const toFraction = (token: string, keywordMap: Record<string, number>) => {
    if (token in keywordMap) return keywordMap[token]
    if (token.endsWith('%')) return Number.parseFloat(token) / 100
    return 0.5
  }
  const parts = (value || '').trim().split(/\s+/)
  if (parts.length < 2) return { x: 0.5, y: 0.5 }
  return { x: toFraction(parts[0], keywordX), y: toFraction(parts[1], keywordY) }
}

const ON_MAP = DESTINATIONS.filter((destination) => destination.mapX != null && destination.mapY != null)
const ROTATE_MS = 8000
const FULL_MAP_WIDTH = 1536
const ISLAND_CROP_X = 742
const ISLAND_CROP_WIDTH = 794

export function ExploreSection() {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [pinPositions, setPinPositions] = useState<Record<string, { left: number; top: number }>>({})

  const imgRef = useRef<HTMLImageElement | null>(null)
  const pinsRef = useRef<HTMLDivElement | null>(null)
  const indexRef = useRef(0)
  const openRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const goToRef = useRef<(target: number, resetTimer?: boolean) => void>(() => {})

  useEffect(() => { indexRef.current = index }, [index])
  useEffect(() => { openRef.current = open }, [open])

  const reposition = useCallback(() => {
    const image = document.querySelector<HTMLImageElement>('.explore-map-image') ?? imgRef.current
    const pins = pinsRef.current
    if (!image || !pins || !image.naturalWidth || !image.naturalHeight) return

    const width = pins.clientWidth
    const height = pins.clientHeight
    if (!width || !height) return

    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
    const renderedWidth = image.naturalWidth * scale
    const renderedHeight = image.naturalHeight * scale
    const position = parseObjectPosition(getComputedStyle(image).objectPosition)
    const offsetX = (width - renderedWidth) * position.x
    const offsetY = (height - renderedHeight) * position.y

    const next: Record<string, { left: number; top: number }> = {}
    ON_MAP.forEach((destination) => {
      const originalX = (destination.mapX! / 100) * FULL_MAP_WIDTH
      const cropRelativeX = originalX - ISLAND_CROP_X
      next[slugify(destination.name)] = {
        left: offsetX + (cropRelativeX / ISLAND_CROP_WIDTH) * renderedWidth,
        top: offsetY + (destination.mapY! / 100) * renderedHeight,
      }
    })
    setPinPositions(next)
  }, [])

  useEffect(() => {
    let frame = requestAnimationFrame(reposition)
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(reposition)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
    }
  }, [reposition])

  const startTimer = useCallback(() => {
    if (ON_MAP.length <= 1) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (!openRef.current) goToRef.current((indexRef.current + 1) % ON_MAP.length)
    }, ROTATE_MS)
  }, [])

  const goTo = useCallback((target: number, resetTimer = false) => {
    if (target === indexRef.current) return
    if (resetTimer) startTimer()
    setIndex(target)
    setOpen(false)
  }, [startTimer])

  useEffect(() => { goToRef.current = goTo }, [goTo])
  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startTimer])

  if (!ON_MAP.length) return null

  const current = ON_MAP[index]
  const currentSlug = slugify(current.name)

  return (
    <section className="explore-studio-section explore-linked-section explore-island-focus explore-portrait-frame explore-heritage-rebuild" id="destinations">
      <div className="explore-studio-bg" aria-hidden="true" />
      <div className="container explore-studio-shell">
        <header className="explore-studio-intro">
          <div>
            <p className="section-label">Ceylon heritage atlas</p>
            <p className="explore-studio-kicker">A story in the frame · a route on the island</p>
          </div>
          <div className="explore-studio-copy">
            <h2>Sri Lanka, held in story and place.</h2>
            <p>Begin with a single framed moment, then follow its setting across the island. Each marker binds the moving image and the map into one continuous, considered route.</p>
          </div>
        </header>

        <div className="explore-studio-workbench">
          <article className="explore-map-card">
            <header className="explore-card-heading">
              <div>
                <span>The island ledger</span>
                <strong>Choose a marker to change the framed story</strong>
              </div>
              <span className="explore-map-count">{String(ON_MAP.length).padStart(2, '0')} places</span>
            </header>
            <div className="explore-map-canvas">
              <Image
                ref={imgRef}
                className="explore-map-image"
                src="/images/sri-lanka-map-island-focus.jpg"
                alt="Island-focused illustrated interactive map of Sri Lanka marking Fine Lanka Tours destinations"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
                onLoad={() => requestAnimationFrame(reposition)}
              />
              <div className="explore-atlas-pins" ref={pinsRef} aria-label="Select a destination on the illustrated Sri Lanka map">
                {ON_MAP.map((destination, destinationIndex) => {
                  const slug = slugify(destination.name)
                  const position = pinPositions[slug]
                  const cropPercentageX = ((((destination.mapX ?? 0) / 100) * FULL_MAP_WIDTH - ISLAND_CROP_X) / ISLAND_CROP_WIDTH) * 100
                  return (
                    <button
                      type="button"
                      key={slug}
                      className={`map-pin${slug === currentSlug ? ' is-active' : ''}`}
                      aria-label={`Show ${destination.name}`}
                      style={position
                        ? { left: `${position.left}px`, top: `${position.top}px` }
                        : { left: `${cropPercentageX}%`, top: `${destination.mapY ?? 0}%` }}
                      onClick={() => goTo(destinationIndex, true)}
                    >
                      <span className="map-pin-glow" />
                      <span className="map-pin-ping" />
                    </button>
                  )
                })}
              </div>
            </div>
            <footer className="explore-map-card-footer">
              <div className="explore-map-location">
                <span><i aria-hidden="true" /> Now located</span>
                <strong>{current.name} · {current.region}</strong>
              </div>
              <div className="explore-map-support">
                <p>{current.blurb}</p>
                <Link href="/destinations" className="explore-map-destinations-link">
                  <span>View all destinations</span>
                  <b aria-hidden="true">↗</b>
                </Link>
              </div>
            </footer>
          </article>

          <aside className="explore-video-card" aria-live="polite">
            <header className="explore-card-heading">
              <div>
                <span>A framed island story</span>
                <strong>Watch, then trace · {current.name}</strong>
              </div>
              <span className="explore-video-index">{String(index + 1).padStart(2, '0')} / {String(ON_MAP.length).padStart(2, '0')}</span>
            </header>
            <div className="explore-atlas-window">
              <div className={`dest-panel${open ? ' is-open' : ''}`} data-slug={currentSlug}>
                <span className="dest-panel-corner dest-panel-corner-tl" aria-hidden="true"><Icon name="flourish" /></span>
                <span className="dest-panel-corner dest-panel-corner-tr" aria-hidden="true"><Icon name="flourish" /></span>
                <span className="dest-panel-corner dest-panel-corner-br" aria-hidden="true"><Icon name="flourish" /></span>
                <span className="dest-panel-corner dest-panel-corner-bl" aria-hidden="true"><Icon name="flourish" /></span>
                <div className="dest-panel-media">
                  <div className="dest-panel-media-inner">
                    <video
                      key={currentSlug}
                      className="dest-panel-video"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onError={(event) => {
                        const video = event.currentTarget
                        if (video.dataset.usingFallback === 'true') return
                        video.dataset.usingFallback = 'true'
                        video.src = '/videos/destinations/ambient-atlas-loop.mp4'
                        video.load()
                        void video.play().catch(() => undefined)
                      }}
                    >
                      <source src={`/videos/destinations/${currentSlug}.mp4`} type="video/mp4" />
                    </video>
                    <div className="dest-panel-scrim" />
                    <div className="dest-panel-detail">
                      <p className="dest-blurb">{current.blurb}</p>
                      <ul className="dest-highlights">
                        {(current.highlights || []).map((highlight) => <li key={highlight}>{highlight}</li>)}
                      </ul>
                      <button type="button" className="dest-back-cta" data-open-enquiry="">Ask us about {current.name}</button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="dest-panel-toggle"
                    aria-label={`Show details for ${current.name}`}
                    aria-expanded={open}
                    onClick={() => setOpen((value) => !value)}
                  >
                    {open ? '−' : '+'}
                  </button>
                </div>
                <div className="dest-panel-caption">
                  <div className="dest-panel-caption-text">
                    <h3>{current.name}</h3>
                    <p className="dest-panel-caption-sub">{current.blurb}</p>
                  </div>
                  <div className="dest-panel-caption-side">
                    <div className="dest-panel-dots">
                      {ON_MAP.map((destination, destinationIndex) => (
                        <button
                          type="button"
                          key={destination.name}
                          className={`dest-panel-dot${destinationIndex === index ? ' is-active' : ''}`}
                          aria-label={`Show destination ${destinationIndex + 1} of ${ON_MAP.length}`}
                          aria-current={destinationIndex === index}
                          onClick={() => goTo(destinationIndex, true)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <div className="explore-journey-rail" aria-hidden="true">
            <span><em>01</em> Enter the story</span>
            <i />
            <span><em>02</em> Trace it on the island</span>
          </div>
        </div>
      </div>
    </section>
  )
}
