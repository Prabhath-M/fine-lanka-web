/**
 * social-links.ts
 * ------------------------------------------------------------------
 * Single source of truth for Fine Lanka Tours' social/review profile
 * links, kept separate from lib/site-data.ts so it's the one obvious
 * place to fill these in later.
 *
 * All `href` values are intentionally blank for now — none of these
 * profiles exist/are confirmed yet. The footer renders a disabled,
 * non-clickable icon for any entry with a blank href instead of a
 * dead `#` link, so nothing looks broken in the meantime. Fill in a
 * real URL here and it becomes a live link automatically.
 * ------------------------------------------------------------------
 */

export interface SocialLink {
  key: string
  label: string
  href: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'facebook', label: 'Facebook', href: '' },
  { key: 'instagram', label: 'Instagram', href: '' },
  { key: 'linkedin', label: 'LinkedIn', href: '' },
  { key: 'tripadvisor', label: 'TripAdvisor', href: '' },
]
