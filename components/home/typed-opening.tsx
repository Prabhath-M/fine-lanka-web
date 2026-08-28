'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTypingProgress } from '@/lib/use-typing-progress'

export const HERO_OPENING_COMPLETE_EVENT = 'fine-lanka:typed-opening-complete'

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
  phrasePauses?: { afterPhrase: string; delay: number }[]
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

export function TypedOpening() {
  const hasNotifiedCompletion = useRef(false)
  const [isReady, setIsReady] = useState(false)

  const notifyCompletion = useCallback(() => {
    if (hasNotifiedCompletion.current) return
    hasNotifiedCompletion.current = true
    window.dispatchEvent(new Event(HERO_OPENING_COMPLETE_EVENT))
  }, [])

  useEffect(() => {
    setIsReady(true)
    const openingWasReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clearDelay = openingWasReduced ? 580 : 5360
    const clearTimer = window.setTimeout(notifyCompletion, clearDelay)

    return () => window.clearTimeout(clearTimer)
  }, [notifyCompletion])

  return (
    <section
      className={`typed-opening${isReady ? ' is-ready' : ''}`}
      aria-label="Fine Lanka Tours introduction"
    >
      <div className="typed-opening-stage">
        <p className="typed-opening-kicker">Fine Lanka Tours · Island Notes</p>
        <div className="typed-opening-copy" aria-label="Welcome to Sri Lanka. The Pearl of Indian Ocean.">
          <OpeningTypingLine
            className="typed-opening-line typed-opening-line--one"
            text="WELCOME TO SRI LANKA"
            startDelay={300}
            characterDelay={82}
            phrasePauses={[{ afterPhrase: 'WELCOME TO', delay: 180 }]}
          />
          <OpeningTypingLine
            className="typed-opening-line typed-opening-line--two"
            text="THE PEARL OF INDIAN OCEAN"
            startDelay={2350}
            characterDelay={82}
            phrasePauses={[{ afterPhrase: 'THE PEARL', delay: 160 }, { afterPhrase: 'THE PEARL OF INDIAN', delay: 120 }]}
          />
        </div>
        <span className="typed-opening-progress" aria-hidden="true" />
      </div>
    </section>
  )
}
