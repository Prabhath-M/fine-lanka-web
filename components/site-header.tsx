'use client'

// Design reminder: the header is a restrained six-rem heritage threshold;
// route additions should stay concise and preserve its ceremonial rhythm.
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons'
import { NavLink } from '@/components/nav-link'
import { NAV_LINKS, SITE } from '@/lib/site-data'
import { useFocusTrap } from '@/lib/use-focus-trap'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'

/**
 * Hand-painted mural behind the tall, unscrolled header. The prior flipbook
 * cross-faded six large raster layers continuously; one composed frame keeps
 * the same visual language without imposing background decode/paint work on
 * every route.
 */
const MURAL_FRAMES = [
  '/mural/blend-1.webp',
  '/mural/blend-2.webp',
  '/mural/blend-3.webp',
  '/mural/blend-4.webp',
  '/mural/blend-5.webp',
  '/mural/blend-6.webp',
]

/**
 * Maps a Next.js pathname to the `page` key used by NAV_LINKS for
 * active-item highlighting — the React equivalent of the old
 * `document.body.dataset.page` convention every static page set by
 * hand. Extend this as more routes are migrated (see MIGRATION_PLAN.md
 * Phases 3–6): each phase adds its real path here once the page moves
 * off `public/<page>.html`.
 */
function pageKeyForPathname(pathname: string): string {
  if (pathname === '/') return 'index'
  if (pathname.startsWith('/journal')) return 'journal'
  if (pathname.startsWith('/destinations')) return 'destinations'
  if (pathname.startsWith('/tours-pricing')) return 'tours-pricing'
  if (pathname.startsWith('/booking')) return 'booking'
  if (pathname.startsWith('/about')) return 'about'
  return ''
}

export function SiteHeader() {
  const pathname = usePathname()
  const currentPage = pageKeyForPathname(pathname)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [suppressedDropdown, setSuppressedDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const mobileNavRef = useRef<HTMLElement | null>(null)
  const scrolledRef = useRef(false)

  // Client-side navigation keeps the shared header mounted. A dropdown that
  // was dismissed by a click must stay suppressed until the pointer leaves
  // the trigger; otherwise the still-hovered trigger reopens it immediately
  // on the destination page.

  // ---- Compact/scrolled header style (was initHeaderScroll()) ----
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24
      if (next === scrolledRef.current) return
      scrolledRef.current = next
      setScrolled(next)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ---- Keep body[data-page] in sync (public/css/style.css has a few
  // page-scoped rules, e.g. an index-only .nav-toggle style, that key
  // off this attribute — same convention every static page used to set
  // by hand via <body data-page="…">) ----
  useEffect(() => {
    if (currentPage) {
      document.body.dataset.page = currentPage
    } else {
      delete document.body.dataset.page
    }
  }, [currentPage])

  // ---- Lock body scroll while the mobile drawer is open ----
  useBodyScrollLock(mobileOpen)

  // ---- Close the mobile drawer on Escape ----
  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  // ---- Trap focus inside the drawer while open, restore it to the
  // nav-toggle button (or whatever had focus) once it closes ----
  useFocusTrap(mobileOpen, mobileNavRef)

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header${scrolled ? ' is-scrolled' : ''}`}
        id="site-header"
      >
        <div className="site-header-mural" aria-hidden="true">
          <img
            src={MURAL_FRAMES[0]}
            alt=""
            className="site-header-mural-frame"
            width={1900}
            height={360}
            loading="eager"
          />
        </div>
        <div className="container header-inner">
          <NavLink href="/" className="brand">
            <span className="brand-logo">
              <span className="brand-logo-flare" aria-hidden="true" />
              <img
                src="/images/logo-site.webp"
                alt=""
                className="brand-logo-img"
                width={1024}
                height={1024}
                loading="eager"
              />
            </span>
            <span data-brand>{SITE.brand}</span>
          </NavLink>

          <nav aria-label="Primary">
            <ul className="primary-nav" id="primary-nav">
              {NAV_LINKS.map((item) => {
                const isActive = item.page === currentPage
                if (item.children) {
                  return (
                    <li
                      key={item.label}
                      className="nav-item has-dropdown"
                      data-menu={item.page || ''}
                      data-dropdown-suppressed={suppressedDropdown === item.label ? 'true' : undefined}
                      onClick={() => setSuppressedDropdown(item.label)}
                      onPointerEnter={() => setSuppressedDropdown(null)}
                    >
                      <NavLink
                        href={item.href}
                        className={isActive ? 'is-active' : undefined}
                        aria-haspopup="true"
                        onFocus={() => setSuppressedDropdown(null)}
                      >
                        <span className="nav-label">{item.label}</span>
                      </NavLink>
                      <ul className="dropdown">
                        <li className="dropdown-frieze dropdown-frieze--top" aria-hidden="true">
                          <Icon name="tuktuk" />
                          <Icon name="wave" />
                          <Icon name="dancer" />
                          <Icon name="fisherman" />
                        </li>
                        <li className="dropdown-heading" aria-hidden="true">
                          <span>{item.label}</span>
                        </li>
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavLink href={child.href}>
                              <span className="dropdown-icon">
                                <Icon name={child.icon} />
                              </span>
                              <span className="dropdown-label">{child.label}</span>
                            </NavLink>
                          </li>
                        ))}
                        <li className="dropdown-frieze dropdown-frieze--bottom" aria-hidden="true">
                          <Icon name="fisherman" />
                          <Icon name="dancer" />
                          <Icon name="wave" />
                          <Icon name="tuktuk" />
                        </li>
                      </ul>
                    </li>
                  )
                }
                return (
                  <li key={item.label} className={`nav-item${isActive ? ' is-active' : ''}`}>
                    <NavLink href={item.href}><span className="nav-label">{item.label}</span></NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="header-actions">
            <span className="header-phone" data-phone>
              {SITE.phone}
            </span>
            <button className="btn btn-uikit-primary" data-open-enquiry="">
              <Icon name="pin" className="btn-icon" />
              Plan a Journey
            </button>
            <button
              className="nav-toggle"
              id="nav-toggle"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-nav-overlay${mobileOpen ? ' is-open' : ''}`}
        id="mobile-nav-overlay"
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`mobile-nav${mobileOpen ? ' is-open' : ''}`}
        id="mobile-nav"
        ref={mobileNavRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        aria-hidden={!mobileOpen}
        tabIndex={-1}
      >
        <ul id="mobile-nav-links">
          {NAV_LINKS.map((item) => {
            if (item.children) {
              return (
                <li key={item.label} className="mobile-nav-group">
                  <span className="mobile-nav-heading">{item.label}</span>
                  <ul>
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <NavLink href={child.href} onClick={() => setMobileOpen(false)}>
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            }
            return (
              <li key={item.label}>
                <NavLink
                  href={item.href}
                  className={item.page === currentPage ? 'is-active' : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </aside>
    </>
  )
}
