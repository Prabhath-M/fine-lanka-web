const fs=require('fs');
const base='/home/ubuntu/fine-lanka-web';
const visual=JSON.parse(fs.readFileSync(base+'/public/data/atlas-visual-data.json','utf8'));
const vision=JSON.parse(fs.readFileSync(base+'/docs/atlas-marker-vision-complete.json','utf8'));
const old=visual.waypoints||[];
const byName=new Map(old.map(x=>[String(x.name).toLowerCase(),x]));
const waypoints=vision.markers.map((m,i)=>{
  const name=m.visibleLabel || `Waypoint ${String(i+1).padStart(2,'0')}`;
  const oldItem=byName.get(name.toLowerCase());
  return {uid:m.markerUid||`atlas-marker-${String(i+1).padStart(3,'0')}`,name,x:m.x,y:m.y,role:(m.type||m.markerType)==='primary'?'primary-tourism':'support-hub',atlasPosition:{x:m.x,y:m.y},lat:oldItem?.lat??null,lon:oldItem?.lon??null,markerType:(m.type||m.markerType)||'support'};
});
visual.image='/images/fine-lanka-route-atlas-all-hubs.png'; visual.imageWidth=1664; visual.imageHeight=2080; visual.waypoints=waypoints;
fs.writeFileSync(base+'/public/data/atlas-visual-data.json',JSON.stringify(visual));
fs.writeFileSync(base+'/docs/atlas-visual-data-vision-merged.json',JSON.stringify(visual,null,2));
console.log(JSON.stringify({waypoints:waypoints.length,primary:waypoints.filter(x=>x.role==='primary-tourism').length,support:waypoints.filter(x=>x.role==='support-hub').length,routes:(visual.routes||[]).length}));
