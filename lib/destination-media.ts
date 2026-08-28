/**
 * Destination-card video is deliberately limited to the foreground carousel
 * card. This avoids decoding the same autoplay fallback on hidden cards.
 */
export function shouldRenderDestinationVideo(mediaActive: boolean, reducedMotion: boolean) {
  return mediaActive && !reducedMotion
}
