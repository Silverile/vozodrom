"""Chronology, explicit chassis identity and Czech-market overlap fallback."""
import json
from pathlib import Path
from match import Matcher
m=Matcher();plan=json.loads(Path('analysis/codex/single-generation-pass/batch-4/plan.json').read_text(encoding='utf-8-sig'));n=0
for p in plan:
 for i,g in enumerate(p['generations']):
  year=(g['from']+(g['to'] or 2026))//2
  code=(g['code'] or '').replace('/',' ')
  actual=m.generation(p['make'],p['line'],year,code)
  assert actual==i,(p['make'],p['line'],year,code,actual,i)
  n+=1
for line,year,code,index in [('sunny',1994,'',7),('sunny',1998,'',9),('sunny',1994,'B14',10),('bluebird',1989,'',7),('bluebird',1989,'U12',8),('vanette',2000,'',3),('vanette',2000,'S21',4),('maxima',2003,'',4),('maxima',2003,'A34',5)]:
 assert m.generation('nissan',line,year,code)==index,(line,year,code,index)
for make,line,year in [('nissan','pulsar',2008),('nissan','pulsar',2019),('nissan','prairie',1981),('nissan','bluebird',1958),('chevrolet','tahoe',1994)]:
 assert m.generation(make,line,year) is None,(make,line,year)
assert m.generation('daewoo','nexia',1986,'LeMans')==0
print(f'PASS: {n} generation-year cases, 9 regional/code cases, 5 production gaps and combined LeMans scope')
