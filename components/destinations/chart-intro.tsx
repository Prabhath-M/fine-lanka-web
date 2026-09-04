'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DESTINATION_VIDEO_READY_EVENT } from '@/components/destinations/destination-card'

/**
 * Destinations opening ritual — Archival Cartography direction.
 *
 * The brass ship's-wheel remains the first interaction and visual signature.
 * This component owns only the intro overlay lifecycle; the destination page
 * beneath it is responsible for the atlas composition and staged card field.
 */

// Kept in step with the .chart-ritual-wheel img `chartWheelTurnSmooth`
// animation duration in app/globals.css (slowed from 2650ms to give the
// wheel image, and the assets warmed early from the Home page per
// docs/OPENING-ANIMATION-PRELOAD-PLAN.md, more time to actually load
// before the minimum-time gate is satisfied) — change both together.
const WHEEL_MS = 3600
const DOOR_MS = 820
// Hard cap on how much longer than WHEEL_MS we'll wait for the wheel image
// and first destination video to actually arrive before opening the doors
// anyway — a slow connection or an errored asset should never leave someone
// staring at the ritual indefinitely.
const MAX_EXTRA_WAIT_MS = 4000

export function ChartIntro({ children, onReveal }: { children: React.ReactNode; onReveal?: () => void }) {
  const [ready, setReady] = useState(false)
  const [showRitual, setShowRitual] = useState(true)
  const [doorsOpening, setDoorsOpening] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  // On the very first run, the doors must not open before the brass wheel
  // image and the first destination video are actually ready — otherwise
  // (most visibly on a cold cache) the ritual finishes and the doors open
  // onto a wheel/card that hasn't loaded yet. Once that's happened once,
  // the assets are known-loaded, so the replay button can go straight back
  // to the original fixed timing without re-waiting on anything.
  const hasOpenedOnceRef = useRef(false)
  const wheelLoadedRef = useRef(false)
  const videoReadyRef = useRef(false)
  const minTimeElapsedRef = useRef(false)
  const openedRef = useRef(false)
  const openDoorsRef = useRef<() => void>(() => {})

  const maybeOpenDoors = useCallback(() => {
    if (openedRef.current) return
    if (minTimeElapsedRef.current && wheelLoadedRef.current && videoReadyRef.current) {
      openDoorsRef.current()
    }
  }, [])

  const onWheelImageSettled = useCallback(() => {
    wheelLoadedRef.current = true
    maybeOpenDoors()
  }, [maybeOpenDoors])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setShowRitual(false)
      setReady(true)
      return
    }
    setShowRitual(true)
    setDoorsOpening(false)
    setReady(false)
    openedRef.current = false

    openDoorsRef.current = () => {
      if (openedRef.current) return
      openedRef.current = true
      hasOpenedOnceRef.current = true
      setDoorsOpening(true)
      window.setTimeout(() => setReady(true), DOOR_MS)
    }

    if (hasOpenedOnceRef.current) {
      // Replay: assets are already loaded and playing — no need to gate.
      const doorsTimer = window.setTimeout(() => openDoorsRef.current(), WHEEL_MS)
      return () => window.clearTimeout(doorsTimer)
    }

    wheelLoadedRef.current = false
    videoReadyRef.current = false
    minTimeElapsedRef.current = false

    const minTimer = window.setTimeout(() => {
      minTimeElapsedRef.current = true
      maybeOpenDoors()
    }, WHEEL_MS)
    const maxWaitTimer = window.setTimeout(() => openDoorsRef.current(), WHEEL_MS + MAX_EXTRA_WAIT_MS)

    const onVideoReady = () => {
      videoReadyRef.current = true
      maybeOpenDoors()
    }
    window.addEventListener(DESTINATION_VIDEO_READY_EVENT, onVideoReady)

    return () => {
      window.clearTimeout(minTimer)
      window.clearTimeout(maxWaitTimer)
      window.removeEventListener(DESTINATION_VIDEO_READY_EVENT, onVideoReady)
    }
  }, [replayKey, maybeOpenDoors])

  useEffect(() => {
    if (!ready || !onReveal) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const scrollTimer = window.setTimeout(onReveal, 140)
    return () => window.clearTimeout(scrollTimer)
  }, [ready, onReveal])

  const replay = () => {
    setReady(false)
    setShowRitual(true)
    setDoorsOpening(false)
    setReplayKey((key) => key + 1)
  }

  return (
    <div className={`chart-intro ${ready ? 'is-ready' : 'is-loading'} ${doorsOpening ? 'is-opening' : ''}`}>
      {showRitual && (
        <div
          className={`chart-ritual ${doorsOpening ? 'is-opening' : ''} ${ready ? 'is-done' : ''}`}
          key={replayKey}
          aria-hidden={ready}
          aria-live="polite"
          data-chart-ritual
        >
          <div className="chart-ritual-topline">
            <span className="chart-ritual-rule" />
            SERENDIB &middot; ISLAND CHART
            <span className="chart-ritual-rule" />
          </div>
          <div className="chart-ritual-center">
            <div className="chart-ritual-orbit orbit-a" />
            <div className="chart-ritual-orbit orbit-b" />
            <div className="chart-ritual-wheel">
              <img
                src="/images/serendib-brass-wheel.webp"
                alt=""
                draggable={false}
                width={800}
                height={800}
                loading="eager"
                onLoad={onWheelImageSettled}
                onError={onWheelImageSettled}
              />
            </div>
            <p className="chart-ritual-kicker">Turn the wheel</p>
            <h1 className="chart-ritual-title">
              Let the island
              <br />
              <em>surface.</em>
            </h1>
            <p className="chart-ritual-subtitle">Thirteen coordinates. One long way around.</p>
          </div>
          <div className="chart-ritual-doors" aria-hidden="true">
            <div className="chart-ritual-door chart-ritual-door--left">
              <span className="chart-ritual-door-grain" />
              <span className="chart-ritual-door-hardware" />
            </div>
            <div className="chart-ritual-door chart-ritual-door--right">
              <span className="chart-ritual-door-grain" />
              <span className="chart-ritual-door-hardware" />
            </div>
            <span className="chart-ritual-door-lock" />
          </div>
          <div className="chart-ritual-footer">
            <span>Charting your way through Sri Lanka</span>
            <span className="chart-ritual-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>North / 07&deg; N</span>
          </div>
        </div>
      )}
      <div className="chart-intro-content">{children}</div>
      {ready && (
        <button type="button" className="chart-replay" onClick={replay} aria-label="Replay the chart intro">
          <span className="chart-replay-icon">&#8635;</span>
          Turn again
        </button>
      )}
    </div>
  )
}
