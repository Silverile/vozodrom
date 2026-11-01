"""Compare catalogue-only C6 routing before/after; contains no vehicle records."""
import sys,json,gzip
from pathlib import Path
sys.path.insert(0,'scripts/stats')
import match
root=Path('analysis/codex/single-generation-pass/batch-6')
new=match.Matcher()
base=json.loads(gzip.decompress((root/'baseline.json.gz').read_bytes()))
load=match.load
match.load=lambda path:base[path] if path in base else load(path)
old=match.Matcher()
rows=[]
for year in range(1928,2027):
 for model in ['C6','C6 2.7 HDI','C 6']:
  a=old.line('citroen',model,year);b=new.line('citroen',model,year)
  if a!=b:rows.append({'model':model,'year':year,'before':a,'after':b})
(root/'related-routing.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(json.dumps([r for r in rows if r['year']>=2000]))
