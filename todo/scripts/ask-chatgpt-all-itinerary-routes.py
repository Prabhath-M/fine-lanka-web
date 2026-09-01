import json, os, requests
from pathlib import Path
base=Path('/home/ubuntu/fine-lanka-web')
draft=json.loads((base/'docs/route-waypoints-draft.json').read_text())
source=json.loads((base/'docs/route-waypoints-validated.json').read_text())
input_data={'itineraries':draft['tours'],'known_places':{k:{'lat':v['lat'],'lon':v['lon']} for k,v in source['places'].items()}}
prompt='''You are a Sri Lanka route-planning expert. Expand every itinerary below into a practical fastest road corridor, using the ordered destinations as endpoints and adding only the main towns, junctions, and route corridors a driver would actually pass. Preserve tourism destinations as endpoints or stops and distinguish them from pass-through hubs. For every leg return: start, end, orderedHubs (main cities/towns only, not every village), roadNamesAndRefs, routeType (road, expressway, scenic rail, park/local spur), confidence, and notes. Also return distinctHubs as a deduplicated list with name, role, and which itinerary slugs use it. Do not invent a straight line. If a leg is a scenic train or local park spur, say so and do not pretend it is a main-road corridor. Use the airport as Bandaranaike International Airport / Katunayake. Output JSON only with keys routeDatabase and distinctHubs. Each routeDatabase item must have tourSlug and legs.'''
url=os.environ['OPENAI_API_BASE'].rstrip('/')+'/chat/completions'
headers={'Authorization':'Bearer '+os.environ['OPENAI_API_KEY'],'Content-Type':'application/json'}
payload={'model':'gpt-5-mini','messages':[{'role':'system','content':'Return JSON only. Be conservative and explicit about uncertainty.'},{'role':'user','content':prompt+'\n\nINPUT:\n'+json.dumps(input_data)}],'max_completion_tokens':9000,'reasoning':{'effort':'low'},'response_format':{'type':'json_object'}}
r=requests.post(url,headers=headers,json=payload,timeout=180)
if not r.ok:
    raise RuntimeError(f'ChatGPT proxy error {r.status_code}: {r.text[:2000]}')
r.raise_for_status()
content=r.json()['choices'][0]['message']['content']
(base/'docs/chatgpt-all-itinerary-routes.json').write_text(content)
print(content)
