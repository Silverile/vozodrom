"""Save an offline gallery linked to the unchanged local batch files."""
import json
import runpy
from pathlib import Path

here = Path(__file__).resolve().parent
review = runpy.run_path(str(here / 'review.py'))
rows = review['records']()
for row in rows:
    for kind in ('photo', 'drawing'):
        row[kind + 'Url'] = Path(row[kind]).as_uri() if row[kind] else ''
html = review['HTML'].replace('/asset/${r.id}/${t}', '${esc(r[t+\'Url\'])}')
html = html.replace('__DATA__', json.dumps(rows, ensure_ascii=False).replace('</', '<\\/'))
(here / 'review.html').write_text(html, encoding='utf-8')
print(here / 'review.html')
