import { describe, expect, it } from 'vitest'
import atlas from '../public/data/route-atlas.json'

type Marker = { id: string; type: 'primary' | 'hub'; kind: string }
type Waypoint = { markerId: string; role: 'airport' | 'main' | 'secondary'; nights?: number }
type Itinerary = { waypoints: Waypoint[]; airportToAirport: boolean }

const markers = atlas.markers as Marker[]
const itineraries = atlas.itineraries as Itinerary[]
const markerIds = new Set(markers.map((marker) => marker.id))

describe('route atlas data', () => {
  it('keeps every marker unique and classified as a primary destination or supporting hub', () => {
    expect(markers.length).toBe(atlas.networkStats.markerCount)
    expect(new Set(markers.map((marker) => marker.id)).size).toBe(markers.length)
    expect(markers.filter((marker) => marker.type === 'primary')).toHaveLength(atlas.networkStats.primaryCount)
    expect(markers.filter((marker) => marker.type === 'hub')).toHaveLength(atlas.networkStats.hubCount)
  })

  it('keeps every itinerary airport-to-airport with valid role-aware waypoints', () => {
    expect(itineraries).toHaveLength(13)
    for (const itinerary of itineraries) {
      expect(itinerary.airportToAirport).toBe(true)
      expect(itinerary.waypoints[0]).toMatchObject({ markerId: 'bandaranaike-airport', role: 'airport' })
      expect(itinerary.waypoints.at(-1)?.role).not.toBe('airport')
      expect(itinerary.waypoints.every((waypoint) => markerIds.has(waypoint.markerId))).toBe(true)
      expect(itinerary.waypoints.filter((waypoint) => waypoint.role === 'main').every((waypoint) => typeof waypoint.nights === 'number' && waypoint.nights > 0)).toBe(true)
      expect(itinerary.waypoints.filter((waypoint) => waypoint.role !== 'main').every((waypoint) => waypoint.nights === undefined)).toBe(true)
    }
  })

  it('keeps the map intentionally marker-only with no legacy paths', () => {
    expect(atlas.segments).toHaveLength(0)
    expect(atlas.networkStats.edgeCount).toBe(0)
    expect(atlas.networkStats.itineraryCount).toBe(13)
    expect(atlas.networkStats.connected).toBe(false)
  })
})
