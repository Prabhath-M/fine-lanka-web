'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { planDistinctRoam, planRoam, type Point } from '@/lib/adventure-roam'

/**
 * Routes of the sprites in a group (e.g. all the birds), by sprite: each sprite's latest route, so a
 * new flight can be planned to differ from the others' and from the sprite's own previous one.
 */
const boards = new Map<string, Map<string, Point[]>>()

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
  /** Sprites with the same group never fly the same route: each flight is planned to differ from the rest. */
  group?: string
}

/**
 * A decorative sprite that repeatedly flies a new random route across its (viewport-sized) layer:
 * in from one edge, through a few random points, out through another edge, a pause, then again.
 * Each route is planned from the layer's current size, so it always starts relative to the screen
 * as it is at that moment. Reduced-motion visitors do not see it at all.
 */
export function Roamer({ active, className = '', children, speed, waypoints, pause, tilt, forward, startDelay = 0, group }: RoamerProps) {
  const id = useId()
  const ref = useRef<HTMLSpanElement>(null)
  const animation = useRef<Animation | null>(null)

  useEffect(() => {
    const el = ref.current
    const layer = el?.parentElement
    if (!el || !layer) return

    const board = group ? (boards.get(group) ?? boards.set(group, new Map()).get(group)) : undefined
    if (!active) {
      board?.delete(id)
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
      const options = {
        width: layer.clientWidth,
        height: layer.clientHeight,
        spriteW: el.offsetWidth,
        spriteH: el.offsetHeight,
        speed: rand(speed),
        waypoints,
        tilt,
        forward,
      }
      // With a group, avoid every route on the board: the others' latest ones and this sprite's last.
      const plan = board ? planDistinctRoam(options, [...board.values()]) : planRoam(options)
      board?.set(id, plan.path)
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
      board?.delete(id)
      if (animation.current) animation.current.onfinish = null
    }
  }, [active, speed, waypoints, pause, tilt, forward, startDelay, group, id])

  useEffect(() => () => animation.current?.cancel(), [])

  return (
    <span ref={ref} className={`adventure-roamer ${className}`}>
      {children}
    </span>
  )
}
