import importlib.util,pathlib,re,time,urllib.parse
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root='analysis/codex/structure-pass-6';pathlib.Path(root).mkdir(exist_ok=True)
q=e.load('analysis/codex/catalog-sweep-residuals.json')['structuralSignals'];e.write(root+'/queue.json',q)
titles='Citroën_C3|Mercedes-Benz_GLE|MG_ZS_(crossover)|Mini_Hatch|Toyota_Land_Cruiser|Land_Rover_Freelander|Porsche_Cayenne|Volkswagen_Tayron|Mercedes-Benz_G-Class|Ram_pickup|Kia_Niro|Ford_Explorer|Jaguar_XF|KGM_Torres|Renault_Master|Jaguar_F-Type|Hillman_Minx|DS_4|Great_Wall_Wingle|Ram_pickup|Caterham_7|Fiat-Abarth_1000|AC_Cobra|Acura_Legend|Adler_Favorit|Alfa_Romeo_8C|Alpina_B10|Alpina_B8|AMC_Matador|Auto_Union_1000|BAIC_BJ40|Senova_X55|Senova_D50|Bentley_Batur|Brilliance_FRV|Brilliance_H230|Bristol_Blenheim|Chery_Eastar|Force_Gurkha|Force_Traveller|Forthing_T5|Geely_Emgrand|Geely_MK|Geely_Haoyue|Ginetta_G4|Haval_Big_Dog|Haval_H5|Haval_H6|Hindustan_Ambassador|Hongqi_HS7|Hudson_Wasp|Infiniti_I|Infiniti_M|Infiniti_Q60|Infiniti_Q70|Innocenti_Mini|Izh_2126|Jaguar_E-Type|Jeep_Jeepster_Commando|Jeep_Wagoneer|Jetour_X70|Jetour_X90|Lamborghini_Countach|Ligier_JS4|Lotus_Evora|Lynk_%26_Co_10|Mahindra_Bolero_Neo|Mahindra_Jeep|Maruti_800|MG5|Proton_e.MAS_7|Ram_pickup|Dacia_Duster|Roewe_RX5|Toyota_HiAce|Volkswagen_Beetle|Voyah_Passion|Voyah_Taishan|Wey_Gaoshan|Wuling_Cortez|Wuling_Hongguang|Wuling_Hongguang_Mini_EV|Wuling_Rongguang|Wuling_Sunshine'.split('|')
# Source is UTF-8 on disk; percent encode international titles explicitly.
assert len(titles)==len(q)
results=[]
for row,title in zip(q,titles):
 url='https://en.wikipedia.org/wiki/'+urllib.parse.quote(urllib.parse.unquote(title),safe='_()')
 t,c,err=e.fetch(url);facts=[];prose=[];headings={}
 if t is not None:
  for x in t.xpath('//style|//script'):x.drop_tree()
  for x in t.iter():
   tag=x.tag if isinstance(x.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=e.clean(x.text_content())
   if tag=='tr':
    cells=x.xpath('./th|./td');label=e.clean(cells[0].text_content()) if cells else ''
    if re.search('^Production$|^Model years$|^Assembly$',label,re.I):facts.append({'heading':' / '.join(headings.values()),'label':label,'value':e.clean(' '.join(c.text_content() for c in cells[1:]))[:900]})
   if tag=='p':
    text=e.clean(x.text_content())
    if re.search(r'\b(?:18|19|20)\d{2}\b',text):prose.append({'heading':' / '.join(headings.values()),'text':text[:2200]})
 results.append({**row,'url':url,'canonical':c,'error':err,'facts':facts,'datedProse':prose[:100]});e.write(root+'/research.json',results)
 print(row['id'],err or 'OK',len(facts),flush=True)
 if err and '429' in str(err):break
 time.sleep(1.5)
