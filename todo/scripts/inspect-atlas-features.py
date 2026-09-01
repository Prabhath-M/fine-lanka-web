import cv2
import json
from pathlib import Path
import numpy as np

src=Path('/home/ubuntu/fine-lanka-web/public/images/fine-lanka-route-atlas-portrait.png')
out_dir=Path('/home/ubuntu/fine-lanka-web/docs/atlas-cv')
out_dir.mkdir(parents=True, exist_ok=True)
img=cv2.imread(str(src))
if img is None: raise SystemExit(f'Could not read {src}')
hsv=cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# Coral/orange ink ranges; keep the light background out.
red1=cv2.inRange(hsv, np.array([0,90,90]), np.array([16,255,255]))
red2=cv2.inRange(hsv, np.array([165,70,80]), np.array([180,255,255]))
coral=cv2.bitwise_or(red1, red2)
# Waypoint circles are compact, high-saturation coral rings.
num, labels, stats, cent=cv2.connectedComponentsWithStats(coral, 8)
waypoints=[]
for i in range(1,num):
    x,y,w,h,area=stats[i]
    if 35<=area<=2200 and 5<=w<=90 and 5<=h<=90 and 0.45<=w/max(h,1)<=2.2:
        waypoints.append({'x':int(round(cent[i][0])),'y':int(round(cent[i][1])),'width':int(w),'height':int(h),'area':int(area)})
# Orange route ink; morphology joins broken/dashed strokes for a route mask.
orange=cv2.inRange(hsv, np.array([5,55,80]), np.array([30,255,255]))
kernel=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))
route=cv2.morphologyEx(orange, cv2.MORPH_CLOSE, kernel, iterations=2)
route=cv2.morphologyEx(route, cv2.MORPH_OPEN, np.ones((3,3),np.uint8), iterations=1)
num2, labels2, stats2, cent2=cv2.connectedComponentsWithStats(route,8)
route_components=[]
for i in range(1,num2):
    x,y,w,h,area=stats2[i]
    if area>250:
        route_components.append({'x':int(x),'y':int(y),'width':int(w),'height':int(h),'area':int(area)})
# Annotated diagnostic for later review, not used as the production map.
annot=img.copy()
for p in waypoints:
    cv2.circle(annot,(p['x'],p['y']),max(8,min(p['width'],p['height'])//2+4),(255,0,255),3)
for c in route_components:
    cv2.rectangle(annot,(c['x'],c['y']),(c['x']+c['width'],c['y']+c['height']),(255,255,0),2)
cv2.imwrite(str(out_dir/'atlas-cv-detections.png'),annot)
result={'image':str(src),'width':int(img.shape[1]),'height':int(img.shape[0]),'waypointCandidates':len(waypoints),'waypoints':waypoints,'routeComponents':len(route_components),'routeComponentsSummary':route_components}
(out_dir/'atlas-cv-detections.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
