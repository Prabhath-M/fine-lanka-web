import { describe, expect, it } from 'vitest'
import { buildTypingTimings } from './use-typing-progress'

describe('buildTypingTimings', () => {
  it('keeps every leading box ahead of its character reveal', () => {
    const timings = buildTypingTimings('ABC', 100, 80, [], 50, 24)

    expect(timings).toEqual([
      { boxDelay: 100, characterDelay: 174 },
      { boxDelay: 180, characterDelay: 254 },
      { boxDelay: 260, characterDelay: 334 },
    ])
    expect(timings.every(({ boxDelay, characterDelay }) => characterDelay > boxDelay)).toBe(true)
  })

  it('applies phrase pauses only to characters after the phrase', () => {
    const timings = buildTypingTimings(
      'WELCOME HOME',
      0,
      80,
      [{ afterPhrase: 'WELCOME', delay: 180 }],
      50,
      24,
    )

    expect(timings[0]).toEqual({ boxDelay: 0, characterDelay: 74 })
    expect(timings[6]).toEqual({ boxDelay: 480, characterDelay: 554 })
    expect(timings[7]).toEqual({ boxDelay: 740, characterDelay: 814 })
  })
})
