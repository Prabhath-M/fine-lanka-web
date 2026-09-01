const fs = require('fs');
const sourcePath = '/home/ubuntu/fine-lanka-web/docs/route-waypoints-validated.json';
const outputPath = '/home/ubuntu/fine-lanka-web/docs/map-feature-registry.json';
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const GEO = { west:79.45, east:82.15, north:10.1, south:5.65 };
function atlasPosition(lon, lat) {
  return {
    xPercent: Number((15 + ((lon-GEO.west)/(GEO.east-GEO.west))*70).toFixed(4)),
    yPercent: Number((2 + ((GEO.north-lat)/(GEO.north-GEO.south))*94).toFixed(4))
  };
}
function slug(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
const waypointFeatures = Object.entries(source.places).map(([cityName, place]) => ({
  uid: `wp-${slug(cityName)}`,
  cityName,
  exactLocation: { latitude: place.lat, longitude: place.lon },
  atlasPosition: atlasPosition(place.lon, place.lat),
  query: place.query,
  display: place.display,
  role: 'route-waypoint'
}));
const routeFeatures = Object.entries(source.segments).map(([segmentUid, segment]) => {
  const [startCity, endCity] = segmentUid.split('__');
  return {
    uid: `rt-${slug(startCity)}-to-${slug(endCity)}`,
    sourceSegmentUid: segmentUid,
    startWaypointUid: `wp-${slug(startCity)}`,
    endWaypointUid: `wp-${slug(endCity)}`,
    startCity,
    endCity,
    distanceKm: segment.distanceKm,
    durationMin: segment.durationMin,
    routeGeometry: segment.geometry,
    routeLineType: segment.geometry.coordinates.length > 18 ? 'routed-road-trace' : 'short-connector'
  };
});
const tripFeatures = Object.entries(source.tours).map(([tripUid, trip]) => ({
  uid: `trip-${tripUid}`,
  sourceTripUid: tripUid,
  waypointUids: trip.waypoints.map(city => `wp-${slug(city)}`),
  routeUids: trip.segments.map(segmentUid => {
    const [startCity, endCity] = segmentUid.split('__');
    return `rt-${slug(startCity)}-to-${slug(endCity)}`;
  })
}));
const registry = {
  schemaVersion: '1.0',
  mapImage: '/images/fine-lanka-route-atlas-portrait.png',
  coordinateSystem: 'WGS84 latitude/longitude; atlasPosition is the normalized placement on the fixed portrait map image',
  atlasBounds: GEO,
  waypointFeatures,
  routeFeatures,
  tripFeatures,
  places: source.places,
  segments: source.segments,
  tours: source.tours
};
fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2));
console.log(`Created ${waypointFeatures.length} waypoint features and ${routeFeatures.length} route features across ${tripFeatures.length} trips.`);
console.log(`Output: ${outputPath}`);
