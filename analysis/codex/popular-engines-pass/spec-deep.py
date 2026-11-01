"""Visit older generation links that the first bounded discovery pass did not reach."""
import importlib.util,pathlib,sys,re,urllib.parse
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('spec','analysis/codex/spec-site-engines.py');spec=importlib.util.module_from_spec(s);s.loader.exec_module(spec);e=spec.r.t
root=pathlib.Path('analysis/codex/popular-engines-pass');q=e.load(str(root/'fallback-candidates.json'));covered={(r['id'],r['index']) for r in e.load(str(root/'trim-candidates.json'))['rows']}
for file in ['structured-candidates.json','default-candidates.json']:
 for r in e.load(str(root/file)):
  if r['engines']:covered.add((r['make']+'/'+r['line'],r['index']))
# Preserve the original strict production/model/detail proof. Only change discovery order.
links=spec.links
active=[None]
def ordered(tree):
 result=links(tree)
 if active[0]:
  g=spec.r.INDEX[active[0]['make']][active[0]['line']]['generations'][active[0]['index']]
  wanted=e.codes(g)&set('I II III IV V VI VII VIII IX X XI XII'.split())
  result.sort(key=lambda pair: -len(wanted&e.token(urllib.parse.unquote(pair[0].rsplit('/',1)[-1]))))
 return result
spec.links=ordered
out=[]
for r in q:
 active[0]=r
 if not r['engines'] and r['status']!='regional-deferred' and (r['make']+'/'+r['line'],r['index']) not in covered:
  r=spec.research(r,max_models=2,max_generation_pages=60,max_details=4)
 out.append(r);e.write(str(root/'deep-candidates.json'),out);print((r['make']+'/'+r['line'],r['index']),r.get('specFallbackStatus'),len(r['engines']),flush=True)
print('DONE',len(out),sum(len(x['engines']) for x in out),'rateLimited',spec.RATE_LIMITED,flush=True)
