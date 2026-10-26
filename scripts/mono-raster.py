"""Turn raster logos (public/logos/*.png|jpg|gif) into one-colour alpha masks in public/logos/mono/*.png.

The SVG logos go through mono-logos.mjs; this is the same idea for bitmaps. Ink is every pixel that is
opaque and darker or more saturated than the background, so dark and coloured marks on white or
transparent backgrounds both work. The page fills the mask with currentColor.

Run after adding a raster logo: py scripts/mono-raster.py   (needs Pillow)
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "logos")
OUT = os.path.join(ROOT, "mono")
MAX = 256  # height of the stored mask; enough for the 44px make page on 3x screens

for name in sorted(os.listdir(ROOT)):
    base, ext = os.path.splitext(name)
    if ext.lower() not in (".png", ".jpg", ".jpeg", ".gif", ".webp"):
        continue
    im = Image.open(os.path.join(ROOT, name)).convert("RGBA")
    px = im.load()
    w, h = im.size
    # Background colour: the most common opaque pixel along the image border (white for most JPGs).
    # The whole border, not just the corners: a logo can touch a corner (Blata's outline).
    border = [px[x, y] for x in range(w) for y in (0, h - 1)] + [px[x, y] for y in range(h) for x in (0, w - 1)]
    opaque = [c for c in border if c[3] > 200]
    bg = max(set(opaque), key=opaque.count) if len(opaque) > len(border) / 2 else None
    mask = Image.new("L", (w, h))
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if bg is None:
                ink = 1.0
            else:
                # distance from the background colour, 0..1
                ink = min(1.0, (abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])) / 180)
            mp[x, y] = int(a * ink)
    box = mask.getbbox()
    if not box:
        print("empty:", name)
        continue
    mask = mask.crop(box)
    if mask.height > MAX:
        mask = mask.resize((round(mask.width * MAX / mask.height), MAX), Image.LANCZOS)
    out = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    out.putalpha(mask)
    out.save(os.path.join(OUT, base + ".png"), optimize=True)
    print(f"mono/{base}.png {mask.width}x{mask.height}")
