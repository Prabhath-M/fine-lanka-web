/**
 * map-reveal.ts
 * ------------------------------------------------------------------
 * Timing for the "route reveal" on the tours map: when a trip is
 * selected its stops appear one after another in itinerary order.
 * For each stop: the pin pops up, then its name types out, then a
 * short beat before the next stop.
 *
 * Pure functions only so the choreography is easy to test and tune.
 * ------------------------------------------------------------------
 */

/** Pause before the first stop appears. */
export const START_DELAY_MS = 350
/** Pin pop-up (the name starts typing once the pin has landed). */
export const POP_MS = 360
/** Typing speed; long names are sped up so no stop drags. */
export const CHAR_MS = 30
export const MAX_TYPE_MS = 600
/** Beat after a name finishes, before the next pin. */
export const GAP_MS = 110

export interface RevealStep {
  /** When this stop's pin pops, in ms from the start of the reveal. */
  popAt: number
  /** When its name starts typing. */
  typeAt: number
  /** How long the name takes to type. */
  typeMs: number
  /** When the whole step is done. */
  endAt: number
}

export function typeDuration(name: string): number {
  return Math.min(MAX_TYPE_MS, name.length * CHAR_MS)
}

/** Schedule for a list of stop names, in itinerary order. */
export function planReveal(names: readonly string[]): { steps: RevealStep[]; totalMs: number } {
  let t = START_DELAY_MS
  const steps = names.map((name) => {
    const typeMs = typeDuration(name)
    const step: RevealStep = { popAt: t, typeAt: t + POP_MS, typeMs, endAt: t + POP_MS + typeMs + GAP_MS }
    t = step.endAt
    return step
  })
  return { steps, totalMs: t }
}
