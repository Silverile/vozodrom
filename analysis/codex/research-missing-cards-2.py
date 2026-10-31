"""Paced model/badge-specific evidence for the remaining missing cards. No public writes."""
import importlib.util,json,os,re,subprocess,time,urllib.parse
s=importlib.util.spec_from_file_location('base','analysis/codex/research-missing-cards.py');b=importlib.util.module_from_spec(s);s.loader.exec_module(b)
t=b.t;ROOT='analysis/codex/wave-3-missing-cards-2';os.makedirs(ROOT,exist_ok=True)
LEADS={
'ac-cars/378-gt-zagato':['en:AC_378_GT_Zagato'],
'automobili-pininfarina/b95':['en:Pininfarina_B95'],
'daewoo/gentra-uzbekistan-2013-introduction':['en:Daewoo_Gentra'],
'fiat/qubo-l':['fr:Fiat_Qubo','https://www.media.stellantis.com/em-en/fiat/press/fiat-unveils-the-qubo-l-the-ultimate-family-mover-for-modern-living'],
'ford/f-150':['en:Ford_F-Series','en:Ford_F-Series_(sixth_generation)','en:Ford_F-Series_(seventh_generation)','en:Ford_F-Series_(eighth_generation)','en:Ford_F-Series_(ninth_generation)','en:Ford_F-Series_(tenth_generation)','en:Ford_F-Series_(eleventh_generation)','en:Ford_F-Series_(twelfth_generation)','en:Ford_F-Series_(thirteenth_generation)','en:Ford_F-Series_(fourteenth_generation)'],
'ford/maverick':['en:Ford_Maverick_(2022)'],
'mahindra/scorpio-pik-up-goa-pik-up-getaway':['en:Mahindra_Scorpio_Getaway'],
'maruti-suzuki/esteem':['en:Suzuki_Cultus'],
'maruti-suzuki/grand-vitara-xl-7-import':['en:Suzuki_XL-7'],
'maruti-suzuki/kizashi-import':['en:Suzuki_Kizashi'],
'maruti-suzuki/s-cross':['en:Suzuki_SX4_S-Cross'],
'maruti-suzuki/super-carry':['en:Suzuki_Carry'],
'maruti-suzuki/zen-estilo-estilo':['en:Maruti_Suzuki_Zen_Estilo'],
'maserati/2-24v-4-24v-4-18v':['en:Maserati_Biturbo'],
'maxus/edeliver-5':['en:Maxus_Deliver_5'],
'mazda/cx-5e':['en:Mazda_CX-5e'],
'mclaren/788hs':['https://cars.mclaren.com/en/super-series/788hs','https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/mclaren/super-series/2generation/353111/'],
'mercedes-benz/eqt':['en:Mercedes-Benz_Citan'],
'microcar/m-go-models-auto-has-0-microcar-rows':['fr:Microcar_M.Go','fr:Microcar'],
'mitsubishi/asx-vr-e-foxtron-based-bev':['en:Foxtron_Bria'],
'mitsubishi/delica-d-3':['en:Nissan_NV200'],
'mitsubishi/diamante-magna':['en:Mitsubishi_Diamante','en:Mitsubishi_Magna'],
'mitsubishi/pajero-junior-pajero-mini':['en:Mitsubishi_Pajero_Mini','en:Mitsubishi_Pajero_Junior'],
'morgan/plus-four-cx-t':['en:Morgan_Plus_Four'],
'moskvic/2315-pickup-on-2140-base':['ru:Москвич-2315'],
'moskvic/2901-van-on-2141-base':['ru:Москвич-2901'],
'moskvic/5-crossover':['ru:Москвич_5'],
'nio/et5-touring-et5t':['en:Nio_ET5'],
'omoda/omoda-7-c7':['en:Omoda_7'],
'omoda/omoda-9-c9':['en:Omoda_9'],
'opel/rocks-e-rocks-electric-model-line-l6e-quadricycle-decide-whether-it-belongs-in-auto':['en:Opel_Rocks_Electric','de:Opel_Rocks-e'],
'packard/light-eight':['en:Packard_Light_Eight'],
'packard/packard-1958-sedan-hardtop-station-wagon-packardbaker':['en:Packard_(1957–58)'],
'plymouth/arrow':['en:Plymouth_Arrow','en:Mitsubishi_Lancer_Celeste'],
'plymouth/champ':['en:Dodge_Colt'],
'plymouth/scamp-pickup':['en:Plymouth_Scamp_(pickup)'],
'plymouth/suburban':['en:Plymouth_Suburban'],
'plymouth/tc3':['en:Dodge_Omni_024'],
'plymouth/trail-duster':['en:Dodge_Ramcharger'],
'pontiac/strato-chief-canada':['en:Pontiac_Strato_Chief'],
'pontiac/sunrunner-canada-geo-tracker-twin':['en:Chevrolet_Tracker_(Americas)'],
'pontiac/wave-canada-rebadged-chevrolet-aveo-t200':['en:Daewoo_Kalos'],
'ram/promaster-van-in-models-auto-no-line-fiat-ducato-rebadge-for-north-america':['en:Fiat_Ducato'],
'renault/duster-renault-badged-non-eu':['en:Dacia_Duster'],
'renault/logan-renault-badged-non-eu':['en:Dacia_Logan'],
'renault/sandero-renault-badged-non-eu':['en:Dacia_Sandero'],
'salmson/2300-s':['fr:Salmson_2300_S'],
'salmson/al':['fr:Salmson_AL'],
'salmson/grand-sport-gs':['fr:Salmson_Grand_Sport'],
'santana-motor/santana-2500-series-iv-super-cazorla':['es:Santana_2500','en:Santana_Motor'],
'santana-motor/santana-cajal':['https://www.motor.es/santana/cajal/'],
'santana-motor/santana-series-ii-iia-iii-88-109-licensed-land-rover':['en:Santana_Motor'],
'scion/ia':['en:Mazda2'],
'scion/im':['en:Toyota_Auris'],
'scion/iq':['en:Toyota_iQ'],
'studebaker/2r-3r-truck':['en:Studebaker_2R'],
'studebaker/lark-cruiser-cruiser':['en:Studebaker_Cruiser','en:Studebaker_Lark'],
'studebaker/lark-daytona-daytona':['en:Studebaker_Lark'],
'studebaker/power-hawk':['en:Studebaker_Power_Hawk'],
'tata-motors/tata-aeris-alias-of-tigor':['en:Tata_Tigor'],
'tata-motors/tata-spacio':['en:Tata_Sumo'],
'tata-motors/tata-yodha-alias-of-xenon':['en:Tata_Telcoline'],
'uaz/hunter-315195':['ru:УАЗ_Хантер'],
'uaz/pickup-23632':['ru:УАЗ_Пикап'],
'uaz/profi-2360':['ru:УАЗ_Профи'],
'uaz/uaz-69-gaz-69-built-in-ulyanovsk':['ru:ГАЗ-69'],
'venturi/atlantique-260-300-300-biturbo':['fr:Venturi_260_Atlantique','fr:Venturi_300_Atlantique','en:Venturi_Atlantique'],
'venturi/coupe-transcup-200-210-260':['fr:Venturi_Coupé'],
'vinfast/limo-green-vf-mpv-7':['en:VinFast_Limo_Green'],
'vinfast/minio-green-vf-2':['en:VinFast_Minio_Green'],
'wartburg/wartburg-motorwagen-eisenach-decauville-licence':['de:Wartburg_(Automobil)'],
'wolseley-motors/wolseley-viper':['de:Wolseley_16/45'],
'wuling-motors/wuling-almaz':['en:Baojun_530'],
'wuling-motors/wuling-cloud-ev':['en:Baojun_Yunduo'],
'wuling-motors/wuling-cortez':['en:Baojun_730'],
'wuling-motors/wuling-sunshine-zhiguang':['en:Wuling_Sunshine'],
'zaz/tavria-pick-up-11055':['ru:ЗАЗ-11055'],
'zotye-auto/z360-alias-of-z300':['en:Zotye_Z300'],
}
def collect(tree,item,url):
 for el in tree.xpath('//style|//script|//sup[contains(@class,"reference")]'):el.drop_tree()
 title=' '.join(tree.xpath('//h1//text()')).strip() or ' '.join(tree.xpath('//title/text()'))
 boxes=b.boxes(tree)
 # DE motor infoboxes use two TD cells, not TH/TD labels.
 for table in tree.xpath('//table'):
  rows={}
  for tr in table.xpath('./tr|./tbody/tr'):
   td=tr.xpath('./td');th=tr.xpath('./th')
   if len(td)==2 and not th:
    key=b.text(td[0]);value=b.text(td[1])
    if len(key)<65:rows[key]=value
  if not any(k in rows for k in ['Produktionszeitraum','Bauzeit','Годы производства']):continue
  boxes.append({'caption':title,'headings':[b.text(x) for x in table.xpath('preceding::h2[1]|preceding::h3[1]')],'rows':rows})
 aliases=[item['line'].split('-')[0]]+re.split(r'\s*/\s*|\s*\(',item['name'])[:3]
 aliases=[x for x in aliases if len(x)>2]
 aliases+=['Scion','Maruti','Gentra','Getaway','ProMaster','Pik-Up','Estilo','Yodha','Spacio','Aeris','Viper','Grand Sport','GS','B95','QUBO','CX-5e']
 needles=[re.compile(r'(?<!\w)'+re.escape(x)+r'(?!\w)',re.I) for x in aliases]
 paragraphs=[]
 for el in tree.xpath('//div[contains(@class,"mw-parser-output")]//p|//main//p|//article//p'):
  if el.xpath('ancestor::table'):continue
  value=b.text(el)
  if len(value)<30 or not any(n.search(value) for n in needles):continue
  if value not in paragraphs:paragraphs.append(value[:2000])
  if len(paragraphs)>=16:break
 # Exact rows from family lists are useful for badge-specific production dates.
 rows=[]
 for tr in tree.xpath('//table[not(contains(@class,"infobox"))]//tr'):
  value=b.text(tr)
  if 15<len(value)<900 and any(n.search(value) for n in needles) and re.search(r'(?:18|19|20)\d{2}',value):
   if value not in rows:rows.append(value)
   if len(rows)>=12:break
 return {'url':url,'title':title,'boxes':boxes,'paragraphs':paragraphs,'matchedRows':rows,'headings':[b.text(x) for x in tree.xpath('//h2|//h3')][:70]}

if __name__=='__main__':
 previous=t.load('analysis/codex/wave-3-missing-cards/survey.json');remaining={x['id'] for x in t.load('analysis/codex/wave-3-missing-cards/report.json')['remaining']}
 items=[x for x in previous['lines'] if x['id'] in remaining]
 old=t.load(ROOT+'/survey.json') if os.path.exists(ROOT+'/survey.json') else {'lines':[]};byid={x['id']:x for x in old['lines']}
 revision=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip();results=[];limited=False
 for item in items:
  if item['id'] in byid and byid[item['id']].get('completed'):result=byid[item['id']]
  else:
   articles=[];attempts=[]
   for lead in LEADS[item['id']]:
    url=lead if lead.startswith('http') else 'https://'+lead[:2]+'.wikipedia.org/wiki/'+lead[3:]
    if limited:attempts.append({'url':url,'error':'Deferred after 429'});continue
    if url not in t.cache:time.sleep(1.5)
    tree,canonical,error=t.fetch(url);attempts.append({'url':url,'resolved':canonical,'error':error})
    if error:
     if '429' in error:limited=True
     continue
    articles.append(collect(tree,item,canonical))
   result={**{k:item[k] for k in ['id','make','line','name','sources']},'attempts':attempts,'articles':articles,'completed':not limited}
  results.append(result);print(item['id'],len(result['articles']),flush=True)
  t.write(ROOT+'/survey.json',{'baselineRevision':revision,'complete':False,'rateLimited':limited,'lines':results})
 t.write(ROOT+'/survey.json',{'baselineRevision':revision,'complete':True,'rateLimited':limited,'lines':results})
