import type { CSSProperties, ReactNode } from 'react'
import { ADVENTURE_STAGES, type AdventureStage } from '@/lib/adventure-data'

/**
 * Animated backdrops for the Adventure & Experiences section, one per stage:
 *   sky     light dawn sky, drifting clouds
 *   canopy  birds crossing a green valley (zip line)
 *   land    birds, hills and drifting pollen (horse riding, ATV)
 *   water   waves and splashing droplets (kayaking, surfing, rafting)
 *   ocean   fish, jellyfish, bubbles and light rays (scuba)
 *   depth   near-black cave with fireflies glowing now and then
 *
 * Everything is decorative (aria-hidden by the parent), server-rendered with fixed numbers (no
 * randomness, so hydration matches) and animated with transform/opacity only. Only the active
 * scene runs its animations; the CSS pauses the rest. See `.adventure-scene` in globals.css.
 */

const vars = (values: Record<string, string | number>) => values as unknown as CSSProperties

/* ---- sky ---- */
const CLOUDS = [
  { y: 5, s: 1.7, dur: 150, delay: -40, x: 6, o: 0.95 },
  { y: 17, s: 1.1, dur: 110, delay: -85, x: 62, o: 0.85 },
  { y: 30, s: 2.1, dur: 190, delay: -120, x: 28, o: 0.8 },
  { y: 46, s: 1.3, dur: 130, delay: -10, x: 74, o: 0.7 },
  { y: 60, s: 1.8, dur: 170, delay: -95, x: 12, o: 0.65 },
  { y: 74, s: 1.0, dur: 120, delay: -55, x: 52, o: 0.55 },
  { y: 86, s: 1.5, dur: 160, delay: -140, x: 85, o: 0.5 },
]

function Clouds({ list = CLOUDS }: { list?: typeof CLOUDS }) {
  return (
    <>
      {list.map((c, i) => (
        <span
          key={i}
          className="adv-cloud"
          style={vars({ '--y': `${c.y}%`, '--s': c.s, '--dur': `${c.dur}s`, '--delay': `${c.delay}s`, '--x': `${c.x}%`, '--o': c.o })}
        />
      ))}
    </>
  )
}

/* ---- birds (canopy + land) ---- */
interface BirdSpec {
  y: number
  s: number
  dur: number
  delay: number
  x: number
  flap: number
  left?: boolean
}
const CANOPY_BIRDS: BirdSpec[] = [
  { y: 14, s: 1.3, dur: 34, delay: -6, x: 20, flap: 0.8 },
  { y: 22, s: 0.9, dur: 42, delay: -22, x: 64, flap: 0.7 },
  { y: 33, s: 1.6, dur: 30, delay: -15, x: 40, flap: 0.9, left: true },
  { y: 45, s: 1.0, dur: 38, delay: -30, x: 78, flap: 0.75 },
  { y: 55, s: 1.2, dur: 46, delay: -2, x: 10, flap: 0.85, left: true },
  { y: 66, s: 0.8, dur: 36, delay: -18, x: 55, flap: 0.7 },
]
const LAND_BIRDS: BirdSpec[] = [
  { y: 12, s: 1.1, dur: 40, delay: -12, x: 30, flap: 0.85 },
  { y: 26, s: 1.5, dur: 33, delay: -4, x: 70, flap: 0.8, left: true },
  { y: 38, s: 0.9, dur: 44, delay: -26, x: 18, flap: 0.7 },
  { y: 50, s: 1.2, dur: 37, delay: -19, x: 48, flap: 0.9, left: true },
  { y: 60, s: 0.8, dur: 48, delay: -33, x: 84, flap: 0.75 },
]

function Birds({ list }: { list: BirdSpec[] }) {
  return (
    <>
      {list.map((b, i) => (
        <span
          key={i}
          className={`adv-bird${b.left ? ' is-left' : ''}`}
          style={vars({ '--y': `${b.y}%`, '--s': b.s, '--dur': `${b.dur}s`, '--delay': `${b.delay}s`, '--x': `${b.x}%`, '--flap': `${b.flap}s` })}
        >
          <svg viewBox="0 0 30 14" focusable="false">
            <path d="M1 9 Q8 0 15 8 Q22 0 29 9" />
          </svg>
        </span>
      ))}
    </>
  )
}

/* ---- land ---- */
const MOTES = [
  { x: 8, y: 70, d: 22, delay: -4 },
  { x: 20, y: 82, d: 28, delay: -14 },
  { x: 33, y: 64, d: 25, delay: -9 },
  { x: 47, y: 78, d: 30, delay: -19 },
  { x: 58, y: 68, d: 24, delay: -2 },
  { x: 71, y: 84, d: 27, delay: -12 },
  { x: 83, y: 72, d: 31, delay: -22 },
  { x: 92, y: 80, d: 23, delay: -7 },
]

/* ---- water ---- */
// 16 humps across a 1200-unit viewBox; shifting by half the (200%-wide) svg is whole periods, so it loops seamlessly.
const WAVE_PATH = (() => {
  let d = 'M0 50 Q37.5 8 75 50'
  for (let i = 2; i <= 16; i++) d += ` T${i * 75} 50`
  return `${d} V100 H0 Z`
})()
const WAVES = [
  { dur: 26, rev: false, o: 0.16, h: 30, b: 14 },
  { dur: 19, rev: true, o: 0.22, h: 26, b: 7 },
  { dur: 14, rev: false, o: 0.3, h: 22, b: 0 },
]
const DROPS = [
  { x: 6, h: 26, dx: 24, sz: 7, dur: 4.6, delay: -0.4 },
  { x: 13, h: 34, dx: -18, sz: 5, dur: 5.4, delay: -3.1 },
  { x: 21, h: 22, dx: 30, sz: 9, dur: 4.2, delay: -1.7 },
  { x: 29, h: 40, dx: -26, sz: 6, dur: 6.1, delay: -4.4 },
  { x: 37, h: 28, dx: 20, sz: 8, dur: 4.9, delay: -2.2 },
  { x: 44, h: 36, dx: -14, sz: 5, dur: 5.7, delay: -0.9 },
  { x: 52, h: 24, dx: 28, sz: 10, dur: 4.4, delay: -3.6 },
  { x: 59, h: 32, dx: -22, sz: 6, dur: 5.2, delay: -1.2 },
  { x: 66, h: 42, dx: 16, sz: 7, dur: 6.4, delay: -4.9 },
  { x: 73, h: 27, dx: -30, sz: 9, dur: 4.7, delay: -2.8 },
  { x: 80, h: 35, dx: 22, sz: 5, dur: 5.5, delay: -0.2 },
  { x: 87, h: 23, dx: -16, sz: 8, dur: 4.3, delay: -3.4 },
  { x: 93, h: 38, dx: 18, sz: 6, dur: 5.9, delay: -1.6 },
  { x: 48, h: 44, dx: -10, sz: 11, dur: 6.8, delay: -5.2 },
]

/* ---- ocean ---- */
const FISH = [
  { y: 16, s: 1.0, dur: 38, delay: -5, x: 20, c: 'a', left: false },
  { y: 19, s: 0.8, dur: 38, delay: -7, x: 14, c: 'a', left: false },
  { y: 14, s: 0.7, dur: 38, delay: -9, x: 8, c: 'a', left: false },
  { y: 40, s: 1.5, dur: 50, delay: -20, x: 66, c: 'b', left: true },
  { y: 44, s: 1.2, dur: 50, delay: -23, x: 74, c: 'b', left: true },
  { y: 60, s: 1.0, dur: 44, delay: -12, x: 40, c: 'c', left: false },
  { y: 64, s: 0.8, dur: 44, delay: -14, x: 33, c: 'c', left: false },
  { y: 58, s: 0.9, dur: 44, delay: -16, x: 28, c: 'c', left: false },
  { y: 78, s: 1.7, dur: 58, delay: -30, x: 80, c: 'b', left: true },
]
const JELLY = [
  { x: 14, s: 1.4, dur: 70, delay: -18, dx: 40 },
  { x: 46, s: 1.0, dur: 58, delay: -40, dx: -30 },
  { x: 72, s: 1.7, dur: 84, delay: -60, dx: 50 },
  { x: 90, s: 0.9, dur: 64, delay: -8, dx: -40 },
]
const BUBBLES = [
  { x: 4, sz: 6, dur: 11, delay: -2 },
  { x: 11, sz: 10, dur: 14, delay: -9 },
  { x: 19, sz: 5, dur: 10, delay: -5 },
  { x: 27, sz: 8, dur: 13, delay: -11 },
  { x: 36, sz: 12, dur: 16, delay: -3 },
  { x: 44, sz: 6, dur: 11, delay: -8 },
  { x: 53, sz: 9, dur: 15, delay: -13 },
  { x: 61, sz: 5, dur: 10, delay: -1 },
  { x: 69, sz: 11, dur: 14, delay: -6 },
  { x: 77, sz: 7, dur: 12, delay: -10 },
  { x: 85, sz: 9, dur: 16, delay: -4 },
  { x: 93, sz: 6, dur: 11, delay: -12 },
]
const RAYS = [
  { x: 8, w: 14, dur: 9, delay: -2 },
  { x: 34, w: 10, dur: 12, delay: -7 },
  { x: 58, w: 16, dur: 10, delay: -4 },
  { x: 82, w: 11, dur: 13, delay: -9 },
]

/* ---- cave ---- */
const STALACTITES = (() => {
  const teeth: [number, number][] = [
    [40, 70], [110, 34], [190, 92], [270, 40], [350, 64], [430, 28], [520, 86], [610, 44], [690, 72],
    [770, 30], [850, 96], [930, 46], [1010, 66], [1090, 32], [1160, 78],
  ]
  let d = 'M0 0 V18'
  for (const [x, len] of teeth) d += ` L${x - 16} 18 L${x} ${len} L${x + 16} 18`
  return `${d} L1200 18 V0 Z`
})()
const FIREFLIES = [
  { x: 9, y: 22, dx: 40, dy: -30, sz: 4, dur: 15, delay: -2 },
  { x: 17, y: 62, dx: -30, dy: -50, sz: 5, dur: 18, delay: -11 },
  { x: 26, y: 38, dx: 50, dy: 20, sz: 3, dur: 13, delay: -6 },
  { x: 34, y: 78, dx: -20, dy: -40, sz: 4, dur: 17, delay: -14 },
  { x: 42, y: 28, dx: 36, dy: 34, sz: 5, dur: 19, delay: -4 },
  { x: 50, y: 56, dx: -44, dy: -26, sz: 3, dur: 14, delay: -9 },
  { x: 58, y: 18, dx: 28, dy: 46, sz: 4, dur: 16, delay: -16 },
  { x: 66, y: 70, dx: -38, dy: -34, sz: 5, dur: 20, delay: -1 },
  { x: 74, y: 44, dx: 46, dy: -22, sz: 3, dur: 12, delay: -8 },
  { x: 82, y: 82, dx: -26, dy: -48, sz: 4, dur: 18, delay: -13 },
  { x: 90, y: 30, dx: -34, dy: 38, sz: 5, dur: 15, delay: -5 },
  { x: 95, y: 60, dx: 22, dy: -40, sz: 3, dur: 17, delay: -10 },
  { x: 22, y: 90, dx: 32, dy: -36, sz: 4, dur: 14, delay: -7 },
  { x: 62, y: 92, dx: -28, dy: -30, sz: 3, dur: 19, delay: -15 },
]

function Fish() {
  return (
    <>
      {FISH.map((f, i) => (
        <span
          key={i}
          className={`adv-fish adv-fish-${f.c}${f.left ? ' is-left' : ''}`}
          style={vars({ '--y': `${f.y}%`, '--s': f.s, '--dur': `${f.dur}s`, '--delay': `${f.delay}s`, '--x': `${f.x}%` })}
        >
          <svg viewBox="0 0 34 20" focusable="false">
            <path d="M2 10 C8 1 20 1 25 10 C20 19 8 19 2 10 Z M24 10 L33 3 V17 Z" />
          </svg>
        </span>
      ))}
    </>
  )
}

const SCENES: Record<AdventureStage, ReactNode> = {
  sky: (
    <>
      <span className="adv-sun" />
      <Clouds />
    </>
  ),
  canopy: (
    <>
      <Clouds list={CLOUDS.slice(0, 3).map((c) => ({ ...c, o: c.o * 0.45 }))} />
      <Birds list={CANOPY_BIRDS} />
    </>
  ),
  land: (
    <>
      <Birds list={LAND_BIRDS} />
      {MOTES.map((m, i) => (
        <span key={i} className="adv-mote" style={vars({ '--x': `${m.x}%`, '--y': `${m.y}%`, '--dur': `${m.d}s`, '--delay': `${m.delay}s` })} />
      ))}
      <svg className="adv-hills" viewBox="0 0 1200 200" preserveAspectRatio="none" focusable="false">
        <path className="adv-hills-far" d="M0 200 V110 C140 56 290 62 440 104 S760 150 900 98 S1110 52 1200 84 V200 Z" />
        <path className="adv-hills-near" d="M0 200 V150 C170 112 330 118 500 150 S850 176 1010 138 S1140 120 1200 130 V200 Z" />
      </svg>
    </>
  ),
  water: (
    <>
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="adv-drop"
          style={vars({ '--x': `${d.x}%`, '--h': `${d.h}vh`, '--dx': `${d.dx}px`, '--sz': `${d.sz}px`, '--dur': `${d.dur}s`, '--delay': `${d.delay}s` })}
        />
      ))}
      {WAVES.map((w, i) => (
        <svg
          key={i}
          className={`adv-wave${w.rev ? ' is-rev' : ''}`}
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          focusable="false"
          style={vars({ '--dur': `${w.dur}s`, '--o': w.o, '--h': `${w.h}vh`, '--b': `${w.b}vh` })}
        >
          <path d={WAVE_PATH} />
        </svg>
      ))}
    </>
  ),
  ocean: (
    <>
      {RAYS.map((r, i) => (
        <span key={i} className="adv-ray" style={vars({ '--x': `${r.x}%`, '--w': `${r.w}vw`, '--dur': `${r.dur}s`, '--delay': `${r.delay}s` })} />
      ))}
      <Fish />
      {JELLY.map((j, i) => (
        <span
          key={i}
          className="adv-jelly"
          style={vars({ '--x': `${j.x}%`, '--s': j.s, '--dur': `${j.dur}s`, '--delay': `${j.delay}s`, '--dx': `${j.dx}px` })}
        >
          <svg viewBox="0 0 40 64" focusable="false">
            <path className="adv-jelly-bell" d="M5 26 Q5 4 20 4 Q35 4 35 26 Q28 30 20 27 Q12 30 5 26 Z" />
            <path d="M12 28 Q8 38 12 46 T12 62 M20 28 Q16 40 20 50 T20 62 M28 28 Q32 38 28 46 T28 62" />
          </svg>
        </span>
      ))}
      {BUBBLES.map((b, i) => (
        <span key={i} className="adv-bubble" style={vars({ '--x': `${b.x}%`, '--sz': `${b.sz}px`, '--dur': `${b.dur}s`, '--delay': `${b.delay}s` })} />
      ))}
    </>
  ),
  depth: (
    <>
      <svg className="adv-stalactites" viewBox="0 0 1200 110" preserveAspectRatio="none" focusable="false">
        <path d={STALACTITES} />
      </svg>
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          className="adv-firefly"
          style={vars({ '--x': `${f.x}%`, '--y': `${f.y}%`, '--dx': `${f.dx}px`, '--dy': `${f.dy}px`, '--sz': `${f.sz}px`, '--dur': `${f.dur}s`, '--delay': `${f.delay}s` })}
        />
      ))}
    </>
  ),
}

export function AdventureScenes({ stage }: { stage: AdventureStage }) {
  return (
    <div className="adventure-tint-view">
      {ADVENTURE_STAGES.map((entry) => (
        <div key={entry.id} data-stage={entry.id} className={`adventure-scene${entry.id === stage ? ' is-on' : ''}`}>
          {SCENES[entry.id]}
        </div>
      ))}
    </div>
  )
}
