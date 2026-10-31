"""Fetch one generation-family source per selected line; retain production facts, not raw pages."""
import importlib.util,concurrent.futures,json,re
s=importlib.util.spec_from_file_location('engines','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
names=['Hyundai_Tucson','Renault_Clio','Citro%C3%ABn_C3','Hyundai_i20','Dacia_Logan','Mercedes-Benz_GLE','Mitsubishi_ASX','Ford_Escort_(Europe)','Mercedes-Benz_Vito','Audi_Q7','BMW_1_Series','Citro%C3%ABn_C5','MG_ZS_(crossover)','Mini_Hatch','Toyota_Hilux','Nissan_Micra','Volkswagen_T-Roc','Toyota_Land_Cruiser','Fiat_Uno','Porsche_Cayenne','Mercedes-Benz_GLA','Land_Rover_Defender','Nissan_Navara','Volkswagen_Tayron','Chevrolet_Cruze','MG_HS','Range_Rover','Daewoo_Matiz','Mitsubishi_Eclipse_Cross','Kia_K4','Kia_Niro','Mercedes-Benz_G-Class','Mercedes-Benz_Typ_300_(W03)','Ford_Explorer','Jaguar_XF','SsangYong_Torres','Barkas_B_1000','Dacia_Spring','Kia_Optima','Mercedes-AMG_GT','Audi_RS_6','Audi_RS_3','Chrysler_Pacifica','Jaguar_XJ','Dodge_Caravan','Daewoo_Nubira','BYD_Seal_U','Audi_RS_5','Ligier_JS50','Lynk_%26_Co_01']
queue=e.load('analysis/codex/structure-pass-2/queue.json')['selected'];assert len(names)==len(queue)
def run(item):
 r,title=item;u='https://en.wikipedia.org/wiki/'+title;t,canonical,error=e.fetch(u);facts=[];headings={}
 if t is not None:
  for x in t.iter():
   tag=x.tag if isinstance(x.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=e.clean(x.text_content())
   if tag!='table' or 'infobox' not in x.get('class',''):continue
   production=[];codes=[]
   for tr in x.xpath('.//tr'):
    label=e.clean(tr.xpath('string(th[1])'))
    if re.search(r'^Production$|Produktionszeitraum|V.roba',label,re.I):
     for style in tr.xpath('.//style'):style.drop_tree()
     production.append(e.clean(tr.xpath('string(td[1])')))
    if re.search(r'Model.code|Also.called',label,re.I):codes.append(e.clean(tr.xpath('string(td[1])'))[:160])
   if production:facts.append({'heading':' / '.join(headings.values()),'codes':codes,'production':production})
 return {'make':r['make'],'line':r['line'],'url':u,'canonical':canonical,'error':error,'facts':facts}
results=list(concurrent.futures.ThreadPoolExecutor(8).map(run,zip(queue,names)));e.write('analysis/codex/structure-pass-2/research.json',results)
for r in results:print(json.dumps(r,ensure_ascii=False))
