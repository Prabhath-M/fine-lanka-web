import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ADVENTURE_STAGES, type AdventureStage } from '@/lib/adventure-data'
import { Roamer } from '@/components/destinations/adventure-roamer'

/**
 * Atmospheric, photo-led backdrops for the Adventure & Experiences section. Real cloud layers
 * drift over the photography while supplied green-screen videos provide the wildlife motion.
 * These are decorative, deterministic and hidden from assistive technology by the parent.
 */
const vars = (values: Record<string, string | number>) => values as unknown as CSSProperties

type Layer = { x: number; y: number; size: number; duration: number; delay: number }

const CLOUDS: Layer[] = [
  { x: 4, y: 8, size: 74, duration: 145, delay: -46 },
  { x: 61, y: 20, size: 58, duration: 118, delay: -82 },
  { x: 28, y: 34, size: 86, duration: 175, delay: -123 },
  { x: 74, y: 49, size: 62, duration: 132, delay: -14 },
  { x: 15, y: 65, size: 80, duration: 158, delay: -101 },
]

const WISPS: Layer[] = [
  { x: 10, y: 14, size: 82, duration: 190, delay: -63 },
  { x: 54, y: 30, size: 70, duration: 165, delay: -117 },
  { x: 22, y: 55, size: 88, duration: 205, delay: -155 },
]

const BIRDS: Layer[] = [
  { x: 8, y: 15, size: 0.72, duration: 42, delay: -8 },
  { x: 12, y: 38, size: 0.56, duration: 51, delay: -25 },
  { x: 6, y: 61, size: 0.48, duration: 58, delay: -39 },
]

const MOTES = [
  { x: 8, y: 70, duration: 22, delay: -4 },
  { x: 20, y: 82, duration: 28, delay: -14 },
  { x: 33, y: 64, duration: 25, delay: -9 },
  { x: 47, y: 78, duration: 30, delay: -19 },
  { x: 58, y: 68, duration: 24, delay: -2 },
  { x: 71, y: 84, duration: 27, delay: -12 },
  { x: 83, y: 72, duration: 31, delay: -22 },
  { x: 92, y: 80, duration: 23, delay: -7 },
]

const RIPPLES = [
  { bottom: 9, width: 58, duration: 19, delay: -4 },
  { bottom: 16, width: 72, duration: 23, delay: -12 },
  { bottom: 25, width: 48, duration: 17, delay: -8 },
]

const RAYS = [
  { x: 8, width: 14, duration: 9, delay: -2 },
  { x: 34, width: 10, duration: 12, delay: -7 },
  { x: 58, width: 16, duration: 10, delay: -4 },
  { x: 82, width: 11, duration: 13, delay: -9 },
]

const FISH = [
  { src: '/images/adventure-fish-salmon.png', ar: '574 / 182', x: 12, y: 18, size: 14, start: '-26vw', mid: '42vw', end: '112vw', lift: '-2vh', flip: 1, duration: 38, delay: -8 },
  { src: '/images/adventure-fish-perch.png', ar: '588 / 304', x: 72, y: 32, size: 11, start: '112vw', mid: '50vw', end: '-24vw', lift: '2vh', flip: -1, duration: 46, delay: -21 },
  { src: '/images/adventure-fish-red.png', ar: '638 / 190', x: 34, y: 43, size: 12, start: '-22vw', mid: '38vw', end: '108vw', lift: '-3vh', flip: 1, duration: 52, delay: -34 },
  { src: '/images/adventure-fish-salmon.png', ar: '574 / 182', x: 80, y: 55, size: 9, start: '110vw', mid: '58vw', end: '-20vw', lift: '1vh', flip: -1, duration: 43, delay: -15 },
  { src: '/images/adventure-fish-perch.png', ar: '588 / 304', x: 22, y: 66, size: 10, start: '-24vw', mid: '44vw', end: '114vw', lift: '-2vh', flip: 1, duration: 57, delay: -42 },
  { src: '/images/adventure-fish-red.png', ar: '638 / 190', x: 66, y: 76, size: 8, start: '108vw', mid: '52vw', end: '-22vw', lift: '2vh', flip: -1, duration: 49, delay: -7 },
  { src: '/images/adventure-fish-salmon.png', ar: '574 / 182', x: 44, y: 87, size: 7, start: '-20vw', mid: '36vw', end: '110vw', lift: '-1vh', flip: 1, duration: 61, delay: -29 },
]

const JELLYFISH = [
  { x: 12, size: 15, duration: 73, delay: -21, drift: 44, kind: 'moon' },
  { x: 42, size: 11, duration: 61, delay: -39, drift: -28, kind: 'tropical' },
  { x: 72, size: 18, duration: 82, delay: -58, drift: 52, kind: 'moon' },
  { x: 91, size: 10, duration: 69, delay: -9, drift: -36, kind: 'tropical' },
]

const BUBBLES = [
  { x: 4, size: 6, duration: 11, delay: -2 },
  { x: 11, size: 10, duration: 14, delay: -9 },
  { x: 19, size: 5, duration: 10, delay: -5 },
  { x: 27, size: 8, duration: 13, delay: -11 },
  { x: 36, size: 12, duration: 16, delay: -3 },
  { x: 44, size: 6, duration: 11, delay: -8 },
  { x: 53, size: 9, duration: 15, delay: -13 },
  { x: 61, size: 5, duration: 10, delay: -1 },
  { x: 69, size: 11, duration: 14, delay: -6 },
  { x: 77, size: 7, duration: 12, delay: -10 },
  { x: 85, size: 9, duration: 16, delay: -4 },
  { x: 93, size: 6, duration: 11, delay: -12 },
]

const FIREFLIES = [
  { x: 7, y: 18, dx: 40, dy: -30, size: 5, duration: 15, delay: -2 },
  { x: 14, y: 46, dx: -30, dy: -50, size: 8, duration: 18, delay: -11 },
  { x: 22, y: 72, dx: 50, dy: 20, size: 4, duration: 13, delay: -6 },
  { x: 30, y: 30, dx: -20, dy: -40, size: 6, duration: 17, delay: -14 },
  { x: 38, y: 84, dx: 36, dy: 34, size: 9, duration: 19, delay: -4 },
  { x: 46, y: 58, dx: -44, dy: -26, size: 4, duration: 14, delay: -9 },
  { x: 54, y: 20, dx: 28, dy: 46, size: 7, duration: 16, delay: -16 },
  { x: 61, y: 74, dx: -38, dy: -34, size: 5, duration: 20, delay: -1 },
  { x: 68, y: 42, dx: 46, dy: -22, size: 10, duration: 12, delay: -8 },
  { x: 75, y: 88, dx: -26, dy: -48, size: 6, duration: 18, delay: -13 },
  { x: 82, y: 26, dx: -34, dy: 38, size: 5, duration: 15, delay: -5 },
  { x: 89, y: 60, dx: 22, dy: -40, size: 8, duration: 17, delay: -10 },
  { x: 95, y: 36, dx: -24, dy: 26, size: 4, duration: 14, delay: -3 },
  { x: 18, y: 90, dx: 30, dy: -22, size: 7, duration: 21, delay: -17 },
  { x: 57, y: 48, dx: -36, dy: 30, size: 5, duration: 16, delay: -7 },
  { x: 93, y: 78, dx: 42, dy: -36, size: 9, duration: 19, delay: -12 },
]

function TransparentVideo({
  src,
  className,
  active,
  style,
}: {
  src: string
  className: string
  active: boolean
  style?: CSSProperties
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active])

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      autoPlay={active}
      loop
      muted
      playsInline
      preload={active ? 'auto' : 'metadata'}
      aria-hidden="true"
    >
      <source src={src} type="video/webm" />
    </video>
  )
}

function AnimatedGif({
  src,
  className,
  style,
}: {
  src: string
  className: string
  style?: CSSProperties
}) {
  return <img src={src} className={className} style={style} alt="" aria-hidden="true" />
}

const scene = (stage: AdventureStage, active: boolean): ReactNode => {
  switch (stage) {
    case 'sky':
      return (
        <>
          {CLOUDS.map((cloud, i) => (
            <span key={`cloud-${i}`} className="adv-cloud adv-cloud-bank" style={vars({ '--x': `${cloud.x}%`, '--y': `${cloud.y}%`, '--w': `${cloud.size}vw`, '--dur': `${cloud.duration}s`, '--delay': `${cloud.delay}s` })} />
          ))}
          {WISPS.map((cloud, i) => (
            <span key={`wisp-${i}`} className="adv-cloud adv-cloud-wisp" style={vars({ '--x': `${cloud.x}%`, '--y': `${cloud.y}%`, '--w': `${cloud.size}vw`, '--dur': `${cloud.duration}s`, '--delay': `${cloud.delay}s` })} />
          ))}
        </>
      )
    case 'canopy':
      return (
        <>
          {CLOUDS.slice(0, 2).map((cloud, i) => (
            <span key={`cloud-${i}`} className="adv-cloud adv-cloud-bank" style={vars({ '--x': `${cloud.x}%`, '--y': `${cloud.y}%`, '--w': `${cloud.size}vw`, '--dur': `${cloud.duration}s`, '--delay': `${cloud.delay}s`, '--o': 0.48 })} />
          ))}
          {BIRDS.map((bird, i) => (
            <AnimatedGif key={i} src="/images/adventure-birds-flock.png" className="adv-bird" style={vars({ '--x': `${bird.x}%`, '--y': `${bird.y}%`, '--s': bird.size, '--dur': `${bird.duration}s`, '--delay': `${bird.delay}s` })} />
          ))}
        </>
      )
    case 'land':
      return (
        <>
          {BIRDS.map((bird, i) => (
            <AnimatedGif key={`bird-${i}`} src="/images/adventure-birds-flock.png" className="adv-bird" style={vars({ '--x': `${bird.x}%`, '--y': `${bird.y}%`, '--s': bird.size, '--dur': `${bird.duration}s`, '--delay': `${bird.delay}s` })} />
          ))}
          {MOTES.map((mote, i) => (
            <span key={i} className="adv-mote" style={vars({ '--x': `${mote.x}%`, '--y': `${mote.y}%`, '--dur': `${mote.duration}s`, '--delay': `${mote.delay}s` })} />
          ))}
        </>
      )
    case 'water':
      return RIPPLES.map((ripple, i) => (
        <span key={i} className="adv-ripple" style={vars({ '--bottom': `${ripple.bottom}%`, '--w': `${ripple.width}vw`, '--dur': `${ripple.duration}s`, '--delay': `${ripple.delay}s` })} />
      ))
    case 'ocean':
      return (
        <>
          {RAYS.map((ray, i) => (
            <span key={`ray-${i}`} className="adv-ray" style={vars({ '--x': `${ray.x}%`, '--w': `${ray.width}vw`, '--dur': `${ray.duration}s`, '--delay': `${ray.delay}s` })} />
          ))}
          {FISH.map((fish, i) => (
            <AnimatedGif key={`fish-${i}`} src={fish.src} className="adv-fish" style={vars({ '--ar': fish.ar, '--x': `${fish.x}%`, '--y': `${fish.y}%`, '--s': `${fish.size}vw`, '--dur': `${fish.duration}s`, '--delay': `${fish.delay}s`, '--start': fish.start, '--mid': fish.mid, '--end': fish.end, '--lift': fish.lift, '--flip': fish.flip })} />
          ))}
          {JELLYFISH.map((jelly, i) => (
            <TransparentVideo key={`jelly-${i}`} src="/images/adventure-real-jellyfish.webm" className={`adv-jelly adv-jelly-${jelly.kind}`} active={active} style={vars({ '--x': `${jelly.x}%`, '--s': `${jelly.size}vw`, '--dur': `${jelly.duration}s`, '--delay': `${jelly.delay}s`, '--dx': `${jelly.drift}px` })} />
          ))}
          {BUBBLES.map((bubble, i) => (
            <span key={i} className="adv-bubble" style={vars({ '--x': `${bubble.x}%`, '--sz': `${bubble.size}px`, '--dur': `${bubble.duration}s`, '--delay': `${bubble.delay}s` })} />
          ))}
        </>
      )
    case 'depth':
      return (
        <>
          <AnimatedGif src="/images/adventure-fireflies.apng" className="adv-firefly-footage" />
          {FIREFLIES.map((firefly, i) => (
            <span key={i} className="adv-firefly" style={vars({ '--x': `${firefly.x}%`, '--y': `${firefly.y}%`, '--dx': `${firefly.dx}px`, '--dy': `${firefly.dy}px`, '--sz': `${firefly.size}px`, '--dur': `${firefly.duration}s`, '--delay': `${firefly.delay}s` })} />
          ))}
        </>
      )
    default:
      return null
  }
}

/**
 * Screen overlays (rain drops, birds, fish) sit in a section-sized box with a viewport-sized sticky
 * stage inside it. So they stay locked to the screen while the section is on screen, leave with the
 * section when it scrolls away, and are placed relative to the current screen when it comes back.
 */
function ViewportLayer({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className="adventure-viewport-layer" aria-hidden="true">
      <div className={className}>{children}</div>
    </div>
  )
}

export function AdventureScreenOverlay({ active }: { active: boolean }) {
  // Drops are tiled at a fixed, modest size (two offset, mirrored layers so the repeat is not obvious)
  // instead of stretching one 16:9 frame over the whole screen.
  return (
    <ViewportLayer className={`adventure-screen-overlay-layer${active ? ' is-on' : ''}`}>
      <span className="adventure-screen-overlay adventure-screen-overlay-a" />
      <span className="adventure-screen-overlay adventure-screen-overlay-b" />
    </ViewportLayer>
  )
}

const BIRD_SPEED: [number, number] = [150, 210]
const BIRD_POINTS: [number, number] = [2, 4]
const BIRD_PAUSE: [number, number] = [1.5, 5]
const FISH_SPEED: [number, number] = [90, 140]
const FISH_POINTS: [number, number] = [2, 3]
const FISH_PAUSE: [number, number] = [2, 6]

function LittleBird({ active, className, startDelay }: { active: boolean; className: string; startDelay: number }) {
  // Animated WebP with a real (soft) alpha channel, pre-cropped to the bird's flight area.
  return (
    <Roamer active={active} className={`adventure-little-bird ${className}`} speed={BIRD_SPEED} waypoints={BIRD_POINTS} pause={BIRD_PAUSE} tilt={0.6} startDelay={startDelay}>
      <AnimatedGif src="/images/adventure-little-bird.webp" className="adventure-little-bird-img" />
    </Roamer>
  )
}

export function AdventureBirdOverlay({ active }: { active: boolean }) {
  const state = active ? ' is-on' : ''
  return (
    <>
      <ViewportLayer className={`adventure-bird-overlay-layer adventure-bird-overlay-layer-under${state}`}>
        <LittleBird active={active} className="adventure-little-bird-under" startDelay={0} />
        <LittleBird active={active} className="adventure-little-bird-under-late" startDelay={6} />
      </ViewportLayer>
      <ViewportLayer className={`adventure-bird-overlay-layer adventure-bird-overlay-layer-over${state}`}>
        <LittleBird active={active} className="adventure-little-bird-over" startDelay={3} />
        <LittleBird active={active} className="adventure-little-bird-over-late" startDelay={9} />
      </ViewportLayer>
    </>
  )
}

function OverlayFish({ active, src, className, startDelay }: { active: boolean; src: string; className: string; startDelay: number }) {
  return (
    <Roamer active={active} className={`adventure-overlay-fish-wrap ${className}`} speed={FISH_SPEED} waypoints={FISH_POINTS} pause={FISH_PAUSE} tilt={0.35} startDelay={startDelay}>
      <AnimatedGif src={src} className="adventure-overlay-fish" />
    </Roamer>
  )
}

export function AdventureFishOverlay({ active }: { active: boolean }) {
  const state = active ? ' is-on' : ''
  return (
    <>
      <ViewportLayer className={`adventure-fish-overlay-layer adventure-fish-overlay-layer-under${state}`}>
        <OverlayFish active={active} src="/images/adventure-fish-perch.png" className="adventure-overlay-fish-under" startDelay={0} />
      </ViewportLayer>
      <ViewportLayer className={`adventure-fish-overlay-layer adventure-fish-overlay-layer-over${state}`}>
        <OverlayFish active={active} src="/images/adventure-fish-red.png" className="adventure-overlay-fish-over" startDelay={5} />
      </ViewportLayer>
    </>
  )
}

export function AdventureScenes({ stage }: { stage: AdventureStage }) {
  return (
    <div className="adventure-tint-view">
      {ADVENTURE_STAGES.map((entry) => (
        <div key={entry.id} data-stage={entry.id} className={`adventure-scene${entry.id === stage ? ' is-on' : ''}`}>
          {scene(entry.id, entry.id === stage)}
        </div>
      ))}
    </div>
  )
}
