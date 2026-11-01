"""One UltimateSpecs detail-page fallback per dated, empty-engine generation.
Uses explicit kW only. No HP conversion, hybrid component inference or saved HTML.
"""
import argparse,concurrent.futures,importlib.util,json,re,sys,urllib.parse,time
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
r.INDEX=r.t.load('src/data/model-cards-index.json')
MAKES={x['slug']:x['name'] for x in r.t.load('src/data/makes-index.json')};BASE='https://www.ultimatespecs.com'
BRANDS={'skoda':'Skoda','ds-automobiles':'DS','mercedes-benz':'Mercedes-Benz','alfa-romeo':'Alfa-Romeo','land-rover':'Land-Rover'}
LAST_FETCH=0;RATE_LIMITED=False
def compact(x):return re.sub(r'[^A-Z0-9]','',r.t.fold(x))
def model_names(item):
    card=r.INDEX[item['make']][item['line']];names={compact(card['name']),compact(item['line'])}
    if item['make']=='mercedes-benz':names|={compact(re.sub(r'^trida-','',item['line'])+'-Class')}
    if item['make']=='ds-automobiles':names|={compact(card['name'].replace('DS ',''))}
    return names
def owns_model_text(text,names):
    folded=r.t.fold(text)
    return any(n and re.search(r'(?<![A-Z0-9])'+r'\s*'.join(re.escape(ch) for ch in n)+r'(?![A-Z0-9])',folded) for n in names)
def links(tree):
    return [(urllib.parse.urljoin(BASE,a.get('href')),r.t.clean(a.text_content())) for a in tree.xpath('//a[@href]') if a.get('href','').startswith('/car-specs/')]
def source_rows(tree):
    rows={}
    for tr in tree.xpath('//tr'):
        cells=tr.xpath('./th|./td')
        if len(cells)==2:
            key=r.t.fold(cells[0].text_content());value=r.t.clean(cells[1].text_content())
            if key and key not in rows:rows[key]=value
    return rows
def production(tree):
    text=r.t.clean(tree.text_content())
    m=re.search(r'Production years:\s*from\s+(\d{4})\s+to\s+(?:to\s+)?(\d{4}|present)',text,re.I)
    if m:return (int(m[1]),None if m[2].lower()=='present' else int(m[2]))
    m=re.search(r'Production years:\s*(\d{4})\b',text,re.I)
    return (int(m[1]),None) if m else None
def generation_fit(g,name,span):
    if not span or not g.get('from'):return False
    if span[0]>(g.get('to') or 2026) or span[1] and span[1]<g['from']:return False
    codes={c for c in r.t.token(g.get('code') or '') if re.search(r'\d',c)}
    if codes&r.t.token(name):return True
    return abs(span[0]-g['from'])<=1
def short_variant(title,brand,gen_title,model,cc,fuel,kw):
    variant=re.sub(r'\s+Specs\s*$','',title,flags=re.I)
    brand_pattern=r'[\s-]+'.join(re.escape(x) for x in re.split(r'[\s-]+',brand))
    for name in [gen_title,model]:
        prefix=r'^'+brand_pattern+r'\s+'+re.escape(name)+r'(?=\s|$)'
        shortened=re.sub(prefix,'',variant,count=1,flags=re.I).strip()
        if shortened!=variant:variant=shortened;break
    variant=re.sub(r'\b\d+(?:[.,]\d+)?\s*(?:HP|PS|bhp)\b','',variant,flags=re.I)
    variant=r.short_name(variant)
    if not variant or len(variant)>40 or fuel!='electric' and not re.search(r'\d',variant):
        variant=('Elektromotor '+str(kw)+' kW') if fuel=='electric' else f'{cc/1000:.1f} '+('diesel' if fuel=='diesel' else 'benzin')
    return variant
def detail(tree,url,item,gen_title,span,gen_url=None):
    g=r.INDEX[item['make']][item['line']]['generations'][item['generationIndex']]
    title=r.t.clean(tree.xpath('string(//h1)'));rows=source_rows(tree);generation_field=rows.get('GENERATION','');generation=generation_field
    if not generation and gen_url and re.fullmatch(r'https://www\.ultimatespecs\.com/car-specs/[A-Za-z-]+/M\d+/[^/?#]+',gen_url):generation=gen_title
    parent_attribution=False
    if generation and not generation_fit(g,generation,span) and gen_url:
        codes={c for c in r.t.token(g.get('code') or '') if re.search(r'\d',c)}
        if codes&r.t.token(gen_title) and codes&r.t.token(title) and r.t.token(generation)<=r.t.token(gen_title) and generation_fit(g,gen_title,span):
            # Some pages abbreviate F103's generation to the trim "75". The
            # linked generation table and vehicle title must both identify F103.
            generation=gen_title;parent_attribution=True
    if not title or not generation or not generation_fit(g,generation,span):return None,'Detail generation not attributable'
    brand=BRANDS.get(item['make'],MAKES[item['make']]);ct=compact(title)
    if not ct.startswith(compact(brand)) or not owns_model_text(title,model_names(item)) or not owns_model_text(generation,model_names(item)):return None,'Detail model ownership not established'
    if r.t.foreign_market(title+' '+generation):return None,'Explicit regional specification'
    arch=' '.join([rows.get('ENGINE TYPE',''),rows.get('FUEL TYPE',''),rows.get('ENGINE TYPE NUMBER OF CYLINDERS','')])
    if re.search(r'hybrid|PHEV|MHEV|HEV|48\s*V',arch+' '+title,re.I):return None,'Hybrid output requires separate system-power review'
    fuel='electric' if re.search(r'electric',arch,re.I) else r.t.fuel(arch,'')
    if fuel not in ('electric','petrol','diesel','petrol-lpg','petrol-cng'):return None,'No unambiguous fuel'
    power_label='TOTAL ELECTRIC POWER' if fuel=='electric' and rows.get('TOTAL ELECTRIC POWER') else 'HORSEPOWER'
    power_text=rows.get(power_label,'');kw=r.t.power(power_text)
    if kw is None:return None,'No single explicit vehicle kW value'
    cc_text=rows.get('ENGINE DISPLACEMENT','');cc=None if fuel=='electric' else r.t.displacement(cc_text)
    if fuel!='electric' and cc is None:return None,'No displacement'
    body=rows.get('BODY','');wanted=set(g.get('bodyTypes') or [])
    if wanted=={'convertible'} and not re.search(r'cabrio|convertible|roadster',body,re.I):return None,'Body variant mismatch'
    if wanted=={'coupe'} and not re.search(r'coupe|coupé',body,re.I):return None,'Body variant mismatch'
    h=tree.xpath('//h1')[0];date_text=r.t.clean(' '.join(h.getparent().xpath('./b/text()')))
    years=re.findall(r'\b(?:18|19|20)\d{2}\b',date_text)
    start=int(years[0]) if years else span[0];end=int(years[1]) if len(years)>1 else None
    if start<g['from'] or start>(g.get('to') or 2026) or end and end>(g.get('to') or 2026):return None,'Variant dates outside card generation'
    variant=short_variant(title,brand,gen_title,r.INDEX[item['make']][item['line']]['name'],cc,fuel,kw)
    proof={'url':url,'title':title,'modelAliases':sorted(model_names(item)),'generation':generation,'generationFieldPresent':bool(generation_field),'generationPageUrl':gen_url,'linkedFromGenerationEngineTable':bool(gen_url),'generationPageTitle':gen_title,'generationProductionFrom':span[0],'generationProductionTo':span[1],'variantDateText':date_text,'fuelText':arch,'bodyText':body,'powerLabel':power_label,'powerText':power_text,'displacementText':cc_text}
    if parent_attribution:proof.update({'generationAttribution':'linked-generation-page','generationFieldText':generation_field})
    ev={'method':'specification-page','anchor':generation,'fromYear':span[0],'toYear':span[1],'generationIndex':item['generationIndex'],'rowFromYear':start,'rowToYear':end or start}
    scope={'tableSection':'Vehicle Engine Technical Data','variantYears':date_text or str(start),'originalVariant':title,'powerBasis':'explicit total electric output' if power_label=='TOTAL ELECTRIC POWER' else 'explicit vehicle Horsepower field in kW; no conversion','specificationPage':proof,'generationEvidence':ev}
    return {'fuel':fuel,'displacementCc':cc,'displacementLitresNominal':None if cc is None else round(cc/1000,1),'powerKwMin':kw,'powerKwMax':kw,'availablePowerKw':[kw],'powerRangeCoverage':'documented-versions-only','variant':variant,'sources':[url],'sourceScope':scope},None
def research(item,max_models=2,max_generation_pages=20,max_details=3,retry_429_delays=()):
    if item['engines'] or not item.get('from'):return item
    if RATE_LIMITED:
        item=json.loads(json.dumps(item));item['specFallbackStatus']='not-queried-after-rate-limit';item['reason']='Specification fallback deferred after HTTP 429; not proof of an absent page.';return item
    item=json.loads(json.dumps(item));item['specFallbackStatus']='attempted-no-match';attempts=item['attempts'];g=r.INDEX[item['make']][item['line']]['generations'][item['generationIndex']]
    brand=BRANDS.get(item['make'],MAKES[item['make']]).replace(' ','-');url=BASE+'/car-specs/'+brand+'-models'
    def fetch(u):
        global LAST_FETCH,RATE_LIMITED
        if RATE_LIMITED:return None,{'error':'Source crawl stopped after HTTP 429'}
        if u not in r.t.cache:
            time.sleep(max(0,1.5-(time.monotonic()-LAST_FETCH)));LAST_FETCH=time.monotonic()
        tree,canonical,error=r.t.fetch(u);a={'url':u,'canonical':canonical,'phase':'spec-site','error':error};attempts.append(a)
        for retry_index,delay in enumerate(retry_429_delays,1):
            if not error or '429' not in error:break
            time.sleep(delay)
            with r.t.lock:r.t.cache.pop(u,None)
            tree,canonical,error=r.t.fetch(u);a={'url':u,'canonical':canonical,'phase':'spec-site','error':error,'retryIndex':retry_index,'backoffSeconds':delay};attempts.append(a)
        if error and '429' in error:RATE_LIMITED=True;item['specFallbackStatus']='rate-limited';item['reason']='Specification source returned HTTP 429; crawl stopped rather than treating rate limiting as missing data.'
        return tree,a
    tree,a=fetch(url)
    if tree is None:
        if not RATE_LIMITED:item['reason']='Specification fallback attempted; brand-index retrieval failed: '+str(a.get('error'))
        return item
    models=[]
    for u,text in links(tree):
        tail=urllib.parse.unquote(u.rsplit('/',1)[-1]);tail=re.sub('^'+re.escape(brand)+'-','',tail,flags=re.I)
        if compact(tail) in model_names(item) and ('-models/' in u or re.search(r'/M\d+/',u)):models.append(u)
    if not models:a['error']='No exact model link in specification-site brand index';item['reason']=a['error'];return item
    for model in list(dict.fromkeys(models))[:max_models]:
        mt,ma=fetch(model)
        if mt is None:continue
        genurls=[model] if re.search(r'/M\d+/',model) else [u for u,text in links(mt) if re.search(r'/'+re.escape(brand)+r'/M\d+/',u,re.I) and any(n and n in compact(urllib.parse.unquote(u.rsplit('/',1)[-1])) for n in model_names(item))]
        codes={c for c in r.t.token(g.get('code') or '') if re.search(r'\d',c)}
        genurls.sort(key=lambda u:-len(codes&r.t.token(urllib.parse.unquote(u.rsplit('/',1)[-1]))))
        for gu in list(dict.fromkeys(genurls))[:max_generation_pages]:
            gt,ga=fetch(gu)
            if gt is None:continue
            heading=r.t.clean(gt.xpath('string(//h1)'));span=production(gt)
            if not generation_fit(g,heading,span):ga['error']='Generation title/production dates do not match';continue
            ga['generationTitle']=heading;ga['productionYears']=span
            # Only specs actually linked from the generation's own tables. Ignore
            # recent-car recommendations and navigation links from other models.
            specifications=[]
            for table in gt.xpath('//table'):
                if not re.search(r'Horsepower',table.text_content(),re.I):continue
                for u,text in links(table):
                    if re.search(r'/'+re.escape(brand)+r'/\d+/[^/]+\.html$',u,re.I):specifications.append(u)
            gen_title=re.sub(r'^'+re.escape(brand.replace('-',' '))+r'\s+|\s+Specs$','',heading,flags=re.I)
            for su in list(dict.fromkeys(specifications))[:max_details]:
                st,sa=fetch(su)
                if st is None:continue
                engine,reason=detail(st,su,item,gen_title,span,gu);sa['error']=reason;sa['usableRows']=int(engine is not None)
                if engine:item['engines']=[engine];item['status']='candidates';item['specFallbackStatus']='filled';item.pop('reason',None);return item
    if not item['engines'] and not RATE_LIMITED:item['reason']='Wikipedia unusable; specification-site discovery/detail pages also failed ownership, generation, body, fuel or explicit-kW checks. Undated structures are handled separately.'
    return item
if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--batch',type=int,required=True);args=ap.parse_args();path=r.OUT+f'/staged/candidates-{args.batch}.json';data=r.t.load(path);assert data['complete']
    original=data['generations'];out=[]
    for i,item in enumerate(original):
        if RATE_LIMITED and not item['engines'] and item.get('from'):
            item['specFallbackStatus']='not-queried-after-rate-limit';item['reason']='Specification fallback deferred because the source rate-limited the crawl.'
        else:item=research(item)
        out.append(item);print(json.dumps({'id':item['make']+'/'+item['line'],'index':item['generationIndex'],'rows':len(item['engines']),'specStatus':item.get('specFallbackStatus')}),flush=True)
        data['generations']=out+original[i+1:];data['specSitePass']={'visited':i+1,'rateLimited':RATE_LIMITED,'complete':i+1==len(original),'requestSpacingSeconds':1.5};r.t.write(path,data)
