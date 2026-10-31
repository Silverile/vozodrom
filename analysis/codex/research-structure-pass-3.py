import importlib.util,concurrent.futures,re,json
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
queue=e.load('analysis/codex/structure-pass-3/queue.json');index=e.load('src/data/model-cards-index.json')
titles=['Jeep_Gladiator_(SJ)','Audi_RS_Q3','Audi_RS_4','Kia_Clarus','Kia_Seltos','Great_Wall_Wingle','Kia_EV5','Infiniti_G','Microcar','Audi_TT','Daihatsu_Rocky','Aston_Martin_Vantage_(2005)','Dodge_Magnum','DS_3','Caterham_7','BAIC_BJ30','Fiat-Abarth_750','Fiat_850','Acura_Integra','Adler_(cars)','Alfa_Romeo_20-30_HP','Alpina_B4','Alpina_B5','Alpina_B7','Arcfox_Alpha_T5','Arcfox_Kaola','Ariel_Atom','Ariel_Nomad','BAC_Mono','BAIC_BJ40','Bentley_Batur','Bentley_3%C2%BD_Litre','Bertone_Freeclimber',None,None,None,'Chery_Fulwin_(1999)','Daihatsu_Copen','Daimler_Sovereign','Delage_D6','Delage_D8','Delage_CO','DKW_Junior','DKW_F2','Dodge_Brothers','Dodge_Coronet','Dodge_Custom','Dodge_Ramcharger','Donkervoort_D8','Donkervoort_S8']
def run(item):
 r,title=item;card=index[r['make']][r['line']];urls=['https://en.wikipedia.org/wiki/'+title] if title else card['sources'][:1];out=[]
 for u in urls:
  t,c,err=e.fetch(u);facts=[];headings={}
  if t is not None:
   for x in t.iter():
    tag=x.tag if isinstance(x.tag,str) else ''
    if re.fullmatch('h[2345]',tag):
     level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=e.clean(x.text_content())
    if tag!='table':continue
    for tr in x.xpath('./tbody/tr|./tr'):
     label=e.clean(tr.xpath('string(th[1])'))
     if re.search('^Production$|Produktionszeitraum|Bauzeitraum',label,re.I):
      for st in tr.xpath('.//style'):st.drop_tree()
      facts.append({'heading':' / '.join(headings.values()),'production':e.clean(tr.xpath('string(td[1])'))[:500]})
  out.append({'url':u,'canonical':c,'error':err,'facts':facts})
 return {**r,'sources':out}
rs=list(concurrent.futures.ThreadPoolExecutor(8).map(run,zip(queue,titles)));e.write('analysis/codex/structure-pass-3/research.json',rs)
for r in rs:print(json.dumps(r,ensure_ascii=False))
