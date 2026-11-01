import pathlib,importlib.util,concurrent.futures,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass/batch-5')
urls=['https://en.wikipedia.org/wiki/'+t for t in ['Honda_Odyssey_(North_America)','Honda_Odyssey_(international)','GMC_Yukon','Chevrolet_Express','Chevrolet_Astro','Nissan_300ZX','Nissan_Cube','Nissan_Skyline','Nissan_Silvia']]+['https://de.wikipedia.org/wiki/'+t for t in ['Audi_Coupé_B2','Audi_Coupé_B3','Audi_Sport_quattro','Mazda_929','Mazda_Sentia','Nissan_300ZX','Nissan_Cube','Nissan_Skyline','Honda_Odyssey','Honda_Pilot','Fiat_Punto_(Typ_199)']]+['https://fr.wikipedia.org/wiki/Alpina_(automobile)','https://fr.wikipedia.org/wiki/Avions_Voisin_C23','https://de.wikipedia.org/wiki/Voisin_C_23','https://astonmartins.com/car/am-lagonda-series-2-v540-and-v580/','https://astonmartins.com/car/v8-lagonda-series-1/']
def fetch(u):
 t,c,err=e.fetch(u)
 if t is not None:
  for el in t.xpath('//script|//style|//nav|//footer'):el.drop_tree()
 return {'url':u,'error':err,'text':e.clean(t.text_content()) if t is not None else ''}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(fetch,urls));e.write(str(root/'extra-facts.json'),r)
for x in r:
 print('\n'+x['url']+' '+str(x['error']),flush=True)
 print('\n'.join(re.findall(r'.{0,110}\bkW\b.{0,100}',x['text'])),flush=True)
