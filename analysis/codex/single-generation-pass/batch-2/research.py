import importlib.util,concurrent.futures,pathlib,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass/batch-2')
titles=['BMW_E84','BMW_F48','BMW_U11','BMW_E71','BMW_F16','BMW_G06','BMW_E31','BMW_G15','Opel_Vivaro','Opel_Movano','Opel_Combo','Opel_Omega','Citroën_Jumpy','Lada_2101','Peugeot_205','Fiat_Freemont','Lada_Niva']
def work(title):
 url='https://de.wikipedia.org/wiki/'+title;t,c,err=e.fetch(url);facts=[];prose=[];tables=[]
 if t is not None:
  for tr in t.xpath('//table[contains(@class,"infobox")]//tr'):
   text=e.clean(tr.text_content())
   if re.search(r'Produktionszeitraum|Karosserieversionen|Verkaufsbezeichnung',text):facts.append(text)
  for p in t.xpath('//p'):
   txt=e.clean(p.text_content())
   if re.search(r'\b(?:19|20)\d\d\b',txt):prose.append(txt)
  for i,tb in enumerate(t.xpath('//table')):
   txt=e.clean(tb.text_content())
   if 'kW' in txt and len(txt)<35000:tables.append({'index':i+1,'text':txt})
 return {'title':title,'url':url,'error':err,'facts':facts,'prose':prose,'tables':tables}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=5).map(work,titles));e.write(str(root/'research.json'),r)
for x in r:print(x['title'],x['error'],x['facts'],flush=True)
