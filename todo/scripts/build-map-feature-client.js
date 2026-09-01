const fs=require('fs');
const full=JSON.parse(fs.readFileSync('/home/ubuntu/fine-lanka-web/docs/map-feature-registry.json','utf8'));
const client={schemaVersion:full.schemaVersion,mapImage:full.mapImage,coordinateSystem:full.coordinateSystem,atlasBounds:full.atlasBounds,places:full.places,segments:full.segments,tours:full.tours};
fs.writeFileSync('/home/ubuntu/fine-lanka-web/public/data/map-feature-registry-client.json',JSON.stringify(client));
console.log(`Created compact client registry: ${fs.statSync('/home/ubuntu/fine-lanka-web/public/data/map-feature-registry-client.json').size} bytes`);
