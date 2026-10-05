import { describe, expect, it } from 'vitest'
import atlas from '../public/data/route-atlas.json'
import { MAX_TYPE_MS, POP_MS, START_DELAY_MS, planReveal, typeDuration } from './map-reveal'

describe('route reveal timing', () => {
  it('reveals stops strictly one after another: pin, then name, then the next stop', () => {
    const { steps, totalMs } = planReveal(['Katunayaka Airport', 'Anuradhapura Ancient City', 'Sigiriya'])
    expect(steps).toHaveLength(3)
    expect(steps[0].popAt).toBe(START_DELAY_MS)
    steps.forEach((step, index) => {
      expect(step.typeAt).toBe(step.popAt + POP_MS)
      expect(step.endAt).toBeGreaterThan(step.typeAt + step.typeMs - 1)
      if (index > 0) expect(step.popAt).toBe(steps[index - 1].endAt)
    })
    expect(totalMs).toBe(steps[2].endAt)
  })

  it('caps the typing time so long names are not slow', () => {
    expect(typeDuration('Anuradhapura Ancient City')).toBe(MAX_TYPE_MS)
    expect(typeDuration('Ella')).toBeLessThan(MAX_TYPE_MS)
    expect(typeDuration('')).toBe(0)
  })

  it('keeps every real trip under 15 seconds', () => {
    const names = new Map(atlas.markers.map((marker) => [marker.id, marker.name]))
    for (const itinerary of atlas.itineraries) {
      const { steps, totalMs } = planReveal(itinerary.waypoints.map((waypoint) => names.get(waypoint.markerId) ?? ''))
      expect(steps.length, itinerary.id).toBe(itinerary.waypoints.length)
      expect(totalMs, itinerary.id).toBeLessThan(15000)
    }
  })
})
