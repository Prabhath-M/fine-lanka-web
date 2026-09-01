import base64,json,os,requests
from pathlib import Path
base=Path('/home/ubuntu/fine-lanka-web'); crops=[('top',0,760),('middle',650,1450),('bottom',1340,2080)]
url=os.environ['OPENAI_API_BASE'].rstrip('/')+'/chat/completions'; headers={'Authorization':'Bearer '+os.environ['OPENAI_API_KEY'],'Content-Type':'application/json'}
allm=[]
for name,y0,y1 in crops:
 p=base/'docs/atlas-crops'/f'{name}.png'; data=base64.b64encode(p.read_bytes()).decode()
 prompt=f'''Inspect this crop from a fixed illustrated Sri Lanka route atlas. Crop full-image bounds are x=0..1664 and y={y0}..{y1}. Identify ONLY actual map waypoint symbols that are circular markers with a white center: red-ring primary destinations and brown/tan/cream-ring support hubs. Exclude the legend, decorative art, coins, food, and non-marker circles. Return JSON only with key markers. Each marker object must contain only markerType (primary or support), x and y pixel center in FULL IMAGE coordinates (not crop coordinates). Do not return labels, confidence, or explanations. If a marker appears partially at a crop edge, include it only when its center is inside this crop. Do not provide explanations.'''
 body={'model':'gemini-3-flash-preview','messages':[{'role':'user','content':[{'type':'text','text':prompt},{'type':'image_url','image_url':{'url':'data:image/png;base64,'+data,'detail':'high'}}]}],'max_tokens':4500,'response_format':{'type':'json_object'}}
 r=requests.post(url,headers=headers,json=body,timeout=150); r.raise_for_status(); d=json.loads(r.json()['choices'][0]['message']['content']); allm.extend(d.get('markers',[]))
# dedupe by label and proximity, favor first high-quality crop result
merged=[]
for m in allm:
 if not isinstance(m.get('x'),(int,float)) or not isinstance(m.get('y'),(int,float)): continue
 if any((m['x']-q['x'])**2+(m['y']-q['y'])**2<35**2 for q in merged): continue
 merged.append(m)
for i,m in enumerate(sorted(merged,key=lambda z:(z['y'],z['x'])),1): m['markerUid']=f'atlas-marker-{i:03d}'; m['xPct']=round(m['x']/1664*100,4); m['yPct']=round(m['y']/2080*100,4)
out={'image':'/home/ubuntu/fine-lanka-web/public/images/fine-lanka-route-atlas-all-hubs.png','width':1664,'height':2080,'markers':merged}
(base/'docs/atlas-marker-vision-complete.json').write_text(json.dumps(out,indent=2)); print(json.dumps({'markers':len(merged),'primary':sum(m['markerType']=='primary' for m in merged),'support':sum(m['markerType']=='support' for m in merged)},indent=2))
