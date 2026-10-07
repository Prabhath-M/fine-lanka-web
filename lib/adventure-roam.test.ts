import { describe, expect, it } from 'vitest'
import { planDistinctRoam, planRoam, routeDistance, type Point } from '@/lib/adventure-roam'

// Small deterministic random source (mulberry32) so the routes are reproducible.
function seeded(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const base = { width: 1440, height: 800, spriteW: 120, spriteH: 120, speed: 170, waypoints: [2, 4] as [number, number] }
const outside = (p: { x: number; y: number }) => p.x <= -base.spriteW || p.x >= base.width || p.y <= -base.spriteH || p.y >= base.height

describe('planRoam', () => {
  it('enters and leaves outside the screen, with random points inside it', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const plan = planRoam({ ...base, random: seeded(seed) })
      const { points } = plan
      expect(outside(points[0])).toBe(true)
      expect(outside(points[points.length - 1])).toBe(true)
      const inner = points.slice(1, -1)
      expect(inner.length).toBeGreaterThanOrEqual(2)
      expect(inner.length).toBeLessThanOrEqual(4)
      for (const p of inner) {
        expect(p.x).toBeGreaterThanOrEqual(0)
        expect(p.x + base.spriteW).toBeLessThanOrEqual(base.width)
        expect(p.y).toBeGreaterThanOrEqual(0)
        expect(p.y + base.spriteH).toBeLessThanOrEqual(base.height)
      }
    }
  })

  it('leaves through a different side than it came in', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const { points } = planRoam({ ...base, random: seeded(seed) })
      const side = (p: { x: number; y: number }) => (p.x <= -base.spriteW ? 'l' : p.x >= base.width ? 'r' : p.y <= -base.spriteH ? 't' : 'b')
      expect(side(points[0])).not.toBe(side(points[points.length - 1]))
    }
  })

  it('does not fly the same route twice', () => {
    const a = planRoam({ ...base, random: seeded(3) })
    const b = planRoam({ ...base, random: seeded(4) })
    expect(a.points).not.toEqual(b.points)
  })

  it('builds ordered keyframes from 0 to 1 with finite transforms and a sensible duration', () => {
    const plan = planRoam({ ...base, random: seeded(7) })
    expect(plan.keyframes.length).toBeGreaterThanOrEqual(24)
    expect(plan.keyframes[0].offset).toBe(0)
    expect(plan.keyframes[plan.keyframes.length - 1].offset).toBe(1)
    plan.keyframes.forEach((frame, i) => {
      if (i) expect(frame.offset).toBeGreaterThan(plan.keyframes[i - 1].offset)
      expect(frame.transform).toMatch(/^translate3d\(-?[\d.]+px, -?[\d.]+px, 0\) rotate\(-?[\d.]+rad\)$/)
      expect(frame.transform).not.toMatch(/NaN|Infinity/)
    })
    expect(plan.duration).toBeGreaterThanOrEqual(4000)
    expect(plan.duration).toBeLessThanOrEqual(60000)
  })

  it('never flips the image, and keeps the tilt small', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const plan = planRoam({ ...base, tilt: 0.5, random: seeded(seed) })
      for (const frame of plan.keyframes) {
        expect(frame.transform).not.toContain('scale')
        const angle = Number(/rotate\((-?[\d.]+)rad\)/.exec(frame.transform)?.[1])
        expect(Math.abs(angle)).toBeLessThanOrEqual(0.5)
      }
    }
  })

  describe('forward-only routes (fish)', () => {
    const fish = { ...base, spriteW: 170, spriteH: 90, speed: 110, waypoints: [2, 3] as [number, number], forward: true }
    const xOf = (transform: string) => Number(/translate3d\((-?[\d.]+)px/.exec(transform)?.[1])

    it('enters on the left, leaves on the right, and swims on to the right overall', () => {
      for (let seed = 1; seed <= 60; seed++) {
        const { points, keyframes } = planRoam({ ...fish, random: seeded(seed) })
        expect(points[0].x).toBeLessThanOrEqual(-fish.spriteW)
        expect(points[points.length - 1].x).toBeGreaterThanOrEqual(fish.width)
        expect(xOf(keyframes[keyframes.length - 1].transform)).toBeGreaterThan(xOf(keyframes[0].transform) + fish.width)
      }
    })

    it('never swims backwards by more than a short float', () => {
      for (let seed = 1; seed <= 60; seed++) {
        const { keyframes } = planRoam({ ...fish, random: seeded(seed) })
        let peak = -Infinity
        let worstBack = 0
        for (const frame of keyframes) {
          const x = xOf(frame.transform)
          peak = Math.max(peak, x)
          worstBack = Math.max(worstBack, peak - x)
        }
        expect(worstBack).toBeLessThanOrEqual(fish.width * 0.14)
      }
    })

    it('moves back only in a deliberate float, never as a small flicker', () => {
      let floated = 0
      let forwardOnly = 0
      for (let seed = 1; seed <= 80; seed++) {
        const { keyframes } = planRoam({ ...fish, random: seeded(seed) })
        let peak = -Infinity
        let worstBack = 0
        for (const frame of keyframes) {
          const x = xOf(frame.transform)
          peak = Math.max(peak, x)
          worstBack = Math.max(worstBack, peak - x)
        }
        if (worstBack < 1) forwardOnly++
        else {
          floated++
          expect(worstBack).toBeGreaterThanOrEqual(40) // a real float (about 4% of the width or more), not a twitch
        }
      }
      expect(floated).toBeGreaterThan(15)
      expect(forwardOnly).toBeGreaterThan(15)
    })

    it('slows down while floating', () => {
      // A float segment costs three times as much per pixel, so routes with one take longer than their length / speed.
      const plan = planRoam({ ...fish, random: seeded(11) })
      let length = 0
      for (let i = 1; i < plan.keyframes.length; i++) {
        const [x0, y0] = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px/.exec(plan.keyframes[i - 1].transform)!.slice(1).map(Number)
        const [x1, y1] = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px/.exec(plan.keyframes[i].transform)!.slice(1).map(Number)
        length += Math.hypot(x1 - x0, y1 - y0)
      }
      expect(plan.duration).toBeGreaterThan((length / fish.speed) * 1000 * 0.98)
    })
  })
})

describe('planDistinctRoam', () => {
  it('measures identical routes as 0 apart and different routes as far apart', () => {
    const a = planRoam({ ...base, random: seeded(11) }).path
    expect(routeDistance(a, a)).toBe(0)
    expect(routeDistance(a, planRoam({ ...base, random: seeded(12) }).path)).toBeGreaterThan(50)
  })

  it('gives each of three birds, and each bird its next flight, a route unlike the others', () => {
    const floor = Math.min(base.width, base.height) * 0.18
    for (let seed = 1; seed <= 25; seed++) {
      const random = seeded(seed * 97)
      const board: Point[][] = []
      const routes: Point[][] = []
      // three birds, two flights each, always planned against everything flown so far
      for (let flight = 0; flight < 6; flight++) {
        const plan = planDistinctRoam({ ...base, random }, board.slice(-3))
        for (const earlier of board.slice(-3)) expect(routeDistance(plan.path, earlier)).toBeGreaterThan(floor)
        board.push(plan.path)
        routes.push(plan.path)
      }
      expect(routes).toHaveLength(6)
    }
  })

  it('beats a plain random route at staying away from the others', () => {
    let distinctTotal = 0
    let plainTotal = 0
    for (let seed = 1; seed <= 30; seed++) {
      const random = seeded(seed)
      const others = [planRoam({ ...base, random }).path, planRoam({ ...base, random }).path]
      const score = (path: Point[]) => Math.min(...others.map((o) => routeDistance(path, o)))
      distinctTotal += score(planDistinctRoam({ ...base, random }, others).path)
      plainTotal += score(planRoam({ ...base, random }).path)
    }
    expect(distinctTotal).toBeGreaterThan(plainTotal)
  })
})

