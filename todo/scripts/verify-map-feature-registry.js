const fs=require('fs');
const d=JSON.parse(fs.readFileSync('/home/ubuntu/fine-lanka-web/docs/map-feature-registry.json','utf8'));
const waypointUids=new Set(d.waypointFeatures.map(x=>x.uid));
const checks=d.routeFeatures.map(r=>({uid:r.uid,start:r.startCity,end:r.endCity,startExists:waypointUids.has(r.startWaypointUid),endExists:waypointUids.has(r.endWaypointUid),coordinates:r.routeGeometry.coordinates.length}));
const broken=checks.filter(x=>!x.startExists||!x.endExists||x.coordinates<2);
const trips=d.tripFeatures.map(t=>({uid:t.uid,waypoints:t.waypointUids.length,routes:t.routeUids.length}));
const output={waypointCount:d.waypointFeatures.length,routeCount:d.routeFeatures.length,tripCount:d.tripFeatures.length,brokenRoutes:broken,allTripsHaveRoutes:trips.every(x=>x.routes>0),trips};
fs.writeFileSync('/home/ubuntu/fine-lanka-web/docs/map-feature-registry-verification.json',JSON.stringify(output,null,2));
console.log(JSON.stringify(output,null,2));
