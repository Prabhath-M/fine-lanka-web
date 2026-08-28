import { useEffect, useMemo, useState } from 'react'

export type TypingPhrasePause = {
  afterPhrase: string
  delay: number
}

export type TypingTiming = {
  boxDelay: number
  characterDelay: number
}

export function buildTypingTimings(
  text: string,
  startDelay: number,
  characterDelay: number,
  phrasePauses: TypingPhrasePause[] = [],
  boxLead: number,
  boxToCharacterGap: number,
) {
  const characters = Array.from(text)
  let elapsed = startDelay
  const timings: TypingTiming[] = characters.map(() => {
    const boxDelay = elapsed
    elapsed += characterDelay
    return {
      boxDelay,
      characterDelay: boxDelay + boxLead + boxToCharacterGap,
    }
  })

  phrasePauses.forEach(({ afterPhrase, delay }) => {
    const phraseEnd = text.indexOf(afterPhrase) + afterPhrase.length
    if (phraseEnd <= 0) return
    timings.slice(phraseEnd).forEach((timing) => {
      timing.boxDelay += delay
      timing.characterDelay += delay
    })
  })

  return timings
}

export function useTypingProgress(
  text: string,
  startDelay: number,
  characterDelay: number,
  phrasePauses: TypingPhrasePause[] = [],
  boxLeadRatio = 0.62,
  minimumBoxLead = 40,
  maximumBoxLead = 56,
  boxToCharacterGap = 24,
) {
  const characters = useMemo(() => Array.from(text), [text])
  const phrasePausesKey = JSON.stringify(phrasePauses)
  const boxLead = Math.max(
    minimumBoxLead,
    Math.min(maximumBoxLead, Math.round(characterDelay * boxLeadRatio)),
  )
  const timings = useMemo(
    () =>
      buildTypingTimings(
        text,
        startDelay,
        characterDelay,
        JSON.parse(phrasePausesKey) as TypingPhrasePause[],
        boxLead,
        boxToCharacterGap,
      ),
    [boxLead, boxToCharacterGap, characterDelay, phrasePausesKey, startDelay, text],
  )

  const [revealedCount, setRevealedCount] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setRevealedCount(characters.length)
      setActiveIndex(-1)
      return
    }

    setRevealedCount(0)
    setActiveIndex(-1)
    const timers: number[] = []

    timings.forEach((timing, index) => {
      timers.push(
        window.setTimeout(() => {
          setActiveIndex(index)
        }, timing.boxDelay),
      )
      timers.push(
        window.setTimeout(() => {
          setRevealedCount((count) => Math.max(count, index + 1))
          setActiveIndex((current) => (current === index ? -1 : current))
        }, timing.characterDelay),
      )
    })

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [characters.length, timings])

  return { activeIndex, boxLead, characters, revealedCount }
}
