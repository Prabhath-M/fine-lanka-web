import json, re
from pathlib import Path
vision=json.loads(Path('/home/ubuntu/fine-lanka-web/docs/atlas-cv/chatgpt-vision-atlas.json').read_text())
source=json.loads(Path('/home/ubuntu/fine-lanka-web/docs/route-waypoints-validated.json').read_text())
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def canonical(s):
    aliases={'Airport':'Bandaranaike Airport','Arugam Bay':'Arugam Bay','Kalpitiyya':'Kalpitiya','Adam’s Peak':"Adam's Peak"}
    return aliases.get(s,s)
# The vision audit is the fixed-image source of truth. Preserve its coordinates and traces.
waypoints=vision.get('waypoints',[])
routes=vision.get('routes',[])
for w in waypoints:
    w['name']=canonical(w['name'])
    w['uid']='wp-'+slug(w['name'])
    w['atlasPosition']={'x':w['x'],'y':w['y']}
route_index={}
for r in routes:
    r['start']=canonical(r['start']); r['end']=canonical(r['end'])
    r['uid']='rt-'+slug(r['start'])+'-to-'+slug(r['end'])
    r['startWaypointUid']='wp-'+slug(r['start'])
    r['endWaypointUid']='wp-'+slug(r['end'])
    route_index[(slug(r['start']),slug(r['end']))]=r['uid']
# Match each itinerary leg to the visible route graph. If an endpoint pair is not a direct line, use BFS through visible orange-line waypoints.
adj={}
for r in routes:
    a,b=slug(r['start']),slug(r['end']); adj.setdefault(a,[]).append((b,r['uid'])); adj.setdefault(b,[]).append((a,r['uid']))
def graph_path(start,end):
    start,end=slug(canonical(start)),slug(canonical(end))
    if start not in adj or end not in adj: return []
    q=[(start,[])]; seen={start}
    while q:
        node,edges=q.pop(0)
        if node==end: return edges
        for nxt,uid in adj.get(node,[]):
            if nxt not in seen:
                seen.add(nxt); q.append((nxt,edges+[uid]))
    return []
tours={}
for trip_uid,trip in source['tours'].items():
    route_uids=[]
    for seg in trip['segments']:
        a,b=seg.split('__'); route_uids.extend(graph_path(a,b))
    # preserve order while removing duplicate route traces
    route_uids=list(dict.fromkeys(route_uids))
    tours[trip_uid]={'waypoints':trip['waypoints'],'segments':trip['segments'],'visualRouteUids':route_uids}
output={'schemaVersion':'2.0-vision-registered','image': '/images/fine-lanka-route-atlas-portrait.png','imageWidth':1664,'imageHeight':2080,'waypoints':waypoints,'routes':routes,'tours':tours,'places':source['places'],'source':'ChatGPT vision audit of fixed atlas image'}
Path('/home/ubuntu/fine-lanka-web/public/data/atlas-visual-data.json').write_text(json.dumps(output,separators=(',',':')))
Path('/home/ubuntu/fine-lanka-web/docs/atlas-cv/atlas-visual-data.json').write_text(json.dumps(output,indent=2))
print(json.dumps({'waypoints':len(waypoints),'routes':len(routes),'trips':len(tours),'matchedTripRouteCounts':{k:len(v['visualRouteUids']) for k,v in tours.items()}},indent=2))
