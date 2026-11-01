import importlib.util,re,concurrent.futures
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);urls=['https://en.wikipedia.org/wiki/'+t for t in ['Nissan_Sunny','Lada_Samara','Nissan_Pulsar','Nissan_Bluebird','Nissan_Vanette','Nissan_Maxima','Nissan_Serena','Nissan_Prairie','Mazda_MPV','Mazda_CX-9','Chevrolet_Camaro','Chevrolet_Corvette','Pontiac_Firebird']]
def work(u):
 t,c,err=e.fetch(u);head={};out=[]
 if t is not None:
  for x in t.iter():
   tag=x.tag if isinstance(x.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    lev=int(tag[1]);head={k:v for k,v in head.items() if k<lev};head[lev]=e.clean(x.text_content())
   if tag=='p' and 'kW' in x.text_content():out.append({'heading':' / '.join(head.values()),'text':e.clean(x.text_content())})
 return {'url':u,'paragraphs':out,'error':err}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(work,urls));e.write('analysis/codex/single-generation-pass/batch-4/power-prose.json',r)
for x in r:
 if any(k in x['url'] for k in ['Samara','Sunny','Maxima','Prairie','MPV']):
  print(x['url']);print('\n'.join(p['heading']+': '+p['text'] for p in x['paragraphs'])[:6000])
