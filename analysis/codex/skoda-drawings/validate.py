from pathlib import Path
import hashlib, json
from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
PHOTOS = REPO.parent / "vozodrom-data" / "front-photos" / "skoda"
cards = json.loads((REPO / "src/data/model-cards-index.json").read_text(encoding="utf-8"))["skoda"]
all_ids = [f"skoda--{slug}--{i}" for slug, card in cards.items() for i, _ in enumerate(card["generations"])]
expected = [gid for gid in all_ids if not (REPO / "public/front" / f"{gid}.webp").is_file()]
generated = set(p.stem for p in (HERE / "raw").glob("skoda--*.png"))
issues = []
hashes = {}
reference_audits = {}
for audit_file in HERE.glob("*-reference-audit.json"):
    try:
        audit = json.loads(audit_file.read_text(encoding="utf-8-sig"))
    except (OSError, ValueError) as exc:
        issues.append(f"{audit_file.name}: invalid reference audit: {exc}")
        continue
    for row in audit.get("items", []):
        gid = row.get("id")
        if not gid:
            issues.append(f"{audit_file.name}: audit row without id")
        elif gid in reference_audits:
            issues.append(f"{gid}: duplicate reference audit")
        else:
            reference_audits[gid] = row
for gid in expected:
    if gid not in generated:
        continue
    drawing = HERE / "raw" / f"{gid}.png"
    try:
        with Image.open(drawing) as im:
            if im.size != (1536, 1024): issues.append(f"{gid}: drawing size {im.size}")
            im.verify()
    except Exception as e: issues.append(f"{gid}: invalid drawing: {e}")
    digest = hashlib.sha256(drawing.read_bytes()).hexdigest()
    if digest in hashes: issues.append(f"{gid}: duplicate drawing of {hashes[digest]}")
    hashes[digest] = gid
    folders = list(PHOTOS.glob(f"{gid} *"))
    if len(folders) != 1:
        issues.append(f"{gid}: expected one photo folder, found {len(folders)}")
        continue
    folder = folders[0]
    refs = list(folder.glob("reference.*"))
    if not refs: issues.append(f"{gid}: missing reference image")
    for name in ("info.txt", "zdroj.txt"):
        if not (folder / name).is_file(): issues.append(f"{gid}: missing {name}")
    copy = folder / f"{gid}.png"
    if not copy.is_file(): issues.append(f"{gid}: missing folder drawing copy")
    elif hashlib.sha256(copy.read_bytes()).hexdigest() != digest: issues.append(f"{gid}: folder copy differs")
    audit = reference_audits.get(gid)
    if not audit:
        issues.append(f"{gid}: missing strict reference audit")
    elif audit.get("verdict") != "pass":
        issues.append(f"{gid}: reference audit verdict {audit.get('verdict', 'missing')}")

result = {"catalogueGenerations": len(all_ids), "expectedNewDrawings": len(expected), "existingSiteDrawings": len(all_ids) - len(expected),
          "newDrawings": len(generated), "remaining": len(set(expected) - generated), "issues": issues}
(HERE / "validation.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(result, ensure_ascii=False))
