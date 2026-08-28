/**
 * icons.js
 * ------------------------------------------------------------------
 * Small line-art SVG icons, drawn in-house (no external image files,
 * no icon-font dependency). Every icon shares the same stroke weight
 * and viewBox so new ones can be added consistently.
 *
 * Add a new icon by adding a key with inner SVG markup (no outer <svg> tag).
 * ------------------------------------------------------------------
 */

const ICON_VIEWBOX = "0 0 48 48";

const ICONS = {
  temple: `
    <path d="M24 6 L40 18 H8 Z" />
    <path d="M11 18 V38 M37 18 V38" />
    <path d="M6 38 H42" />
    <path d="M18 24 V38 M30 24 V38" />
  `,
  mountain: `
    <path d="M4 38 L18 16 L24 26 L30 14 L44 38 Z" />
    <path d="M18 16 L21 21 M30 14 L33 19" />
  `,
  wave: `
    <path d="M4 30 C 10 22, 16 22, 22 30 C 28 38, 34 38, 40 30" />
    <path d="M4 20 C 10 12, 16 12, 22 20 C 28 28, 34 28, 40 20" />
  `,
  sun: `
    <circle cx="24" cy="24" r="9" />
    <path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M9 9 L13 13 M35 35 L39 39 M9 39 L13 35 M35 13 L39 9" />
  `,
  island: `
    <path d="M2 34 C 10 28, 16 28, 24 34 C 32 40, 38 40, 46 34" />
    <path d="M18 26 L24 8 L30 26" />
  `,
  compass: `
    <circle cx="24" cy="24" r="18" />
    <path d="M24 12 L28 24 L24 36 L20 24 Z" />
  `,
  elephant: `
    <path d="M8 34 C8 24 14 16 24 16 C33 16 38 22 38 28 C38 32 36 34 33 34 L33 40" />
    <path d="M14 34 V40 M20 34 V40 M27 34 V40" />
    <path d="M8 34 C5 34 4 30 6 27 C7.5 25 9 25.5 9 28" />
    <circle cx="30" cy="22" r="1.4" fill="currentColor" stroke="none" />
    <path d="M14 20 C11 18 11 14 14 12" />
  `,
  leaf: `
    <path d="M10 38 C10 20 24 8 40 8 C40 24 28 38 10 38 Z" />
    <path d="M10 38 C16 30 22 22 30 14" />
  `,
  /* lotus — the Serendib UI-kit's mark; a fan of 5 pointed petals. */
  lotus: `
    <path d="M24 40 Q16.58 31.12 7.04 29.4 Q12.76 37.22 24 40 Z" />
    <path d="M24 40 Q20.94 25.89 11.5 18.35 Q13.31 30.29 24 40 Z" />
    <path d="M24 40 Q29.0 24.6 24.0 12.0 Q19.0 24.6 24 40 Z" />
    <path d="M24 40 Q34.69 30.29 36.5 18.35 Q27.06 25.89 24 40 Z" />
    <path d="M24 40 Q35.24 37.22 40.96 29.4 Q31.42 31.12 24 40 Z" />
    <circle cx="24" cy="41" r="1.4" fill="currentColor" stroke="none" />
  `,
  pin: `
    <path d="M24 44 C24 44 36 30 36 20 A12 12 0 1 0 12 20 C12 30 24 44 24 44 Z" />
    <circle cx="24" cy="20" r="4.5" />
  `,
  phone: `
    <path d="M10 6 H16 L19 14 L15 17 C16.5 22 20 25.5 25 27 L28 23 L36 26 V32 C36 35 34 37 31 36.5 C17 34 10 27 7.5 13 C7 10 8 6 10 6 Z" />
  `,
  arrow: `
    <path d="M6 24 H40 M30 14 L40 24 L30 34" />
  `,
  facebook: `
    <path d="M28 44 V25 H34 L35 18 H28 V14 C28 12 28.5 10.5 31 10.5 H35 V4.3 C34 4.2 31.6 4 29 4 C23.5 4 20 7.3 20 13.3 V18 H14 V25 H20 V44 Z" />
  `,
  instagram: `
    <rect x="6" y="6" width="36" height="36" rx="9" />
    <circle cx="24" cy="24" r="9" />
    <circle cx="34" cy="14" r="1.5" />
  `,
  linkedin: `
    <rect x="6" y="6" width="36" height="36" rx="4" />
    <circle cx="15" cy="16" r="2.3" />
    <path d="M15 22 V38 M15 22 V38 M24 38 V28 C24 24 30 24 30 28 V38 M24 38 V22" />
  `,
  lion: `
    <circle cx="24" cy="27" r="8" />
    <path d="M24 4 L26.5 12 M24 4 L21.5 12 M35 7 L31 14.5 M13 7 L17 14.5 M43 16 L34.5 19 M5 16 L13.5 19 M43 30 L34.5 26.5 M5 30 L13.5 26.5 M35 41 L30.5 33 M13 41 L17.5 33" />
    <circle cx="21" cy="25.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="27" cy="25.5" r="1.1" fill="currentColor" stroke="none" />
    <path d="M22 30 Q24 32 26 30" />
  `,
  chevron: `
    <path d="M29 10 L15 24 L29 38" />
  `,
  flourish: `
    <path d="M6 44 C 6 24, 24 6, 44 6" />
    <path d="M6 44 C 8 30, 16 20, 28 15" />
    <path d="M6 36 C 11 36, 15 32, 15 27" />
    <circle cx="44" cy="6" r="2.1" fill="currentColor" stroke="none" />
  `,
};

/** Returns a ready-to-insert <svg> string for the given icon key. */
function iconMarkup(key, extraClass = "") {
  const inner = ICONS[key] || ICONS.compass;
  return `<svg class="icon ${extraClass}" viewBox="${ICON_VIEWBOX}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
