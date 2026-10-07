/**
 * Random flight paths for the bird and fish overlays in the Adventure section.
 *
 * A flight enters from one edge of the viewport, passes through a few random points inside it, and
 * leaves through a different edge. The route is a smooth Catmull-Rom curve, resampled at equal
 * arc length so the sprite moves at a constant speed. The sprite turns to face the way it is going
 * (an artwork that faces right is mirrored when it heads left) and tilts a little with the climb.
 * Pure and framework-free so it can be tested; the component only feeds the keyframes to the
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
  /** Random source in [0, 1); injectable for tests. */
  random?: () => number
}

export interface RoamPlan {
  /** Flight time in ms. */
  duration: number
  keyframes: { transform: string; offset: number }[]
  /** The control points: entry, waypoints, exit (top-left corner of the sprite). */
  points: Point[]
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

  // Entry and exit: just outside the area, on two different sides (0 left, 1 right, 2 top, 3 bottom).
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
  const startSide = Math.floor(rnd() * 4) % 4
  const endSide = (startSide + 1 + (Math.floor(rnd() * 3) % 3)) % 4

  // Random points inside the area, kept apart so the route wanders instead of dithering.
  const [minPoints, maxPoints] = options.waypoints
  const count = clamp(Math.floor(between(minPoints, maxPoints + 1)), minPoints, maxPoints)
  const boxW = Math.max(width * 0.9 - spriteW, 1)
  const boxH = Math.max(height * 0.82 - spriteH, 1)
  const spacing = Math.min(width, height) * 0.22
  const points: Point[] = [edge(startSide)]
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

  // Dense samples along the curve, with cumulative length for equal-arc-length resampling.
  const dense: Point[] = []
  const cumulative: number[] = []
  let length = 0
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p3 = points[i + 2] ?? points[i + 1]
    for (let step = 0; step < 16; step++) {
      const point = catmullRom(p0, points[i], points[i + 1], p3, step / 16)
      if (dense.length) length += Math.hypot(point.x - dense[dense.length - 1].x, point.y - dense[dense.length - 1].y)
      dense.push(point)
      cumulative.push(length)
    }
  }
  const last = points[points.length - 1]
  length += Math.hypot(last.x - dense[dense.length - 1].x, last.y - dense[dense.length - 1].y)
  dense.push(last)
  cumulative.push(length)

  const frames = clamp(Math.round(length / 28), 24, 140)
  const samples: Point[] = []
  let cursor = 0
  for (let i = 0; i < frames; i++) {
    const target = (length * i) / (frames - 1)
    while (cursor < cumulative.length - 2 && cumulative[cursor + 1] < target) cursor++
    const span = cumulative[cursor + 1] - cumulative[cursor] || 1
    const k = clamp((target - cumulative[cursor]) / span, 0, 1)
    samples.push({
      x: dense[cursor].x + (dense[cursor + 1].x - dense[cursor].x) * k,
      y: dense[cursor].y + (dense[cursor + 1].y - dense[cursor].y) * k,
    })
  }

  // Heading: face the direction of travel (smoothly, so a turn reads as a quick flip) and tilt with the climb.
  const keyframes: RoamPlan['keyframes'] = []
  let facing = samples[1].x >= samples[0].x ? 1 : -1
  let target = facing
  for (let i = 0; i < frames; i++) {
    const before = samples[Math.max(i - 1, 0)]
    const after = samples[Math.min(i + 1, frames - 1)]
    const dx = after.x - before.x
    const dy = after.y - before.y
    const speed = Math.hypot(dx, dy) || 1
    if (dx / speed > 0.15) target = 1
    else if (dx / speed < -0.15) target = -1
    facing += (target - facing) * 0.45
    const tilt = clamp(Math.atan2(dy, Math.abs(dx) + 1e-6) * 0.6, -maxTilt, maxTilt)
    keyframes.push({
      transform: `translate3d(${samples[i].x.toFixed(1)}px, ${samples[i].y.toFixed(1)}px, 0) scaleX(${facing.toFixed(3)}) rotate(${tilt.toFixed(3)}rad)`,
      offset: i / (frames - 1),
    })
  }

  return { duration: clamp((length / Math.max(options.speed, 1)) * 1000, 4000, 60000), keyframes, points }
}
