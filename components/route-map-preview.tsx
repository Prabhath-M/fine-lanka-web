'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Compass, MapPin, MousePointer2, Route, X } from 'lucide-react'
import styles from './route-map-preview.module.css'
import { DESTINATIONS } from '@/lib/destinations-data'

type Marker = {
  id: string
  name: string
  x: number
  y: number
  type: 'primary' | 'hub'
  kind: string
  note?: string
}

type Segment = {
  id: string
  from: string
  to: string
  via?: [number, number][]
  kind: 'main' | 'scenic'
  roadClass?: string
  distanceKm?: number
  durationMin?: number
  sourceKey?: string
}

type Waypoint = {
  markerId: string
  role: 'airport' | 'main' | 'secondary'
  nights?: number
  mainOrder?: number
}

type Itinerary = {
  id: string
  label: string
  route: string
  waypoints: Waypoint[]
  markers: string[]
  tracedSegments: string[]
  segments: string[]
  distanceKm: number
  durationMin: number
  airportToAirport: boolean
}

type AtlasData = {
  image: string
  width: number
  height: number
  calibration: string
  source: {
    map: string
    routes: string
    itineraryRule: string
  }
  networkStats: {
    markerCount: number
    edgeCount: number
    primaryCount: number
    hubCount: number
    itineraryCount: number
    connected: boolean
  }
  markers: Marker[]
  segments: Segment[]
  itineraries: Itinerary[]
}

const kindLabel: Record<string, string> = {
  arrival: 'Arrival point',
  heritage: 'Heritage place',
  coast: 'Coastal stop',
  mountain: 'Mountain stop',
  tea: 'Tea-country stop',
  wildlife: 'Wildlife stop',
  waterfall: 'Waterfall stop',
  adventure: 'Adventure stop',
  nature: 'Nature stop',
  culture: 'Culture stop',
  rail: 'Railway stop',
  hub: 'Route hub',
  'hub-city': 'Route hub / city',
}

type ZoomRegion = {
  id: string
  label: string
  note: string
  x: number
  y: number
  width: number
  height: number
}

const zoomRegions: ZoomRegion[] = [
  { id: 'overview', label: 'Overview', note: 'Full island reference', x: 0, y: 0, width: 1664, height: 2080 },
  { id: 'north', label: 'North', note: 'Jaffna to Anuradhapura', x: 120, y: 0, width: 1180, height: 1475 },
  { id: 'cultural', label: 'Cultural Triangle', note: 'Anuradhapura to Polonnaruwa', x: 350, y: 500, width: 980, height: 1225 },
  { id: 'highlands', label: 'Central Highlands', note: 'Kandy to Ella', x: 290, y: 1030, width: 1050, height: 1312 },
  { id: 'south-east', label: 'South & East', note: 'Galle to Arugam Bay', x: 300, y: 760, width: 1210, height: 1512 },
  { id: 'west', label: 'West Coast', note: 'Puttalam to Galle', x: 60, y: 640, width: 920, height: 1150 },
]

const symbolByKind: Record<string, string> = {
  arrival: '✈',
  heritage: '✦',
  coast: '≈',
  mountain: '⌃',
  tea: '❧',
  wildlife: '♢',
  waterfall: '║',
  adventure: '≈',
  nature: '♧',
  culture: '◈',
  rail: '▰',
  hub: '·',
  'hub-city': '·',
}

const locationDetails: Record<string, { image: string; description: string }> = {
  airport: {
    image: '/images/sri-lanka-map-island-focus.webp',
    description: 'Your island welcome point at Bandaranaike International Airport, north of Colombo and the starting point for every Fine Lanka journey.',
  },
  pinnawala: {
    image: '/images/tour-nature.webp',
    description: 'A gentle first stop beside the Maha Oya, known for the Pinnawala Elephant Orphanage and a slower introduction to Sri Lanka’s wildlife.',
  },
  dambulla: {
    image: '/images/tour-cultural-historical.webp',
    description: 'A north-central heritage stop anchored by the Dambulla Cave Temple, with painted caves and Buddha images carved into the rock.',
  },
  sigiriya: {
    image: '/images/tours-and-pricing/sigiriya.webp',
    description: 'The fifth-century Sigiriya Rock Fortress, with frescoes, the Mirror Wall, garden ruins and wide views across the Cultural Triangle.',
  },
  anuradhapura: {
    image: '/images/tours-and-pricing/anuradhapura.webp',
    description: 'One of the ancient island’s ceremonial capitals, its floodlit dagobas and sacred sites still drawing pilgrims after over two thousand years.',
  },
  kandy: {
    image: '/images/tours-and-pricing/kandy.webp',
    description: 'The hill capital and spiritual heart of the island, home to the Temple of the Sacred Tooth Relic and the Esala Perahera procession.',
  },
  ella: {
    image: '/images/tours-and-pricing/ella.webp',
    description: 'A hill-country favourite threaded by the Nine Arch Bridge and the scenic railway, with tea slopes and viewpoints in every direction.',
  },
  'nuwara-eliya': {
    image: '/images/tours-and-pricing/nuwara-eliya.webp',
    description: 'Sri Lanka’s tea country at its most classic — rolling estates wrapped in cool highland mist, with colonial-era charm woven through the town.',
  },
  galle: {
    image: '/images/tours-and-pricing/galle.webp',
    description: 'A fortified coastal town where a Dutch-colonial fort, ramparts and a working lighthouse meet the Indian Ocean.',
  },
  mirissa: {
    image: '/images/tours-and-pricing/mirissa.webp',
    description: 'A palm-lined south-coast beach known for whale watching, quiet coves and one of the island’s best-loved sunset viewpoints.',
  },
  'arugam-bay': {
    image: '/images/tours-and-pricing/arugam-bay.webp',
    description: 'The island’s east-coast surf capital, a laid-back stretch of coastline where fishing boats and world-class breaks share the same shore.',
  },
  colombo: {
    image: '/images/tours-and-pricing/colombo.webp',
    description: 'The island’s commercial capital, where colonial-era landmarks and the Lotus Tower skyline meet a fast-moving modern city.',
  },
}

function getLocationDetails(marker: Marker) {
  const direct = locationDetails[marker.id]
  if (direct) return direct
  const destination = DESTINATIONS.find((item) => item.name.toLowerCase().includes(marker.name.toLowerCase()) || marker.name.toLowerCase().includes(item.name.toLowerCase()))
  return {
    image: destination?.region === 'Wildlife & National Parks' ? '/images/tour-nature.webp' : destination?.region === 'Hill Country' ? '/images/tour-nature.webp' : destination?.region === 'South Coast' || destination?.region === 'East Coast' ? '/images/tour-beach.webp' : '/images/tour-cultural-historical.webp',
    description: destination?.blurb ?? marker.note ?? `${marker.name} is a featured stop on the Fine Lanka route atlas. Select this waypoint to explore its place in the journey.`,
  }
}

function pathForSegment(segment: Segment, markers: Map<string, Marker>, width: number, height: number) {
  const start = markers.get(segment.from)
  const end = markers.get(segment.to)
  if (!start || !end) return ''
  const points: [number, number][] = [[start.x, start.y], ...(segment.via ?? []), [end.x, end.y]]
  return points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ')
}

type RouteMapPreviewProps = {
  embedded?: boolean
  selectedItineraryId?: string | null
  onSelectedItineraryChange?: (itineraryId: string | null) => void
}

export function RouteMapPreview({ embedded = false, selectedItineraryId: controlledItineraryId, onSelectedItineraryChange }: RouteMapPreviewProps) {
  const [data, setData] = useState<AtlasData | null>(null)
  const [internalSelectedItineraryId, setInternalSelectedItineraryId] = useState<string | null>('cultural-triangle-escape')
  const selectedItineraryId = controlledItineraryId === undefined ? internalSelectedItineraryId : controlledItineraryId
  const Root = embedded ? 'div' : 'main'
  const setSelectedItineraryId = (itineraryId: string | null) => {
    if (controlledItineraryId === undefined) setInternalSelectedItineraryId(itineraryId)
    onSelectedItineraryChange?.(itineraryId)
  }
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  // On wide viewports the place card anchors next to whichever marker was
  // clicked instead of sitting fixed in a map corner; this holds the spot
  // to anchor it to, measured live off the actual button/frame-wrap so it
  // stays correct through the map's zoom levels. The card renders inside a
  // thin wrapper around (not inside) the map frame, since the frame itself
  // has overflow: hidden for image cropping and would clip the card near
  // any edge marker. Left untouched (null) on the narrower/mobile layout,
  // which keeps its own fixed bottom-of-map card.
  const mapFrameWrapRef = useRef<HTMLDivElement>(null)
  const [markerCardAnchor, setMarkerCardAnchor] = useState<{ left: number; top: number; above: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/route-atlas.json')
      .then((response) => {
        if (!response.ok) throw new Error('The route atlas data could not be loaded.')
        return response.json() as Promise<AtlasData>
      })
      .then(setData)
      .catch((loadError: Error) => setError(loadError.message))
  }, [])

  const selectedItinerary = selectedItineraryId ? data?.itineraries.find((item) => item.id === selectedItineraryId) : undefined
  const markerById = useMemo(() => new Map((data?.markers ?? []).map((marker) => [marker.id, marker])), [data])
  const activeWaypoints = useMemo(() => selectedItinerary?.waypoints ?? [], [selectedItinerary])
  const activeMarkerIds = useMemo(() => new Set(activeWaypoints.map((waypoint) => waypoint.markerId)), [activeWaypoints])
  const activeSegmentIds = useMemo(() => new Set(selectedItinerary?.segments ?? []), [selectedItinerary])
  // Per-pin "spotlight": rather than one shape covering the whole trip, each
  // active marker gets its own soft-edged circle of full colour, and the
  // rest of the map stays under the grayscale/dimmed copy. An SVG <mask>
  // (referenced by id) is used rather than stacking CSS gradient masks,
  // because a real union of several circular "reveal" holes needs either
  // mask-composite keywords that differ between standard and -webkit- CSS
  // (fragile across browsers) or, more simply and predictably, an SVG mask —
  // where painting several white/feathered circles on a black backdrop
  // unions their visible regions automatically, no compositing mode needed.
  const spotlightMarkers = useMemo(() => {
    if (!data || !selectedItinerary || activeMarkerIds.size === 0) return []
    return data.markers.filter((marker) => activeMarkerIds.has(marker.id))
  }, [data, selectedItinerary, activeMarkerIds])
  const spotlightRadiusPx = 340
  const spotlightMaskId = useId()
  const waypointByMarkerId = useMemo(() => new Map(activeWaypoints.map((waypoint) => [waypoint.markerId, waypoint])), [activeWaypoints])
  const mainWaypointOrder = useMemo(() => activeWaypoints.filter((waypoint) => waypoint.role === 'main'), [activeWaypoints])
  const selectedMarker = selectedMarkerId ? markerById.get(selectedMarkerId) : null
  const [zoomRegionId, setZoomRegionId] = useState('overview')
  const zoomRegion = zoomRegions.find((region) => region.id === zoomRegionId) ?? zoomRegions[0]
  const zoomScale = data ? data.width / zoomRegion.width : 1
  const zoomCanvasStyle = data ? {
    width: `${zoomScale * 100}%`,
    height: `${zoomScale * 100}%`,
    left: `${-(zoomRegion.x * zoomScale / data.width) * 100}%`,
    top: `${-(zoomRegion.y * zoomScale / data.height) * 100}%`,
  } : undefined

  if (!data) {
    return (
      <Root className={`${styles.page} ${embedded ? styles.embeddedPage : ''}`}>
        <div className={styles.loading}>{error ?? 'Loading the map…'}</div>
      </Root>
    )
  }

  return (
    <Root className={`${styles.page} ${embedded ? styles.embeddedPage : ''}`}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}><Compass size={15} /> Fine Lanka route atlas · explore Sri Lanka by map</div>
        <div className={styles.heroGrid}>
          <div>
            <h1>Follow the island <em>by feeling.</em></h1>
            <p className={styles.intro}>
              A hand-illustrated guide to the places we love most across Sri Lanka. Tap any marker to see photos, a short story, and where it fits into your journey.
            </p>
          </div>
          <div className={styles.calibrationCard}>
            <span className={styles.cardLabel}>At a glance</span>
            <strong>{data.networkStats.markerCount} places to discover</strong>
            <span>{data.networkStats.primaryCount} signature destinations · {data.networkStats.hubCount} gateway towns along the way</span>
          </div>
        </div>
      </header>

      <section className={styles.workspace} aria-label="Interactive route atlas">
        <aside className={styles.sidebar}>
          <div className={styles.sidebarIntro}>
            <span className={styles.kicker}>Explore the island</span>
            <h2>Places, <em>made visible.</em></h2>
            <p>Each marker is thoughtfully placed to reflect where a destination sits on the island — pick a trip below to see its main stays highlighted, or explore freely at your own pace.</p>
          </div>
          <div className={styles.routeList} role="list" aria-label="Select a trip">
            <div className={styles.routeOption}>
              <span className={styles.routeOptionTop}><span>Choose a trip</span><MapPin size={14} /></span>
              <strong>{data.itineraries.length} itineraries</strong>
              <span>Select a trip to highlight its main stays and supporting stops.</span>
            </div>
            {data.itineraries.map((itinerary) => (
              <button
                key={itinerary.id}
                type="button"
                role="listitem"
                className={`${styles.routeOptionButton} ${selectedItinerary?.id === itinerary.id ? styles.routeOptionButtonSelected : ''}`}
                onClick={() => { setSelectedItineraryId(selectedItinerary?.id === itinerary.id ? null : itinerary.id); setSelectedMarkerId(null) }}
                aria-pressed={selectedItinerary?.id === itinerary.id}
              >
                <span className={styles.routeOptionTop}><span>{itinerary.label}</span><span>{itinerary.waypoints.filter((waypoint) => waypoint.role === 'main').length} stays</span></span>
                <strong>{itinerary.route}</strong>
              </button>
            ))}
          </div>
          <div className={styles.legend} aria-label="Map legend">
            <span className={styles.legendTitle}>Read the marks</span>
            <span><i className={`${styles.legendDot} ${styles.legendPrimary}`} /> Primary destination</span>
            <span><i className={`${styles.legendDot} ${styles.legendHub}`} /> Supporting hub / transfer point</span>
            <span><i className={`${styles.legendDot} ${styles.legendAirport}`} /> Airport / arrival point</span>
          </div>
        </aside>

        <div className={styles.mapColumn}>
          <div className={styles.mapHeader}>
            <div className={styles.mapTitle}>
              <span className={styles.kicker}>Explore by map</span>
              <h2>Sri Lanka, <em>up close.</em></h2>
              <p className={styles.routeTrail}>Every marker is a real place worth visiting — zoom into a region or tap a stop to start exploring.</p>
            </div>
            <div className={styles.mapHeaderRight}>
              <div className={styles.routeFacts} aria-label="Map facts">
                <span><strong>{data.markers.length}</strong><small>places</small></span>
                <span><strong>{data.itineraries.length}</strong><small>sample trips</small></span>
              </div>
              <div className={styles.zoomControls} aria-label="Map zoom regions">
                {zoomRegions.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    className={`${styles.zoomButton} ${zoomRegion.id === region.id ? styles.zoomButtonSelected : ''}`}
                    onClick={() => { setZoomRegionId(region.id); setSelectedMarkerId(null) }}
                    aria-pressed={zoomRegion.id === region.id}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
              <span className={styles.mapHint}><MousePointer2 size={14} /> Tap a marker to explore · {zoomRegion.note}</span>
            </div>
          </div>
          <div className={styles.mapFrameWrap} ref={mapFrameWrapRef}>
            <div className={styles.mapFrame}>
              <div className={styles.mapCanvas} style={zoomCanvasStyle}>
                <img
                  src={data.image}
                  alt="Illustrated Sri Lankan tour map with detected waypoint circles"
                  className={styles.mapImage}
                  width={data.width}
                  height={data.height}
                  loading="lazy"
                />
                <img
                  src={data.image}
                  alt=""
                  aria-hidden="true"
                  className={styles.mapImageMuted}
                  style={{ opacity: selectedItinerary ? 1 : 0 }}
                  width={data.width}
                  height={data.height}
                  loading="lazy"
                />
                {spotlightMarkers.length > 0 && (
                  <img
                    src={data.image}
                    alt=""
                    aria-hidden="true"
                    className={styles.mapImageSpotlight}
                    style={{ mask: `url("#${spotlightMaskId}")`, WebkitMaskImage: `url("#${spotlightMaskId}")` }}
                    width={data.width}
                    height={data.height}
                    loading="lazy"
                  />
                )}
                {spotlightMarkers.length > 0 && (
                  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
                    <defs>
                      <mask id={spotlightMaskId} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
                        <rect x="0" y="0" width="1" height="1" fill="black" />
                        {/* A nested, viewBox-scoped <svg> gives this content real
                            pixel coordinates (matching marker.x/marker.y and the
                            blur's stdDeviation directly, no fraction math) while
                            the outer mask still scales proportionally with
                            whatever size the masked <img> actually renders at. */}
                        <svg x="0" y="0" width="1" height="1" viewBox={`0 0 ${data.width} ${data.height}`}>
                          <defs>
                            <radialGradient id={`${spotlightMaskId}-feather`}>
                              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                              <stop offset="35%" stopColor="#fff" stopOpacity="1" />
                              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                            </radialGradient>
                            {/* Blurring the combined shapes alone still leaves a
                                faint darker notch right where two circles meet —
                                a plain blur softens each edge but doesn't fully
                                fuse two separate soft-edged blobs into one evenly
                                -lit shape. Fix (the classic "gooey filter" trick):
                                blur, then push the alpha channel through a steep
                                threshold so any partially-lit pixel snaps to
                                fully on/off — this is what actually merges two
                                overlapping blobs into one seamless union, since
                                there's no partial-alpha pinch left to read as a
                                notch. A final light blur softens that now-crisp
                                edge back into a gentle glow. */}
                            <filter id={`${spotlightMaskId}-blur`} x="-80%" y="-80%" width="260%" height="260%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="34" result="soft" />
                              <feColorMatrix
                                in="soft"
                                type="matrix"
                                values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 20 -9"
                                result="fused"
                              />
                              <feGaussianBlur in="fused" stdDeviation="10" />
                            </filter>
                          </defs>
                          <g filter={`url("#${spotlightMaskId}-blur")`}>
                            {spotlightMarkers.map((marker) => (
                              <circle
                                key={marker.id}
                                cx={marker.x}
                                cy={marker.y}
                                r={spotlightRadiusPx}
                                fill={`url("#${spotlightMaskId}-feather")`}
                              />
                            ))}
                          </g>
                        </svg>
                      </mask>
                    </defs>
                  </svg>
                )}
                <div className={styles.markerLayer}>
                {data.markers.map((marker) => {
                  const isActive = activeMarkerIds.has(marker.id)
                  const isSelected = selectedMarkerId === marker.id
                  const waypoint = waypointByMarkerId.get(marker.id)
                  const mainOrder = waypoint?.role === 'main' ? mainWaypointOrder.findIndex((item) => item.markerId === marker.id) : -1
                  const secondaryOrder = waypoint?.role === 'secondary' ? (waypoint.mainOrder ?? 1) - 1 : -1
                  const isMainWaypoint = mainOrder >= 0
                  const isSecondaryWaypoint = secondaryOrder >= 0
                  const isAirportWaypoint = waypoint?.role === 'airport'
                  // Only meaningful once a trip is selected: markers that
                  // aren't part of that trip shrink and desaturate so the
                  // chosen route's pins read clearly against the rest.
                  const isDimmed = Boolean(selectedItinerary) && !isActive
                  return (
                    <button
                      key={marker.id}
                      type="button"
                      className={`${styles.marker} ${isAirportWaypoint ? styles.markerAnchorAirport : ''}`}
                      style={{ left: `${(marker.x / data.width) * 100}%`, top: `${(marker.y / data.height) * 100}%` }}
                      onClick={(event) => {
                        setSelectedMarkerId(marker.id)
                        const wrap = mapFrameWrapRef.current
                        if (!wrap) { setMarkerCardAnchor(null); return }
                        const wrapRect = wrap.getBoundingClientRect()
                        const btnRect = event.currentTarget.getBoundingClientRect()
                        const cardHalfWidth = 168 // half of the card's ~21rem width
                        const cardHeightEstimate = 360
                        const gap = 18
                        const margin = 12
                        const cx = btnRect.left + btnRect.width / 2 - wrapRect.left
                        const cy = btnRect.top + btnRect.height / 2 - wrapRect.top
                        const left = Math.min(Math.max(cx, cardHalfWidth + margin), wrapRect.width - cardHalfWidth - margin)
                        const above = cy > cardHeightEstimate + gap + margin
                        setMarkerCardAnchor({ left, top: cy, above })
                      }}
                      aria-label={`Show details for ${marker.name}`}
                      aria-pressed={isSelected}
                      title={marker.name}
                    >
                      <span className={`${styles.markerHead} ${marker.type === 'primary' ? styles.markerPrimary : styles.markerHub} ${marker.kind === 'arrival' ? styles.markerArrival : ''} ${isActive ? styles.markerActive : ''} ${isDimmed ? styles.markerDimmed : ''} ${isSelected ? styles.markerSelected : ''} ${isMainWaypoint ? styles.markerItineraryMain : ''} ${isSecondaryWaypoint ? styles.markerItinerarySecondary : ''} ${isAirportWaypoint ? styles.markerItineraryAirport : ''}`}>
                        <span className={(isMainWaypoint || isSecondaryWaypoint) ? styles.markerOrder : styles.markerCore}>{isMainWaypoint ? mainOrder + 1 : isSecondaryWaypoint ? secondaryOrder + 1 : marker.type === 'hub' && marker.kind !== 'arrival' ? '•' : symbolByKind[marker.kind] ?? '·'}</span>
                        {isMainWaypoint && <span className={styles.markerStay}>{waypoint?.nights ?? 0}N</span>}
                        <span className={styles.markerLabel}>{marker.name}</span>
                      </span>
                    </button>
                  )
                })}
                </div>
              </div>
            </div>
          {selectedMarker && (
            <aside
              className={styles.placeCard}
              aria-live="polite"
              data-anchored={markerCardAnchor ? (markerCardAnchor.above ? 'above' : 'below') : undefined}
              style={markerCardAnchor ? ({ '--place-card-left': `${markerCardAnchor.left}px`, '--place-card-top': `${markerCardAnchor.top}px` } as React.CSSProperties) : undefined}
            >
              <button type="button" className={styles.closeButton} onClick={() => setSelectedMarkerId(null)} aria-label="Close place details"><X size={16} /></button>
              <img
                className={styles.placeImage}
                src={getLocationDetails(selectedMarker).image}
                alt={`${selectedMarker.name} travel photograph`}
                loading="lazy"
              />
              <span className={styles.placeType}>{selectedMarker.type === 'primary' ? 'Primary destination' : kindLabel[selectedMarker.kind] ?? 'Route hub'}</span>
              <h3>{selectedMarker.name}</h3>
              <p>{getLocationDetails(selectedMarker).description}</p>
              <div className={styles.placeMeta}><MapPin size={14} /> Image coordinate {selectedMarker.x}, {selectedMarker.y}</div>
              <div className={styles.placeMeta}><Route size={14} /> {selectedMarker.type === 'primary' ? 'Destination node' : 'Shared route hub'}</div>
              {activeMarkerIds.has(selectedMarker.id) && <div className={styles.activeNotice}>Included in {selectedItinerary?.label}</div>}
            </aside>
          )}
          </div>
          <p className={styles.caption}>This hand-illustrated map is your visual companion to the island — tap any marker for a closer look at what makes each place worth the trip.</p>
          <p className={styles.accuracyNote}>Marker positions are artistically composed for a beautiful, easy-to-read map and are approximate — not intended for precise geographic navigation.</p>
        </div>
      </section>
    </Root>
  )
}
