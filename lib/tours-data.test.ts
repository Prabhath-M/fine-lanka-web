import { describe, expect, it } from 'vitest'
import { TOUR_CATEGORIES, TOUR_PACKAGES } from './tours-data'

describe('Tours & Pricing collection data', () => {
  it('keeps every displayed package linked to a configured non-placeholder category with a positive price and itinerary', () => {
    const selectableCategories = new Set(
      TOUR_CATEGORIES.filter((category) => !category.comingSoon).map((category) => category.slug),
    )

    expect(TOUR_PACKAGES.length).toBeGreaterThan(0)

    for (const tour of TOUR_PACKAGES) {
      expect(selectableCategories.has(tour.category)).toBe(true)
      expect(tour.priceFrom).toBeGreaterThan(0)
      expect(tour.nights).toBeGreaterThan(0)
      expect(tour.itinerary.length).toBeGreaterThan(0)
    }
  })
})
