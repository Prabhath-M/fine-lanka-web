import { describe, expect, it } from 'vitest'
import { planRoam } from '@/lib/adventure-roam'

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
      expect(frame.transform).toMatch(/^translate3d\(-?[\d.]+px, -?[\d.]+px, 0\) scaleX\(-?[\d.]+\) rotate\(-?[\d.]+rad\)$/)
      expect(frame.transform).not.toMatch(/NaN|Infinity/)
    })
    expect(plan.duration).toBeGreaterThanOrEqual(4000)
    expect(plan.duration).toBeLessThanOrEqual(60000)
  })

  it('faces the way it is travelling', () => {
    // Entering from the left and ending on the right must start facing right (positive scaleX).
    for (let seed = 1; seed <= 60; seed++) {
      const plan = planRoam({ ...base, random: seeded(seed) })
      const first = plan.points[0]
      if (first.x > -base.spriteW) continue
      const scale = Number(/scaleX\((-?[\d.]+)\)/.exec(plan.keyframes[0].transform)?.[1])
      expect(scale).toBeGreaterThan(0)
    }
  })
})
