import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ADVENTURE_STAGES, type AdventureStage } from '@/lib/adventure-data'

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
  { x: 16, y: 18, size: 1.35, duration: 28, delay: -4 },
  { x: 48, y: 32, size: 1.1, duration: 34, delay: -18 },
  { x: 79, y: 50, size: 0.98, duration: 31, delay: -25 },
  { x: 34, y: 67, size: 0.82, duration: 38, delay: -11 },
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
  { x: 8, y: 22, size: 34, duration: 30, delay: -7 },
  { x: 54, y: 48, size: 30, duration: 36, delay: -19 },
  { x: 22, y: 70, size: 25, duration: 33, delay: -26 },
  { x: 78, y: 34, size: 22, duration: 42, delay: -31 },
]

const JELLYFISH = [
  { x: 8, size: 19, duration: 46, delay: -12, drift: 44, kind: 'moon' },
  { x: 30, size: 15, duration: 52, delay: -29, drift: -28, kind: 'tropical' },
  { x: 53, size: 22, duration: 58, delay: -41, drift: 52, kind: 'moon' },
  { x: 77, size: 17, duration: 49, delay: -4, drift: -36, kind: 'tropical' },
  { x: 94, size: 14, duration: 62, delay: -35, drift: 30, kind: 'moon' },
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
  { x: 6, y: 18, dx: 48, dy: -34, size: 6, duration: 11, delay: -2 },
  { x: 13, y: 46, dx: -36, dy: -52, size: 7, duration: 14, delay: -11 },
  { x: 20, y: 73, dx: 44, dy: 22, size: 5, duration: 12, delay: -6 },
  { x: 28, y: 29, dx: -22, dy: -42, size: 6, duration: 15, delay: -14 },
  { x: 36, y: 61, dx: 42, dy: 35, size: 7, duration: 13, delay: -4 },
  { x: 44, y: 17, dx: -48, dy: -28, size: 5, duration: 10, delay: -9 },
  { x: 51, y: 78, dx: 30, dy: -44, size: 6, duration: 14, delay: -16 },
  { x: 59, y: 40, dx: -42, dy: 28, size: 7, duration: 16, delay: -1 },
  { x: 67, y: 22, dx: 50, dy: -24, size: 5, duration: 11, delay: -8 },
  { x: 74, y: 68, dx: -34, dy: -48, size: 7, duration: 15, delay: -13 },
  { x: 82, y: 34, dx: 38, dy: 42, size: 6, duration: 12, delay: -5 },
  { x: 90, y: 82, dx: -28, dy: -36, size: 8, duration: 17, delay: -10 },
  { x: 97, y: 52, dx: 24, dy: -46, size: 5, duration: 13, delay: -7 },
  { x: 24, y: 88, dx: 36, dy: -30, size: 6, duration: 16, delay: -12 },
  { x: 63, y: 88, dx: -40, dy: -32, size: 5, duration: 14, delay: -3 },
  { x: 87, y: 14, dx: -34, dy: 38, size: 6, duration: 12, delay: -15 },
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
      onCanPlay={() => {
        if (active) void ref.current?.play().catch(() => {})
      }}
      aria-hidden="true"
    >
      <source src={src} type="video/webm" />
    </video>
  )
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
            <TransparentVideo key={i} src="/images/adventure-real-birds.webm" className="adv-bird" active={active} style={vars({ '--x': `${bird.x}%`, '--y': `${bird.y}%`, '--s': bird.size, '--dur': `${bird.duration}s`, '--delay': `${bird.delay}s` })} />
          ))}
        </>
      )
    case 'land':
      return (
        <>
          {BIRDS.map((bird, i) => (
            <TransparentVideo key={`bird-${i}`} src="/images/adventure-real-birds.webm" className="adv-bird" active={active} style={vars({ '--x': `${bird.x}%`, '--y': `${bird.y}%`, '--s': bird.size, '--dur': `${bird.duration}s`, '--delay': `${bird.delay}s` })} />
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
            <TransparentVideo key={`fish-${i}`} src="/images/adventure-real-fish.webm" className="adv-fish" active={active} style={vars({ '--x': `${fish.x}%`, '--y': `${fish.y}%`, '--s': `${fish.size}vw`, '--dur': `${fish.duration}s`, '--delay': `${fish.delay}s` })} />
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
      return FIREFLIES.map((firefly, i) => (
        <span key={i} className="adv-firefly" style={vars({ '--x': `${firefly.x}%`, '--y': `${firefly.y}%`, '--dx': `${firefly.dx}px`, '--dy': `${firefly.dy}px`, '--sz': `${firefly.size}px`, '--dur': `${firefly.duration}s`, '--delay': `${firefly.delay}s` })} />
      ))
    default:
      return null
  }
}

export function AdventureScreenOverlay({ active }: { active: boolean }) {
  return (
    <>
      <TransparentVideo src="/images/adventure-real-camera-splash.webm" className={`adventure-screen-overlay${active ? ' is-on' : ''}`} active={active} />
      <TransparentVideo src="/images/adventure-real-camera-splash.webm" className={`adventure-screen-overlay adventure-screen-overlay-secondary${active ? ' is-on' : ''}`} active={active} />
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
