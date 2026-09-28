import { describe, expect, it } from 'vitest'
import { TOUR_CATEGORIES, TOUR_PACKAGES } from './tours-data'

describe('Tours & Pricing collection data', () => {
  it('keeps every displayed package linked to a configured non-placeholder category with a night count and itinerary', () => {
    const selectableCategories = new Set(
      TOUR_CATEGORIES.filter((category) => !category.comingSoon).map((category) => category.slug),
    )

    expect(TOUR_PACKAGES.length).toBeGreaterThan(0)

    for (const tour of TOUR_PACKAGES) {
      expect(selectableCategories.has(tour.category)).toBe(true)
      expect(tour.nights).toBeGreaterThan(0)
      expect(tour.itinerary.length).toBeGreaterThan(0)
    }
  })

  it('keeps each route\'s night counts, the nights total and the day count consistent', () => {
    for (const tour of TOUR_PACKAGES) {
      const routeNights = [...tour.route.matchAll(/\((\d+)N\)/g)].reduce((sum, match) => sum + Number(match[1]), 0)
      expect(routeNights, `${tour.slug} route nights`).toBe(tour.nights)
      expect(tour.itinerary.length, `${tour.slug} day count`).toBe(tour.nights + 1)
      tour.itinerary.forEach((day, index) => expect(day.day, `${tour.slug} day numbering`).toBe(index + 1))
    }
  })
})
