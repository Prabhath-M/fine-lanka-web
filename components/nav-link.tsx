'use client'

import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

type NavLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode
  }

/**
 * Drop-in replacement for next/link for navigation UI (header nav, footer
 * links). Next's router treats a click on a link to the *current* URL as a
 * no-op — no navigation happens, so the link just looks dead. That was
 * invisible before the Phase 6 `<a>` → `<Link>` migration, since every click
 * used to be a full browser reload no matter the destination. This restores
 * the original full-reload behavior for a same-location click, while every
 * other click keeps the fast client-side navigation Phase 6 added.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { href, onClick, children, ...rest },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    // Let modified/non-primary clicks (open in new tab, etc.) behave normally.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (typeof window === 'undefined') return

    const rawHref = typeof href === 'string' ? href : (href.pathname ?? '/') + (href.search ?? '') + (href.hash ?? '')

    let target: URL
    try {
      target = new URL(rawHref, window.location.origin)
    } catch {
      return
    }

    const isSameLocation =
      !target.hash &&
      target.pathname === window.location.pathname &&
      target.search === window.location.search

    if (isSameLocation) {
      event.preventDefault()
      window.location.reload()
    }
  }

  return (
    <Link ref={ref} href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
})
