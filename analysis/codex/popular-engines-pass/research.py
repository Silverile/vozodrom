"""Read-only candidates for the fleet >=1000 group. No catalogue mutation."""
import pathlib,json,gzip,sys,concurrent.futures,importlib.util,copy
sys.stdout.reconfigure(encoding='utf-8')
spec=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
helper=importlib.util.spec_from_file_location('tables','analysis/codex/popular-engines-pass/table-parser.py');tables=importlib.util.module_from_spec(helper);helper.loader.exec_module(tables);tables.install(e)
root=pathlib.Path('analysis/codex/popular-engines-pass');root.mkdir(exist_ok=True)
index=e.load('src/data/model-cards-index.json');allq=e.load('analysis/codex/popular-engine-gaps.json')['generations'];q=[r for r in allq if r['lineFleet']>=1000]
items={}
for r in q:items.setdefault((r['make'],r['line']),copy.deepcopy(index[r['make']][r['line']]))
de={'kia/sportage':'Kia_Sportage','kia/rio':'Kia_Rio','kia/picanto':'Kia_Picanto','opel/corsa':'Opel_Corsa','opel/vectra':'Opel_Vectra','mazda/3':'Mazda3','fiat/panda':'Fiat_Panda','honda/civic':'Honda_Civic','honda/cr-v':'Honda_CR-V','honda/accord':'Honda_Accord','honda/jazz':'Honda_Jazz','mini/cooper':'Mini_(BMW_Group)','mini/countryman':'Mini_Countryman','nissan/x-trail':'Nissan_X-Trail','nissan/micra':'Nissan_Micra','nissan/primera':'Nissan_Primera','nissan/note':'Nissan_Note','mazda/5':'Mazda5','mazda/626':'Mazda_626','mazda/323':'Mazda_323','peugeot/106':'Peugeot_106','peugeot/107':'Peugeot_107','peugeot/405':'Peugeot_405','dacia/logan':'Dacia_Logan','dacia/bigster':'Dacia_Bigster','lada/2101':'WAS-2101','lada/niva':'Lada_Niva','alfa-romeo/giulia':'Alfa_Romeo_Giulia_(1962)','fiat/bravo':'Fiat_Bravo','fiat/tipo':'Fiat_Tipo_(Typ_160)','fiat/500':'Fiat_500_(2020)','mitsubishi/galant':'Mitsubishi_Galant','mitsubishi/colt':'Mitsubishi_Colt','mitsubishi/lancer':'Mitsubishi_Lancer','mitsubishi/space-star':'Mitsubishi_Space_Star_(1998)','mitsubishi/pajero':'Mitsubishi_Pajero','mitsubishi/outlander':'Mitsubishi_Outlander','mitsubishi/l200':'Mitsubishi_L200','audi/80':'Audi_80','audi/100':'Audi_100','porsche/boxster':'Porsche_Boxster','porsche/911':'Porsche_911','porsche/panamera':'Porsche_Panamera','lancia/delta':'Lancia_Delta','jaguar/xf':'Jaguar_XF','isuzu/d-max':'Isuzu_D-Max','mg/zs':'MG_ZS','peugeot/partner':'Peugeot_Partner','iveco/daily':'Iveco_Daily','daewoo/matiz':'Daewoo_Matiz','daewoo/lanos':'Daewoo_Lanos','chevrolet/cruze':'Chevrolet_Cruze'}
for (make,line),card in items.items():
 target_indices={x['index'] for x in q if x['make']==make and x['line']==line}
 targeted=[u for i,g in enumerate(card['generations']) if i in target_indices for u in g.get('sources',[])]
 card['_researchWikiSources']=targeted+card['sources']
 if make+'/'+line in de:card['_researchWikiSources'].insert(0,'https://de.wikipedia.org/wiki/'+de[make+'/'+line])
def urls(card):
 found=list(dict.fromkeys(u for u in card['_researchWikiSources'] if re.match(r'https://(?:en|de|cs)\.wikipedia\.org/',u) and not re.search(r'List_of_|Liste_|Seznam_',u)))
 return sorted(found,key=lambda u:0 if '//de.' in u else 1 if '//en.' in u else 2)[:14]
import re
e.wiki_urls=urls
paths=['src/data/model-cards-index.json','src/data/model-lines-index.json','src/data/catalog/model-lines-auto.json','src/data/catalog/model-line-additions.json','src/data/catalog/generation-id-aliases.json','src/data/front-drawings.json','src/data/front-drawing-review.json','src/data/stats/audi.json','src/data/stats/index.json','src/data/listing-stats.json']
paths += [str(p).replace('\\','/') for d in ['src/data/catalog/model-cards','src/data/model-cards'] for p in pathlib.Path(d).glob('*.json')]
if not (root/'baseline.json.gz').exists():
 with gzip.open(root/'baseline.json.gz','wt',encoding='utf-8') as f:json.dump({p:e.load(p) for p in paths},f,ensure_ascii=False)
e.write(str(root/'selection.json'),q)
def run(item):
 (make,line),card=item
 try:r=e.research_line((make,line,card))
 except Exception as exc:r={'make':make,'line':line,'attempts':[],'rows':[],'error':str(exc)}
 targets={x['index'] for x in q if x['make']==make and x['line']==line};r['rows']=[x for x in r['rows'] if x['generation'] in targets]
 print(make+'/'+line,len(r['rows']),flush=True);return r
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(run,items.items()))
e.write(str(root/'candidates.json'),results)
print('Read-only research finished:',len(results),'lines',sum(len(x['rows']) for x in results),'candidate rows',flush=True)
