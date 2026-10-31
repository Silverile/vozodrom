"""Read-only live infobox survey of the frozen missing-card queue. No public edits."""
import importlib.util, json, os, re, subprocess, time, urllib.parse
spec=importlib.util.spec_from_file_location('t','analysis/codex/engine-throughput.py')
t=importlib.util.module_from_spec(spec);spec.loader.exec_module(t)
OUT='analysis/codex/wave-3-missing-cards'
os.makedirs(OUT,exist_ok=True)
RATE_LIMITED=False

def text(el):
    return ' '.join(el.text_content().split())

def boxes(tree):
    out=[]
    for table in tree.xpath('//table[contains(concat(" ",normalize-space(@class)," ")," infobox ")]'):
        rows={}
        for tr in table.xpath('./tbody/tr|./tr'):
            th=tr.xpath('./th');td=tr.xpath('./td')
            if th and td:
                # Preserve line boundaries between markets / production periods.
                cell=td[0]
                for br in cell.xpath('.//br'):br.tail=' | '+(br.tail or '')
                rows[text(th[0])]=text(cell)
        if not rows:continue
        caption=table.xpath('./caption|./tbody/tr/th[@colspan]|./tr/th[@colspan]')
        previous=table.xpath('preceding::h2[1]|preceding::h3[1]')
        out.append({'caption':text(caption[0])[:150] if caption else '',
                    'headings':[text(x)[:150] for x in previous], 'rows':rows})
    return out

def survey(item):
    global RATE_LIMITED
    leads=item['sources'][:]
    # Discover a model article from a clean make/model title; leads never count as facts.
    title=item['title']
    title=re.sub(r'^(Wolseley|Subaru|Wuling|Santana|Tata) \1 ',r'\1 ',title,flags=re.I)
    leads.insert(0,'https://en.wikipedia.org/wiki/'+title.replace(' ','_'))
    normalized=[]
    for u in leads:
        if 'wikipedia.org' not in u:continue
        q=urllib.parse.parse_qs(urllib.parse.urlsplit(u).query)
        if q.get('title'):u=urllib.parse.urljoin(u,'/wiki/'+q['title'][0].replace(' ','_'))
        normalized.append(u)
    attempts=[];articles=[]
    for u in dict.fromkeys(normalized):
        if RATE_LIMITED:
            attempts.append({'url':u,'error':'Deferred after HTTP 429; not a no-source result.'});continue
        time.sleep(1.5)
        tree,canonical,error=t.fetch(u)
        if tree is None:
            attempts.append({'url':u,'error':error})
            if '429' in (error or ''):RATE_LIMITED=True
            continue
        title=' '.join(tree.xpath('//h1//text()')).strip() or ' '.join(tree.xpath('//title/text()')).split(' - Wikipedia')[0]
        article={'url':canonical,'title':title,'boxes':boxes(tree)}
        attempts.append({'url':u,'resolved':canonical,'title':title,'boxes':len(article['boxes'])})
        if article['boxes']:articles.append(article)
    return {**item,'attempts':attempts,'articles':articles}

if __name__=='__main__':
    audit=t.load('analysis/codex/catalog-completeness-audit.json')
    src=t.load('src/data/catalog/model-lines-auto.json')+t.load('src/data/catalog/model-line-additions.json')
    names={m['slug']:m['name'] for m in t.load('src/data/makes-index.json')}
    # Targeted article leads; facts are read from fetched pages, never these strings.
    overrides={
      'ac-cars/378-gt-zagato':'AC 378 GT Zagato','austin-motor-company/austin-seven-mini-ado15':'Mini',
      'mahindra/e2o':'Mahindra e2o','mercedes-benz/eqt':'Mercedes-Benz T-Class',
      'maruti-suzuki/alto-alto-800-alto-k10':'Maruti Suzuki Alto','maruti-suzuki/esteem':'Maruti Suzuki Esteem',
      'maruti-suzuki/swift-dzire-dzire':'Suzuki Dzire','maruti-suzuki/vitara-brezza-brezza':'Suzuki Vitara Brezza',
      'maruti-suzuki/zen-estilo-estilo':'Suzuki MR Wagon','maruti-suzuki/super-carry':'Suzuki Carry',
      'maserati/granturismo-ii-m189':'Maserati GranTurismo','maserati/quattroporte-v-m139':'Maserati Quattroporte',
      'maxus/eterron-9-terron-9':'Maxus Terron 9','maxus/mifa-9-in-models-auto':'Maxus Mifa 9',
      'mitsubishi/pajero-junior-pajero-mini':'Mitsubishi Pajero Mini','neta-auto/u-x':'Neta U','neta-auto/v-aya':'Neta V',
      'nio/et5-touring-et5t':'Nio ET5','opel/vectra-b':'Opel Vectra','volvo/144':'Volvo 140 Series',
      'ora/mecha-dragon-sedan-china-only':'Saloon Mecha Dragon','plymouth/arrow':'Plymouth Arrow',
      'plymouth/champ':'Plymouth Champ','plymouth/scamp-pickup':'Plymouth Scamp',
      'plymouth/tc3':'Plymouth Horizon TC3','plymouth/trail-duster':'Plymouth Trail Duster',
      'pontiac/strato-chief-canada':'Pontiac Strato Chief','pontiac/sunrunner-canada-geo-tracker-twin':'Pontiac Sunrunner',
      'pontiac/wave-canada-rebadged-chevrolet-aveo-t200':'Pontiac Wave','ram/promaster-van-in-models-auto-no-line-fiat-ducato-rebadge-for-north-america':'Ram ProMaster',
      'roewe/rx5-max-emax':'Roewe RX5 Max','roewe/360-360-plus':'Roewe 360',
      'scion/ia':'Scion iA','scion/im':'Scion iM','scion/iq':'Scion iQ','scion/xd':'Scion xD',
      'seat/panda':'SEAT Panda','seat/ritmo':'SEAT Ritmo','simca/horizon':'Talbot Horizon',
      'studebaker/lark-cruiser-cruiser':'Studebaker Cruiser','studebaker/lark-daytona-daytona':'Studebaker Lark',
      'studebaker/champ-pickup':'Studebaker Champ','studebaker/2r-3r-truck':'Studebaker 2R',
      'studebaker/power-hawk':'Studebaker Power Hawk','toyota/avensis-verso':'Toyota Ipsum',
      'uaz/hunter-315195':'UAZ Hunter','uaz/pickup-23632':'UAZ Pickup','uaz/profi-2360':'UAZ Profi',
      'voyah/courage-zhiyin':'Voyah Zhiyin','willys/mb-jeep':'Willys MB',
      'venturi/atlantique-260-300-300-biturbo':'Venturi Atlantique',
      'wuling-motors/wuling-almaz':'Wuling Almaz','wuling-motors/wuling-binguo-plus':'Wuling Binguo Plus',
      'wuling-motors/wuling-cloud-ev':'Wuling Cloud EV','wuling-motors/wuling-cortez':'Wuling Cortez',
      'wuling-motors/wuling-hongguang-s1-confero':'Wuling Hongguang S1','wuling-motors/wuling-sunshine-zhiguang':'Wuling Sunshine',
    }
    items=[]
    for row in audit['lines']:
        if row['cardPresent']:continue
        make,slug=row['makeSlug'],row['lineSlug'];line=next(s for s in src if s['makeSlug']==make and s['slug']==slug)
        name=re.split(r'\s*\(',line['name'])[0]
        title=overrides.get(make+'/'+slug,names[make]+' '+name)
        items.append({'id':make+'/'+slug,'make':make,'line':slug,'name':line['name'],'title':title,'sources':line.get('sources',[])})
    prior=t.load(OUT+'/survey.json') if os.path.exists(OUT+'/survey.json') else {'lines':[]}
    byid={x['id']:x for x in prior['lines']};results=[]
    revision=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    for item in items:
        old=byid.get(item['id'])
        if old and old['articles']:result=old
        else:result=survey(item)
        results.append(result);print(result['id'],len(result['articles']),flush=True)
        t.write(OUT+'/survey.json',{'baselineRevision':revision,'complete':False,'rateLimited':RATE_LIMITED,'lines':results})
    t.write(OUT+'/survey.json',{'baselineRevision':revision,'complete':True,'rateLimited':RATE_LIMITED,'lines':results})
