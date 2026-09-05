'use client'

/* Thin Home-specific wrapper around the generic overlay in
 * components/typed-opening.tsx (docs/OPENING-ANIMATION-PRELOAD-PLAN.md,
 * Section 4). Copy, timing, and the exported event name are byte-for-
 * byte the same as before this was extracted — hero.tsx's import of
 * HERO_OPENING_COMPLETE_EVENT from this same path is unaffected. */

import { TypedOpening as GenericTypedOpening } from '@/components/typed-opening'

export const HERO_OPENING_COMPLETE_EVENT = 'fine-lanka:typed-opening-complete'

export function TypedOpening() {
  return (
    <GenericTypedOpening
      eventName={HERO_OPENING_COMPLETE_EVENT}
      kicker="Fine Lanka Tours · Island Notes"
      sectionAriaLabel="Fine Lanka Tours introduction"
      copyAriaLabel="Welcome to Sri Lanka. The Pearl of Indian Ocean."
      lines={[
        {
          text: 'WELCOME TO SRI LANKA',
          startDelay: 300,
          characterDelay: 82,
          phrasePauses: [{ afterPhrase: 'WELCOME TO', delay: 180 }],
        },
        {
          text: 'THE PEARL OF INDIAN OCEAN',
          startDelay: 2350,
          characterDelay: 82,
          phrasePauses: [
            { afterPhrase: 'THE PEARL', delay: 160 },
            { afterPhrase: 'THE PEARL OF INDIAN', delay: 120 },
          ],
        },
      ]}
    />
  )
}
