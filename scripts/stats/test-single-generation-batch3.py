"""Production chronology, overlap codes and genuine production hiatus checks."""
import json
from pathlib import Path
from match import Matcher
m=Matcher();plan=json.loads(Path('analysis/codex/single-generation-pass/batch-3/plan.json').read_text(encoding='utf-8-sig'));n=0
for p in plan:
 for i,g in enumerate(p['generations']):
  year=(g['from']+(g['to'] or 2026))//2
  code=(g['code'] or '').replace('/',' ')
  actual=m.generation(p['make'],p['line'],year,code)
  assert actual==i,(p['make'],p['line'],year,code,actual,i)
  n+=1
for make,line,year in [('opel','tigra',2002),('chevrolet','camaro',2005),('chevrolet','camaro',2024),('citroen','2cv',1948),('nissan','gt-r',2006)]:
 assert m.generation(make,line,year) is None,(make,line,year)
for year,code,index in [(1999,'160',2),(1990,'Y60',3),(1999,'Y61',4),(2025,'Y62',5),(2025,'Y63',6)]:
 assert m.generation('nissan','patrol',year,code)==index,(year,code,index)
assert m.generation('fiat','qubo',2026,'225')==0
assert m.generation('fiat','qubo',2026,'Qubo L')==1
print(f'PASS: {n} generation-year cases, 7 overlap/code cases and 5 production gaps')
