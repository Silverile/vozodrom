from pathlib import Path
import hashlib, json
from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
PHOTOS = REPO.parent / "vozodrom-data" / "front-photos" / "gaz"
cards = json.loads((REPO / "src/data/model-cards-index.json").read_text(encoding="utf-8"))["gaz"]
index = json.loads((REPO / "src/data/front-drawings.json").read_text(encoding="utf-8"))
all_ids = [f"gaz--{slug.removeprefix('gaz-')}--{i}" for slug, card in cards.items() for i, _ in enumerate(card["generations"])]
expected = [gid for gid in all_ids if not any(x[0] == int(gid.rsplit('--',1)[1]) for x in index.get(gid.rsplit('--',1)[0], []))]
generated = set(p.stem for p in (HERE / "raw").glob("gaz--*.png"))
issues, hashes, audits = [], {}, {}
for audit_file in HERE.glob("*-reference-audit.json"):
    try: data = json.loads(audit_file.read_text(encoding="utf-8-sig"))
    except Exception as exc:
        issues.append(f"{audit_file.name}: invalid reference audit: {exc}"); continue
    rows = data.get("items", data) if isinstance(data, dict) else data
    for row in rows:
        gid = row.get("id")
        if not gid: issues.append(f"{audit_file.name}: audit row without id")
        elif gid in audits: issues.append(f"{gid}: duplicate reference audit")
        else: audits[gid] = row
for gid in expected:
    if gid not in generated: continue
    drawing = HERE / "raw" / f"{gid}.png"
    try:
        with Image.open(drawing) as im:
            if im.size != (1536, 1024): issues.append(f"{gid}: drawing size {im.size}")
            im.verify()
    except Exception as exc: issues.append(f"{gid}: invalid drawing: {exc}")
    digest = hashlib.sha256(drawing.read_bytes()).hexdigest()
    if digest in hashes: issues.append(f"{gid}: duplicate drawing of {hashes[digest]}")
    hashes[digest] = gid
    folders = ([PHOTOS / gid] if (PHOTOS / gid).is_dir() else []) + list(PHOTOS.glob(f"{gid} *"))
    if len(folders) != 1:
        issues.append(f"{gid}: expected one photo folder, found {len(folders)}"); continue
    folder = folders[0]
    refs = list(folder.glob("reference.*"))
    if not refs: issues.append(f"{gid}: missing reference image")
    if not (folder / "metadata.json").is_file(): issues.append(f"{gid}: missing metadata.json")
    copy = folder / f"{gid}.png"
    if not copy.is_file(): issues.append(f"{gid}: missing folder drawing copy")
    elif hashlib.sha256(copy.read_bytes()).hexdigest() != digest: issues.append(f"{gid}: folder copy differs")
    audit = audits.get(gid)
    if not audit: issues.append(f"{gid}: missing strict reference audit")
    elif audit.get("verdict") != "pass": issues.append(f"{gid}: reference audit verdict {audit.get('verdict', 'missing')}")
result = {"catalogueGenerations":len(all_ids),"expectedNewDrawings":len(expected),"existingSiteDrawings":len(all_ids)-len(expected),"newDrawings":len(generated),"remaining":len(set(expected)-generated),"issues":issues}
(HERE / "validation.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(result,ensure_ascii=False))


