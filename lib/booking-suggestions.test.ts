import { describe, expect, it } from 'vitest'
import atlas from '../public/data/route-atlas.json'
import { TOUR_PACKAGES } from './tours-data'
import {
  DEFAULT_SUGGESTIONS,
  MAJOR_SITES,
  MAX_SUGGESTIONS,
  stopsOfTour,
  suggestDestinations,
} from './booking-suggestions'

const markerIds = new Set(atlas.markers.map((marker) => marker.id))

describe('booking destination suggestions', () => {
  it('only suggests places that exist on the map, with unique ids and labels', () => {
    expect(MAJOR_SITES.every((site) => markerIds.has(site.id))).toBe(true)
    expect(new Set(MAJOR_SITES.map((site) => site.id)).size).toBe(MAJOR_SITES.length)
    expect(new Set(MAJOR_SITES.map((site) => site.label)).size).toBe(MAJOR_SITES.length)
  })

  it('shows a fixed set of headline sights when no tour is chosen', () => {
    expect(DEFAULT_SUGGESTIONS).toHaveLength(MAX_SUGGESTIONS)
    expect(suggestDestinations('')).toEqual(DEFAULT_SUGGESTIONS)
    expect(suggestDestinations(null)).toEqual(DEFAULT_SUGGESTIONS)
    expect(suggestDestinations('not-a-tour')).toEqual(DEFAULT_SUGGESTIONS)
  })

  it('suggests 10-12 sights per tour, none already on the tour', () => {
    for (const tour of TOUR_PACKAGES) {
      const onTour = stopsOfTour(tour.slug)
      expect(onTour.size, tour.slug).toBeGreaterThan(0)
      const suggestions = suggestDestinations(tour.slug)
      expect(suggestions.length, tour.slug).toBeGreaterThanOrEqual(10)
      expect(suggestions.length, tour.slug).toBeLessThanOrEqual(MAX_SUGGESTIONS)
      expect(suggestions.every((site) => !onTour.has(site.id)), tour.slug).toBe(true)
      expect(new Set(suggestions.map((site) => site.id)).size, tour.slug).toBe(suggestions.length)
    }
  })

  it('puts sights close to the route first', () => {
    // Highlands & Waterfalls is Kandy / Nuwara Eliya / Ella: Haputale (next to Ella) should
    // come well before far-north Jaffna.
    const ids = suggestDestinations('highlands-and-waterfalls').map((site) => site.id)
    expect(ids).toContain('haputale')
    expect(ids.indexOf('haputale')).toBeLessThan(ids.includes('jaffna') ? ids.indexOf('jaffna') : Infinity)
    expect(ids.indexOf('haputale')).toBeLessThan(5)
  })
})
