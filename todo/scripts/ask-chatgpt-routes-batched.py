import json, os, requests, concurrent.futures as cf
from pathlib import Path
base=Path('/home/ubuntu/fine-lanka-web'); draft=json.loads((base/'docs/route-waypoints-draft.json').read_text()); url=os.environ['OPENAI_API_BASE'].rstrip('/')+'/chat/completions'; headers={'Authorization':'Bearer '+os.environ['OPENAI_API_KEY'],'Content-Type':'application/json'}

def one(item):
 slug, stops=item
 prompt=f'''You are a Sri Lanka route-planning expert. For this itinerary sequence: {" -> ".join(stops)}. For every consecutive leg, return an object with start, end, orderedHubs (only important towns/junctions passed), roadNamesAndRefs, routeType (road, expressway, scenic rail, park/local spur), confidence, and a short note. Use Bandaranaike International Airport/Katunayake for Airport. Prefer fastest practical driving corridors. Do not add tiny villages or invent straight lines. If an itinerary stop is a tourism destination rather than a main hub, retain it as the endpoint. Output JSON only with keys tourSlug and legs.'''
 payload={'model':'gpt-5-mini','messages':[{'role':'system','content':'Return compact JSON only.'},{'role':'user','content':prompt}], 'max_completion_tokens':2600, 'response_format':{'type':'json_object'}}
 r=requests.post(url,headers=headers,json=payload,timeout=90); r.raise_for_status(); return json.loads(r.json()['choices'][0]['message']['content'])
items=list(draft['tours'].items())
with cf.ThreadPoolExecutor(max_workers=4) as ex: results=list(ex.map(one,items))
all_legs=[r for r in results]
distinct={}
for r in results:
 for leg in r.get('legs',[]):
  for name in [leg.get('start'),leg.get('end'),*leg.get('orderedHubs',[])]:
   if name: distinct.setdefault(name,{'name':name,'usedBy':[]})
  for name in [leg.get('start'),leg.get('end'),*leg.get('orderedHubs',[])]:
   if name and r['tourSlug'] not in distinct[name]['usedBy']: distinct[name]['usedBy'].append(r['tourSlug'])
out={'routeDatabase':all_legs,'distinctHubs':sorted(distinct.values(),key=lambda x:x['name'])}
(base/'docs/chatgpt-all-itinerary-routes.json').write_text(json.dumps(out,indent=2)); print(json.dumps({'tours':len(all_legs),'legs':sum(len(r.get('legs',[])) for r in all_legs),'distinctHubs':len(out['distinctHubs'])},indent=2))
