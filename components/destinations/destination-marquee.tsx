'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { DestinationCard } from '@/components/destinations/destination-card'
import type { Destination } from '@/lib/destinations-data'

/**
 * Island Carousel — selected destination discovery direction.
 *
 * This component deliberately orchestrates the position, focus, and controls
 * around DestinationCard. It does not alter the card's established artwork,
 * media behavior, or detail interaction.
 */

const DRAG_THRESHOLD = 42

function wrappedIndex(index: number, length: number) {
  return ((index % length) + length) % length
}

function relativePosition(index: number, activeIndex: number, length: number) {
  let distance = index - activeIndex
  if (distance > length / 2) distance -= length
  if (distance < -length / 2) distance += length
  return distance
}

export function DestinationMarquee({ destinations }: { destinations: Destination[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [rudderTurn, setRudderTurn] = useState(0)
  const pointerStart = useRef<number | null>(null)
  const rudderLock = useRef(false)

  useEffect(() => {
    setActiveIndex(0)
    setRudderTurn(0)
  }, [destinations])

  if (!destinations.length) {
    return <p className="dest-empty">No destinations match that filter yet — try another region.</p>
  }

  const activeDestination = destinations[wrappedIndex(activeIndex, destinations.length)]
  const go = (direction: number) => {
    setActiveIndex((current) => wrappedIndex(current + direction, destinations.length))
  }

  const turnRudder = (direction: number) => {
    if (rudderLock.current) return
    rudderLock.current = true
    window.setTimeout(() => {
      rudderLock.current = false
    }, 260)
    // Keep the wheel's turn count continuous. Wrapping at eight turns made
    // 315deg jump back to 0deg, forcing a long reverse interpolation on mobile.
    setRudderTurn((current) => current + direction)
    go(direction)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(destinations.length - 1)
    }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return
    const delta = event.clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(delta) < DRAG_THRESHOLD) return
    go(delta > 0 ? -1 : 1)
  }

  return (
    <section id="destination-carousel-stage" className="island-carousel" aria-label="Explore destinations as an island carousel">
      <div className="island-carousel-topline">
        <span>Island carousel</span>
        <i aria-hidden="true" />
        <span>Drag or use arrow keys</span>
        <i aria-hidden="true" />
        <span>{destinations.length.toString().padStart(2, '0')} plotted places</span>
      </div>

      <div
        className="island-carousel-stage"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointerStart.current = null }}
        aria-describedby="island-carousel-instructions"
      >
        <p id="island-carousel-instructions" className="sr-only">
          Use left and right arrow keys, the left and right sides of the ship rudder, or swipe to browse destinations.
        </p>

        <div className="island-carousel-atlas-photo" aria-hidden="true" />
        <div className="island-carousel-orbit orbit-outer" aria-hidden="true" />
        <div className="island-carousel-orbit orbit-inner" aria-hidden="true" />
        <div className="island-carousel-crosshair" aria-hidden="true" />
        <div className="island-carousel-markings" aria-hidden="true">
          <span className="island-carousel-marking island-carousel-marking--nw">06° 55′ N</span>
          <span className="island-carousel-marking island-carousel-marking--ne">SERENDIB / 01</span>
          <span className="island-carousel-marking island-carousel-marking--sw">WESTING 79° 51′ E</span>
          <span className="island-carousel-marking island-carousel-marking--se">PLATE / {destinations.length.toString().padStart(2, '0')}</span>
          <i className="island-carousel-tick island-carousel-tick--x" />
          <i className="island-carousel-tick island-carousel-tick--y" />
        </div>

        <div className="island-carousel-compass" aria-hidden="true">
          <span>N</span><span>E</span><span>S</span><span>W</span>
          <strong>{(activeIndex + 1).toString().padStart(2, '0')}</strong>
          <small>/ {destinations.length.toString().padStart(2, '0')}</small>
        </div>

        <div className="island-carousel-deck">
          {destinations.map((destination, index) => {
            const distance = relativePosition(index, activeIndex, destinations.length)
            const absoluteDistance = Math.abs(distance)
            const direction = Math.sign(distance) || 1
            const visible = absoluteDistance <= 2
            const x = distance === 0 ? 0 : direction * (absoluteDistance === 1 ? 38 : 62)
            const y = distance === 0 ? 0 : absoluteDistance === 1 ? 24 : 44
            const scale = distance === 0 ? 1 : absoluteDistance === 1 ? 0.76 : 0.57
            const rotate = distance === 0 ? 0 : direction * (absoluteDistance === 1 ? 7 : 13)
            const opacity = distance === 0 ? 1 : absoluteDistance === 1 ? 0.72 : 0.26
            const cardStyle = {
              '--island-x': `${x}%`,
              '--island-y': `${y}px`,
              '--island-scale': scale,
              '--island-rotate': `${rotate}deg`,
              '--island-opacity': opacity,
              '--island-z': 10 - absoluteDistance,
            } as CSSProperties

            return (
              <div
                className={`island-carousel-card${index === activeIndex ? ' is-active' : ''}${visible ? ' is-visible' : ''}`}
                key={destination.name}
                style={cardStyle}
                aria-hidden={!visible}
                inert={index !== activeIndex ? true : undefined}
              >
                <DestinationCard destination={destination} index={index} mediaActive={index === activeIndex} />
              </div>
            )
          })}
        </div>

        <div className="island-carousel-clouds" aria-hidden="true" />
      </div>

      <div className="island-carousel-rudder" aria-label="Destination rudder controls">
        <img
          src="/images/serendib-brass-wheel.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ '--rudder-turn': `${rudderTurn * 45}deg` } as CSSProperties}
        />
        <button
          type="button"
          className="island-carousel-rudder-hit is-prev"
          onClick={() => turnRudder(-1)}
          aria-label="Turn the left rudder pole counterclockwise to show the previous destination"
        >
          <span className="sr-only">Previous destination</span>
        </button>
        <button
          type="button"
          className="island-carousel-rudder-hit is-next"
          onClick={() => turnRudder(1)}
          aria-label="Turn the right rudder pole clockwise to show the next destination"
        >
          <span className="sr-only">Next destination</span>
        </button>
        <span className="island-carousel-rudder-caption" aria-hidden="true">Turn a pole</span>
      </div>

      <div className="island-carousel-info-pane" aria-live="polite">
        <div className="island-carousel-info-pane-head">
          <p className="island-carousel-eyebrow">Current bearing</p>
          <span className="island-carousel-waypoint">Waypoint {(activeIndex + 1).toString().padStart(2, '0')}</span>
        </div>
        <div className="island-carousel-info-pane-body">
          <div className="island-carousel-info-copy">
            <h3>{activeDestination.name}</h3>
            <p>{activeDestination.blurb}</p>
          </div>
          <dl className="island-carousel-facts">
            <div>
              <dt>Region</dt>
              <dd>{activeDestination.region}</dd>
            </div>
            <div>
              <dt>Coordinates</dt>
              <dd>{activeDestination.coords}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="island-carousel-dots" aria-label="Choose a destination">
        {destinations.map((destination, index) => (
          <button
            type="button"
            key={destination.name}
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? 'is-active' : undefined}
            aria-label={`Show ${destination.name}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  )
}
