"""Production-table and dated prose evidence; no vehicle-level data."""
import importlib.util,concurrent.futures,re,json,pathlib
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root='analysis/codex/structure-pass-4';pathlib.Path(root).mkdir(exist_ok=True)
previous=e.load('analysis/codex/structure-pass-3/next-queue.json');queue=previous['next'][:50]
queue += [dict(make=i.split('/')[0],line=i.split('/')[1],fleet=None) for i in previous['dateFollowups']]
index=e.load('src/data/model-cards-index.json')
titles=['Estrima_Bir%C3%B2','Exeed_Sterra_ET','Force_Traveller','Forthing_T5_Evo','Forthing_T5','Geely_Boyue','Geely_Emgrand','Geometry_A','Geely_Haoyue','Geely_Boyue','GMC_Acadia','Chevrolet_Colorado','GMC_Terrain','Great_Wall_Coolbear','Great_Wall_Peri','Great_Wall_Voleex_C10','Grecav_Sonique','Haval_Big_Dog','Haval_F7','Haval_H1','Haval_H6','Haval_H7','Hongqi_CA770','Hongqi_H9','Hongqi_HS7','Infiniti_QX50','Izh_2715','Jeep_CJ','Jeep_Forward_Control','Jetour_Dashing','Jetour_Freedom','Jetour_Traveller','Jetour_X70','Jetour_X90','Kia_K3_(BL7)','Koenigsegg_Agera','Lancia_Flavia','Land_Rover_series','Ligier','Lincoln_Continental','Lotus_Esprit','Lotus_Europa','Lynk_%26_Co_Z10','Mahindra_Armada','Mahindra_Bolero_Neo','Mahindra_Jeep','Maruti_Suzuki_Alto','Suzuki_Baleno','Suzuki_Swift','Maybach_SW','Abarth_1000','Bertone_Freeclimber','Delage_CO','Dodge_Custom']
def run(item):
 r,title=item;lang='it' if r['make'] in ['estrima','grecav'] else 'fr' if r['make']=='ligier' else 'en';u='https://'+lang+'.wikipedia.org/wiki/'+title
 t,c,err=e.fetch(u);facts=[];prose=[];headings={}
 if t is not None:
  for st in t.xpath('//style|//script'):st.drop_tree()
  for x in t.iter():
   tag=x.tag if isinstance(x.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=e.clean(x.text_content())
   if tag=='tr':
    cells=x.xpath('./th|./td');label=e.clean(cells[0].text_content()) if cells else ''
    if re.search('^Production$|Produktionszeitraum|Bauzeitraum|Produzione|Production',label,re.I):facts.append({'heading':' / '.join(headings.values()),'production':e.clean(' '.join(c.text_content() for c in cells[1:]))[:650]})
   if tag=='p':
    text=e.clean(x.text_content())
    if re.search(r'\b(?:18|19|20)\d{2}\b',text) and len(prose)<55:prose.append({'heading':' / '.join(headings.values()),'text':text[:1300]})
 return {**r,'sources':[{'url':u,'canonical':c,'error':err,'facts':facts,'datedProse':prose}]}
e.write(root+'/queue.json',queue);rs=list(concurrent.futures.ThreadPoolExecutor(8).map(run,zip(queue,titles)));e.write(root+'/research.json',rs)
for r in rs:print(json.dumps({'id':r['make']+'/'+r['line'],**{k:v for k,v in r['sources'][0].items() if k!='datedProse'}},ensure_ascii=False))
