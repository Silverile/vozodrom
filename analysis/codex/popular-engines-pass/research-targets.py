"""One useful source per target generation, using existing explicit source leads."""
import pathlib,importlib.util,sys,time,threading,concurrent.futures,json
sys.stdout.reconfigure(encoding='utf-8')
s=importlib.util.spec_from_file_location('second','analysis/codex/second-source-engines.py');second=importlib.util.module_from_spec(s);s.loader.exec_module(second);e=second.t
s=importlib.util.spec_from_file_location('helper','analysis/codex/popular-engines-pass/table-parser.py');h=importlib.util.module_from_spec(s);s.loader.exec_module(h);h.install(e)
root=pathlib.Path('analysis/codex/popular-engines-pass');index=e.load('src/data/model-cards-index.json');q=e.load(str(root/'selection.json'))
old_table=second.table_rows
def table_rows(table,context,url,num):
 # Reuse explicit hybrid/component and non-European exclusions.
 text=e.fold(table.text_content()+' '+context)
 if e.foreign_market(context) or any(x in text for x in ['SYSTEMLEISTUNG','HYBRID','MHEV','PHEV']):return []
 return hparse(table,context,url,num) or old_table(table,context,url,num)
hparse=e.parse_table;second.table_rows=table_rows
fetch=e.fetch;lock=threading.Lock();last=[0]
def polite(url):
 if url in e.cache:return e.cache[url]
 with lock:
  if url in e.cache:return e.cache[url]
  delay=0.8-(time.monotonic()-last[0])
  if delay>0:time.sleep(delay)
  result=fetch(url);last[0]=time.monotonic();return result
e.fetch=polite
skip={('citroen','c3',3),('kia','sportage',5),('kia','rio',3),('kia','rio',5),('honda','accord',10),('fiat','uno',1),('fiat','fiorino',3),('nissan','navara',2),('kia','niro',1),*[('nissan','sunny',i) for i in [8,10,11,12,13,14]]}
def run(r):
 make,line,gi=r['make'],r['line'],r['index'];card=index[make][line];g=card['generations'][gi];attempts=[]
 if (make,line,gi) in skip:return {**r,'status':'regional-deferred','engines':[],'attempts':[],'reason':'Distinct regional branch; European availability is not established, so no donor engine row is copied.'}
 item={'make':make,'line':line,'generationIndex':gi,'sources':g.get('sources',[])}
 for url in second.urls(item,card):
  tree,canonical,error=polite(url);attempts.append({'url':url,'canonical':canonical,'error':error})
  if tree is None or not second.owns_article(tree,card,make,gi):continue
  rows=[row for i,row in second.page_rows(tree,url,card)+second.prose_rows(tree,url,card) if i==gi]
  rows=[row for row in rows if row['fuel']=='electric' or row['displacementCc'] or row['displacementLitresNominal']]
  unique={}
  for row in rows:
   row['variant']=second.short_name(row['variant'])
   if not row['variant'] or len(row['variant'])>40:continue
   unique.setdefault((row['variant'],row['fuel'],row['displacementCc'],row['powerKwMin']),row)
  if unique:return {**r,'status':'candidate','engines':list(unique.values()),'attempts':attempts}
 return {**r,'status':'no-source','engines':[],'attempts':attempts}
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(run,q):
  results.append(result);print(result['make']+'/'+result['line']+'/'+str(result['index']),result['status'],len(result['engines']),flush=True)
  e.write(str(root/'target-candidates.json'),results)
print('DONE',len(results),sum(len(x['engines']) for x in results),flush=True)
