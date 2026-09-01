import json
p='/home/ubuntu/fine-lanka-web/docs/airport-dambulla-osrm.json'
d=json.load(open(p))
r=d['routes'][0]
print('distance_km',round(r['distance']/1000,1),'duration_min',round(r['duration']/60,1))
for leg in r['legs']:
  for s in leg['steps']:
    m=s.get('maneuver',{})
    print({'road':s.get('name') or '(unnamed)','ref':s.get('ref') or '','type':m.get('type'),'modifier':m.get('modifier'),'lon':round(m.get('location',[0,0])[0],6),'lat':round(m.get('location',[0,0])[1],6)})
