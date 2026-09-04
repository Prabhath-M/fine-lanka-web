import { useEffect } from 'react'

/**
 * Kicks off a background fetch for a list of image URLs as soon as
 * `start` is true, so they're already in the browser cache by the time
 * they're actually rendered (e.g. on a page reached via navigation
 * from here). Deliberately a plain `Image()` prefetch rather than
 * `<link rel="preload">` in `<head>` — the list differs per page/
 * component, so this stays scoped to wherever it's called instead of
 * needing global markup changes.
 *
 * Fires regardless of `prefers-reduced-motion`: reduced motion means
 * skip the *animation*, not skip warming the cache — if anything a
 * visitor who skips the animation reaches the real content sooner, so
 * the assets are needed sooner too.
 *
 * See docs/OPENING-ANIMATION-PRELOAD-PLAN.md for the full plan this
 * hook is part of.
 */
export function usePreloadImages(urls: string[], start = true) {
  useEffect(() => {
    if (!start || urls.length === 0) return
    urls.forEach((url) => {
      const img = new window.Image()
      img.src = url
    })
  }, [start, urls])
}
