import cv2, json
from pathlib import Path
import numpy as np
src='/home/ubuntu/fine-lanka-web/public/images/fine-lanka-route-atlas-portrait.png'
img=cv2.imread(src); hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
mask=cv2.inRange(hsv,np.array([0,110,100]),np.array([15,255,255]))
num,lab,stats,cent=cv2.connectedComponentsWithStats(mask,8)
rows=[]
for i in range(1,num):
 x,y,w,h,a=stats[i]; ar=w/max(h,1)
 if 18<=w<=45 and 18<=h<=45 and .7<=ar<=1.4 and 180<=a<=1000:
  rows.append((int(round(cent[i][0])),int(round(cent[i][1])),int(w),int(h),int(a)))
rows=sorted(rows,key=lambda p:(p[1],p[0]))
print('count',len(rows))
for r in rows: print(r)
Path('/home/ubuntu/fine-lanka-web/docs/atlas-cv/circle-candidates.json').write_text(json.dumps(rows,indent=2))
