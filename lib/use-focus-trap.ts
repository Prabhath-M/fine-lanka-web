'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Basic focus-trap for modals/drawers (enquiry modal, itinerary modal,
 * mobile nav drawer). While `active` is true:
 *  - moves focus into the container (first focusable element, or the
 *    container itself if nothing focusable is found)
 *  - keeps Tab/Shift+Tab cycling within the container instead of
 *    escaping to the page behind it
 *  - restores focus to whatever was focused before the trap activated
 *    once `active` goes back to false (e.g. the nav-toggle button, or
 *    whichever "Plan a Journey" button opened the enquiry modal)
 */
export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!active || !container) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))

    const first = focusables()[0]
    ;(first ?? container).focus({ preventScroll: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus?.({ preventScroll: true })
    }
  }, [active, containerRef])
}
