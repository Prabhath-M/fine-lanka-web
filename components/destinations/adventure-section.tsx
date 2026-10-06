"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import {
  ADVENTURES,
  ADVENTURE_CLOSING,
  ADVENTURE_INTRO,
  type AdventureStage,
} from "@/lib/adventure-data";
import { AdventurePanel } from "@/components/destinations/adventure-panel";
import {
  AdventureScenes,
  AdventureScreenOverlay,
} from "@/components/destinations/adventure-scenes";

/**
 * "Adventure & Experiences" -- the "Sky to Underground" section of the
 * Destinations page. See docs/DESTINATIONS-ADVENTURE-SECTION-PLAN.md.
 *
 * The background is a set of animated scenes (see adventure-scenes.tsx), one per stage, and
 * `data-stage` on the section also drives the text colours. One IntersectionObserver handles both the
 * active stage and the entrance; it never touches layout, so nothing shifts.
 */
/**
 * Keep one source of truth for the atmospheric scene. The activity panels remain normal document
 * flow; whichever panel is nearest the viewer's middle band selects the matching backdrop.
 */
export function AdventureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState<AdventureStage>('sky')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const panels = Array.from(section.querySelectorAll<HTMLElement>('.adventure-panel'))
    if (panels.length === 0) return

    let frame = 0
    const updateStage = () => {
      frame = 0
      const sectionRect = section.getBoundingClientRect()
      // Do not reset the scene while the section is outside the viewport. This prevents the sky
      // plate from flashing when entering or leaving the adventure section.
      if (sectionRect.bottom <= 0 || sectionRect.top >= window.innerHeight) return

      const targetY = window.innerHeight * 0.42
      let nearest = panels[0]
      let nearestDistance = Number.POSITIVE_INFINITY
      for (const panel of panels) {
        const rect = panel.getBoundingClientRect()
        const distance = Math.abs(rect.top + rect.height / 2 - targetY)
        if (distance < nearestDistance) {
          nearest = panel
          nearestDistance = distance
        }
      }

      const next = nearest.dataset.stage as AdventureStage | undefined
      if (next) setStage((current) => (current === next ? current : next))
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(updateStage)
    }

    updateStage()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="adventure"
      ref={sectionRef}
      className="adventure"
      aria-labelledby="adventure-title"
      data-stage={stage}
      data-motion="off"
      data-scrub="off"
    >
      <div className="adventure-tint" aria-hidden="true">
        <AdventureScenes stage={stage} />
      </div>
      <div className="adventure-sky" aria-hidden="true" />
      <AdventureScreenOverlay active={stage === "water" || stage === "ocean"} />

      <div className="container">
        <header className="adventure-head">
          <p className="dest-section-kicker">{ADVENTURE_INTRO.kicker}</p>
          <h2 id="adventure-title">{ADVENTURE_INTRO.title}</h2>
          <p className="adventure-lede">{ADVENTURE_INTRO.lede}</p>
        </header>

        <div className="adventure-track">
          <div className="adventure-rail">
            <span className="adventure-spine" aria-hidden="true" />
            <ol className="adventure-list" role="list">
              {ADVENTURES.map((adventure) => (
                <AdventurePanel key={adventure.slug} adventure={adventure} />
              ))}
            </ol>
          </div>
        </div>

        <div className="adventure-closing">
          <h3>{ADVENTURE_CLOSING.title}</h3>
          <p>{ADVENTURE_CLOSING.body}</p>
          <button
            type="button"
            className="btn btn-uikit-primary"
            data-open-enquiry=""
          >
            <Icon name="pin" className="btn-icon" />
            Plan an adventure
          </button>
          <p className="adventure-signoff">{ADVENTURE_CLOSING.signoff}</p>
          <p className="adventure-brandline">{ADVENTURE_CLOSING.brandLine}</p>
        </div>
      </div>
    </section>
  );
}
