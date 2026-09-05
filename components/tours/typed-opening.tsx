'use client'

/* Tours & Pricing opening — first typewriter animation this page has
 * had (docs/OPENING-ANIMATION-PRELOAD-PLAN.md, Section 4). Reuses the
 * same overlay mechanism as Home (components/typed-opening.tsx) and
 * its existing .typed-opening* CSS, with page-appropriate copy.
 *
 * clearDelayMs/reducedClearDelayMs are deliberately left at the
 * component's defaults (5360ms/580ms) so the existing CSS timing in
 * app/globals.css — written for that exact duration — stays correct
 * without needing any CSS changes for this page. */

import { TypedOpening } from '@/components/typed-opening'

export const TOURS_OPENING_COMPLETE_EVENT = 'fine-lanka:tours-opening-complete'

export function ToursTypedOpening() {
  return (
    <TypedOpening
      eventName={TOURS_OPENING_COMPLETE_EVENT}
      kicker="Fine Lanka Tours · Journeys & Fares"
      sectionAriaLabel="Fine Lanka Tours, tours and pricing introduction"
      copyAriaLabel="Every route, considered. Designed around you."
      lines={[
        {
          text: 'EVERY ROUTE, CONSIDERED',
          startDelay: 300,
          characterDelay: 82,
          phrasePauses: [{ afterPhrase: 'EVERY ROUTE,', delay: 170 }],
        },
        {
          text: 'DESIGNED AROUND YOU',
          startDelay: 2600,
          characterDelay: 82,
        },
      ]}
    />
  )
}
