import { NextRequest } from 'next/server'

/** In-memory rate limiter, keyed by IP + form kind.
 *
 *  IMPORTANT LIMITATION: this only works reliably on a single
 *  long-running server process. On serverless platforms (Vercel, most
 *  Netlify functions) each invocation can land on a different instance
 *  with its own empty Map, and the Map is wiped on every cold start —
 *  so this is a best-effort speed bump against a single script hammering
 *  one instance, not a real guarantee. If actual abuse shows up in
 *  production, replace this with a shared store (Upstash Redis is the
 *  standard pairing for Vercel — @upstash/ratelimit) so the count is
 *  consistent across instances. Documented in docs/PRE-LAUNCH-AUDIT.md
 *  Phase 8. */
const hits = new Map<string, number[]>()

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5

export function isRateLimited(req: NextRequest, formKind: string): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const key = `${formKind}:${ip}`
  const now = Date.now()
  const timestamps = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps)
    return true
  }

  timestamps.push(now)
  hits.set(key, timestamps)

  // Opportunistic cleanup so the Map doesn't grow unbounded on a
  // long-running process — cheap since it only runs when a new IP hits.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      const fresh = v.filter((t) => now - t < WINDOW_MS)
      if (fresh.length === 0) hits.delete(k)
      else hits.set(k, fresh)
    }
  }

  return false
}

/** A honeypot field name shared across all three forms. Real visitors
 *  never see or fill this field (hidden via CSS, not just off-screen
 *  text, and marked aria-hidden so screen readers skip it too); most
 *  bots fill every field they find in the DOM. If it's non-empty, treat
 *  the submission as spam. */
export const HONEYPOT_FIELD = 'company_website'

export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD]
  return typeof value === 'string' && value.trim().length > 0
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_RE.test(value.trim()) && value.trim().length <= 254
}

/** Trims a string field and caps its length so one malicious/broken
 *  request can't send megabytes of text through to an email. Returns
 *  undefined for anything that isn't a non-empty string, so callers can
 *  treat "not provided" and "invalid type" the same way. */
export function cleanString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (trimmed.length === 0) return undefined
  return trimmed.slice(0, maxLength)
}
