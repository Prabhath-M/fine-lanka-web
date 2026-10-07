'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { planRoam } from '@/lib/adventure-roam'

interface RoamerProps {
  /** Flies only while true; when it turns false the sprite stops and is hidden once its layer has faded. */
  active: boolean
  className?: string
  children: ReactNode
  /** Speed range, px per second. */
  speed: [number, number]
  /** Range of random points to pass through before leaving. */
  waypoints: [number, number]
  /** Range of seconds between leaving the screen and coming back on a new route. */
  pause: [number, number]
  tilt?: number
  /** Fish: only ever move forward (right), with a slow float back or ahead now and then. */
  forward?: boolean
  /** Seconds before the first flight, so several sprites do not start together. */
  startDelay?: number
}

/**
 * A decorative sprite that repeatedly flies a new random route across its (viewport-sized) layer:
 * in from one edge, through a few random points, out through another edge, a pause, then again.
 * Each route is planned from the layer's current size, so it always starts relative to the screen
 * as it is at that moment. Reduced-motion visitors do not see it at all.
 */
export function Roamer({ active, className = '', children, speed, waypoints, pause, tilt, forward, startDelay = 0 }: RoamerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const animation = useRef<Animation | null>(null)

  useEffect(() => {
    const el = ref.current
    const layer = el?.parentElement
    if (!el || !layer) return

    if (!active) {
      // Freeze where it is while the layer fades out, then clear it.
      animation.current?.pause()
      const clear = window.setTimeout(() => {
        animation.current?.cancel()
        animation.current = null
        el.style.visibility = 'hidden'
      }, 700)
      return () => window.clearTimeout(clear)
    }

    if (typeof el.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rand = (range: [number, number]) => range[0] + Math.random() * (range[1] - range[0])
    let timer = 0
    let stopped = false
    const launch = () => {
      if (stopped) return
      const plan = planRoam({
        width: layer.clientWidth,
        height: layer.clientHeight,
        spriteW: el.offsetWidth,
        spriteH: el.offsetHeight,
        speed: rand(speed),
        waypoints,
        tilt,
        forward,
      })
      animation.current?.cancel()
      el.style.visibility = 'visible'
      const flight = el.animate(plan.keyframes, { duration: plan.duration, easing: 'linear', fill: 'forwards' })
      animation.current = flight
      flight.onfinish = () => {
        el.style.visibility = 'hidden'
        timer = window.setTimeout(launch, rand(pause) * 1000)
      }
    }
    timer = window.setTimeout(launch, (startDelay + Math.random() * 0.8) * 1000)
    return () => {
      stopped = true
      window.clearTimeout(timer)
      if (animation.current) animation.current.onfinish = null
    }
  }, [active, speed, waypoints, pause, tilt, forward, startDelay])

  useEffect(() => () => animation.current?.cancel(), [])

  return (
    <span ref={ref} className={`adventure-roamer ${className}`}>
      {children}
    </span>
  )
}
