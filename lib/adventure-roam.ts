/**
 * Random flight paths for the bird and fish overlays in the Adventure section.
 *
 * A flight enters from one edge of the viewport, passes through a few random points inside it, and
 * leaves through a different edge. The route is a smooth Catmull-Rom curve, resampled at equal
 * arc length so the sprite moves at a constant speed. The sprite image is never mirrored (a flip
 * would break the 3D look of the footage); it only tilts a little with the climb. Pure and framework-free so it can be tested; the component only feeds the keyframes to the
 * Web Animations API.
 */

export interface Point {
  x: number
  y: number
}

export interface RoamOptions {
  /** Size of the area the sprite flies over (the viewport-sized stage), in px. */
  width: number
  height: number
  /** Size of the sprite, in px; it starts and ends fully outside the area. */
  spriteW: number
  spriteH: number
  /** Flight speed, px per second. */
  speed: number
  /** Inclusive range of random points to pass through before leaving. */
  waypoints: [number, number]
  /** Largest tilt, in radians (default 0.5). */
  tilt?: number
  /**
   * For creatures that must not swim backwards (fish): enter on the left, leave on the right, keep
   * moving forward (to the right) through the waypoints, and once in a while float a little back or
   * ahead, slowly, before carrying on forward.
   */
  forward?: boolean
  /** Random source in [0, 1); injectable for tests. */
  random?: () => number
}

export interface RoamPlan {
  /** Flight time in ms. */
  duration: number
  keyframes: { transform: string; offset: number }[]
  /** The control points: entry, waypoints, exit (top-left corner of the sprite). */
  points: Point[]
  /** The flown route, sampled at equal time steps (top-left corner of the sprite). */
  path: Point[]
}

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value))

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t
  const t3 = t2 * t
  const mix = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
  return { x: mix(p0.x, p1.x, p2.x, p3.x), y: mix(p0.y, p1.y, p2.y, p3.y) }
}

export function planRoam(options: RoamOptions): RoamPlan {
  const { width, height, spriteW, spriteH } = options
  const rnd = options.random ?? Math.random
  const between = (low: number, high: number) => low + (high - low) * rnd()
  const maxTilt = options.tilt ?? 0.5

  // Entry and exit points sit just outside the area (sides: 0 left, 1 right, 2 top, 3 bottom).
  const edge = (side: number): Point => {
    switch (side) {
      case 0:
        return { x: -spriteW * 1.2, y: between(0.08, 0.82) * height }
      case 1:
        return { x: width + spriteW * 0.2, y: between(0.08, 0.82) * height }
      case 2:
        return { x: between(0.08, 0.9) * width, y: -spriteH * 1.2 }
      default:
        return { x: between(0.08, 0.9) * width, y: height + spriteH * 0.2 }
    }
  }
  const [minPoints, maxPoints] = options.waypoints
  const count = clamp(Math.floor(between(minPoints, maxPoints + 1)), minPoints, maxPoints)
  const boxW = Math.max(width * 0.9 - spriteW, 1)
  const boxH = Math.max(height * 0.82 - spriteH, 1)
  const points: Point[] = []
  const floatSegments = new Set<number>() // segments flown slowly (the float back or ahead)
  const backSegments = new Set<number>() // the only segments where a forward-only creature may drift back

  if (options.forward) {
    const startY = edge(0)
    const endY = edge(1)
    const lo = width * 0.1
    const hi = Math.max(width * 0.9 - spriteW, lo + 1)
    const yLo = height * 0.08
    const yHi = height * 0.08 + boxH
    const waypoints: Point[] = []
    for (let i = 0; i < count; i++) {
      const x = lo + (hi - lo) * ((i + 1) / (count + 1)) + between(-0.03, 0.03) * width
      waypoints.push({ x: clamp(x, lo, hi), y: between(yLo, yHi) })
    }
    points.push(startY)
    // One waypoint is followed by a slow float a little back (more often) or ahead, then forward again.
    const floatAt = count > 0 ? Math.floor(rnd() * count) % count : -1
    waypoints.forEach((waypoint, i) => {
      points.push(waypoint)
      if (i !== floatAt) return
      const back = rnd() < 0.6
      const shift = back ? -between(0.04, 0.09) : between(0.03, 0.05)
      floatSegments.add(points.length - 1) // the segment from this waypoint to the float point
      if (back) backSegments.add(points.length - 1)
      points.push({ x: clamp(waypoint.x + shift * width, lo, hi), y: clamp(waypoint.y + between(-0.08, 0.08) * height, yLo, yHi) })
      floatSegments.add(points.length - 1) // and the one that leaves it, which is also slow
    })
    points.push(endY)
  } else {
    // Entry and exit: two different sides; random points inside the area, kept apart so the route
    // wanders instead of dithering.
    const startSide = Math.floor(rnd() * 4) % 4
    const endSide = (startSide + 1 + (Math.floor(rnd() * 3) % 3)) % 4
    const spacing = Math.min(width, height) * 0.22
    points.push(edge(startSide))
    for (let i = 0; i < count; i++) {
      let candidate: Point = { x: width * 0.05 + rnd() * boxW, y: height * 0.08 + rnd() * boxH }
      for (let attempt = 0; attempt < 8; attempt++) {
        const previous = points[points.length - 1]
        if (Math.hypot(candidate.x - previous.x, candidate.y - previous.y) >= spacing) break
        candidate = { x: width * 0.05 + rnd() * boxW, y: height * 0.08 + rnd() * boxH }
      }
      points.push(candidate)
    }
    points.push(edge(endSide))
  }

  // Dense samples along the curve, with cumulative "time cost" (length, three times as much on the
  // slow float segments) for resampling at equal time steps, so a float really is slow.
  const dense: Point[] = []
  const denseSegment: number[] = []
  const cumulative: number[] = []
  let length = 0
  let cost = 0
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p3 = points[i + 2] ?? points[i + 1]
    const weight = floatSegments.has(i) ? 3 : 1
    for (let step = 0; step < 16; step++) {
      const point = catmullRom(p0, points[i], points[i + 1], p3, step / 16)
      if (dense.length) {
        const d = Math.hypot(point.x - dense[dense.length - 1].x, point.y - dense[dense.length - 1].y)
        length += d
        cost += d * weight
      }
      dense.push(point)
      denseSegment.push(i)
      cumulative.push(cost)
    }
  }
  const last = points[points.length - 1]
  const tail = Math.hypot(last.x - dense[dense.length - 1].x, last.y - dense[dense.length - 1].y)
  length += tail
  cost += tail
  dense.push(last)
  denseSegment.push(points.length - 2)
  cumulative.push(cost)

  const frames = clamp(Math.round(length / 28), 24, 140)
  const samples: Point[] = []
  let cursor = 0
  let furthest = -Infinity
  for (let i = 0; i < frames; i++) {
    const target = (cost * i) / (frames - 1)
    while (cursor < cumulative.length - 2 && cumulative[cursor + 1] < target) cursor++
    const span = cumulative[cursor + 1] - cumulative[cursor] || 1
    const k = clamp((target - cumulative[cursor]) / span, 0, 1)
    let x = dense[cursor].x + (dense[cursor + 1].x - dense[cursor].x) * k
    // A forward-only creature never drifts back by accident (a curve can overshoot slightly); only
    // the deliberate float back may move it back.
    if (options.forward) {
      if (backSegments.has(denseSegment[cursor])) furthest = x // the float back: start again from here
      else {
        x = Math.max(x, furthest)
        furthest = x
      }
    }
    samples.push({ x, y: dense[cursor].y + (dense[cursor + 1].y - dense[cursor].y) * k })
  }

  // Tilt a little with the climb or dive. The image is never flipped; when the route runs against the
  // way the artwork faces, the tilt is mirrored so the nose still leads the climb.
  const keyframes: RoamPlan['keyframes'] = []
  for (let i = 0; i < frames; i++) {
    const before = samples[Math.max(i - 1, 0)]
    const after = samples[Math.min(i + 1, frames - 1)]
    const dx = after.x - before.x
    const dy = after.y - before.y
    const tilt = clamp(Math.atan2(dy * (dx < 0 ? -1 : 1), Math.abs(dx) + 1e-6) * 0.6, -maxTilt, maxTilt)
    keyframes.push({
      transform: `translate3d(${samples[i].x.toFixed(1)}px, ${samples[i].y.toFixed(1)}px, 0) rotate(${tilt.toFixed(3)}rad)`,
      offset: i / (frames - 1),
    })
  }

  return { duration: clamp((cost / Math.max(options.speed, 1)) * 1000, 4000, 60000), keyframes, points, path: samples }
}

/**
 * How different two routes are: the mean distance, in px, from a point on one route to the nearest
 * point on the other (both ways round, so a short route inside a long one still counts as different).
 */
export function routeDistance(a: Point[], b: Point[]): number {
  const thin = (path: Point[]) => {
    const stride = Math.max(1, Math.floor(path.length / 36))
    return path.filter((_, i) => i % stride === 0)
  }
  const one = (from: Point[], to: Point[]) => {
    let sum = 0
    for (const p of from) {
      let nearest = Infinity
      for (const q of to) nearest = Math.min(nearest, Math.hypot(p.x - q.x, p.y - q.y))
      sum += nearest
    }
    return sum / from.length
  }
  const ta = thin(a)
  const tb = thin(b)
  if (!ta.length || !tb.length) return Infinity
  return (one(ta, tb) + one(tb, ta)) / 2
}

/**
 * Plans a route that differs from every route in `avoid` (the other creatures' current or latest
 * routes and this one's own previous route). Tries several random routes and keeps the one furthest
 * from all of them, stopping early once one is clearly different.
 */
export function planDistinctRoam(options: RoamOptions, avoid: Point[][], attempts = 14): RoamPlan {
  const enough = Math.min(options.width, options.height) * 0.38
  let best: RoamPlan | null = null
  let bestScore = -1
  for (let i = 0; i < attempts; i++) {
    const plan = planRoam(options)
    const score = avoid.length ? Math.min(...avoid.map((route) => routeDistance(plan.path, route))) : Infinity
    if (score > bestScore) {
      best = plan
      bestScore = score
    }
    if (score >= enough) break
  }
  return best as RoamPlan
}
