'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PROCESS_STEPS } from '@/lib/site-data'

/**
 * "How it works" section — this is the FlightReveal prototype, ported
 * over as-is: same colors, same fonts, same shadows, same curved-path /
 * plane / shadow-plane animation math, same card treatment. Nothing
 * about the visual design has been touched. The only things that changed
 * from the source prototype are the four waypoints themselves — instead
 * of four cities with flight-log fields, each point is a PROCESS_STEP
 * with a title and a description — and the header copy above the route,
 * since it referenced the demo's fictional airline/city pair directly.
 */

// 960x540 viewBox (16:9, matches Tailwind's aspect-video) so every
// on-screen % position lines up exactly with the SVG's own coordinates.
const VB_W = 960
const VB_H = 540

type Point = { x: number; y: number; code: string; title: string; text: string }

// Same zigzag route as the source prototype: down, up, down, up across
// the canvas.
const LAYOUT = [
  { x: 40, y: 355 },
  { x: 350, y: 195 },
  { x: 630, y: 350 },
  { x: 920, y: 195 },
]

const POINTS: Point[] = PROCESS_STEPS.slice(0, 4).map((step, i) => ({
  ...LAYOUT[i],
  code: `0${i + 1}`,
  title: step.title,
  text: step.text,
}))

// Build each leg as its own independent curved arc: point 1 curves into
// point 2, point 2 into point 3, point 3 into point 4 — a separate
// quadratic-Bezier bulge per leg (via a single offset control point),
// rather than one continuous spline smoothed across all four points.
// Every leg bulges to the same side, so the whole route reads as one
// consistent clockwise sweep rather than an alternating S-curve. The path
// itself keeps its kink at each waypoint; the turn is smoothed out
// separately, as a heading animation: each leg flares level near its end
// (see animateLeg), then turns onto the next heading while paused at the
// point (see animateTurnAtPoint below) — not by reshaping this path.
function curvedLegsPath(pts: Point[], bulgeRatio = 0.22) {
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy)
    // perpendicular to the leg, same side every time so every leg bulges
    // the same way (a consistent clockwise curve rather than an S)
    const nx = -dy / len
    const ny = dx / len
    const sign = -1
    const bulge = len * bulgeRatio * sign
    const cx = (a.x + b.x) / 2 + nx * bulge
    const cy = (a.y + b.y) / 2 + ny * bulge
    d += ` Q ${cx},${cy} ${b.x},${b.y}`
  }
  return d
}

const PATH_D = curvedLegsPath(POINTS)

// The plane's shadow ignores the curve entirely and travels the direct
// straight line between each pair of waypoints — cumulative distance
// along that straight polyline, computed once since POINTS is static.
const STRAIGHT_CUM = (() => {
  const cum = [0]
  for (let i = 0; i < POINTS.length - 1; i++) {
    const a = POINTS[i]
    const b = POINTS[i + 1]
    cum.push(cum[i] + Math.hypot(b.x - a.x, b.y - a.y))
  }
  return cum
})()

// Position + heading at a given distance along that straight polyline.
function pointAndAngleAtStraightDistance(pts: Point[], cum: number[], dist: number) {
  const total = cum[cum.length - 1]
  const d = Math.max(0, Math.min(dist, total))
  let segIdx = cum.length - 2 // default: last segment, covers d === total
  for (let i = 0; i < cum.length - 1; i++) {
    if (d >= cum[i] && d < cum[i + 1]) {
      segIdx = i
      break
    }
  }
  const segStart = cum[segIdx]
  const segLen = cum[segIdx + 1] - segStart
  const t = segLen > 0 ? (d - segStart) / segLen : 0
  const a = pts[segIdx]
  const b = pts[segIdx + 1]
  const angle = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle }
}

const TOTAL_MS = 5000 // whole trip, split across legs proportional to their length
const PAUSE_MS = 20 // pause at each intermediate stop before continuing

// In the last stretch of each leg, the heading eases away from the curve's
// own tangent toward dead-level (a landing flare) instead of following the
// tangent all the way to the point. LEVEL_START is how far into the leg
// (0–1) that flare begins.
const LEVEL_START = 0.78
const LEVEL_ANGLE = 0

function shortestDelta(from: number, to: number) {
  const d = to - from
  return ((d + 540) % 360) - 180 // shortest turn direction, avoids the long way around
}

const PLANE_SCALE = 1.7
const TAIL_LAG = 13 * PLANE_SCALE * 1.6

const pct = (x: number, y: number) => ({ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` })

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Find the arc-length position along the real (curved) path that's closest
// to a target point, so waypoint timing matches the actual curve rather
// than the straight-line distance between points.
function findLengthAt(geo: SVGPathElement, total: number, target: Point, samples = 600) {
  let bestLen = 0
  let bestDist = Infinity
  for (let i = 0; i <= samples; i++) {
    const len = (i / samples) * total
    const p = geo.getPointAtLength(len)
    const dx = p.x - target.x
    const dy = p.y - target.y
    const dd = dx * dx + dy * dy
    if (dd < bestDist) {
      bestDist = dd
      bestLen = len
    }
  }
  return bestLen
}

// Keep each description in its point's quarter of the route so it stays
// close to the marker without spilling into the neighboring point's area.
// The gap between quarters is a CSS var (--process-desc-gap) rather than
// a hardcoded 1rem so a mobile media query can shrink it — reclaiming
// real width for the text without changing the layout, positions, or
// reveal behavior at all.
function descriptionPlacement(p: Point, index: number) {
  const above = index % 2 === 0
  const style: React.CSSProperties = {}
  style.left = `${index * 25}%`
  style.width = 'calc(25% - var(--process-desc-gap, 1rem))'
  if (above) style.bottom = `calc(${100 - (p.y / VB_H) * 100}% + 24px)`
  else style.top = `calc(${(p.y / VB_H) * 100}% + 24px)`
  const origin = `origin-${above ? 'bottom' : 'top'}-${index < 2 ? 'left' : 'right'}`
  return { style, origin }
}

export function Process() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const geoPathRef = useRef<SVGPathElement | null>(null)
  const planeRef = useRef<SVGGElement | null>(null)
  const shadowPlaneRef = useRef<SVGGElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const sequenceRef = useRef(0)
  const mountedRef = useRef(true)
  const hasCompletedRef = useRef(false)
  const metricsRef = useRef<{ totalLen: number; cum: number[] } | null>(null)

  const [revealed, setRevealed] = useState([false, false, false, false])
  const [activeStep, setActiveStep] = useState(0)
  const [flying, setFlying] = useState(false)

  const setPlaneTransform = useCallback((x: number, y: number, angle: number) => {
    const plane = planeRef.current
    if (!plane) return
    plane.setAttribute('transform', `translate(${x},${y}) rotate(${angle}) scale(${PLANE_SCALE})`)
  }, [])

  const setShadowTransform = useCallback((x: number, y: number, angle: number) => {
    const shadow = shadowPlaneRef.current
    if (!shadow) return
    shadow.setAttribute(
      'transform',
      `translate(${x},${y}) rotate(${angle}) scale(${PLANE_SCALE * 0.92})`,
    )
  }, [])

  // Heading looking forward from this point in the direction of travel —
  // the curve's own tangent, before any landing flare is applied.
  const angleLeaving = useCallback((atDist: number) => {
    const geo = geoPathRef.current
    const metrics = metricsRef.current
    if (!geo || !metrics) return 0
    const p = geo.getPointAtLength(atDist)
    const ahead = geo.getPointAtLength(Math.min(atDist + 2, metrics.totalLen))
    return Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI)
  }, [])

  const positionPlane = useCallback(
    (atDist: number) => {
      const geo = geoPathRef.current
      const metrics = metricsRef.current
      if (!geo || !metrics) return
      const p = geo.getPointAtLength(atDist)
      setPlaneTransform(p.x, p.y, angleLeaving(atDist))
    },
    [angleLeaving, setPlaneTransform],
  )

  // Same idea, but the shadow rides the straight line between waypoints
  // instead of the curved flight path — it visibly cuts corners the real
  // plane doesn't.
  const positionShadowPlane = useCallback(
    (atDist: number) => {
      const { x, y, angle } = pointAndAngleAtStraightDistance(POINTS, STRAIGHT_CUM, atDist)
      setShadowTransform(x, y, angle)
    },
    [setShadowTransform],
  )

  // Turn the plane and its shadow from horizontal (where each leg's landing
  // flare left them) onto the next leg's own heading — the "take-off" turn
  // while paused at the point. Both happen on the same clock, so they turn
  // in step.
  const animateTurnAtPoint = useCallback(
    (
      planeXY: { x: number; y: number },
      planeFrom: number,
      planeTo: number,
      shadowXY: { x: number; y: number },
      shadowFrom: number,
      shadowTo: number,
      durationMs: number,
    ) =>
      new Promise<void>((resolve) => {
        const start = performance.now()
        const planeDelta = shortestDelta(planeFrom, planeTo)
        const shadowDelta = shortestDelta(shadowFrom, shadowTo)
        const frame = (now: number) => {
          if (!mountedRef.current) return resolve()
          const raw = Math.min((now - start) / durationMs, 1)
          // A constant angular rate keeps the turn at point 3 as one
          // uniform movement instead of easing through multiple turns.
          const t = raw
          setPlaneTransform(planeXY.x, planeXY.y, planeFrom + planeDelta * t)
          setShadowTransform(shadowXY.x, shadowXY.y, shadowFrom + shadowDelta * t)
          if (raw < 1) {
            rafRef.current = requestAnimationFrame(frame)
          } else {
            resolve()
          }
        }
        rafRef.current = requestAnimationFrame(frame)
      }),
    [setPlaneTransform, setShadowTransform],
  )

  const animateLeg = useCallback(
    (fromDist: number, toDist: number, straightFrom: number, straightTo: number, durationMs: number, flattenArrival = true, arrivalIndex?: number) =>
      new Promise<void>((resolve) => {
        const geo = geoPathRef.current
        const metrics = metricsRef.current
        const start = performance.now()
        let waypointRevealed = false
        const frame = (now: number) => {
          if (!mountedRef.current) return resolve()
          const raw = Math.min((now - start) / durationMs, 1)
          const t = easeInOutCubic(raw)
          const d = fromDist + t * (toDist - fromDist)
          const shadowDist = straightFrom + t * (straightTo - straightFrom)

          // how far into this leg's landing flare we are, 0 until
          // LEVEL_START, easing to 1 by the time the leg ends
          const levelT = flattenArrival && raw > LEVEL_START
            ? easeInOutCubic((raw - LEVEL_START) / (1 - LEVEL_START))
            : 0

          const p = geo!.getPointAtLength(d)
          // At point 3, keep the final arrival frame on the incoming
          // heading; sampling the exact waypoint would read the next leg.
          const planeHeadingDistance = flattenArrival ? d : Math.max(fromDist, Math.min(d, toDist - 2))
          const naturalPlaneAngle = angleLeaving(planeHeadingDistance)
          const planeAngle =
            naturalPlaneAngle + shortestDelta(naturalPlaneAngle, LEVEL_ANGLE) * levelT
          setPlaneTransform(p.x, p.y, planeAngle)

          const shadowHeadingDistance = flattenArrival
            ? shadowDist
            : Math.max(straightFrom, Math.min(shadowDist, straightTo - 2))
          const shadowPos = pointAndAngleAtStraightDistance(POINTS, STRAIGHT_CUM, shadowHeadingDistance)
          const shadowAngle =
            shadowPos.angle + shortestDelta(shadowPos.angle, LEVEL_ANGLE) * levelT
          setShadowTransform(shadowPos.x, shadowPos.y, shadowAngle)

          const revealDist = Math.max(0, d - TAIL_LAG)
          geo!.style.strokeDashoffset = String(metrics!.totalLen - revealDist)

          // Start the description as the aircraft enters the waypoint,
          // rather than waiting for the animation promise to resolve.
          if (arrivalIndex !== undefined && !waypointRevealed && raw >= 0.94) {
            waypointRevealed = true
            setActiveStep(arrivalIndex)
            setRevealed((previous) => previous.map((value, index) => index <= arrivalIndex || value))
          }

          if (raw < 1) {
            rafRef.current = requestAnimationFrame(frame)
          } else {
            resolve()
          }
        }
        rafRef.current = requestAnimationFrame(frame)
      }),
    [angleLeaving, setPlaneTransform, setShadowTransform],
  )

  const flySequence = useCallback(async () => {
    const sequence = ++sequenceRef.current
    const geo = geoPathRef.current
    const metrics = metricsRef.current
    if (!geo || !metrics) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    geo.style.strokeDasharray = String(metrics.totalLen)
    geo.style.strokeDashoffset = String(metrics.totalLen)
    setRevealed([true, false, false, false])
    setActiveStep(0)
    setFlying(true)
    positionPlane(0)
    positionShadowPlane(0)

    await sleep(350)
    if (sequence !== sequenceRef.current) return
    for (let leg = 0; leg < 3; leg++) {
      if (!mountedRef.current || sequence !== sequenceRef.current) return
      const legLen = metrics.cum[leg + 1] - metrics.cum[leg]
      const legMs = TOTAL_MS * (legLen / metrics.totalLen)
      await animateLeg(metrics.cum[leg], metrics.cum[leg + 1], STRAIGHT_CUM[leg], STRAIGHT_CUM[leg + 1], legMs, leg !== 1, leg + 1)
      if (!mountedRef.current || sequence !== sequenceRef.current) return
      setRevealed((prev) => {
        const next = [...prev]
        next[leg + 1] = true
        return next
      })
      if (leg < 2) {
        const planePoint = geo.getPointAtLength(metrics.cum[leg + 1])
        const departureAngle = angleLeaving(metrics.cum[leg + 1])
        const shadowPoint = POINTS[leg + 1]
        const shadowDepartureAngle = pointAndAngleAtStraightDistance(
          POINTS,
          STRAIGHT_CUM,
          STRAIGHT_CUM[leg + 1],
        ).angle
        const isPointThree = leg === 1
        const planeArrivalAngle = isPointThree
          ? angleLeaving(Math.max(metrics.cum[leg + 1] - 2, metrics.cum[leg]))
          : LEVEL_ANGLE
        const shadowArrivalAngle = isPointThree
          ? pointAndAngleAtStraightDistance(POINTS, STRAIGHT_CUM, STRAIGHT_CUM[leg + 1] - 2).angle
          : LEVEL_ANGLE
        await animateTurnAtPoint(
          planePoint,
          planeArrivalAngle,
          departureAngle,
          shadowPoint,
          shadowArrivalAngle,
          shadowDepartureAngle,
          PAUSE_MS,
        )
        if (sequence !== sequenceRef.current) return
      }
    }
    if (mountedRef.current) {
      hasCompletedRef.current = true
      setFlying(false)
    }
  }, [animateLeg, positionPlane, positionShadowPlane, angleLeaving, animateTurnAtPoint])

  // Measure the real (curved) path once it's mounted, then start the flight.
  useEffect(() => {
    mountedRef.current = true
    const geo = geoPathRef.current
    if (!geo) return

    const totalLen = geo.getTotalLength()
    const cum = [0, findLengthAt(geo, totalLen, POINTS[1]), findLengthAt(geo, totalLen, POINTS[2]), totalLen]
    metricsRef.current = { totalLen, cum }

    geo.style.strokeDasharray = String(totalLen)
    geo.style.strokeDashoffset = String(totalLen)
    positionPlane(0)
    positionShadowPlane(0)

    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          sequenceRef.current += 1
          if (rafRef.current) cancelAnimationFrame(rafRef.current)
          setFlying(false)
          if (hasCompletedRef.current) return
          setRevealed([false, false, false, false])
          geo.style.strokeDashoffset = String(totalLen)
          positionPlane(0)
          positionShadowPlane(0)
          return
        }
        mountedRef.current = true
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setRevealed([true, true, true, true])
          setActiveStep(3)
          geo.style.strokeDasharray = 'none'
          return
        }
        if (hasCompletedRef.current) {
          setRevealed([true, true, true, true])
          setActiveStep(3)
          geo.style.strokeDashoffset = '0'
          return
        }
        flySequence()
      },
      { threshold: 0.35 },
    )
    observer.observe(section)

    return () => {
      mountedRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [flySequence, positionPlane, positionShadowPlane])

  return (
    <section ref={sectionRef} id="process" className="relative isolate w-full overflow-hidden bg-[#f7f4ec]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="process-background absolute inset-0 opacity-90"
          style={{
            backgroundImage: "url('/images/fine-lanka-process-route-background-tall.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-[#fffdf6]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(247,244,236,0.56)_100%)]" />
      </div>
      <div className="relative z-10 container py-16">
        <div className="process-kicker flex items-center gap-2 mb-3">
          <span className="w-4 h-px bg-[#0B1220]/50 inline-block" />
          The Fine Lanka way
        </div>
        <h2 className="process-heading text-[#0B1220] mb-2">
          From the first conversation to a confident{' '}
          <span style={{ fontStyle: 'italic', color: '#C9A227' }}>wheels-up</span>
        </h2>
        <p className="process-lede max-w-md mb-8">
          Four clear stages, one team at your side — so every decision feels weighed and settled long before you depart.
        </p>

        <div className="process-route-canvas relative w-full aspect-video">
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <mask id="process-reveal-mask" maskUnits="userSpaceOnUse">
                <path
                  ref={geoPathRef}
                  d={PATH_D}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </mask>
              <linearGradient id="process-plane-body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff9df" />
                <stop offset="0.42" stopColor="#E4C766" />
                <stop offset="1" stopColor="#B68A1B" />
              </linearGradient>
              <linearGradient id="process-plane-wing" x1="0" y1="0" x2="0.7" y2="1">
                <stop offset="0" stopColor="#F5E6A7" />
                <stop offset="0.55" stopColor="#D4AE3B" />
                <stop offset="1" stopColor="#987313" />
              </linearGradient>
              <linearGradient id="process-plane-glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DDF2F2" />
                <stop offset="0.48" stopColor="#6A93A5" />
                <stop offset="1" stopColor="#243B50" />
              </linearGradient>
              <radialGradient id="process-plane-halo">
                <stop offset="0" stopColor="#E4C766" stopOpacity="0.5" />
                <stop offset="1" stopColor="#E4C766" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* faint straight-line ground track the shadow rides — the
                direct route the curved flight path departs from */}
            <path
              d={`M ${POINTS.map((p) => `${p.x},${p.y}`).join(' L ')}`}
              fill="none"
              stroke="#0B1220"
              strokeOpacity="0.1"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="1 7"
            />

            <path
              d={PATH_D}
              fill="none"
              stroke="#E4C766"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0.5 11"
              mask="url(#process-reveal-mask)"
            />

            {/* the plane's shadow: same silhouette, dark/translucent/blurred,
                riding the straight line between waypoints rather than the
                curve — so it visibly cuts each corner the real plane doesn't */}
            <g ref={shadowPlaneRef} opacity="0.22">
              <path d="M 13,0 L 3,-2.1 L -11,-1.2 L -11,1.2 L 3,2.1 Z" fill="#000000" />
              <path d="M 2,-1 L -3,-11 L -6.4,-11 L -1.2,-1 Z" fill="#000000" />
              <path d="M 2,1 L -3,11 L -6.4,11 L -1.2,1 Z" fill="#000000" />
              <path d="M -8.8,-0.6 L -12.6,-4.6 L -14.2,-4.6 L -10.4,-0.6 Z" fill="#000000" />
              <path d="M -8.8,0.6 L -12.6,4.6 L -14.2,4.6 L -10.4,0.6 Z" fill="#000000" />
            </g>

          </svg>

          {/* plane rendered in its own overlay SVG, above the waypoint
              labels and step-description text — everything else (route
              lines, shadow) stays in the base SVG, underneath the text */}
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="absolute inset-0 w-full h-full overflow-visible z-20 pointer-events-none"
          >
            {/* polished aircraft marker: halo, swept wings, cockpit glass,
                tail stabilisers, and a highlighted fuselage built nose-first
                along +X so rotate() still aligns it with the flight path */}
            <g ref={planeRef}>
              <circle r="14" fill="url(#process-plane-halo)" opacity="0.6" />
              <path d="M 14,0 C 10,-1.35 5,-2.25 -8,-1.5 L -12,-0.65 L -12,0.65 L -8,1.5 C 5,2.25 10,1.35 14,0 Z" fill="url(#process-plane-body)" stroke="#765912" strokeWidth="0.45" />
              <path d="M 3,-1 L -4,-12 L -7.5,-12 L -2,-1.2 Z" fill="url(#process-plane-wing)" stroke="#765912" strokeWidth="0.45" />
              <path d="M 3,1 L -4,12 L -7.5,12 L -2,1.2 Z" fill="url(#process-plane-wing)" stroke="#765912" strokeWidth="0.45" />
              <path d="M -7.2,-0.6 L -12.8,-5.2 L -14.4,-5.2 L -10.4,-0.5 Z" fill="#D4AE3B" stroke="#765912" strokeWidth="0.4" />
              <path d="M -7.2,0.6 L -12.8,5.2 L -14.4,5.2 L -10.4,0.5 Z" fill="#D4AE3B" stroke="#765912" strokeWidth="0.4" />
              <path d="M 7.2,-1.12 C 5.6,-1.45 3.8,-1.5 2.2,-1.35 L 3.6,1.35 C 5.1,1.45 6.5,1.2 7.7,0.75 Z" fill="url(#process-plane-glass)" stroke="#274454" strokeWidth="0.35" />
              <path d="M 10.2,-0.55 L 13.1,0 L 10.2,0.55 Z" fill="#FFF6CF" opacity="0.9" />
              <path d="M -2.8,-0.55 L 5.8,-0.55" stroke="#FFF4C5" strokeWidth="0.45" strokeLinecap="round" opacity="0.75" />
            </g>
          </svg>

          {/* waypoint markers */}
          {POINTS.map((p, i) => {
            const isEndpoint = i === 0 || i === POINTS.length - 1
            return (
              <div
                key={p.code}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                style={pct(p.x, p.y)}
              >
                <div
                  className={`rounded-full transition-colors duration-300 ${
                    isEndpoint
                      ? 'w-[9px] h-[9px] bg-[#E4C766] shadow-[0_0_0_4px_rgba(228,199,102,0.18)]'
                      : `w-[7px] h-[7px] shadow-[0_0_0_3px_rgba(228,199,102,0.14)] ${
                          revealed[i] ? 'bg-[#E4C766]' : 'bg-[#0B1220]/20'
                        }`
                  }`}
                />
                <div className="font-mono text-[13px] tracking-wider text-[#0B1220]">{p.code}</div>
                <div className="text-[11px] text-[#0B1220]/45 whitespace-nowrap">{p.title}</div>
              </div>
            )
          })}

          {/* one description card per waypoint, revealed on arrival —
              exact same layout, positions, and reveal animation at every
              screen size. Only the width (via --process-desc-gap above)
              and font sizes (via --process-title-size /
              --process-text-size below) shrink on mobile, giving the
              same cards more effective room instead of replacing them
              with something else. */}
          {POINTS.map((p, i) => {
            const { style, origin } = descriptionPlacement(p, i)
            const show = revealed[i]
            return (
              <div
                key={p.code}
                className={`process-step-desc process-step-desc-${i} absolute max-w-none text-[#0B1220] ${origin} transition-all duration-500 ${
                  show ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
                }`}
                style={style}
              >
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0B1220]/50 border-b border-[#0B1220]/10 pb-2 mb-3">
                  Step {p.code}
                </div>
                <div className="h-[1.2em] overflow-hidden leading-[1.2em] mb-2">
                  <div
                    className="font-semibold transition-transform duration-[380ms]"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 'var(--process-title-size, 16px)',
                      transform: show ? 'translateY(0)' : 'translateY(-100%)',
                      transitionDelay: show ? '70ms' : '0ms',
                      transitionTimingFunction: 'cubic-bezier(.2,.8,.3,1)',
                    }}
                  >
                    {p.title}
                  </div>
                </div>
                <div
                  className="leading-snug text-[#0B1220]/70"
                  style={{ fontSize: 'var(--process-text-size, 13px)' }}
                >
                  {p.text}
                </div>
              </div>
            )
          })}

          <div className="process-mobile-description" aria-live="polite">
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#0B1220]/50 border-b border-[#0B1220]/10 pb-2 mb-2">
              Step {POINTS[activeStep].code}
            </div>
            <div className="font-semibold text-[#0B1220]" style={{ fontFamily: "'Fraunces', serif" }}>
              {POINTS[activeStep].title}
            </div>
            <div className="mt-1 text-[12px] leading-[1.45] text-[#0B1220]/70">
              {POINTS[activeStep].text}
            </div>
          </div>
        </div>

      </div>
      <div className="mural-divider mural-divider--frieze" aria-hidden="true">
        <div className="mural-divider-inner" />
      </div>
    </section>
  )
}
