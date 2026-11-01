import json,pathlib,importlib.util,concurrent.futures,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass/batch-5')
urls=['https://fr.wikipedia.org/wiki/Avions_Voisin_C'+n for n in ['11','14','16','23','28']]+['https://en.wikipedia.org/wiki/ALFA_24_HP','https://en.wikipedia.org/wiki/Fiat_Grande_Punto','https://de.wikipedia.org/wiki/Adler_9/24_PS','https://de.wikipedia.org/wiki/Borgward_2000','https://de.wikipedia.org/wiki/Borgward_2300','https://en.wikipedia.org/wiki/Honda_Odyssey_(North_America)','https://www.astonmartin.com/en/models/past-models/lagonda','https://media.astonmartin.com/lagonda-series-2/?lang=eng','https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-271-2.bmw-3-20-ps-am-1-4-sedan.html','https://www.alpina-archive.com/?page_id=10','https://www.alpina-archive.com/?page_id=11','https://ru.wikipedia.org/wiki/Соболь_NEXT','https://autozavod.media/rubrics/news/chem-zapomnilsya-2022-god-v-gruppe-gaz/']
def fetch(u):
 t,c,err=e.fetch(u)
 if t is not None:
  for el in t.xpath('//script|//style|//nav|//footer'):el.drop_tree()
 return {'url':u,'error':err,'text':e.clean(t.text_content()) if t is not None else ''}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(fetch,urls));e.write(str(root/'follow-up.json'),r)
for x in r:print(x['url'],x['error'],x['text'][:2000],flush=True)
