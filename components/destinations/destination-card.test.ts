import { describe, expect, it } from 'vitest'
import { shouldRenderDestinationVideo } from '../../lib/destination-media'

describe('shouldRenderDestinationVideo', () => {
  it('mounts autoplay media only for an active card when motion is allowed', () => {
    expect(shouldRenderDestinationVideo(true, false)).toBe(true)
    expect(shouldRenderDestinationVideo(false, false)).toBe(false)
  })

  it('keeps the non-video fallback for users who prefer reduced motion', () => {
    expect(shouldRenderDestinationVideo(true, true)).toBe(false)
    expect(shouldRenderDestinationVideo(false, true)).toBe(false)
  })
})
