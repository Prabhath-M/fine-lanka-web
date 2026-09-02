'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { JOURNAL_ENTRIES, type JournalEntry } from '@/lib/journal-data'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import { Icon } from '@/components/icons'
import { useTypingProgress } from '@/lib/use-typing-progress'

// Design reminder: the portal resolves into a measured archive reveal—heading
// and brass rules first, then one journal card at a time. State owns the card
// cascade so it cannot collapse into a grouped CSS animation.
const THRESHOLD_TYPING_MS = 12400
const THRESHOLD_POWER_DOWN_MS = 640
const POST_PORTAL_PAUSE_MS = 500
const EYEBROW_REVEAL_MS = 1200
const TITLE_REVEAL_MS = 1500
const DESCRIPTION_REVEAL_MS = 1800
const DIVIDER_REVEAL_MS = 1100
const EYEBROW_TO_TITLE_DELAY_MS = 650
const TITLE_TO_DESCRIPTION_DELAY_MS = 800
const DESCRIPTION_TO_DIVIDER_DELAY_MS = 1000
// The heading stages complete before the archive folios begin. The per-card
// cadence remains unchanged once the first folio is eligible.
const CARD_REVEAL_START_MS = DIVIDER_REVEAL_MS
const CARD_REVEAL_STAGGER_MS = 330

function JournalTypingLine({
  text,
  startDelay,
  characterDelay,
  phrasePauses = [],
}: {
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
    0.7,
    16,
    34,
    12,
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
    <>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={word.isSpace ? undefined : 'journal-threshold-word'}>
          {word.chars.map((character, charOffset) => {
            const index = word.startIndex + charOffset
            const isRevealed = index < revealedCount
            const isActive = index === activeIndex
            return (
              <span key={`${character}-${index}`} className="journal-threshold-character-slot" aria-hidden="true">
                <span className={`journal-threshold-leading-box${isActive ? ' is-active' : ''}`} />
                <span className={`journal-threshold-character${isRevealed ? ' is-revealed' : ''}`}>
                  {character === ' ' ? '\u00a0' : character}
                </span>
              </span>
            )
          })}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  )
}

export function JournalPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [contentRevealed, setContentRevealed] = useState(false)
  const [realmReady, setRealmReady] = useState(false)
  const [headingStage, setHeadingStage] = useState(0)
  const [revealedCardCount, setRevealedCardCount] = useState(0)
  const [doorwayGone, setDoorwayGone] = useState(false)
  const [thresholdComplete, setThresholdComplete] = useState(false)
  const [thresholdReady, setThresholdReady] = useState(false)
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null)

  const chronicleRef = useRef<HTMLElement | null>(null)
  const portalToggleRef = useRef<HTMLInputElement | null>(null)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentRevealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cardRevealTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const headingStageTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const thresholdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openingRef = useRef(false)

  const prefersReducedMotion = useCallback(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // ---- Open the doorway while zooming through it at the same time →
  // reveal the chronicles beyond ----
  const openPortal = useCallback(() => {
    if (openingRef.current) return
    openingRef.current = true

    // Automatic opening must also enter the native fallback's checked state,
    // otherwise its `:not(:checked)` scroll lock never releases.
    if (portalToggleRef.current) portalToggleRef.current.checked = true

    setIsOpen(true)
    setIsZooming(true)

    if (prefersReducedMotion()) {
      setRevealed(true)
      setContentRevealed(true)
      setDoorwayGone(true)
      return
    }

    // Keep the page locked throughout the 0.8s anticipation and 3s
    // door/realm transition; the reveal state releases it only after the
    // doorway has been removed from the document.
    revealTimer.current = setTimeout(() => {
      setRevealed(true)
      setDoorwayGone(true)
      contentRevealTimer.current = setTimeout(() => {
        setContentRevealed(true)
      }, POST_PORTAL_PAUSE_MS)
    }, 3800)
  }, [prefersReducedMotion])

  // ---- Clear screen → CSS types every character → open the doorway ----
  useEffect(() => {
    const clearTimers = () => {
      if (thresholdTimer.current) clearTimeout(thresholdTimer.current)
    }

    setThresholdReady(true)

    if (prefersReducedMotion()) {
      setThresholdComplete(true)
      openPortal()
      return clearTimers
    }

    setThresholdComplete(false)
    thresholdTimer.current = setTimeout(() => {
      setThresholdComplete(true)
      openPortal()
    }, THRESHOLD_TYPING_MS + THRESHOLD_POWER_DOWN_MS)
    return clearTimers
  }, [openPortal, prefersReducedMotion])

  useEffect(() => {
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current)
      if (contentRevealTimer.current) clearTimeout(contentRevealTimer.current)
      cardRevealTimers.current.forEach(clearTimeout)
      headingStageTimers.current.forEach(clearTimeout)
    }
  }, [])

  // Decode the exact CSS realm source while the doorway is on screen. The
  // independent heading sequence cannot start until both this image and the
  // portal-completion state are ready.
  useEffect(() => {
    const realm = new window.Image()
    const markReady = () => setRealmReady(true)
    realm.addEventListener('load', markReady, { once: true })
    realm.src = '/images/journal/portal-realm-refined.jpg'
    if (realm.complete) markReady()
    return () => realm.removeEventListener('load', markReady)
  }, [])

  // The lines are distinct stages, not a shared CSS delay. Each following
  // stage begins partway through its predecessor for a measured cascade.
  useEffect(() => {
    headingStageTimers.current.forEach(clearTimeout)
    headingStageTimers.current = []

    if (!contentRevealed || !realmReady) {
      setHeadingStage(0)
      return
    }

    if (prefersReducedMotion()) {
      setHeadingStage(4)
      return
    }

    setHeadingStage(1)
    const titleTimer = setTimeout(
      () => setHeadingStage(2),
      EYEBROW_TO_TITLE_DELAY_MS,
    )
    const descriptionTimer = setTimeout(
      () => setHeadingStage(3),
      EYEBROW_TO_TITLE_DELAY_MS + TITLE_TO_DESCRIPTION_DELAY_MS,
    )
    const dividerTimer = setTimeout(
      () => setHeadingStage(4),
      EYEBROW_TO_TITLE_DELAY_MS + TITLE_TO_DESCRIPTION_DELAY_MS + DESCRIPTION_TO_DIVIDER_DELAY_MS,
    )
    headingStageTimers.current.push(titleTimer, descriptionTimer, dividerTimer)

    return () => {
      headingStageTimers.current.forEach(clearTimeout)
      headingStageTimers.current = []
    }
  }, [contentRevealed, realmReady, prefersReducedMotion])

  // Cards are intentionally staged from React state rather than a shared CSS
  // selector: one entry becomes eligible at a time only after the heading has
  // completed its slow arrival.
  useEffect(() => {
    cardRevealTimers.current.forEach(clearTimeout)
    cardRevealTimers.current = []

    if (!contentRevealed || headingStage < 4) {
      setRevealedCardCount(0)
      return
    }

    if (prefersReducedMotion()) {
      setRevealedCardCount(JOURNAL_ENTRIES.length)
      return
    }

    setRevealedCardCount(0)
    JOURNAL_ENTRIES.forEach((_entry, index) => {
      const timer = setTimeout(() => {
        setRevealedCardCount((count) => Math.max(count, index + 1))
      }, CARD_REVEAL_START_MS + index * CARD_REVEAL_STAGGER_MS)
      cardRevealTimers.current.push(timer)
    })

    return () => {
      cardRevealTimers.current.forEach(clearTimeout)
      cardRevealTimers.current = []
    }
  }, [contentRevealed, headingStage, prefersReducedMotion])

  // ---- Lock scrolling until the doorway is opened (or reader is open) ----
  useBodyScrollLock(!revealed || activeEntry !== null)

  // ---- Reader overlay: Escape to close ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEntry(null)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <main>
      {!thresholdComplete && (
                  <section
            className={`journal-threshold-sequence${thresholdReady ? ' is-ready' : ''}`}
            aria-label="Journal threshold introduction"
            aria-live="polite"
          >

          <div className="journal-threshold-copy">
            <p className="journal-threshold-kicker">
              <JournalTypingLine text="Field notes · The Threshold" startDelay={220} characterDelay={70} phrasePauses={[{ afterPhrase: 'Field notes ·', delay: 150 }]} />
            </p>
            <h1 className="journal-threshold-title">
              <JournalTypingLine text="Cross the Ancient Doorway" startDelay={2500} characterDelay={80} phrasePauses={[{ afterPhrase: 'Cross the', delay: 140 }]} />
            </h1>
            <p className="journal-threshold-sub">
              <JournalTypingLine
                text="Beyond this carved stone threshold lie the chronicles of every journey — sunrise climbs on Sigiriya, hill-country trains, and whales before breakfast."
                startDelay={4800}
                characterDelay={41}
                phrasePauses={[
                  { afterPhrase: 'Beyond this carved stone threshold', delay: 180 },
                  { afterPhrase: 'chronicles of every journey —', delay: 220 },
                  { afterPhrase: 'sunrise climbs on Sigiriya,', delay: 190 },
                  { afterPhrase: 'hill-country trains,', delay: 160 },
                ]}
              />
            </p>
            <span className="journal-threshold-rule" aria-hidden="true" />
          </div>
        </section>
      )}
      <input
        id="journal-portal-toggle"
        ref={portalToggleRef}
        className="journal-portal-toggle"
        type="checkbox"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          if (event.target.checked) openPortal()
        }}
      />
      {/* ============ THE ANCIENT DOORWAY ============
          Unmounted entirely once doorwayGone is true - it's already
          fully invisible by then (see the zoom keyframes), so removing
          it is seamless, and it stops taking up any scroll height. */}
      {!doorwayGone && (
        <section
          className={`portal-stage${isZooming ? ' is-zooming' : ''}${revealed ? ' is-revealed' : ''}${!isOpen ? ' is-awaiting-auto' : ''}`}
          data-state={isOpen ? 'open' : 'closed'}
          aria-label="The ancient doorway to the chronicles"
        >
          {/* the realm revealed beyond the threshold */}
          <div className="portal-realm" aria-hidden="true" />
          <div className="portal-burst" aria-hidden="true" />

          {/* the carved stone doorway */}
          <div className="portal-frame">
            {/* The frame is inside the animated doorway so it inherits the exact
                same zoom/lift transform; only the two door leaves rotate. */}
            <div className="portal-architectural-frame" aria-hidden="true" />
            <button
              type="button"
              className="portal-door portal-door--left"
              aria-label="Open the doorway"
              tabIndex={isOpen ? -1 : 0}
              onClick={openPortal}
            />
            <button
              type="button"
              className="portal-door portal-door--right"
              aria-label="Open the doorway"
              tabIndex={isOpen ? -1 : 0}
              onClick={openPortal}
            />
            <div className="portal-seam" aria-hidden="true" />
            <div className="portal-arch" aria-hidden="true" />

            {/* content carved onto the closed doors */}
            <div className="portal-intro">
              <span className="portal-emblem" aria-hidden="true">
                ✦
              </span>
              <p className="portal-eyebrow">Field notes · The Threshold</p>
              <h1>Cross the Ancient Doorway</h1>
              <p className="portal-sub">
                Beyond this carved stone threshold lie the chronicles of every
                journey — sunrise climbs on Sigiriya, slow trains through the
                hills, and whales sighted before breakfast.
              </p>
              <label
                className="portal-enter"
                htmlFor="journal-portal-toggle"
                role="button"
                tabIndex={isOpen ? -1 : 0}
                aria-disabled={isOpen}
              >
                <span className="portal-enter-ring" aria-hidden="true" />
                Open the Doorway
              </label>
            </div>
          </div>

          <div className="portal-hint">A doorway to an older Sri Lanka</div>
        </section>
      )}

      {/* ============ THE CHRONICLES (revealed within) ============ */}
      <section
        ref={chronicleRef}
        className={`chronicle-section${revealed ? ' is-revealed' : ''}${contentRevealed ? ' is-content-revealed' : ''}${headingStage >= 1 ? ' is-eyebrow-revealed' : ''}${headingStage >= 2 ? ' is-title-revealed' : ''}${headingStage >= 3 ? ' is-description-revealed' : ''}${headingStage >= 4 ? ' is-collection-revealed' : ''}`}
      >
        <Image
          className="chronicle-realm-preload"
          src="/images/journal/portal-realm-refined.jpg"
          alt=""
          width={1}
          height={1}
          priority
          aria-hidden="true"
        />
        <div className="chronicle-inner">
          <div className="chronicle-head">
            <span className="chronicle-heading-rule chronicle-heading-rule--left" aria-hidden="true" />
            <p className="chronicle-eyebrow">The Chronicles</p>
            <h2>Logs From Beyond the Threshold</h2>
            <p>
              Entries from the road — the routes we keep returning to, and the
              small details that never quite fit in an itinerary. Unseal any
              leaf to read the full account.
            </p>
            <span className="chronicle-heading-rule chronicle-heading-rule--right" aria-hidden="true" />
          </div>

          <div className="chronicle-collection-divider" aria-hidden="true">
            <span className="chronicle-collection-line" />
            <p className="chronicle-collection-label">
              <span>✦</span>
              Field notes <b>·</b> Selected entries
            </p>
            <span className="chronicle-collection-line" />
          </div>

          <div className="chronicle-grid">
            {JOURNAL_ENTRIES.map((entry, index) => (
              <article
                key={entry.slug}
                className={`chronicle-card${index < revealedCardCount ? ' is-card-revealed' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`Read: ${entry.title}`}
                style={{ '--card-delay': `${index * CARD_REVEAL_STAGGER_MS}ms` } as React.CSSProperties}
                onClick={() => setActiveEntry(entry)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveEntry(entry)
                  }
                }}
              >
                <div className="chronicle-card-media">
                  <Image
                    src={entry.image || '/placeholder.svg'}
                    alt={`${entry.title}, ${entry.location}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    loading="lazy"
                  />
                  <span className="chronicle-card-seal" aria-hidden="true">
                    ✦
                  </span>
                </div>
                <div className="chronicle-card-body">
                  <p className="chronicle-card-meta">
                    {entry.date} · {entry.location}
                  </p>
                  <h3>{entry.title}</h3>
                  <p className="chronicle-card-excerpt">{entry.excerpt}</p>
                  <div className="chronicle-card-tags">
                    {entry.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <span className="chronicle-card-cta">Unseal the entry →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="chronicle-cta">
        <h2>Want a route built around something you read here?</h2>
        <p>
          Every entry above comes from a real itinerary — tell us which one
          caught your eye, and we&apos;ll build a trip around it.
        </p>
        <button type="button" className="btn btn-uikit-primary" data-open-enquiry="">
          <Icon name="pin" className="btn-icon" />
          Plan Your Journey
        </button>
      </section>

      {/* ============ CHRONICLE READER (overlay) ============ */}
      <div className={`chronicle-reader${activeEntry ? ' is-open' : ''}`}>
        {activeEntry && (
          <>
            <div
              className="reader-backdrop"
              onClick={() => setActiveEntry(null)}
            />
            <article
              className="reader-scroll"
              role="dialog"
              aria-modal="true"
              aria-label={activeEntry.title}
            >
              <button
                type="button"
                className="reader-close"
                aria-label="Seal the entry"
                onClick={() => setActiveEntry(null)}
              >
                &times;
              </button>
              <div className="reader-hero">
                <Image
                  src={activeEntry.image || '/placeholder.svg'}
                  alt={`${activeEntry.title}, ${activeEntry.location}`}
                  fill
                  sizes="(max-width: 720px) 100vw, 720px"
                />
              </div>
              <div className="reader-body">
                <p className="reader-meta">
                  {activeEntry.date} · {activeEntry.location} ·{' '}
                  {activeEntry.coords}
                </p>
                <h2>{activeEntry.title}</h2>
                <div className="reader-tags">
                  {activeEntry.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="reader-rule" aria-hidden="true">
                  <span>✦</span>
                </div>
                {activeEntry.body.map((p, idx) => (
                  <p key={idx} className="reader-para">
                    {p}
                  </p>
                ))}
                <button type="button" className="sl-btn">
                  Plan a Trip Like This
                </button>
              </div>
            </article>
          </>
        )}
      </div>
    </main>
  )
}
