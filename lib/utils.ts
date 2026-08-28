import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Shared slug helper — used anywhere a destination name needs to line
 *  up with a data-slug/file-name (map pins + explore-window in
 *  explore-section.tsx, video file names in destination-card.tsx).
 *  e.g. "Ella & the Hill Country" -> "ella-and-the-hill-country". */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
