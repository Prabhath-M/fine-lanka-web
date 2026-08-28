'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { AnimationEvent, CSSProperties } from 'react'

export const HERO_OPENING_COMPLETE_EVENT = 'fine-lanka:typed-opening-complete'

/**
 * Typed Arrival Intro — a first-load overlay that types a short message and
 * emits a completion event only when its final dissolve is over. The hero
 * listens for this event before it starts decoding and playing its video.
 */
function OpeningTypingLine({ className, text, startDelay, characterDelay, phrasePauses = [] }: { className: string; text: string; startDelay: number; characterDelay: number; phrasePauses?: { afterWord: string; delay: number }[] }) {
  // The box must stay visible long enough to survive a dropped frame or two
  // (main-thread jank from the hero video/fonts loading is common on a cold
  // first load) — too short and the browser can skip its only paint window
  // entirely, or the following letter can render in the same frame as the
  // box, making it look like the letter overtook it. 0.62 sizes the box
  // relative to typing speed; the floor/ceiling keep it comfortably clear
  // of both extremes.
  const boxLead = Math.max(40, Math.min(56, Math.round(characterDelay * 0.62)))
  // Gap between the box disappearing and the letter fading in, so the two
  // never land in the same animation frame.
  const boxToCharacterGap = 24
  const characters = Array.from(text)
  let elapsed = startDelay
  const characterTimings = characters.map((character) => {
    const boxDelay = elapsed
    elapsed += characterDelay
    return {
      boxDelay,
      characterDelay: boxDelay + boxLead + boxToCharacterGap,
    }
  })

  phrasePauses.forEach(({ afterWord, delay }) => {
    const wordEnd = text.indexOf(afterWord) + afterWord.length
    if (wordEnd <= 0) return
    characterTimings.slice(wordEnd).forEach((timing) => {
      timing.boxDelay += delay
      timing.characterDelay += delay
    })
  })

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
            const timing = characterTimings[index]
            return (
              <span
                key={`${character}-${index}`}
                className="typed-opening-character-slot"
                style={{
                  '--typed-box-delay': `${timing.boxDelay}ms`,
                  '--typed-box-hold': `${boxLead}ms`,
                  '--typed-character-delay': `${timing.characterDelay}ms`,
                } as CSSProperties}
                aria-hidden="true"
              >
                <span className="typed-opening-leading-box" />
                <span className="typed-opening-character">{character === ' ' ? '\u00a0' : character}</span>
              </span>
            )
          })}
        </span>
      ))}
    </p>
  )
}

export function TypedOpening() {
  const hasNotifiedCompletion = useRef(false)

  const notifyCompletion = useCallback(() => {
    if (hasNotifiedCompletion.current) return
    hasNotifiedCompletion.current = true
    document.documentElement.dataset.typedOpeningComplete = 'true'
    window.dispatchEvent(new Event(HERO_OPENING_COMPLETE_EVENT))
  }, [])

  useEffect(() => {
    const openingWasReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const expectedClearAtMs = openingWasReduced ? 580 : 5360
    const fallbackDelay = Math.max(0, expectedClearAtMs - performance.now())
    const fallbackTimer = window.setTimeout(notifyCompletion, fallbackDelay)

    return () => window.clearTimeout(fallbackTimer)
  }, [notifyCompletion])

  const handleCompletion = (event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || event.animationName !== 'typed-opening-clear') return
    notifyCompletion()
  }

  return (
    <section
      className="typed-opening"
      aria-label="Fine Lanka Tours introduction"
      onAnimationEnd={handleCompletion}
    >
      <div className="typed-opening-stage">
        <p className="typed-opening-kicker">Fine Lanka Tours · Island Notes</p>
        <div className="typed-opening-copy" aria-label="Welcome to Sri Lanka. The Pearl of Indian Ocean.">
          <OpeningTypingLine
            className="typed-opening-line typed-opening-line--one"
            text="WELCOME TO SRI LANKA"
            startDelay={300}
            characterDelay={82}
            phrasePauses={[{ afterWord: 'WELCOME TO', delay: 180 }]}
          />
          <OpeningTypingLine
            className="typed-opening-line typed-opening-line--two"
            text="THE PEARL OF INDIAN OCEAN"
            startDelay={2350}
            characterDelay={82}
            phrasePauses={[{ afterWord: 'THE PEARL', delay: 160 }, { afterWord: 'THE PEARL OF INDIAN', delay: 120 }]}
          />
        </div>
        <span className="typed-opening-progress" aria-hidden="true" />
      </div>
    </section>
  )
}
