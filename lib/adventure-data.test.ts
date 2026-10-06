import { describe, expect, it } from 'vitest'
import {
  ADVENTURES,
  ADVENTURE_CLOSING,
  ADVENTURE_INTRO,
  ADVENTURE_ZONES,
  adventureCountLabel,
  adventuresForZone,
} from './adventure-data'

describe('adventure data', () => {
  it('has the eight experiences numbered 01-08 in order', () => {
    expect(ADVENTURES.map((a) => a.number)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08'])
  })

  it('has unique slugs and unique icon keys', () => {
    expect(new Set(ADVENTURES.map((a) => a.slug)).size).toBe(ADVENTURES.length)
    expect(new Set(ADVENTURES.map((a) => a.icon)).size).toBe(ADVENTURES.length)
  })

  it('has no empty copy and at least one tag per experience', () => {
    for (const a of ADVENTURES) {
      expect(a.title.trim()).not.toBe('')
      expect(a.tagline.trim()).not.toBe('')
      expect(a.body.trim()).not.toBe('')
      expect(a.tags.length).toBeGreaterThan(0)
      for (const tag of a.tags) expect(tag.trim()).not.toBe('')
    }
  })

  it('only uses declared zones and every zone has an experience', () => {
    const zoneIds = ADVENTURE_ZONES.map((z) => z.id)
    for (const a of ADVENTURES) expect(zoneIds).toContain(a.zone)
    for (const id of zoneIds) expect(adventuresForZone(id).length).toBeGreaterThan(0)
  })

  it('groups experiences into zones as planned', () => {
    const titles = (zone: Parameters<typeof adventuresForZone>[0]) => adventuresForZone(zone).map((a) => a.title)
    expect(titles('air')).toEqual(['Helicopter Tours', 'Ella Zip Line'])
    expect(titles('land')).toEqual(['Horse Riding', 'ATV & Quad Bike Adventures'])
    expect(titles('water')).toEqual(['Kayaking', 'White-Water Rafting', 'Scuba Diving & Snorkelling'])
    expect(titles('underground')).toEqual(['Cave Exploration'])
  })

  it('returns everything for the "all" filter', () => {
    expect(adventuresForZone('all')).toHaveLength(8)
  })

  it('keeps the section header and closing copy', () => {
    expect(ADVENTURE_INTRO.title).toBe('Go beyond the ordinary.')
    expect(ADVENTURE_CLOSING.title).toBe('A Little More Adventure. A Lot More Sri Lanka.')
    expect(ADVENTURE_CLOSING.signoff).toBe('Explore Sri Lanka. Experience More.')
  })
})

describe('adventureCountLabel', () => {
  it('describes the current filter', () => {
    expect(adventureCountLabel(8, 'all')).toBe('Showing all 8 experiences')
    expect(adventureCountLabel(3, 'water')).toBe('Showing 3 water experiences')
    expect(adventureCountLabel(1, 'underground')).toBe('Showing 1 underground experience')
  })
})
