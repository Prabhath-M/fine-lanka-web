'use client'

import { useEffect, useMemo, useState } from 'react'
import { Compass, MapPin, MousePointer2, Route, X } from 'lucide-react'
import styles from './route-map-preview.module.css'

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
}

type Itinerary = {
  id: string
  label: string
  route: string
  markers: string[]
  segments: string[]
}

type AtlasData = {
  image: string
  width: number
  height: number
  calibration: string
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

const symbolByKind: Record<string, string> = {
  arrival: '✈',
  heritage: '✦',
  coast: '◒',
  mountain: '⌃',
  tea: '❧',
  wildlife: '♢',
  waterfall: '≋',
  adventure: '≈',
  nature: '♧',
  culture: '◈',
  rail: '▰',
  hub: '·',
  'hub-city': '·',
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

export function RouteMapPreview() {
  const [data, setData] = useState<AtlasData | null>(null)
  const [selectedItineraryId, setSelectedItineraryId] = useState('cultural-triangle-escape')
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
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

  const selectedItinerary = data?.itineraries.find((item) => item.id === selectedItineraryId) ?? data?.itineraries[0]
  const markerById = useMemo(() => new Map((data?.markers ?? []).map((marker) => [marker.id, marker])), [data])
  const activeMarkerIds = useMemo(() => new Set(selectedItinerary?.markers ?? []), [selectedItinerary])
  const activeSegmentIds = useMemo(() => new Set(selectedItinerary?.segments ?? []), [selectedItinerary])
  const selectedMarker = selectedMarkerId ? markerById.get(selectedMarkerId) : null

  if (!data) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>{error ?? 'Loading the calibrated route atlas…'}</div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}><Compass size={15} /> Fine Lanka route atlas · sample overlay</div>
        <div className={styles.heroGrid}>
          <div>
            <h1>Follow the island <em>by feeling.</em></h1>
            <p className={styles.intro}>
              A first interactable pass over the latest illustrated Sri Lankan map. The red circles are primary destinations;
              the brown circles are route hubs and sub-points. Select a travel plan or click any marker to explore the network.
            </p>
          </div>
          <div className={styles.calibrationCard}>
            <span className={styles.cardLabel}>Calibration note</span>
            <strong>Latest all-hubs artwork</strong>
            <span>Markers manually reconciled to the visible circles · {data.markers.length} interactable places</span>
          </div>
        </div>
      </header>

      <section className={styles.workspace} aria-label="Interactive route atlas">
        <aside className={styles.sidebar}>
          <div className={styles.sidebarIntro}>
            <span className={styles.kicker}>Choose a route</span>
            <h2>Trip lines, <em>made visible.</em></h2>
            <p>Quiet corridors remain in the map artwork. The selected itinerary is drawn in a warm red line so its stops read as one journey.</p>
          </div>
          <div className={styles.routeList} role="list" aria-label="Sample itineraries">
            {data.itineraries.map((itinerary) => {
              const isSelected = itinerary.id === selectedItinerary?.id
              return (
                <button
                  key={itinerary.id}
                  type="button"
                  className={`${styles.routeOption} ${isSelected ? styles.routeOptionSelected : ''}`}
                  onClick={() => {
                    setSelectedItineraryId(itinerary.id)
                    setSelectedMarkerId(null)
                  }}
                  aria-pressed={isSelected}
                >
                  <span className={styles.routeOptionTop}><span>{isSelected ? 'Active plan' : 'Sample plan'}</span><Route size={14} /></span>
                  <strong>{itinerary.label}</strong>
                  <span>{itinerary.route}</span>
                </button>
              )
            })}
          </div>
          <div className={styles.legend} aria-label="Map legend">
            <span className={styles.legendTitle}>Read the marks</span>
            <span><i className={`${styles.legendDot} ${styles.legendPrimary}`} /> Primary destination</span>
            <span><i className={`${styles.legendDot} ${styles.legendHub}`} /> Route hub / sub-point</span>
            <span><i className={styles.legendLine} /> Selected corridor</span>
            <span><i className={`${styles.legendLine} ${styles.legendDashed}`} /> Scenic / local connector</span>
          </div>
        </aside>

        <div className={styles.mapColumn}>
          <div className={styles.mapHeader}>
            <div><span className={styles.kicker}>Now tracing</span><h2>{selectedItinerary?.label}</h2></div>
            <span className={styles.mapHint}><MousePointer2 size={14} /> Click any circle</span>
          </div>
          <div className={styles.mapFrame}>
            <img src={data.image} alt="Illustrated Sri Lankan route atlas with red primary destination circles and brown route-hub circles" className={styles.mapImage} />
            <svg className={styles.routeOverlay} viewBox={`0 0 ${data.width} ${data.height}`} preserveAspectRatio="none" aria-hidden="true">
              {data.segments.map((segment) => {
                const isActive = activeSegmentIds.has(segment.id)
                const path = pathForSegment(segment, markerById, data.width, data.height)
                return (
                  <g key={segment.id}>
                    {isActive && <path d={path} className={styles.activeHalo} />}
                    <path d={path} className={`${styles.routePath} ${isActive ? styles.routePathActive : ''} ${segment.kind === 'scenic' ? styles.routePathScenic : ''}`} />
                  </g>
                )
              })}
            </svg>
            <div className={styles.markerLayer}>
              {data.markers.map((marker) => {
                const isActive = activeMarkerIds.has(marker.id)
                const isSelected = selectedMarkerId === marker.id
                return (
                  <button
                    key={marker.id}
                    type="button"
                    className={`${styles.marker} ${marker.type === 'primary' ? styles.markerPrimary : styles.markerHub} ${marker.kind === 'arrival' ? styles.markerArrival : ''} ${isActive ? styles.markerActive : ''} ${isSelected ? styles.markerSelected : ''}`}
                    style={{ left: `${(marker.x / data.width) * 100}%`, top: `${(marker.y / data.height) * 100}%` }}
                    onClick={() => setSelectedMarkerId(marker.id)}
                    aria-label={`Show details for ${marker.name}`}
                    aria-pressed={isSelected}
                    title={marker.name}
                  >
                    <span className={styles.markerCore}>{symbolByKind[marker.kind] ?? '·'}</span>
                    <span className={styles.markerLabel}>{marker.name}</span>
                  </button>
                )
              })}
            </div>
            {selectedMarker && (
              <aside className={styles.placeCard} aria-live="polite">
                <button type="button" className={styles.closeButton} onClick={() => setSelectedMarkerId(null)} aria-label="Close place details"><X size={16} /></button>
                <span className={styles.placeType}>{selectedMarker.type === 'primary' ? 'Primary destination' : kindLabel[selectedMarker.kind] ?? 'Route hub'}</span>
                <h3>{selectedMarker.name}</h3>
                <p>{selectedMarker.note ?? `${selectedMarker.name} is registered from the visible ${selectedMarker.type === 'primary' ? 'red primary' : 'brown hub'} circle on the latest atlas.`}</p>
                <div className={styles.placeMeta}><MapPin size={14} /> Image coordinate {selectedMarker.x}, {selectedMarker.y}</div>
                {activeMarkerIds.has(selectedMarker.id) && <div className={styles.activeNotice}>Included in {selectedItinerary?.label}</div>}
              </aside>
            )}
          </div>
          <p className={styles.caption}>Source artwork remains fixed. The interaction layer is calibrated to the latest all-hubs image and keeps marker coordinates in image space rather than projecting them from latitude/longitude.</p>
        </div>
      </section>
    </main>
  )
}
