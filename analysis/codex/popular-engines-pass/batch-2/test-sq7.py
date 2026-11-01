"""Require a chassis identity for the overseas SQ7 branch; prove other routing unchanged."""
import sys,pathlib,types,subprocess,json
sys.stdout.reconfigure(encoding='utf8');sys.path.insert(0,'scripts/stats')
from match import Matcher
module=types.ModuleType('before');module.__file__=str(pathlib.Path('scripts/stats/match.py').resolve())
source=subprocess.check_output(['git','show','HEAD:scripts/stats/match.py'],text=True,encoding='utf8')
exec(compile(source,module.__file__,'exec'),module.__dict__);old=module.Matcher();new=Matcher()
assert old.lines==new.lines and old.years==new.years and old.gens==new.gens
checked=0;changed=[]
for key,gens in new.gens.items():
 years={None,2026,2027};texts={'','UNKNOWN'}
 for a,b,codes in gens:
  if a:years.update([a-1,a,a+1])
  if b:years.update([b-1,b,b+1])
  texts.add(' '.join(sorted(codes)))
 for year in years:
  for text in texts:
   before=old.generation(*key,year,text);after=new.generation(*key,year,text);checked+=1
   if before!=after:
    assert key==('audi','sq7') and after is None and 'G8' in gens[before][2],(key,year,text,before,after)
    changed.append({'year':year,'type':text,'before':before,'after':after})
cases=[(2025,'',0),(2026,'',None),(2026,'4M',0),(2026,'G8',1),(2026,'4M G8',None),(2027,'',None),(2027,'G8',1),(2027,'UNKNOWN',None)]
for year,text,want in cases:assert new.generation('audi','sq7',year,text)==want,(year,text,want)
result={'result':'PASS','generationLookups':checked,'changedSyntheticCases':changed,'targetedCases':len(cases),'otherMakeAndLineRoutingUnchanged':True,'publishedStatisticsRebuildRequired':False,'reason':'Previously published SQ7 G8 bucket was already withheld; make/line populations and published 4M statistics are unchanged.'}
pathlib.Path('analysis/codex/popular-engines-pass/batch-2/match-validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print(json.dumps(result))
