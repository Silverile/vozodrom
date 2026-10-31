"""Paced, resumable ordinary wave-3 research; candidates only, no catalogue writes."""
import importlib.util, pathlib, re, time, sys, copy, subprocess, urllib.parse
spec=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
root=next((a[7:] for a in sys.argv if a.startswith('--root=')),'analysis/codex/wave-3/batch-1');pathlib.Path(root).mkdir(parents=True,exist_ok=True)
t=r.t;r.INDEX=t.load('src/data/model-cards-index.json')
ms=importlib.util.spec_from_file_location('spec_site','analysis/codex/spec-site-engines.py');ss=importlib.util.module_from_spec(ms);ms.loader.exec_module(ss);ss.r=r
ss.BRANDS.update({'austin-motor-company':'Austin','bristol-cars':'Bristol','bugatti-automobiles':'Bugatti','automobili-pininfarina':'Pininfarina','avatr-technology':'Avatr','avions-voisin':'Voisin','auto-union':'Auto-Union'})
make_names={x['slug']:x['name'] for x in t.load('src/data/makes-index.json')}
if pathlib.Path(root+'/queue.json').exists():queue=t.load(root+'/queue.json')
else:
 audit=t.load('analysis/codex/catalog-completeness-audit.json');progress=t.load('analysis/codex/wave-3/progress.json') if pathlib.Path('analysis/codex/wave-3/progress.json').exists() else {};visited=set(progress.get('visitedIds',[]));queue={'baselineRevision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'lines':[{'makeSlug':x['makeSlug'],'lineSlug':x['lineSlug'],'fleetN':x['fleetN']} for x in audit['lines'] if not x['fleetN'] and x['makeSlug']+'/'+x['lineSlug'] not in visited][:400]};t.write(root+'/queue.json',queue)
if '--merge' in sys.argv:
 shards=[t.load(root+'/research-shard-'+str(i)+'.json') for i in range(4)]
 assert all(x['complete'] and not x.get('rateLimited') for x in shards)
 rows={l['id']:l for s in shards for l in s['lines']};assert len(rows)==len(queue['lines'])
 t.write(root+'/research.json',{'baselineRevision':queue['baselineRevision'],'complete':True,'rateLimited':False,'lines':[rows[x['makeSlug']+'/'+x['lineSlug']] for x in queue['lines']]});sys.exit(0)
shard_arg=next((a[8:] for a in sys.argv if a.startswith('--shard=')),None)
shard,total=(map(int,shard_arg.split('/')) if shard_arg else (0,1))
outfile=root+('/research-shard-'+str(shard)+'.json' if shard_arg else '/research.json')
prior=t.load(outfile) if pathlib.Path(outfile).exists() else t.load(root+'/research.json') if pathlib.Path(root+'/research.json').exists() else {'lines':[]}
retry='--retry-unproductive' in sys.argv
done={x['id']:x for x in prior['lines'] if not x.get('rateLimited') and (not retry or any(g['changes'] or g['engines'] for g in x.get('generations',[])))};results=[];limited=False

def spans(text):
 years=[int(x) for x in re.findall(r'\b(?:18|19|20)\d{2}\b',text)]
 if not years or len(years)>2 or re.search(r'prototype|concept|pre.?production|planned|expected|scheduled|China|Brazil|India|Japan|Europe|export|USA|Canada|Malaysia|Thailand',text,re.I):return None
 if max(years)>2026 or min(years)<1800:return None
 current=bool(re.search(r'present|current|seit|dosud|současnost',text,re.I))
 if len(years)==1 and not current and not re.fullmatch(r'\s*(?:18|19|20)\d{2}(?:\s*\([^)]*\))?\s*',text):return None
 return [min(years),None if current else max(years)]

def bodies(text):
 out=[]
 for pattern,key in [(r'station wagon|estate|kombi','kombi'),(r'hatchback|schrägheck','hatchback'),(r'sedan|saloon|limousine','sedan'),(r'roadster|convertible|cabriolet|cabrio|spider|barchetta','kabriolet'),(r'coup[eé]|berlinetta','kupe'),(r'\bSUV\b|sport.?utility|geländewagen|crossover','suv'),(r'\bMPV\b|minivan','mpv'),(r'pick.?up','pickup')]:
  if re.search(pattern,text,re.I):out.append(key)
 return out

def observations(tree):
 headings={};boxes={}
 for x in tree.xpath('//style|//script'):x.drop_tree()
 for x in tree.iter():
  tag=x.tag if isinstance(x.tag,str) else ''
  if re.fullmatch('h[2345]',tag):
   level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=t.clean(x.text_content())
  if tag!='tr':continue
  cells=x.xpath('./th|./td')
  if len(cells)<2:continue
  label=t.clean(cells[0].text_content());value=t.clean(' '.join(c.text_content() for c in cells[1:]))
  if not re.fullmatch(r'Production|Produktion|Produktionszeitraum|Bauzeit|Výroba|Body style|Karosserie(?:versionen)?|Power output|Electric motor|Engine|Fuel|Fuel type',label,re.I):continue
  parent=x.xpath('ancestor::table')
  if not parent:continue
  table=parent[-1];key=tree.getroottree().getpath(table)
  box=boxes.setdefault(key,{'heading':' / '.join(headings.values()),'fields':{}});box['fields'][label]=value
 return list(boxes.values())

def engine_from_box(box,url,gi,g,title):
 f=box['fields'];motor=f.get('Electric motor','');power=f.get('Power output','')
 values=list(dict.fromkeys(float(v.replace(',','.')) for v in re.findall(r'(\d+(?:[.,]\d+)?)\s*kW\b',power)))
 if len(values)!=1 or not motor or f.get('Engine') or re.search(r'\b(?:hybrid|PHEV|EREV|range.extender|prototype|concept)\b',title+' '+motor+' '+power,re.I):return None
 n=values[0];period=spans(f.get('Production',''))
 if not period or period[0]!=g.get('from'):return None
 return {'fuel':'electric','variant':'Elektromotor','displacementCc':None,'displacementLitresNominal':None,'powerKwMin':n,'powerKwMax':n,'availablePowerKw':[n],'powerRangeCoverage':'documented-versions-only','sources':[url],'sourceScope':{'articleTitle':title,'tableSection':box['heading'],'powerText':power,'powerHeader':'Power output','electricMotorText':motor,'generationEvidence':{'method':'single-generation-production','anchor':title,'fromYear':period[0],'toYear':period[1],'generationIndex':gi}}}

def combustion_from_box(box,url,gi,g,title):
 f=box['fields'];text=f.get('Engine','');power=f.get('Power output','');period=spans(f.get('Production',''))
 values=list(dict.fromkeys(float(v.replace(',','.')) for v in re.findall(r'(\d+(?:[.,]\d+)?)\s*kW\b',power)))
 if not text or f.get('Electric motor') or not period or period[0]!=g.get('from') or len(values)!=1 or re.search(r'hybrid|PHEV|EREV|prototype|concept|racing',title+' '+power,re.I):return None
 text=re.sub(r'(?<=\d),(?=\d{3}\b)','',text)
 ccs=list(dict.fromkeys(int(v) for v in re.findall(r'(\d{3,5})\s*(?:cc|cm3|cm³)\b',text)))
 litres=list(dict.fromkeys(float(v.replace(',','.')) for v in re.findall(r'(\d[.,]\d{1,2})\s*(?:L\b|litre|liter)',text)))
 if len(ccs)>1 or len(litres)>1 or not ccs and not litres:return None
 cc=ccs[0] if ccs else None;size=litres[0] if litres else None
 fuel=t.fuel(' '.join([text,f.get('Fuel',''),f.get('Fuel type','')]),'');fuel_proof={'kind':'same-infobox','text':text+' '+f.get('Fuel','')+' '+f.get('Fuel type','')};sources=[url]
 if fuel not in ['petrol','diesel']:
  known=[(i,v) for i,v in enumerate(g.get('trims',[])) if v.get('engine',{}).get('fuel') in ['petrol','diesel'] and (cc and v['engine'].get('displacementCc')==cc or size and v['engine'].get('displacementCc') and abs(v['engine']['displacementCc']/1000-size)<0.06)]
  fuels={v['engine']['fuel'] for i,v in known}
  if len(fuels)!=1:return None
  fuel=next(iter(fuels));i,v=known[0];fuel_proof={'kind':'existing-technical-version','index':i,'fuel':fuel,'displacementCc':v['engine'].get('displacementCc'),'sources':v.get('sources',[])};sources=list(dict.fromkeys([url,*v.get('sources',[])]))
 n=values[0];name=(str(size) if size else str(cc)+' cm3')+' '+('benzin' if fuel=='petrol' else 'diesel')
 return {'fuel':fuel,'variant':name,'displacementCc':cc,'displacementLitresNominal':size,'powerKwMin':n,'powerKwMax':n,'availablePowerKw':[n],'powerRangeCoverage':'documented-versions-only','sources':sources,'sourceScope':{'articleTitle':title,'tableSection':box['heading'],'powerText':power,'powerHeader':'Power output','engineText':text,'fuelEvidence':fuel_proof,'generationEvidence':{'method':'single-generation-production','anchor':title,'fromYear':period[0],'toYear':period[1],'generationIndex':gi}}}

for row_index,row in enumerate(queue['lines']):
 if row_index%total!=shard:continue
 make,line=row['makeSlug'],row['lineSlug'];id=make+'/'+line
 if id in done:results.append(done[id]);continue
 if limited:results.append({'id':id,'rateLimited':True,'attempts':[],'generations':[],'reason':'Deferred after HTTP 429, not absence of source.'});continue
 card=copy.deepcopy(r.INDEX[make][line]);attempts=[];pages={};gens=[]
 for gi,g in enumerate(card['generations']):
  urls=list(dict.fromkeys([*g.get('sources',[]),*card.get('sources',[])]))
  wiki=[u for u in urls if re.match(r'https://(?:en|de|cs)\.wikipedia.org/',u)]
  brands={'abarth':'Abarth','ac-cars':'AC','acura':'Acura','adler':'Adler','aiways':'Aiways','aixam':'Aixam','alfa-romeo':'Alfa Romeo','alpina':'Alpina','alpine':'Alpine','amc':'AMC','arcfox':'Arcfox','ariel':'Ariel','aro':'ARO','artega':'Artega','aston-martin':'Aston Martin','audi':'Audi'}
  brands.update({'austin-motor-company':'Austin','bristol-cars':'Bristol','bugatti-automobiles':'Bugatti','automobili-pininfarina':'Pininfarina','avatr-technology':'Avatr','auto-union':'Auto Union'})
  model=re.sub(r'\s*\(\d{4}\)\s*$','',card['name']);brand=brands.get(make,make_names.get(make,make.replace('-',' ').title()));title=model if model.lower().startswith(brand.lower()+' ') else brand+' '+model
  dedicated='https://en.wikipedia.org/wiki/'+urllib.parse.quote(title.replace(' ','_'),safe='_()/,-')
  proposed=['https://de.wikipedia.org/wiki/Alpina_'+card['name'].replace(' ','_')] if make=='alpina' else []
  leads=list(dict.fromkeys([*proposed,dedicated,*wiki[:2]]))[:3];selected=None
  for url in leads:
   if url not in t.cache:time.sleep(1.5)
   tree,canonical,error=t.fetch(url);a={'url':url,'canonical':canonical,'error':error};attempts.append(a)
   if error and '429' in error:limited=True;break
   if tree is None:continue
   if not r.owns_article(tree,card,make,gi):a['error']='Model ownership not established from title';continue
   title=t.clean(tree.xpath('string(//h1)'));boxes=observations(tree);a['title']=title;a['productionBoxes']=len([b for b in boxes if 'Production' in b['fields'] or 'Produktionszeitraum' in b['fields']]);pages[canonical]={'url':canonical,'title':title,'boxes':boxes};selected=(canonical,tree,title,boxes);break
  item={'index':gi,'before':{'from':g.get('from'),'to':g.get('to'),'bodyTypes':g.get('bodyTypes',[])},'changes':{},'engines':[]}
  if selected:
   url,tree,title,boxes=selected;production=[b for b in boxes if any(k in b['fields'] for k in ['Production','Produktion','Produktionszeitraum','Bauzeit','Výroba'])]
   candidates=[]
   for b in production:
    value=next((b['fields'][k] for k in ['Production','Produktion','Produktionszeitraum','Bauzeit','Výroba'] if k in b['fields']),None);period=spans(value)
    if not period:continue
    single=len(card['generations'])==1 and len(production)==1
    code=set(re.findall(r'\b[A-Z]+\d+[A-Z0-9]*\b',t.fold(g.get('code') or '')));bycode=bool(code&t.token(b['heading']))
    if len(card['generations'])>1 and t.fold(b['heading']) in ['CONTENTS','INHALT','INHALTSVERZEICHNIS',''] and not code&t.token(title):continue
    bydate=g.get('from') is not None and period[0]==g['from'] and sum(x.get('from')==period[0] for x in card['generations'])==1
    if not (single or bycode or bydate):continue
    if single and g.get('from') is not None and abs(period[0]-g['from'])>1:continue
    if g.get('dateBasis')=='announcement' or re.search(r'prototype|concept|prototyp|koncept|před.?sériov|cancelled',str(g.get('name',''))+' '+str(g.get('specificationScope',{})),re.I):continue
    if g.get('to') is not None and period[1] is not None and abs(period[1]-g['to'])>1:continue
    candidates.append((b,period,value))
   if len(candidates)==1:
    b,period,text=candidates[0];item['dateEvidence']={'url':url,'title':title,'heading':b['heading'],'productionText':text,'period':period}
    proposed=[g.get('from') if g.get('from') is not None else period[0],g.get('to') if g.get('to') is not None else period[1]]
    proto=[t.clean(p.text_content()) for p in tree.xpath('//p') if re.search(r'prototype|concept|pre.?production',p.text_content(),re.I) and str(period[0]) in p.text_content()]
    if proto:item['prototypeStartCaution']={'year':period[0],'reason':'Prototype/concept mentioned in source paragraph for this year; automatic start withheld.'};proposed[0]=g.get('from')
    if proposed[0] is not None and [g.get('from'),g.get('to')]!=proposed:item['changes']['dates']=proposed;g['from'],g['to']=proposed
    body=next((b['fields'][k] for k in ['Body style','Karosserie','Karosserieversionen'] if k in b['fields']),None)
    if body and not g.get('bodyTypes') and bodies(body):item['changes']['bodyTypes']=bodies(body);item['bodyEvidence']={'url':url,'text':body};g['bodyTypes']=bodies(body)
   r.INDEX[make][line]=card
   if not g.get('engines') and g.get('from') and g.get('dateBasis')!='announcement':
    researched=r.research({'make':make,'line':line,'generationIndex':gi,'from':g.get('from'),'to':g.get('to'),'sources':[url]},[url],phase='ordinary-wave-3')
    item['engines']=researched['engines'];item['engineAttempts']=researched['attempts']
    if not item['engines'] and len(card['generations'])==1 and len(production)==1:
     e=engine_from_box(production[0],url,gi,g,title)
     if not e:e=combustion_from_box(production[0],url,gi,g,title)
     if e:item['engines']=[e]
   item['source']=url
  if not limited and not item['engines'] and not g.get('engines') and g.get('from') and g.get('dateBasis')!='announcement':
   r.INDEX[make][line]=card
   fallback=ss.research({'make':make,'line':line,'generationIndex':gi,'from':g.get('from'),'to':g.get('to'),'engines':[],'attempts':[]},max_models=1,max_generation_pages=2,max_details=1)
   item['engines']=fallback['engines'];item['specAttempts']=fallback['attempts'];item['specFallbackStatus']=fallback.get('specFallbackStatus');item['specReason']=fallback.get('reason')
  gens.append(item)
 result={'id':id,'name':card['name'],'attempts':attempts,'pages':list(pages.values()),'generations':gens,'rateLimited':limited};results.append(result)
 pending=[v for k,v in done.items() if k not in {x['id'] for x in results} and any(i%total==shard and q['makeSlug']+'/'+q['lineSlug']==k for i,q in enumerate(queue['lines']))]
 t.write(outfile,{'baselineRevision':queue['baselineRevision'],'complete':False,'lines':results+pending});print(id,'dates',sum('dates' in g['changes'] for g in gens),'bodies',sum('bodyTypes' in g['changes'] for g in gens),'engines',sum(len(g['engines']) for g in gens),flush=True)
t.write(outfile,{'baselineRevision':queue['baselineRevision'],'complete':True,'rateLimited':limited,'lines':results})
