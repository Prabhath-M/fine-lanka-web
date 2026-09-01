import json, time, requests
from pathlib import Path

ROOT = Path('/home/ubuntu/fine-lanka-web')
DRAFT = ROOT / 'docs/route-waypoints-draft.json'
OUT = ROOT / 'docs/route-waypoints-validated.json'

aliases = {
    "Airport": "Bandaranaike International Airport, Sri Lanka",
    "Adam's Peak": "Sri Pada, Sri Lanka",
    "Diyaluma": "Diyaluma Falls, Sri Lanka",
    "Dunhinda": "Dunhinda Falls, Sri Lanka",
    "Dambana": "Dambana, Sri Lanka",
    "Horton Plains": "Horton Plains National Park, Sri Lanka",
    "Knuckles": "Knuckles Range, Sri Lanka",
    "Lipton's Seat": "Lipton Seat, Haputale, Sri Lanka",
    "Yala": "Yala National Park, Sri Lanka",
    "Pinnawala": "Pinnawala, Sri Lanka",
    "Ramboda": "Ramboda, Sri Lanka",
    "Ritigala": "Ritigala, Sri Lanka",
    "Aukana": "Aukana Buddha Statue, Sri Lanka",
    "Mihintale": "Mihintale, Sri Lanka",
    "Wellawaya": "Wellawaya, Sri Lanka",
    "Galle": "Galle, Sri Lanka",
    "Matara": "Matara, Sri Lanka",
    "Avissawella": "Avissawella, Sri Lanka",
    "Nallathanni": "Nallathanniya, Sri Lanka",
    "Habarana": "Habarana, Sri Lanka"
}

def geocode(name):
    q = aliases.get(name, f'{name}, Sri Lanka')
    r = requests.get('https://nominatim.openstreetmap.org/search', params={'q': q, 'format': 'jsonv2', 'limit': 1}, headers={'User-Agent': 'FineLankaRouteResearch/1.0'}, timeout=30)
    r.raise_for_status()
    items = r.json()
    if not items:
        raise RuntimeError(f'No geocode result for {name}: {q}')
    x = items[0]
    return {'name': name, 'query': q, 'lat': float(x['lat']), 'lon': float(x['lon']), 'display': x.get('display_name', '')}

def route(points):
    coords = ';'.join(f"{p['lon']},{p['lat']}" for p in points)
    url = f'https://router.project-osrm.org/route/v1/driving/{coords}'
    r = requests.get(url, params={'overview': 'full', 'geometries': 'geojson', 'steps': 'false'}, timeout=60)
    r.raise_for_status()
    data = r.json()
    if data.get('code') != 'Ok':
        raise RuntimeError(data)
    return {'distanceKm': round(data['routes'][0]['distance'] / 1000, 1), 'durationMin': round(data['routes'][0]['duration'] / 60), 'geometry': data['routes'][0]['geometry']}

draft = json.loads(DRAFT.read_text())
all_names = []
for seq in draft['tours'].values():
    for n in seq:
        if n not in all_names: all_names.append(n)
places = {}
for i, n in enumerate(all_names):
    print(f'geocoding {i+1}/{len(all_names)} {n}', flush=True)
    places[n] = geocode(n)
    time.sleep(1.05)

# Route each pair of adjacent named waypoints as a separate actual-road corridor.
segments = {}
for slug, seq in draft['tours'].items():
    out = []
    for a, b in zip(seq, seq[1:]):
        key = f'{a}__{b}'
        if key not in segments:
            print(f' routing {a} -> {b}', flush=True)
            segments[key] = {'from': a, 'to': b, **route([places[a], places[b]])}
            time.sleep(0.3)
        out.append(key)
    draft['tours'][slug] = {'waypoints': seq, 'segments': out}

result = {'generatedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'places': places, 'segments': segments, 'tours': draft['tours'], 'sources': ['OpenStreetMap Nominatim geocoder', 'OSRM public routing service']}
OUT.write_text(json.dumps(result, indent=2))
print(f'Wrote {OUT}')
