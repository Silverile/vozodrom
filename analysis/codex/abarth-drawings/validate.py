"""Read-only batch integrity checks; writes a report, never modifies images."""
import hashlib
import json
import runpy
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
review = runpy.run_path(str(HERE / 'review.py'))
rows = review['records']()
issues = []
hashes = {}
for row in rows:
    for kind in ('photo', 'drawing'):
        path = Path(row[kind]) if row[kind] else None
        if not path or not path.is_file():
            issues.append(f"{row['id']}: missing {kind}")
            continue
        with Image.open(path) as im:
            row[kind + 'Dimensions'] = list(im.size)
            im.verify()
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        row[kind + 'Sha256'] = digest
        if kind == 'drawing':
            if row[kind + 'Dimensions'] != [1536, 1024]:
                issues.append(f"{row['id']}: unexpected drawing dimensions")
            if digest in hashes:
                issues.append(f"{row['id']}: duplicate drawing of {hashes[digest]}")
            hashes[digest] = row['id']
            folder_copy = Path(row['photo']).parent / (row['id'] + '.png') if row['photo'] else None
            if not folder_copy or not folder_copy.is_file() or hashlib.sha256(folder_copy.read_bytes()).hexdigest() != digest:
                issues.append(f"{row['id']}: missing or differing generation folder copy")
    if row['photo']:
        folder = Path(row['photo']).parent
        for name in ('info.txt', 'zdroj.txt'):
            if not (folder / name).is_file():
                issues.append(f"{row['id']}: missing {name}")
report = dict(expectedGenerations=22, photos=sum(bool(r['photo']) for r in rows),
              drawings=sum(bool(r['drawing']) for r in rows), issues=issues, records=rows)
(HERE / 'validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({k: v for k, v in report.items() if k != 'records'}, ensure_ascii=False))
