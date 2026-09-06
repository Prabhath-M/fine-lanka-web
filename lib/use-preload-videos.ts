import { useEffect } from 'react'

/**
 * Warms the browser's HTTP cache for a list of video URLs, without
 * mounting a <video> element or decoding any frames — this is a plain
 * `fetch(..., { cache: 'force-cache' })`, so nothing plays or draws to
 * the screen, it just gets the bytes into cache ahead of time.
 *
 * Companion to usePreloadImages (lib/use-preload-images.ts), same
 * cache-warming idea, but video needs `fetch` rather than `new Image()`
 * since there's no video-equivalent constructor that fetches without
 * attaching to the DOM.
 *
 * Exists for carousels like the Island Carousel (destination-marquee.tsx)
 * that deliberately mount/decode video for only the active card (see
 * lib/destination-media.ts) to avoid decoding multiple loops in
 * parallel. That's the right call for decode cost, but it means a
 * freshly-activated card's video previously had zero head start on the
 * network fetch — this hook gives it one, by fetching the *next* likely
 * card(s) into cache while the current one is showing, so the switch
 * itself just decodes from an already-local response instead of
 * waiting on the network.
 */
export function usePreloadVideos(urls: string[], start = true) {
  useEffect(() => {
    if (!start || urls.length === 0) return
    urls.forEach((url) => {
      fetch(url, { cache: 'force-cache' }).catch(() => undefined)
    })
  }, [start, urls])
}
