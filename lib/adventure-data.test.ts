import { describe, expect, it } from 'vitest'
import {
  ADVENTURES,
  ADVENTURE_CLOSING,
  ADVENTURE_INTRO,
  ADVENTURE_ZONES,
  ADVENTURE_STAGES,
  adventureStage,
  adventuresForZone,
} from './adventure-data'

describe('adventure data', () => {
  it('has the nine experiences numbered 01-09 in order', () => {
    expect(ADVENTURES.map((a) => a.number)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09'])
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
    expect(titles('land')).toEqual(['ATV & Quad Bike Adventures', 'Horse Riding'])
    expect(titles('water')).toEqual(['Kayaking', 'Surfing & Kite Surfing', 'White-Water Rafting', 'Scuba Diving & Snorkelling'])
    expect(titles('underground')).toEqual(['Cave Exploration'])
  })

  it('gives every experience a photo and alt text', () => {
    for (const a of ADVENTURES) {
      expect(a.image).toMatch(/^\/images\/adventure-/)
      expect((a.imageAlt ?? '').trim()).not.toBe('')
    }
  })

  it('runs from the sky down to the cave', () => {
    expect(ADVENTURES.map((a) => a.slug)).toEqual([
      'helicopter-tours',
      'ella-zip-line',
      'atv-quad-bike-adventures',
      'horse-riding',
      'kayaking',
      'surfing-kite-surfing',
      'white-water-rafting',
      'scuba-diving-snorkelling',
      'cave-exploration',
    ])
  })

  it('returns everything for the "all" filter', () => {
    expect(adventuresForZone('all')).toHaveLength(9)
  })

  it('keeps the section header and closing copy', () => {
    expect(ADVENTURE_INTRO.title).toBe('Go beyond the ordinary.')
    expect(ADVENTURE_CLOSING.title).toBe('A Little More Adventure. A Lot More Sri Lanka.')
    expect(ADVENTURE_CLOSING.signoff).toBe('Explore Sri Lanka. Experience More.')
  })
})

describe('adventureStage', () => {
  it('places the nine experiences from sky down to depth', () => {
    expect(ADVENTURES.map(adventureStage)).toEqual([
      'sky', 'canopy', 'land', 'land', 'water', 'water', 'water', 'ocean', 'depth',
    ])
  })

  it('only uses stages the gauge defines', () => {
    const ids = ADVENTURE_STAGES.map((stage) => stage.id)
    for (const a of ADVENTURES) expect(ids).toContain(adventureStage(a))
  })
})
