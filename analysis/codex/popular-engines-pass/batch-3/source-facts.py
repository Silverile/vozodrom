"""Read technical cells for manual review; save facts, not article prose."""
import importlib.util,pathlib,sys,io,re,concurrent.futures
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/popular-engines-pass/batch-3')
titles=['Bentley_Continental_GT','Mercedes-Benz_W_414','Mercedes-Benz_C_140','Mercedes-Benz_C_215','Jeep_Commander','Daewoo_Nubira','Nissan_Pulsar','Nissan_Murano','Daihatsu_Feroza','Citroën_CX','Citroën_C5_X','Citroën_C6','Alfa_Romeo_146','Alfa_Romeo_145','Alfa_Romeo_Tonale','Mercedes-Benz_N_293','Audi_RS5','BMW_XM','Škoda_1201','Škoda_1101_Tudor','Škoda_Popular','Škoda_Pick-up','Mazda_Demio','Mazda_Tribute','Fiat_Palio','Nissan_Vanette','Nissan_Bluebird','Opel_Campo','Opel_Zafira_Life','Toyota_Avensis_Verso','Moskwitsch-2137','Moskwitsch-403','ARO_10','Mitsubishi_Lancer_Evolution','Dodge_Caravan','Dodge_Charger']

def run(title):
 url='https://de.wikipedia.org/wiki/'+title;tree,canonical,error=e.fetch(url);out={'url':url,'canonical':canonical,'error':error,'tables':[]}
 if tree is None:return out
 out['title']=e.clean(tree.xpath('string(//h1)'))
 for number,table in enumerate(tree.xpath('//table')):
  text=table.text_content()
  if not re.search(r'Hubraum|Leistung|Systemleistung|Motoren',text,re.I) or not re.search(r'\bkW\b|\bPS\b',text):continue
  copy=e.lxml.html.fromstring(e.lxml.html.tostring(table,encoding='unicode'))
  for el in copy.xpath('.//style|.//script'):el.drop_tree()
  try:df=e.pd.read_html(io.StringIO(e.lxml.html.tostring(copy,encoding='unicode')),flavor='lxml')[0].fillna('')
  except Exception:continue
  if df.shape[1]>25 or df.shape[0]>150:continue
  rows=[[e.clean(x) for x in row] for row in df.values.tolist()]
  facts=[r for r in rows if re.search(r'Modell|Motor|Leistung|Hubraum|Bauzeit|Kraftstoff|Antrieb|Typ|Power|Fuel|Displacement|Benzin|Diesel',r[0],re.I) and len(str(r))<6000]
  context=[e.clean(el.text_content()) for el in table.xpath('preceding::h2[1]|preceding::h3[1]')]
  item={'tableIndex':number,'context':context,'columns':[str(c) for c in df.columns],'rows':facts}
  if any(re.search(r'Hubraum|Leistung|Power|Displacement',str(c),re.I) for c in df.columns) and len(rows)<=45:item['engineRows']=rows
  out['tables'].append(item)
 return out
out=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(run,titles):
  out.append(result);print(result['url'],len(result['tables']),result['error'],flush=True);e.write(str(root/'source-facts.json'),out)
