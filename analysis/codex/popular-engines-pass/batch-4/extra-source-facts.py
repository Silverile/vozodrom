"""Read technical cells for manual review; save facts, not article prose."""
import importlib.util,pathlib,sys,io,re,concurrent.futures
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/popular-engines-pass/batch-4')
titles=['fr:Citroën_C15','en:Citroën_C15','en:Lexus_LS_(XF10)','en:Lexus_GS','en:Maserati_Ghibli','en:Fiat_124_Sport_Spider','fr:Peugeot_iOn','fr:Citroën_C-ZERO','en:MG5_EV','en:Isuzu_Trooper','en:Nissan_Prairie']

def run(title):
 lang,article=title.split(':',1);url='https://'+lang+'.wikipedia.org/wiki/'+article;tree,canonical,error=e.fetch(url);out={'url':url,'canonical':canonical,'error':error,'tables':[]}
 if tree is None:return out
 out['title']=e.clean(tree.xpath('string(//h1)'))
 for number,table in enumerate(tree.xpath('//table')):
  text=table.text_content()
  if not re.search(r'Hubraum|Leistung|Systemleistung|Motoren|Power|Engine|Moteur|Puissance|Cylindr',text,re.I) or not re.search(r'\bkW\b|\bPS\b',text):continue
  copy=e.lxml.html.fromstring(e.lxml.html.tostring(table,encoding='unicode'))
  for el in copy.xpath('.//style|.//script'):el.drop_tree()
  try:df=e.pd.read_html(io.StringIO(e.lxml.html.tostring(copy,encoding='unicode')),flavor='lxml')[0].fillna('')
  except Exception:continue
  if df.shape[1]>25 or df.shape[0]>150:continue
  rows=[[e.clean(x) for x in row] for row in df.values.tolist()]
  facts=[r for r in rows if re.search(r'Modell|Motor|Leistung|Hubraum|Bauzeit|Kraftstoff|Antrieb|Typ|Power|Fuel|Displacement|Benzin|Diesel|Engine|Production|Moteur|Puissance|Cylindr|Ann',r[0],re.I) and len(str(r))<6000]
  context=[e.clean(el.text_content()) for el in table.xpath('preceding::h2[1]|preceding::h3[1]')]
  item={'tableIndex':number,'context':context,'columns':[str(c) for c in df.columns],'rows':facts}
  if any(re.search(r'Hubraum|Leistung|Power|Displacement',str(c),re.I) for c in df.columns) and len(rows)<=45:item['engineRows']=rows
  out['tables'].append(item)
 return out
out=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(run,titles):
  out.append(result);print(result['url'],len(result['tables']),result['error'],flush=True);e.write(str(root/'extra-source-facts.json'),out)
