"""Regression: generic model words cannot erase source row-year contradictions."""
import importlib.util,json,pathlib,sys,copy
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
s=importlib.util.spec_from_file_location('h','analysis/codex/popular-engines-pass/table-parser.py');h=importlib.util.module_from_spec(s);s.loader.exec_module(h);h.install(e)
idx=json.loads(pathlib.Path('src/data/model-cards-index.json').read_text(encoding='utf8'))
card=idx['mitsubishi']['pajero-sport'];card={**card,'name':card['name']}
row={'variant':'2.5 DI-D','sources':['https://de.wikipedia.org/wiki/Mitsubishi_Pajero_Sport'],'sourceScope':{'variantYears':'2008–2019'}}
answer=e.generation_attribution(card,'Mitsubishi Pajero Sport (1996–2026)',['KH0 (2008–2019)'],row,[(1996,2026)])
assert answer is None or answer[0]!=0,answer
c=idx['opel']['corsa'];answer2=e.generation_attribution(c,'Opel Corsa B',[],{'sources':['https://de.wikipedia.org/wiki/Opel_Corsa_B'],'sourceScope':{}},[])
assert answer2 is not None and c['generations'][answer2[0]]['code']=='B',answer2
bad=[];n=0
for make,lines in idx.items():
 for line,c in lines.items():
  for i,g in enumerate(c['generations']):
   for engine in g.get('engines') or []:
    import re
    n+=1;years=[int(x) for x in re.findall(r'\b(?:19|20)\d{2}\b',str(engine.get('sourceScope',{}).get('variantYears','')))]
    if years and(max(years)<g['from']or min(years)>(g.get('to')or 2026)):bad.append((make,line,i,engine['variant']))
assert not bad,bad
result={'result':'PASS','genericModelWordDoesNotForceFirstGeneration':True,'explicitChassisStillRecognized':True,'engineRowsAudited':n,'rawDateNonoverlaps':0}
pathlib.Path('analysis/codex/popular-engines-pass/batch-2/parser-validation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8');print(result)
