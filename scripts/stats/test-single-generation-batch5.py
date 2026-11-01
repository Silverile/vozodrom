"""Generation boundaries, parallel Odyssey families, and retained production gaps."""
import json
from pathlib import Path
from match import Matcher
m=Matcher()
plan=json.loads(Path('analysis/codex/single-generation-pass/batch-5/plan.json').read_text(encoding='utf-8-sig'))
n=0
for p in plan:
 for i,g in enumerate(p['generations']):
  year=(g['from']+(g['to'] or 2026))//2
  families=m.gens[(p['make'],p['line'])]
  other=set().union(*(tokens for j,(_,_,tokens) in enumerate(families) if j!=i))
  unique=families[i][2]-other
  code=sorted(unique)[0] if unique else ''
  assert m.generation(p['make'],p['line'],year,code)==i,(p['make'],p['line'],year,code,i)
  n+=1
for year,code,index in [(2000,'RL1',1),(2000,'RA6',2),(2006,'RB1',3),(2006,'RL3',4),(2012,'RB3',5),(2012,'RL5',6),(2020,'RC1',7),(2020,'RL6',8)]:
 assert m.generation('honda','odyssey',year,code)==index,(year,code,index)
for make,line,year in [('nissan','silvia',1970),('audi','coupe',1979),('audi','coupe',1997),('honda','pilot',2001),('nissan','300-zx',2001),('aston-martin','lagonda',1977),('bmw','3-20',1935),('alfa-romeo','90',1988),('ac-cars','2-litre',1959)]:
 assert m.generation(make,line,year) is None,(make,line,year)
assert m.generation('honda','pilot',2018,'YF6')==2
assert m.generation('nissan','300-zx',1990,'Z32')==1
print(f'PASS: {n} generation cases, 8 parallel Odyssey identities, 9 production gaps, Pilot and Z32 mapping')
