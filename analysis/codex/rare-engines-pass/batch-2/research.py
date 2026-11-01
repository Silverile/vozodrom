"""Normalize HTML text boundaries before reading explicitly scoped engine tables."""
import pathlib,importlib.util,sys,time,threading,concurrent.futures
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('second','analysis/codex/second-source-engines.py');second=importlib.util.module_from_spec(s);s.loader.exec_module(second);e=second.t
s=importlib.util.spec_from_file_location('helper','analysis/codex/popular-engines-pass/table-parser.py');h=importlib.util.module_from_spec(s);s.loader.exec_module(h);h.install(e)
root=pathlib.Path('analysis/codex/rare-engines-pass/batch-2');index=e.load('src/data/model-cards-index.json');q=e.load(str(root/'selection.json'))
regional={(r['make'],r['line'],r['index']) for r in e.load(str(root/'target-candidates.json')) if r['status']=='regional-deferred'}
parse=e.parse_table
def guarded(table,context,url,num):
 text=e.fold(table.text_content())
 if any(x in text for x in ['HYBRID','SYSTEMLEISTUNG','SYSTEM OUTPUT','COMBINED POWER','MHEV','PHEV']):return []
 if 'ELEKTROMOTOR' in text and any(x in text for x in ['OTTOMOTOR','DIESELMOTOR','VERBRENNUNGSMOTOR']):return []
 return parse(table,context,url,num)
e.parse_table=guarded
second.table_rows=guarded
fetch=e.fetch;lock=threading.Lock();last=[0]
def polite(url):
 if url in e.cache:return e.cache[url]
 with lock:
  if url in e.cache:return e.cache[url]
  delay=.6-(time.monotonic()-last[0])
  if delay>0:time.sleep(delay)
  result=fetch(url);last[0]=time.monotonic()
  if result[0] is not None:
   # text_content joins <br> boundaries as "LeistungkW". Preserve their spaces.
   for el in result[0].iter():
    if el.tail is not None:el.tail=' '+el.tail
    if el.tag=='br':el.tail=' '+(el.tail or '')
   for cell in result[0].xpath('//th'):
    if e.clean(cell.text_content()).startswith('kW') and not cell.xpath('.//*'):
     cell.text='Leistung '+(cell.text or '')
  return result
e.fetch=polite
def run(r):
 make,line,gi=r['make'],r['line'],r['index'];card=index[make][line];attempts=[]
 if (make,line,gi) in regional:return {**r,'status':'regional-deferred','engines':[],'attempts':[]}
 for url in second.urls({'make':make,'line':line,'generationIndex':gi,'sources':card['generations'][gi].get('sources',[])},card):
  tree,canonical,error=polite(url);attempts.append({'url':url,'canonical':canonical,'error':error})
  if tree is None:continue
  mini=make=='mini' and line=='cooper' and e.clean(tree.xpath('string(//h1)')) in ['Mini Hatch','Mini (BMW Group)']
  if not mini and not second.owns_article(tree,card,make,gi):continue
  rows=[row for i,row in second.page_rows(tree,url,card) if i==gi]
  if mini:rows=[row for row in rows if row['variant'].startswith('Cooper')]
  unique={}
  for row in rows:
   row['variant']=second.short_name(row['variant'])
   if not row['variant'] or len(row['variant'])>40 or not(row['fuel']=='electric' or row['displacementCc'] or row['displacementLitresNominal']):continue
   unique.setdefault((row['variant'],row['fuel'],row['displacementCc'],row['powerKwMin']),row)
  if unique:return {**r,'status':'candidate','engines':list(unique.values()),'attempts':attempts}
 return {**r,'status':'no-source','engines':[],'attempts':attempts}
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(run,q):
  results.append(result);print(result['make']+'/'+result['line']+'/'+str(result['index']),result['status'],len(result['engines']),flush=True);e.write(str(root/'default-candidates.json'),results)
print('DONE',len(results),sum(len(r['engines']) for r in results),flush=True)
