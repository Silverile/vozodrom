import importlib.util,pathlib,sys,re,urllib.parse
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('spec','analysis/codex/spec-site-engines.py');spec=importlib.util.module_from_spec(s);s.loader.exec_module(spec);e=spec.r.t
root=pathlib.Path('analysis/codex/popular-engines-pass/batch-4');q=e.load(str(root/'default-candidates.json'));covered={(r['id'],r['index']) for r in e.load(str(root/'trim-candidates.json'))['rows']}
links=spec.links;active=[None]
def ordered(tree):
 result=links(tree)
 if active[0]:
  r=active[0];g=spec.r.INDEX[r['make']][r['line']]['generations'][r['index']];wanted=e.codes(g)&set('I II III IV V VI VII VIII IX X XI XII'.split())
  result.sort(key=lambda pair:-len(wanted&e.token(urllib.parse.unquote(pair[0].rsplit('/',1)[-1]))))
 return result
spec.links=ordered;out=[]
for r in q:
 active[0]=r
 if not r['engines'] and (r['make']+'/'+r['line'],r['index']) not in covered:
  r=spec.research({**r,'generationIndex':r['index']},max_models=2,max_generation_pages=40,max_details=4)
 out.append(r);e.write(str(root/'spec-candidates.json'),out);print((r['make']+'/'+r['line'],r['index']),r.get('specFallbackStatus'),len(r['engines']),flush=True)
print('DONE',len(out),sum(len(x['engines']) for x in out),'rateLimited',spec.RATE_LIMITED,flush=True)
