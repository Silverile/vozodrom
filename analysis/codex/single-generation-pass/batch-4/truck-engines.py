import json,re,pathlib,importlib.util
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-4');data=e.load(str(root/'engine-research.json'));out=[]
for id in ['chevrolet/silverado','gmc/sierra','chevrolet/suburban']:
 for t in next(x for x in data if x['id']==id)['matrices']:
  if '/wiki/' not in t['url'] or not any('Power' in c for c in t['columns']):continue
  if id=='chevrolet/suburban':
   if not t['heading'].startswith('Ninth generation') or 'Engines' not in t['heading']:continue
   gi=8;ei=1;pi=2;yi=0
  elif 'first_generation' in t['url']:gi=0 if id.startswith('chevrolet') else 1;ei=2;pi=3;yi=1
  elif 'second_generation' in t['url']:gi=1 if id.startswith('chevrolet') else 2;ei=2;pi=3;yi=1
  elif t['heading'].startswith('Third-generation Silverado') and t['heading'].endswith('/ Engines'):gi=2 if id.startswith('chevrolet') else 3;ei=2;pi=3;yi=1
  elif t['heading'].startswith('Fourth-generation Silverado') and t['heading'].endswith('/ Engines'):gi=3 if id.startswith('chevrolet') else 4;ei=2;pi=3;yi=1
  else:continue
  seen=set()
  for r in t['rows']:
   if id!='chevrolet/suburban' and r[0]!='1500':continue
   if re.search('hybrid|eAssist|GMC Yukon|Denali', ' '.join(r),re.I):continue
   sm=re.search(r'(\d(?:\.\d+)?)\s*L\b',r[ei]);kw=e.power(r[pi]);
   if not sm or kw is None:continue
   size=float(sm[1]);fuel='diesel' if re.search('Duramax|Diesel',r[ei],re.I) else 'petrol';key=(size,fuel)
   if key in seen:continue
   seen.add(key);name=re.sub(r'\([^)]*\)','',r[ei]);name=re.sub(r'\bGM\b','',name);name=' '.join(name.split())
   if len(name)>40:continue
   out.append({'id':id,'index':gi,'variant':name,'fuel':fuel,'size':size,'cc':None,'kw':kw,'url':t['url'],'raw':{'heading':t['heading'],'row':r},'note':'Documented factory light-duty configuration. The Silverado generation article explicitly covers the corresponding GMC Sierra; European availability/output is not inferred. Hybrid component ratings and badge-specific special trims excluded.'})
e.write(str(root/'truck-engines.json'),out);print('Reviewed truck/SUV factory candidates',len(out))
