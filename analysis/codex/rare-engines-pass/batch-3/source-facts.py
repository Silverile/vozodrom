"""Read technical cells for manual review; save facts, not article prose."""
import importlib.util,pathlib,sys,io,re,concurrent.futures
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/rare-engines-pass/batch-3')
titles=['Honda_CRX','Honda_NSX','Honda_S2000','Suzuki_Carry','Lada_Granta','Lada_Kalina','Lada_Priora','Mazda2_Hybrid','Nissan_350Z','Nissan_370Z','Nissan_NV250','Chevrolet_Alero','Chevrolet_Beretta','Chevrolet_Corsica','Chevrolet_Volt','Alfa_Romeo_8C_Competizione','Alfa_Romeo_SZ','Alfa_Romeo_RZ','MG_Express','MG_GS','MG_5','MG_RV8','MG_XPower_SV','MG_ZS_(2001)','Porsche_918','Mini_(1959)','Mini_Clubvan','Moskwitsch-2141','Lexus_ES','Lexus_LC','Lexus_LM','Lexus_NX','Lexus_RX','Jaguar_XJ220','Jaguar_XJR-15','Daewoo_Evanda','Daewoo_Honker','Daewoo_Lacetti','Lublin_(Transporter)','Lancia_Flavia_(2012)','Daihatsu_Copen','Isuzu_Piazza','BYD_Han','BYD_Seal_5','BYD_Tang','Maserati_222','Maserati_228','Maserati_422','Maserati_430','Maserati_GranSport','Maserati_GT2_Stradale','Maserati_Karif','Maserati_MC20','Maserati_MCPura','Maserati_Shamal','Maserati_Spyder','ARO_Spartana','Cadillac_Lyriq','DS_5','DS_9','Bentley_Azure','Bentley_Batur']

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
