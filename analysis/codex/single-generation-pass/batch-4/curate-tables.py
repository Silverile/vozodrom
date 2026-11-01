import json,pathlib,re,importlib.util
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-4');data=e.load(str(root/'engine-research.json'));out=[]
# Manually reviewed table/generation/fuel profiles; raw cells are retained with each row.
profiles=[('nissan/patrol','4W60',0,'petrol'),('nissan/patrol','Serie 60/61',1,'petrol'),('nissan/patrol','Patrol 160',2,None),('nissan/patrol','Y60',3,None),('nissan/patrol','Y61',4,None),('opel/movano','Movano B',1,'diesel'),('opel/senator','Senator B',1,'petrol'),('nissan/maxima','A32',3,'petrol'),('nissan/serena','C26',3,'petrol'),('nissan/sunny','Traveller Y10',9,None),('nissan/tiida','C11',0,None),('nissan/200-sx','S10',0,'petrol'),('nissan/200-sx','S110',1,'petrol')]
for id,word,gi,default in profiles:
 for t in next(x for x in data if x['id']==id)['matrices']:
  if '//de.' not in t['url'] or word not in t['heading'] or len(t['columns'])<3:continue
  rows=t['rows'];pi=next((r for r in rows if re.search(r'leistung',r[0],re.I)),None);cc=next((r for r in rows if 'hubraum' in r[0].lower()),None)
  if not pi or not cc:continue
  names=next((r for r in rows[:4] if re.match(r'Modell$|Nissan Patrol$|Nissan Tiida$|Datsun Silvia$|Nissan Silvia$',r[0])),t['columns'])
  codes=next((r for r in rows if re.search('Motorkenncode|Motorkennbuchstaben|Motortyp',r[0],re.I)),None)
  fuelrow=next((r for r in rows if re.search('Motortyp|Motorbauart|Kraftstoff',r[0],re.I)),None)
  for j in range(1,len(t['columns'])):
   variant=e.clean(names[j]);powercell=pi[j];kw=e.power(powercell,pi[0])
   if kw is None or re.search('Japan|USA|4.0 i 24V',variant,re.I):continue
   if not re.search(r'kW\b',powercell,re.I) and not re.search(r'\d+(?:[.,]\d+)?\s*/\s*\d{1,3}\b',powercell):continue
   cap=e.displacement(cc[j],cc[0]);fuel=e.fuel(variant+' '+(fuelrow[j] if fuelrow else ''),'') or default
   if fuel is None:
    fuel='diesel' if re.search(r'\bD\b|\bTD\b|\bDi\b|\bdCi\b',variant) else 'petrol'
   if not cap or not 400<=cap<=10000:continue
   # Engine-code row refines Patrol's repeated displacement labels.
   if id=='nissan/patrol' and codes and re.fullmatch('[A-Z0-9]+',codes[j]):variant=re.sub(r'\(nicht in Deutschland\)','',variant).strip()+' '+codes[j]
   variant=e.variant_name(variant)
   if not variant or variant.isdigit():continue
   out.append({'id':id,'index':gi,'variant':variant,'fuel':fuel,'cc':cap,'size':round(cap/1000,1),'kw':kw,'url':t['url'],'raw':{'heading':t['heading'],'variant':names[j],'power':powercell,'powerHeader':pi[0],'displacement':cc[j]},'note':'Selected documented factory engine; source-market scope applies. Versions explicitly absent in Germany are not presented as German-market offers.'})
e.write(str(root/'curated-engines.json'),out)
for x in out:print(x['id'],x['index'],x['variant'],x['cc'],x['kw'],x['fuel'])
