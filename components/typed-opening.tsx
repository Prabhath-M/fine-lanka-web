'use client'

/* Generic full-screen typewriter opening overlay, extracted from
 * components/home/typed-opening.tsx (docs/OPENING-ANIMATION-PRELOAD-PLAN.md,
 * Section 4) so Tours & Pricing can reuse the same mechanism and CSS
 * (.typed-opening* in app/globals.css) with its own copy, instead of
 * inventing a fourth animation style. Home keeps using its own thin
 * wrapper (components/home/typed-opening.tsx) with its existing copy/
 * timing passed in as props — nothing about Home's behavior changes.
 *
 * Timing note: the CSS clear/CRT-filament animations in app/globals.css
 * are hardcoded to a 5360ms/580ms total experience length (the numbers
 * baked into `animation-delay` there — see the .typed-opening block).
 * Any usage of this component should keep `clearDelayMs`/
 * `reducedClearDelayMs` at the defaults unless those CSS delays are
 * also updated to match — otherwise the overlay will clear at the
 * wrong moment relative to its own fade/filament effect.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTypingProgress } from '@/lib/use-typing-progress'

export type TypedOpeningPhrasePause = { afterPhrase: string; delay: number }

export type TypedOpeningLineConfig = {
  text: string
  startDelay: number
  characterDelay: number
  phrasePauses?: TypedOpeningPhrasePause[]
}

function OpeningTypingLine({
  className,
  text,
  startDelay,
  characterDelay,
  phrasePauses = [],
}: {
  className: string
  text: string
  startDelay: number
  characterDelay: number
  phrasePauses?: TypedOpeningPhrasePause[]
}) {
  const { activeIndex, characters, revealedCount } = useTypingProgress(
    text,
    startDelay,
    characterDelay,
    phrasePauses,
  )
  const words: { chars: string[]; startIndex: number; isSpace: boolean }[] = []

  characters.forEach((character, index) => {
    const isSpace = character === ' '
    const current = words[words.length - 1]
    if (current && current.isSpace === isSpace) {
      current.chars.push(character)
    } else {
      words.push({ chars: [character], startIndex: index, isSpace })
    }
  })

  return (
    <p className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={word.isSpace ? undefined : 'typed-opening-word'}>
          {word.chars.map((character, charOffset) => {
            const index = word.startIndex + charOffset
            const isRevealed = index < revealedCount
            const isActive = index === activeIndex
            return (
              <span
                key={`${character}-${index}`}
                className="typed-opening-character-slot"
                aria-hidden="true"
              >
                <span className={`typed-opening-leading-box${isActive ? ' is-active' : ''}`} />
                <span className={`typed-opening-character${isRevealed ? ' is-revealed' : ''}`}>
                  {character === ' ' ? '\u00a0' : character}
                </span>
              </span>
            )
          })}
        </span>
      ))}
    </p>
  )
}

export function TypedOpening({
  eventName,
  kicker,
  sectionAriaLabel,
  copyAriaLabel,
  lines,
  clearDelayMs = 5360,
  reducedClearDelayMs = 580,
}: {
  /** Dispatched on window once the overlay finishes, same pattern as
   *  HERO_OPENING_COMPLETE_EVENT — whoever needs to know (e.g. to start
   *  buffering a video, or just to log/measure) listens for this. */
  eventName: string
  kicker: string
  sectionAriaLabel: string
  copyAriaLabel: string
  /** Exactly 1 or 2 entries — the CSS only styles
   *  `.typed-opening-line--one`/`--two`. */
  lines: [TypedOpeningLineConfig] | [TypedOpeningLineConfig, TypedOpeningLineConfig]
  clearDelayMs?: number
  reducedClearDelayMs?: number
}) {
  const hasNotifiedCompletion = useRef(false)
  const [isReady, setIsReady] = useState(false)

  const notifyCompletion = useCallback(() => {
    if (hasNotifiedCompletion.current) return
    hasNotifiedCompletion.current = true
    window.dispatchEvent(new Event(eventName))
  }, [eventName])

  useEffect(() => {
    setIsReady(true)
    const openingWasReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clearDelay = openingWasReduced ? reducedClearDelayMs : clearDelayMs
    const clearTimer = window.setTimeout(notifyCompletion, clearDelay)

    return () => window.clearTimeout(clearTimer)
  }, [notifyCompletion, clearDelayMs, reducedClearDelayMs])

  return (
    <section className={`typed-opening${isReady ? ' is-ready' : ''}`} aria-label={sectionAriaLabel}>
      <div className="typed-opening-stage">
        <p className="typed-opening-kicker">{kicker}</p>
        <div className="typed-opening-copy" aria-label={copyAriaLabel}>
          {lines.map((line, index) => (
            <OpeningTypingLine
              key={line.text}
              className={`typed-opening-line typed-opening-line--${index === 0 ? 'one' : 'two'}`}
              text={line.text}
              startDelay={line.startDelay}
              characterDelay={line.characterDelay}
              phrasePauses={line.phrasePauses}
            />
          ))}
        </div>
        <span className="typed-opening-progress" aria-hidden="true" />
      </div>
    </section>
  )
}
