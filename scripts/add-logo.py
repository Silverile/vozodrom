"""Add hand-picked raster logos: py scripts/add-logo.py slug=path/to/image.png ["slug2=other.webp|0.03" ...]

Each image is saved as public/logos/<slug>.png (at most 400px high), registered in
src/data/brand-logo-files.json, and given a one-colour mask by mono-raster.py.
An optional "|<fraction>" after the path crops that share off every edge first, for images that come
with a frame around the logo. Run node scripts/makes-index.mjs afterwards.
"""
import json, os, subprocess, sys
from PIL import Image

REPO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
LOGOS = os.path.join(REPO, "public", "logos")
FILES = os.path.join(REPO, "src", "data", "brand-logo-files.json")

added = []
for arg in sys.argv[1:]:
    slug, spec = arg.split("=", 1)
    path, _, inset = spec.partition("|")
    # Flatten onto white: hand-picked logos are dark on light, and a white shield inside a transparent
    # image (Artega) must stay empty rather than become ink.
    src = Image.open(path).convert("RGBA")
    im = Image.new("RGBA", src.size, (255, 255, 255, 255))
    im.alpha_composite(src)
    if inset:
        dx, dy = round(im.width * float(inset)), round(im.height * float(inset))
        im = im.crop((dx, dy, im.width - dx, im.height - dy))
    if im.height > 400:
        im = im.resize((round(im.width * 400 / im.height), 400), Image.LANCZOS)
    for ext in (".svg", ".jpg", ".jpeg", ".gif", ".webp"):
        for p in (os.path.join(LOGOS, slug + ext), os.path.join(LOGOS, "mono", slug + ext)):
            if os.path.exists(p):
                os.remove(p)
    im.save(os.path.join(LOGOS, slug + ".png"), optimize=True)
    added.append(slug)

subprocess.run([sys.executable, os.path.join(REPO, "scripts", "mono-raster.py")], check=True, stdout=subprocess.DEVNULL)

files = json.load(open(FILES, encoding="utf8"))
for slug in added:
    m = Image.open(os.path.join(LOGOS, "mono", slug + ".png"))
    files[slug] = {"file": f"/logos/{slug}.png", "aspect": round(m.width / m.height, 2), "source": "dodáno ručně"}
    print(slug, files[slug]["aspect"])
json.dump(dict(sorted(files.items())), open(FILES, "w", encoding="utf8"), ensure_ascii=False, indent=1)
open(FILES, "a").write("\n")
