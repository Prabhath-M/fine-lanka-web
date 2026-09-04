'use client'

import { useEffect, useState } from 'react'

/**
 * Destinations opening ritual — Archival Cartography direction.
 *
 * The brass ship's-wheel remains the first interaction and visual signature.
 * This component owns only the intro overlay lifecycle; the destination page
 * beneath it is responsible for the atlas composition and staged card field.
 */

const WHEEL_MS = 2650
const DOOR_MS = 820

export function ChartIntro({ children, onReveal }: { children: React.ReactNode; onReveal?: () => void }) {
  const [ready, setReady] = useState(false)
  const [showRitual, setShowRitual] = useState(true)
  const [doorsOpening, setDoorsOpening] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

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
    const doorsTimer = window.setTimeout(() => setDoorsOpening(true), WHEEL_MS)
    const readyTimer = window.setTimeout(() => setReady(true), WHEEL_MS + DOOR_MS)
    return () => {
      window.clearTimeout(doorsTimer)
      window.clearTimeout(readyTimer)
    }
  }, [replayKey])

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
                src="/images/serendib-brass-wheel.png"
                alt=""
                draggable={false}
                width={800}
                height={800}
                loading="eager"
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
