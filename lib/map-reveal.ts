/**
 * map-reveal.ts
 * ------------------------------------------------------------------
 * Timing for the "route reveal" on the tours map: when a trip is
 * selected its stops appear one after another in itinerary order.
 * For each stop: the pin pops up and settles, a short still pause, then
 * its name types out, then a short beat before the next stop. Nothing
 * moves while a name is typing.
 *
 * Pure functions only so the choreography is easy to test and tune.
 * ------------------------------------------------------------------
 */

/** Pause before the first stop appears. */
export const START_DELAY_MS = 350
/** Pin pop-up. Everything that moves (pin, ripple, illustration) is finished within this. */
export const POP_MS = 380
/** Still pause after the pin has landed, before its name starts typing. */
export const NAME_DELAY_MS = 400
/** When the name starts typing, measured from the start of the pin pop. */
export const NAME_START_MS = POP_MS + NAME_DELAY_MS
/** Typing speed; long names are sped up so no stop drags. */
export const CHAR_MS = 28
export const MAX_TYPE_MS = 520
/** Beat after a name finishes, before the next pin. */
export const GAP_MS = 70

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
    const step: RevealStep = { popAt: t, typeAt: t + NAME_START_MS, typeMs, endAt: t + NAME_START_MS + typeMs + GAP_MS }
    t = step.endAt
    return step
  })
  return { steps, totalMs: t }
}
