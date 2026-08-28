from pathlib import Path
from PIL import Image, ImageFilter, ImageChops, ImageDraw
import shutil

path = Path('public/images/logo-site.png')
backup = Path('public/images/logo-site-backup.png')
if backup.exists():
    shutil.copy2(backup, path)

img = Image.open(path).convert('RGBA')
alpha = img.getchannel('A')

# create a subtle light reflection on the non-transparent logo area
width, height = img.size
reflection = Image.new('RGBA', img.size, (255, 255, 255, 0))
mask = Image.new('L', img.size, 0)
draw = ImageDraw.Draw(mask)
# draw a soft elliptical highlight band
ellipse_box = [width * 0.15, height * 0.05, width * 0.9, height * 0.35]
draw.ellipse(ellipse_box, fill=180)
mask = mask.filter(ImageFilter.GaussianBlur(radius=18))
# constrain reflection to the logo alpha area
mask = ImageChops.multiply(mask, alpha)
reflection.putalpha(mask)

# blend the reflection with the original logo
result = Image.alpha_composite(img, reflection)
result.save(path)
print('Removed glow mask and applied reflection effect to non-transparent logo areas.')
