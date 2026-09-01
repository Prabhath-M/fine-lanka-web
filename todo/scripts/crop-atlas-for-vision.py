from PIL import Image
from pathlib import Path
src=Image.open('/home/ubuntu/fine-lanka-web/public/images/fine-lanka-route-atlas-all-hubs.png')
out=Path('/home/ubuntu/fine-lanka-web/docs/atlas-crops'); out.mkdir(parents=True,exist_ok=True)
# overlapping bands preserve markers near boundaries; coordinates are later offset by y0
for name,y0,y1 in [('top',0,760),('middle',650,1450),('bottom',1340,2080)]:
    src.crop((0,y0,1664,y1)).save(out/f'{name}.png')
print('created',[(n,y0,y1) for n,y0,y1 in [('top',0,760),('middle',650,1450),('bottom',1340,2080)]])
