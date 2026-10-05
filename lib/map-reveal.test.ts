import { describe, expect, it } from 'vitest'
import atlas from '../public/data/route-atlas.json'
import { ARROW_MS, MAX_TYPE_MS, NAME_DELAY_MS, NAME_START_MS, POP_MS, START_DELAY_MS, planReveal, typeDuration } from './map-reveal'

describe('route reveal timing', () => {
  it('reveals stops strictly one after another: pin, then name, then the next stop', () => {
    const { steps, totalMs } = planReveal(['Katunayaka Airport', 'Anuradhapura Ancient City', 'Sigiriya'])
    expect(steps).toHaveLength(3)
    expect(steps[0].popAt).toBe(START_DELAY_MS)
    steps.forEach((step, index) => {
      expect(step.typeAt).toBe(step.popAt + NAME_START_MS)
      expect(step.endAt).toBeGreaterThan(step.typeAt + step.typeMs - 1)
      if (index > 0) expect(step.popAt).toBe(steps[index - 1].endAt)
    })
    expect(totalMs).toBe(steps[2].endAt)
  })

  it('shows a direction arrow after each name is typed, until the next pin pops (none after the last stop)', () => {
    const { steps } = planReveal(['Katunayaka Airport', 'Sigiriya', 'Kandy'])
    expect(steps[0].arrowAt).toBe(steps[0].typeAt + steps[0].typeMs)
    expect(steps[1].arrowAt).toBe(steps[1].typeAt + steps[1].typeMs)
    expect(steps[2].arrowAt).toBeNull()
    expect(steps[1].popAt - steps[0].arrowAt!).toBeGreaterThanOrEqual(ARROW_MS)
  })

  it('waits for the pin to land and then pauses before the name starts typing', () => {
    const { steps } = planReveal(['Kandy'])
    expect(steps[0].typeAt - steps[0].popAt).toBe(POP_MS + NAME_DELAY_MS)
    expect(NAME_DELAY_MS).toBeGreaterThanOrEqual(400)
  })

  it('caps the typing time so long names are not slow', () => {
    expect(typeDuration('Anuradhapura Ancient City')).toBe(MAX_TYPE_MS)
    expect(typeDuration('Ella')).toBeLessThan(MAX_TYPE_MS)
    expect(typeDuration('')).toBe(0)
  })

  it('keeps every real trip under 30 seconds (the arrow pauses add time; there is a Skip button)', () => {
    const names = new Map(atlas.markers.map((marker) => [marker.id, marker.name]))
    for (const itinerary of atlas.itineraries) {
      const { steps, totalMs } = planReveal(itinerary.waypoints.map((waypoint) => names.get(waypoint.markerId) ?? ''))
      expect(steps.length, itinerary.id).toBe(itinerary.waypoints.length)
      expect(totalMs, itinerary.id).toBeLessThan(30000)
    }
  })
})
