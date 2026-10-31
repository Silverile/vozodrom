"""Remaining structure candidates: linked production evidence, no vehicle-level inputs."""
import importlib.util,concurrent.futures,re,pathlib
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root='analysis/codex/structure-pass-5';pathlib.Path(root).mkdir(exist_ok=True)
previous=e.load('analysis/codex/structure-pass-4/next-queue.json');queue=previous['next']+[dict(make='mahindra',line='cj',fleet=None)]
titles=['McLaren_600LT','McLaren_720S','McLaren_Artura','MG5','Microcar','Nash_Advanced_Six','NSU_6/18_PS','Omoda_5','Pagani_Utopia','Polestar_4','Pontiac_Grand_Prix','Pontiac_Vibe','Proton_e.MAS_7','Ram_700','Roewe_RX5','Spyker_C8','TVR_Griffith_(2017)','Volkswagen_Karmann_Ghia','Voyah_Passion','Voyah_Taishan','Wanderer_W_11','Wey_Gaoshan','BMC_ADO16','Wolseley_Hornet_(Mini)','Wuling_Cortez','Wuling_Hongguang','Wuling_Hongguang_Mini_EV','Wuling_Rongguang','Wuling_Sunshine','Mahindra_Jeep']
def run(item):
 r,title=item;lang='de' if r['make'] in ['nsu','wanderer'] else 'en';u='https://'+lang+'.wikipedia.org/wiki/'+title
 t,c,err=e.fetch(u);facts=[];prose=[];headings={}
 if t is not None:
  for st in t.xpath('//style|//script'):st.drop_tree()
  for x in t.iter():
   tag=x.tag if isinstance(x.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=e.clean(x.text_content())
   if tag=='tr':
    cells=x.xpath('./th|./td');label=e.clean(cells[0].text_content()) if cells else ''
    if re.search('^Production$|Produktionszeitraum|Bauzeitraum|Produzione',label,re.I):facts.append({'heading':' / '.join(headings.values()),'production':e.clean(' '.join(c.text_content() for c in cells[1:]))[:650]})
   if tag=='p':
    text=e.clean(x.text_content())
    if re.search(r'\b(?:18|19|20)\d{2}\b',text) and len(prose)<45:prose.append({'heading':' / '.join(headings.values()),'text':text[:1000]})
 return {**r,'sources':[{'url':u,'canonical':c,'error':err,'facts':facts,'datedProse':prose}]}
e.write(root+'/queue.json',queue);rs=list(concurrent.futures.ThreadPoolExecutor(8).map(run,zip(queue,titles)));e.write(root+'/research.json',rs)
for r in rs:print(r['make']+'/'+r['line'],r['sources'][0]['error'],r['sources'][0]['facts'])
