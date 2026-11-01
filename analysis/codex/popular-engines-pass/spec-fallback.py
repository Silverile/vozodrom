import importlib.util,pathlib,sys,json
sys.stdout.reconfigure(encoding='utf-8')
s=importlib.util.spec_from_file_location('spec','analysis/codex/spec-site-engines.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
root=pathlib.Path('analysis/codex/popular-engines-pass');rows=p.r.t.load(str(root/'target-candidates.json'));trim=p.r.t.load(str(root/'trim-candidates.json'))['rows'];covered={(x['id'],x['index']) for x in trim};out=[]
for row in rows:
 item={**row,'generationIndex':row['index']};key=(row['make']+'/'+row['line'],row['index'])
 if not row['engines'] and key not in covered and row['status']!='regional-deferred':item=p.research(item,max_models=1,max_generation_pages=10,max_details=5)
 out.append(item);p.r.t.write(str(root/'fallback-candidates.json'),out)
 print(key,item.get('specFallbackStatus'),len(item['engines']),flush=True)
print('DONE',len(out),sum(bool(x['engines']) for x in out),'rateLimited',p.RATE_LIMITED,flush=True)
