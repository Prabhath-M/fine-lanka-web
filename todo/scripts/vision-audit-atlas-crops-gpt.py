import base64,json,os,requests
from pathlib import Path
base=Path('/home/ubuntu/fine-lanka-web'); crops=[('top',0,760),('middle',650,1450),('bottom',1340,2080)]
url=os.environ['OPENAI_API_BASE'].rstrip('/')+'/chat/completions'; headers={'Authorization':'Bearer '+os.environ['OPENAI_API_KEY'],'Content-Type':'application/json'}
allm=[]
for name,y0,y1 in crops:
 data=base64.b64encode((base/'docs/atlas-crops'/f'{name}.png').read_bytes()).decode()
 prompt=f'''Return a JSON object with a markers array. Inspect only the actual small map waypoint symbols in this crop: circular red-ring white-center primary markers and tan/brown-ring white-center support markers. Ignore the legend and decorative artwork. Crop bounds in the original 1664x2080 image: y={y0} to {y1}. Each marker object must contain only x, y, type, where x/y are original full-image pixel centers and type is primary or support. Include no label or prose. Include each marker whose center is within this crop.'''
 schema={'type':'object','properties':{'markers':{'type':'array','items':{'type':'object','properties':{'x':{'type':'integer'},'y':{'type':'integer'},'type':{'type':'string','enum':['primary','support']}},'required':['x','y','type'],'additionalProperties':False}}},'required':['markers'],'additionalProperties':False}
 body={'model':'gpt-5-mini','messages':[{'role':'user','content':[{'type':'text','text':prompt},{'type':'image_url','image_url':{'url':'data:image/png;base64,'+data,'detail':'high'}}]}],'max_completion_tokens':2000,'response_format':{'type':'json_schema','json_schema':{'name':'markers','strict':True,'schema':schema}}}
 r=requests.post(url,headers=headers,json=body,timeout=120); r.raise_for_status(); text=r.json()['choices'][0]['message']['content']; d=json.loads(text); allm.extend(d['markers'])
merged=[]
for m in allm:
 if all((m['x']-q['x'])**2+(m['y']-q['y'])**2>30**2 for q in merged): merged.append(m)
for i,m in enumerate(sorted(merged,key=lambda z:(z['y'],z['x'])),1): m['markerUid']=f'atlas-marker-{i:03d}'; m['xPct']=round(m['x']/1664*100,4); m['yPct']=round(m['y']/2080*100,4)
out={'image':'/images/fine-lanka-route-atlas-all-hubs.png','width':1664,'height':2080,'markers':merged}
(base/'docs/atlas-marker-vision-complete.json').write_text(json.dumps(out,indent=2)); print(json.dumps({'markers':len(merged),'primary':sum(m['type']=='primary' for m in merged),'support':sum(m['type']=='support' for m in merged)},indent=2))
