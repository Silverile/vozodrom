"""Regression scope and before/after synthetic badges; never reads raw vehicles."""
import importlib.util,json,pathlib,runpy,subprocess,sys,types
root=pathlib.Path('analysis/codex/badge-routing');root.mkdir(exist_ok=True)
sys.path.insert(0,'scripts/stats')
from match import Matcher,BADGE_MAKES
baseline=types.ModuleType('baseline_match');baseline.__file__=str(pathlib.Path('scripts/stats/match.py').resolve())
source=subprocess.check_output(['git','show','00206d5:scripts/stats/match.py'],text=True,encoding='utf8')
exec(compile(source,baseline.__file__,'exec'),baseline.__dict__)
old=baseline.Matcher();new=Matcher();untouched=0;lookups=0
assert old.make_by_key==new.make_by_key
assert old.make_names==new.make_names
for make in sorted(set(old.lines)|set(new.lines)):
    if make in BADGE_MAKES:continue
    assert old.lines.get(make)==new.lines.get(make),make
    assert {k:v for k,v in old.gens.items() if k[0]==make}=={k:v for k,v in new.gens.items() if k[0]==make},make
    for name,slug in set(old.lines.get(make,[])):
        a,b=old.years[(make,slug)]
        for year in {None,a,(a-1) if a else 2000,b,(b+1) if b else 2026}:
            assert old.line(make,name,year)==new.line(make,name,year),(make,name,year)
            lookups+=1
    untouched+=1
data=runpy.run_path('scripts/stats/test-badge-routing.py')
cases=[dict(make=m,badge=text,year=year,before=old.line(m,text,year),after=new.line(m,text,year),expected=want) for m,text,year,want in data['cases']]
result={'result':'PASS','baseline':'00206d5','affectedMakes':sorted(BADGE_MAKES),'unaffectedMakeMatchersIdentical':untouched,'unaffectedSyntheticLookups':lookups,'badgeCases':len(cases),'changedSyntheticCases':sum(c['before']!=c['after'] for c in cases),'cases':cases,'generationTieCases':[{'make':'bmw','line':'rada-3','year':2004,'type':'E46','before':old.generation('bmw','rada-3',2004,'E46'),'after':new.generation('bmw','rada-3',2004,'E46')}]}
(root/'regression.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({k:v for k,v in result.items() if k not in ('cases','generationTieCases')}))
