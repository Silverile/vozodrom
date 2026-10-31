"""Final missing-card evidence; explicitly reuses already identified canonical cards."""
import importlib.util,os,subprocess,time
s=importlib.util.spec_from_file_location('r','analysis/codex/research-missing-cards-2.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
ROOT='analysis/codex/wave-3-missing-cards-3';os.makedirs(ROOT,exist_ok=True)
prior=r.t.load('analysis/codex/wave-3-missing-cards-2/survey.json');ids={x['id'] for x in r.t.load('analysis/codex/wave-3-missing-cards-2/report.json')['remaining']}
leads={
 'microcar/m-go-models-auto-has-0-microcar-rows':['https://gsanspermis.com/microcar-m-go-2008-2014/'],
 'moskvic/2315-pickup-on-2140-base':['https://ru.wikipedia.org/wiki/Москвич-2140'],
 'opel/rocks-e-rocks-electric-model-line-l6e-quadricycle-decide-whether-it-belongs-in-auto':['https://en.wikipedia.org/wiki/Citroën_Ami_(electric_vehicle)'],
 'packard/packard-1958-sedan-hardtop-station-wagon-packardbaker':['https://en.wikipedia.org/wiki/1957_and_1958_Packards'],
 'plymouth/suburban':['https://en.wikipedia.org/wiki/Plymouth_Suburban'],
 'pontiac/strato-chief-canada':['https://www.fmm.co.za/a-strato-star/'],
 'pontiac/wave-canada-rebadged-chevrolet-aveo-t200':['https://en.wikipedia.org/wiki/Daewoo_Kalos'],
 'salmson/al':['https://www.blockleytyre.com/make/salmson/salmson-al-al3'],
 'santana-motor/santana-cajal':['https://www.santiagoramonycajal.org/articulos/santana-cajal-todoterreno-linares/'],
 'santana-motor/santana-series-ii-iia-iii-88-109-licensed-land-rover':['https://en.wikipedia.org/wiki/Santana_Motor'],
}
out=[];limited=False
for x in prior['lines']:
 if x['id'] not in ids:continue
 item={k:x[k] for k in ['id','make','line','name','sources']};attempts=[];articles=[]
 for url in leads.get(x['id'],[]):
  if limited:attempts.append({'url':url,'error':'Deferred after HTTP 429'});continue
  time.sleep(1.5);tree,canonical,error=r.t.fetch(url);attempts.append({'url':url,'resolved':canonical,'error':error})
  if error:
   if '429' in error:limited=True
   continue
  a=r.collect(tree,item,canonical)
  # Model-specific bullet lists and short production-history paragraphs are
  # retained even when the source uses only a short badge after its heading.
  a['paragraphs']=list(dict.fromkeys(a['paragraphs']+[r.b.text(p)[:1800] for p in tree.xpath('//div[contains(@class,"mw-parser-output")]//p') if not p.xpath('ancestor::table') and len(r.b.text(p))>25]))[:45]
  articles.append(a)
 item.update(articles=articles or x['articles'],attempts=attempts,completed=not limited);out.append(item);print(x['id'],len(item['articles']),flush=True)
r.t.write(ROOT+'/survey.json',{'baselineRevision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'complete':True,'rateLimited':limited,'lines':out})
