import { describe, expect, it } from 'vitest'
import atlas from '../public/data/route-atlas.json'

type Marker = { id: string }
type Segment = { id: string; from: string; to: string }
type Itinerary = { waypoints: string[]; segments: string[]; airportToAirport: boolean }

const markers = atlas.markers as Marker[]
const segments = atlas.segments as Segment[]
const itineraries = atlas.itineraries as Itinerary[]
const segmentById = new Map(segments.map((segment) => [segment.id, segment]))

const connects = (segment: Segment, from: string, to: string) =>
  (segment.from === from && segment.to === to) || (segment.from === to && segment.to === from)

describe('route atlas data', () => {
  it('keeps every registered destination and hub in one connected network', () => {
    const adjacency = new Map(markers.map((marker) => [marker.id, new Set<string>()]))
    for (const segment of segments) {
      adjacency.get(segment.from)?.add(segment.to)
      adjacency.get(segment.to)?.add(segment.from)
    }

    const visited = new Set<string>(['airport'])
    const queue = ['airport']
    while (queue.length) {
      const current = queue.shift() as string
      for (const next of adjacency.get(current) ?? []) {
        if (!visited.has(next)) {
          visited.add(next)
          queue.push(next)
        }
      }
    }

    expect(visited.size).toBe(markers.length)
    expect(atlas.networkStats.connected).toBe(true)
  })

  it('keeps every itinerary airport-to-airport with matching consecutive legs', () => {
    expect(itineraries).toHaveLength(13)
    for (const itinerary of itineraries) {
      expect(itinerary.airportToAirport).toBe(true)
      expect(itinerary.waypoints[0]).toBe('airport')
      expect(itinerary.waypoints.at(-1)).toBe('airport')
      expect(itinerary.segments).toHaveLength(itinerary.waypoints.length - 1)
      itinerary.segments.forEach((segmentId, index) => {
        const segment = segmentById.get(segmentId)
        expect(segment, `${itinerary.waypoints[index]} → ${itinerary.waypoints[index + 1]}`).toBeDefined()
        expect(connects(segment as Segment, itinerary.waypoints[index], itinerary.waypoints[index + 1])).toBe(true)
      })
    }
  })

  it('keeps main corridors solid and scenic or local spurs dashed', () => {
    expect(segments.some((segment) => (segment as Segment & { kind: string }).kind === 'main')).toBe(true)
    expect(segments.some((segment) => (segment as Segment & { kind: string }).kind === 'scenic')).toBe(true)
  })
})
