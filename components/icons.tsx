/**
 * icons.tsx
 * ------------------------------------------------------------------
 * React port of public/js/icons.js. Same line-art SVG icon set (one
 * shared stroke weight/viewBox, no icon-font or external image
 * dependency) — just returned as JSX instead of an HTML string.
 *
 * Usage: <Icon name="temple" className="dropdown-icon" />
 *
 * To add a new icon, add a key to ICON_PATHS below with the inner
 * <path>/<circle> markup (no outer <svg> tag) — same convention the
 * original icons.js used.
 * ------------------------------------------------------------------
 */

const ICON_VIEWBOX = '0 0 48 48'

export const ICON_PATHS = {
  temple: (
    <>
      <path d="M24 6 L40 18 H8 Z" />
      <path d="M11 18 V38 M37 18 V38" />
      <path d="M6 38 H42" />
      <path d="M18 24 V38 M30 24 V38" />
    </>
  ),
  mountain: (
    <>
      <path d="M4 38 L18 16 L24 26 L30 14 L44 38 Z" />
      <path d="M18 16 L21 21 M30 14 L33 19" />
    </>
  ),
  wave: (
    <>
      <path d="M4 30 C 10 22, 16 22, 22 30 C 28 38, 34 38, 40 30" />
      <path d="M4 20 C 10 12, 16 12, 22 20 C 28 28, 34 28, 40 20" />
    </>
  ),
  sun: (
    <>
      <circle cx="24" cy="24" r="9" />
      <path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M9 9 L13 13 M35 35 L39 39 M9 39 L13 35 M35 13 L39 9" />
    </>
  ),
  island: (
    <>
      <path d="M2 34 C 10 28, 16 28, 24 34 C 32 40, 38 40, 46 34" />
      <path d="M18 26 L24 8 L30 26" />
    </>
  ),
  compass: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 12 L28 24 L24 36 L20 24 Z" />
    </>
  ),
  elephant: (
    <>
      <path d="M8 34 C8 24 14 16 24 16 C33 16 38 22 38 28 C38 32 36 34 33 34 L33 40" />
      <path d="M14 34 V40 M20 34 V40 M27 34 V40" />
      <path d="M8 34 C5 34 4 30 6 27 C7.5 25 9 25.5 9 28" />
      <circle cx="30" cy="22" r="1.4" fill="currentColor" stroke="none" />
      <path d="M14 20 C11 18 11 14 14 12" />
    </>
  ),
  leaf: (
    <>
      <path d="M10 38 C10 20 24 8 40 8 C40 24 28 38 10 38 Z" />
      <path d="M10 38 C16 30 22 22 30 14" />
    </>
  ),
  /** lotus — the Serendib UI-kit's mark; a fan of 5 pointed petals. */
  lotus: (
    <>
      <path d="M24 40 Q16.58 31.12 7.04 29.4 Q12.76 37.22 24 40 Z" />
      <path d="M24 40 Q20.94 25.89 11.5 18.35 Q13.31 30.29 24 40 Z" />
      <path d="M24 40 Q29.0 24.6 24.0 12.0 Q19.0 24.6 24 40 Z" />
      <path d="M24 40 Q34.69 30.29 36.5 18.35 Q27.06 25.89 24 40 Z" />
      <path d="M24 40 Q35.24 37.22 40.96 29.4 Q31.42 31.12 24 40 Z" />
      <circle cx="24" cy="41" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  /** tuktuk — a roadside three-wheeler, side profile. */
  tuktuk: (
    <>
      <path d="M5 36 H43" />
      <path d="M9 36 V24 Q9 13 20 13 H29 Q37 13 37 21 V36" />
      <path d="M9 24 H37" />
      <path d="M20 13 Q20 9 24 9" />
      <circle cx="15" cy="40" r="4.2" />
      <circle cx="33" cy="40" r="4.2" />
    </>
  ),
  /** fisherman — a stilt fisherman perched above the surf, rod out. */
  fisherman: (
    <>
      <path d="M6 40 C 14 34, 20 34, 26 40" />
      <path d="M24 40 V14" />
      <circle cx="24" cy="10" r="3" />
      <path d="M24 13 L18 20 M24 13 L31 10" />
      <path d="M31 10 L40 6" />
    </>
  ),
  /** dancer — a Kandyan dancer, headdress and flared skirt mid-turn. */
  dancer: (
    <>
      <circle cx="24" cy="10" r="3" />
      <path d="M18 8 L24 4 L30 8" />
      <path d="M24 13 V24" />
      <path d="M24 16 L34 10 M24 16 L14 20" />
      <path d="M24 24 C 14 28, 14 38, 20 42 M24 24 C 34 28, 34 38, 28 42" />
    </>
  ),
  pin: (
    <>
      <path d="M24 44 C24 44 36 30 36 20 A12 12 0 1 0 12 20 C12 30 24 44 24 44 Z" />
      <circle cx="24" cy="20" r="4.5" />
    </>
  ),
  /** message — a speech bubble with two text lines, for "ask us"/enquiry
   *  buttons (Send Enquiry, Enquire About This Tour). */
  message: (
    <>
      <path d="M6 10 H42 V32 H17 L9 40 V32 H6 Z" />
      <path d="M13 18 H35 M13 24 H29" />
    </>
  ),
  /** mail — a plain envelope, for the newsletter sign-up button. */
  mail: (
    <>
      <path d="M6 12 H42 V36 H6 Z" />
      <path d="M6 12 L24 26 L42 12" />
    </>
  ),
  phone: (
    <path d="M10 6 H16 L19 14 L15 17 C16.5 22 20 25.5 25 27 L28 23 L36 26 V32 C36 35 34 37 31 36.5 C17 34 10 27 7.5 13 C7 10 8 6 10 6 Z" />
  ),
  arrow: <path d="M6 24 H40 M30 14 L40 24 L30 34" />,
  facebook: (
    <path d="M28 44 V25 H34 L35 18 H28 V14 C28 12 28.5 10.5 31 10.5 H35 V4.3 C34 4.2 31.6 4 29 4 C23.5 4 20 7.3 20 13.3 V18 H14 V25 H20 V44 Z" />
  ),
  instagram: (
    <>
      <rect x="6" y="6" width="36" height="36" rx="9" />
      <circle cx="24" cy="24" r="9" />
      <circle cx="34" cy="14" r="1.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="6" y="6" width="36" height="36" rx="4" />
      <circle cx="15" cy="16" r="2.3" />
      <path d="M15 22 V38 M15 22 V38 M24 38 V28 C24 24 30 24 30 28 V38 M24 38 V22" />
    </>
  ),
  lion: (
    <>
      <circle cx="24" cy="27" r="8" />
      <path d="M24 4 L26.5 12 M24 4 L21.5 12 M35 7 L31 14.5 M13 7 L17 14.5 M43 16 L34.5 19 M5 16 L13.5 19 M43 30 L34.5 26.5 M5 30 L13.5 26.5 M35 41 L30.5 33 M13 41 L17.5 33" />
      <circle cx="21" cy="25.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="27" cy="25.5" r="1.1" fill="currentColor" stroke="none" />
      <path d="M22 30 Q24 32 26 30" />
    </>
  ),
  chevron: <path d="M29 10 L15 24 L29 38" />,
  flourish: (
    <>
      <path d="M6 44 C 6 24, 24 6, 44 6" />
      <path d="M6 44 C 8 30, 16 20, 28 15" />
      <path d="M6 36 C 11 36, 15 32, 15 27" />
      <circle cx="44" cy="6" r="2.1" fill="currentColor" stroke="none" />
    </>
  ),
} as const

export type IconName = keyof typeof ICON_PATHS

export function Icon({
  name,
  className = '',
}: {
  name: IconName | (string & {})
  className?: string
}) {
  const inner = ICON_PATHS[name as IconName] ?? ICON_PATHS.compass

  return (
    <svg
      className={`icon${className ? ` ${className}` : ''}`}
      viewBox={ICON_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {inner}
    </svg>
  )
}
