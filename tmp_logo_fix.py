from pathlib import Path
from PIL import Image, ImageFilter, ImageChops, ImageOps
import shutil

path = Path('public/images/logo-site.png')
backup = Path('public/images/logo-site-backup.png')
if backup.exists():
    shutil.copy2(backup, path)

img = Image.open(path).convert('RGBA')
alpha = img.getchannel('A')
# preserve only the existing opaque shape via alpha mask
mask = alpha.point(lambda v: 255 if v > 10 else 0)

# bevel/emboss on RGB channels
rgb = img.convert('RGB')
emboss = rgb.filter(ImageFilter.EMBOSS)
embossed = Image.blend(rgb, emboss, 0.28)
embossed = embossed.convert('RGBA')
embossed.putalpha(alpha)

# edge glow/darken around visible edges only
blur_alpha = alpha.filter(ImageFilter.GaussianBlur(radius=4))
edge_mask = ImageChops.subtract(blur_alpha, alpha)
highlight_mask = edge_mask.point(lambda v: min(255, int(v * 1.6)))
darken_mask = edge_mask.point(lambda v: min(255, int(v * 0.8)))

highlight = Image.new('RGBA', img.size, (255, 238, 200, 0))
highlight.putalpha(highlight_mask)
highlight = highlight.filter(ImageFilter.GaussianBlur(radius=2))

darken = Image.new('RGBA', img.size, (0, 0, 0, 0))
darken.putalpha(darken_mask)
darken = darken.filter(ImageFilter.GaussianBlur(radius=1.5))

# combine effects with original alpha preserved
result = Image.alpha_composite(embossed, highlight)
result = Image.alpha_composite(result, darken)
result.putalpha(alpha)

# subtle contrast and color correction only inside mask
final = Image.blend(result, ImageOps.autocontrast(result.convert('RGB')).convert('RGBA'), 0.1)
final.putalpha(alpha)
final.save(path)
print('Restored transparent background and updated logo from backup to', path)
