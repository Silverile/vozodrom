import importlib.util,concurrent.futures,pathlib,json,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass/batch-2');plan=e.load(str(root/'plan.json'))
def work(item):
 card={'name':item['line'],'generations':item['generations']};out=[]
 for url in dict.fromkeys(g['url'] for g in item['generations']):
  t,c,err=e.fetch(url);rows=[];facts=[];prose=[]
  if t is not None:
   rows=[{'generation':i,'engine':r} for i,r in e.page_rows(t,url,card)]
   for tr in t.xpath('//table[contains(@class,"infobox")]//tr'):
    txt=e.clean(tr.text_content())
    if re.search('Production|Produktionszeitraum|Body style|Karosserieversionen',txt):facts.append(txt)
   for p in t.xpath('//p'):
    txt=e.clean(p.text_content())
    if re.search('Produktion|production|Facelift|Modellpflege|prototype|Prototyp',txt,re.I):prose.append(txt)
  out.append({'url':url,'error':err,'facts':facts,'prose':prose,'rows':rows})
 return {**item,'sources':out}
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=5).map(work,plan));e.write(str(root/'engines.json'),results)
for r in results:print(r['make']+'/'+r['line'],[(s['error'],len(s['rows'])) for s in r['sources']],flush=True)
