'use client'

import { useEffect } from 'react'

/**
 * `document.body.classList.add/remove('no-scroll')` used to be done
 * independently by four different components (the mobile nav drawer,
 * the enquiry modal, the itinerary modal, and the journal page's
 * doorway/reader) — whichever one's effect happened to run *last* on a
 * given render won, since they all just force the same shared class on
 * or off with no coordination. In particular `EnquiryModal` mounts last
 * in `app/layout.tsx`, so its mount effect (`isOpen` starts `false`)
 * would immediately strip `no-scroll` back off right after e.g. the
 * journal page's doorway had just added it.
 *
 * A simple module-level counter fixes this: the class only comes off
 * once nothing is asking for a lock anymore, no matter which combo of
 * these is active at once or in what order they mount/unmount.
 *
 * The lock deliberately does nothing beyond toggling that class —
 * `.no-scroll` is just `overflow: hidden` (see globals.css). An
 * earlier version of this hook also forced `height: 100%` in that
 * rule and additionally pinned `<body>` to `position: fixed` here to
 * compensate for it; that combination is what was causing the page to
 * visibly jump to the top when a modal opened (some browsers reset
 * scrollTop the instant an element's height is clamped to the
 * viewport while its overflow is hidden). `overflow: hidden` on its
 * own does not have that problem — the page's current scroll position
 * is simply frozen in place, exactly where the person already is, and
 * the modal itself (`position: fixed; inset: 0`) shows up centred on
 * whatever's currently in the viewport with no scrolling involved.
 */
let lockCount = 0

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    lockCount += 1
    document.body.classList.add('no-scroll')
    document.documentElement.classList.add('no-scroll')

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        document.body.classList.remove('no-scroll')
        document.documentElement.classList.remove('no-scroll')
      }
    }
  }, [active])
}
