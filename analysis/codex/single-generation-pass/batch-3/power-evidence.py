import json,pathlib,importlib.util,re,concurrent.futures
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-3');plan=e.load(str(root/'plan.json'))
urls=list(dict.fromkeys(g['url'] for p in plan if p['action']=='split' for g in p['generations']))
urls += ['https://de.wikipedia.org/wiki/'+t for t in ['Nissan_Patrol','Nissan_Pathfinder','Opel_Tigra','Opel_Tigra_TwinTop','Opel_Senator','Mazda_CX-9','Mazda_MPV','Mazda_BT-50','Chevrolet_Camaro','Chevrolet_Corvette','Pontiac_Firebird','Fiat_Freemont']]
def work(url):
 t,c,err=e.fetch(url);out=[];tables=[];head={}
 if t is not None:
  for x in t.xpath('//style|//script'):x.drop_tree()
  for x in t.iter():
   tag=x.tag if isinstance(x.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    level=int(tag[1]);head={k:v for k,v in head.items() if k<level};head[level]=e.clean(x.text_content())
   txt=e.clean(x.text_content()) if tag in ['p','table'] else ''
   if tag=='p' and 'kW' in txt:out.append({'heading':' / '.join(head.values()),'text':txt})
   if tag=='table' and 'kW' in txt and len(txt)<26000 and not x.xpath('ancestor::table'):tables.append({'heading':' / '.join(head.values()),'text':txt})
 return {'url':url,'error':err,'paragraphs':out,'tables':tables}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(work,urls));e.write(str(root/'power-evidence.json'),r)
for x in r:
 if '/en.' in x['url'] and ('Camaro_' in x['url'] or 'Corvette_' in x['url']):print(x['url'].split('/')[-1], '\n'.join(p['text'][:600] for p in x['paragraphs'][:3]), 'TABLES',len(x['tables']))
