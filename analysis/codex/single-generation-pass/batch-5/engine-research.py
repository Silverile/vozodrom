import pathlib,importlib.util,re,json,concurrent.futures,io
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-5');idx=e.load('src/data/model-cards-index.json');ids=[p['make']+'/'+p['line'] for p in e.load(str(root/'plan.json')) if p['action']=='split' or any(q['make']==p['make'] and q['line']==p['line'] and q['fleet']>0 for q in e.load(str(root/'selection.json'))) or p['make'] in ['abarth','audi','alfa-romeo','alpina','borgward']]
orig=e.engine
def engine(*args,**kw):
 r=orig(*args,**kw)
 if r:r['sourceScope'].update({'powerCell':e.clean(args[1]),'powerHeader':args[8] if len(args)>8 else kw.get('header',''),'displacementCell':e.clean(args[2])})
 return r
e.engine=engine
extra={'929':['Mazda_929'],'silvia':['Nissan_Silvia'],'odyssey':['Honda_Odyssey_(international)','Honda_Odyssey_(North_America)'],'pilot':['Honda_Pilot'],'cube':['Nissan_Cube'],'300-zx':['Nissan_300ZX'],'coupe':['Audi_Coupé'],'astro':['Chevrolet_Astro'],'express':['Chevrolet_Express'],'savana':['Chevrolet_Express'],'yukon':['Chevrolet_Tahoe'],'skyline':['Nissan_Skyline'],'500':['Fiat_500_(2007)'],'sunny':['Nissan_Sunny','Nissan_Pulsar'],'bluebird':['Nissan_Bluebird'],'pulsar':['Nissan_Pulsar'],'tiida':['Nissan_Tiida'],'200-sx':['Nissan_200SX'],'maxima':['Nissan_Maxima'],'suburban':['Chevrolet_Suburban'],'silverado':['Chevrolet_Silverado'],'sierra':['Chevrolet_Silverado'],'tahoe':['Chevrolet_Tahoe'],'serena':['Nissan_Serena'],'prairie':['Nissan_Prairie'],'nexia':['Daewoo_Nexia'],'samara':['Lada_Samara'],'gs':['Citroën_GS']}
def work(id):
 m,l=id.split('/');card=idx[m][l];urls=list(dict.fromkeys(e.wiki_urls(card)+['https://de.wikipedia.org/wiki/'+x for x in extra.get(l,[])]));out=[];mat=[]
 for url in urls:
  t,ca,err=e.fetch(url)
  if t is None:continue
  out.extend({'generation':i,'engine':r} for i,r in e.page_rows(t,url,card));head={}
  for el in t.iter():
   tag=el.tag if isinstance(el.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    lev=int(tag[1]);head={k:v for k,v in head.items() if k<lev};head[lev]=e.clean(el.text_content())
   if tag!='table' or el.xpath('ancestor::table') or 'kW' not in el.text_content() or len(el.text_content())>65000:continue
   try:
    dfs=e.pd.read_html(io.StringIO(e.lxml.html.tostring(el,encoding='unicode')),flavor='lxml');df=dfs[0].fillna('');matrix=[[e.clean(v) for v in row] for row in df.values.tolist()];cols=[' '.join(e.clean(v) for v in c) if isinstance(c,tuple) else e.clean(c) for c in df.columns];mat.append({'url':url,'heading':' / '.join(head.values()),'columns':cols,'rows':matrix})
   except Exception:pass
 return {'id':id,'rows':out,'matrices':mat}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=7).map(work,ids));e.write(str(root/'engine-research.json'),r)
for x in r:print(x['id'],len(x['rows']),len(x['matrices']),flush=True)
