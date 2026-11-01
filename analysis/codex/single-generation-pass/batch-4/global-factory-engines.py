import json,re,pathlib,importlib.util
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-4');d=e.load(str(root/'engine-research.json'));out=[]
def add(id,gi,name,size,kw,t,raw):
 if len(name)>40 or kw is None:return
 out.append({'id':id,'index':gi,'variant':name,'fuel':'petrol','size':size,'cc':None,'kw':kw,'url':t['url'],'raw':raw,'note':'Documented factory version from the source market. European homologation/output is not inferred. Early gross ratings are not directly comparable with later net ratings.'})
for x in d:
 if x['id']=='chevrolet/corvette':
  for t in x['matrices']:
   m=re.search(r'/Chevrolet_Corvette_\(C([1-4])\)',t['url'])
   if not m or t['heading']!='Engines':continue
   gi=int(m[1])-1
   for r in t['rows']:
    if 'Callaway' in ' '.join(r):continue
    cap=r[4] if gi==2 else r[0];sm=re.search(r'(\d(?:\.\d{1,2})?)\s*L\b',cap)
    if not sm:continue
    size=float(sm[1]);kw=e.power(r[2]);code=r[1] if gi==2 else (re.search(r'\bL[A-Z0-9]{1,3}\b',r[0]).group(0) if re.search(r'\bL[A-Z0-9]{1,3}\b',r[0]) else '')
    name=f'{size:g} '+(code+' ' if code else '')+('R6' if 'I6' in cap or size<4 else 'V8');add(x['id'],gi,name,size,kw,t,{'heading':t['heading'],'row':r})
 if x['id']=='chevrolet/camaro':
  for t in x['matrices']:
   if 'third_generation' not in t['url'] or t['heading']!='Engines':continue
   for r in t['rows']:
    sm=re.search(r'(\d(?:\.\d+)?)\s*L',r[0]);kw=e.power(r[4]);
    if sm:add(x['id'],2,sm[1]+' '+r[3],float(sm[1]),kw,t,{'heading':t['heading'],'row':r})
 if x['id']=='pontiac/firebird':
  for t in x['matrices']:
   if '/wiki/Pontiac_Firebird' not in t['url']:continue
   match=re.match(r'(First|Second|Third) generation .* / Engines$',t['heading'])
   if not match:continue
   gi=['First','Second','Third'].index(match[1])
   for r in t['rows']:
    for cell in r[1:]:
     if re.search(r'none produced|concept|prototype|racing|Callaway',cell,re.I):continue
     sm=re.search(r'(\d(?:\.\d+)?)\s*L\b',cell);cm=re.match(r'([A-Z][A-Z0-9]{1,3})\b',cell);kw=e.power(cell)
     if sm:add(x['id'],gi,sm[1]+' '+(cm.group(1) if cm else 'V8'),float(sm[1]),kw,t,{'heading':t['heading'],'modelYear':r[0],'cell':cell})
e.write(str(root/'global-factory-engines.json'),out);print('Global-source factory rows',len(out))
