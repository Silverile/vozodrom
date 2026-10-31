"""Generation-scoped second-source research, reusing the hardened table parser.

Research writes candidates only; apply/validate is a separate Node step.
One successful source per generation, explicit kW only, no generation edits.
"""
import argparse, concurrent.futures, importlib.util, io, json, os, re, subprocess, sys
sys.stdout.reconfigure(encoding='utf8')
BASE=os.path.dirname(os.path.abspath(__file__))
spec=importlib.util.spec_from_file_location('throughput',os.path.join(BASE,'engine-throughput.py'))
t=importlib.util.module_from_spec(spec);spec.loader.exec_module(t)
OUT='analysis/codex/second-source-engines'
os.makedirs(OUT,exist_ok=True)
os.makedirs(OUT+'/staged',exist_ok=True)

# URL leads only. Every lead must resolve and supply its own generation evidence.
LEADS={
 'opel/astra':{1:['Opel_Astra_G']},
 'renault/clio':{5:['Renault_Clio_VI']},
 'bmw/rada-5':{1:['BMW_E28'],2:['BMW_E34'],3:['BMW_E39'],4:['BMW_E60'],6:['BMW_G30']},
 'audi/a6':{4:['Audi_A6_C8']},
 'citroen/c3':{0:['Citroën_C3_(2002)'],3:['Citroën_C3_(2022)']},
 'kia/sportage':{0:['Kia_Sportage_(JA)'],1:['Kia_Sportage_(JE)'],2:['Kia_Sportage_(SL)'],3:['Kia_Sportage_(QL)'],4:['Kia_Sportage_(NQ5)'],5:['Kia_Sportage_(NQ5)']},
 'opel/corsa':{1:['Opel_Corsa_B']},
 'mercedes-benz/trida-e':{0:['Mercedes-Benz_Baureihe_124'],1:['Mercedes-Benz_Baureihe_210'],2:['Mercedes-Benz_Baureihe_211'],3:['Mercedes-Benz_Baureihe_212'],4:['Mercedes-Benz_Baureihe_207'],5:['Mercedes-Benz_Baureihe_213'],6:['Mercedes-Benz_Baureihe_238'],7:['Mercedes-Benz_Baureihe_214']},
 'mercedes-benz/sprinter':{0:['Mercedes-Benz_Sprinter'],1:['Mercedes-Benz_Sprinter'],2:['Mercedes-Benz_Sprinter']},
 'dacia/logan':{1:['Dacia_Logan_II'],2:['Dacia_Logan_III','Dacia_Sandero_III']},
 'citroen/jumper':{0:['Citroën_Jumper']},
 'nissan/qashqai':{0:['Nissan_Qashqai_(J10)'],2:['Nissan_Qashqai_(J12)']},
 'peugeot/partner':{1:['Peugeot_Partner_II'],2:['Peugeot_Partner_III']},
 'mercedes-benz/trida-c':{i:['Mercedes-Benz_Baureihe_'+c] for i,c in enumerate(['202','203','204','205','206'])},
 'audi/a3':{0:['Audi_A3_8L'],3:['Audi_A3_8Y']},
 'honda/cr-v':{i:['Honda_CR-V','en:Honda_CR-V_('+n+'_generation)'] for i,n in enumerate(['first','second','third','fourth','fifth','sixth'])},
 'bmw/x5':{0:['BMW_E53']},
 'peugeot/207':{0:['Peugeot_207']},
 'skoda/citigo':{0:['Škoda_Citigo']},
 'honda/civic':{i:['Honda_Civic_('+c+'.'+('_Generation)' if i in [8,9,10] else '_Generation)'), 'Honda_Civic'] for i,c in enumerate(map(str,range(1,12)))},
 'opel/zafira':{0:['Opel_Zafira_A'],1:['Opel_Zafira_B'],2:['Opel_Zafira_Tourer']},
 'lada/2101':{0:['WAS-2101']},
 'mercedes-benz/gle':{1:['Mercedes-Benz_W_164'],2:['Mercedes-Benz_W_166'],3:['Mercedes-Benz_C_292'],4:['Mercedes-Benz_Baureihe_167'],5:['Mercedes-Benz_Baureihe_167']},
 'dacia/dokker':{0:['Dacia_Dokker']},
 'citroen/c4-picasso':{0:['Citroën_C4_Picasso_I'],1:['Citroën_C4_Picasso_II']},
 'mazda/6':{0:['Mazda6_(Typ_GG/GY)'],1:['Mazda6_(Typ_GH)'],2:['Mazda6_(Typ_GJ)']},
 'skoda/1000-1100-mb':{0:['Škoda_1000_MB']},
 'citroen/c4':{1:['Citroën_C4_(2010)']},
 'fiat/doblo':{2:['Fiat_Doblò']},
 'peugeot/5008':{1:['Peugeot_5008_II'],2:['Peugeot_5008_III']},
 'opel/meriva':{0:['Opel_Meriva_A']},
 'mitsubishi/asx':{0:['Mitsubishi_ASX'],1:['Mitsubishi_ASX']},
 'iveco/daily':{0:['Iveco_Daily'],1:['Iveco_Daily'],2:['Iveco_Daily']},
 'mercedes-benz/trida-a':{i:['Mercedes-Benz_Baureihe_'+c] for i,c in enumerate(['168','169','176'])},
 'mazda/3':{0:['Mazda3_(Typ_BK)'],1:['Mazda3_(Typ_BL)'],2:['Mazda3_(Typ_BM)'],3:['Mazda3_(Typ_BP)']},
 'bmw/x3':{0:['BMW_E83']},
 'seat/alhambra':{0:['Seat_Alhambra_I'],1:['Seat_Alhambra_II']},
 'kia/rio':{0:['Kia_Rio_(DC)'],1:['Kia_Rio_(JB)']},
}

# Alternate family spellings provide table/heading evidence, never guessed data.
FAMILIES={'citroen/c3':'Citroën_C3','kia/sportage':'Kia_Sportage','nissan/qashqai':'Nissan_Qashqai',
 'peugeot/partner':'Peugeot_Partner','honda/civic':'Honda_Civic','opel/zafira':'Opel_Zafira',
 'dacia/logan':'Dacia_Logan','citroen/c4-picasso':'Citroën_C4_Picasso','mazda/6':'Mazda6',
 'citroen/c4':'Citroën_C4','peugeot/5008':'Peugeot_5008','mazda/3':'Mazda3',
 'seat/alhambra':'Seat_Alhambra','kia/rio':'Kia_Rio'}

def short_name(value):
    value=re.sub(r'^(\d{3})\.\d{1,2}$',r'\1',value)
    value=re.sub(r'\s*\(\d+\)', '',value)
    value=re.sub(r'\s+(?:2WD|4WD|AWD|FWD)\b','',value)
    # A transposed Mercedes column may name several body badges with one engine.
    if len(re.findall(r'\b\d{3}\b',value))>1:
        pattern=r'^[A-Z]{1,3}\s*\d{3}(?:\s+(?:CDI|CGI|Kompressor|Diesel|AMG)\b)?' if re.match(r'^[A-Z]',value) else r'^\d{3}(?:\s*(?:CDI|CGI|Kompressor|Diesel|AMG|CE|TE|[EDdei]))?'
        first=re.match(pattern,value)
        if first:value=first[0].strip()
    return t.variant_name(value)

def table_rows(table,context,source,number):
    table=t.lxml.html.fromstring(t.lxml.html.tostring(table,encoding='unicode'))
    for el in table.xpath('.//style|.//script|.//sup|.//table'):el.drop_tree()
    try:df=t.pd.read_html(io.StringIO(t.lxml.html.tostring(table,encoding='unicode')),flavor='lxml')[0].fillna('')
    except Exception:return []
    if df.shape[1]<2 or df.shape[0]>250:return []
    cols=[' '.join(t.clean(c) for c in x) if isinstance(x,tuple) else t.clean(x) for x in df.columns]
    rows=[[t.clean(x) for x in row] for row in df.values.tolist()]
    labels=[t.fold(r[0]) for r in rows]
    pi=next((i for i,l in enumerate(labels) if re.match(r'^(?:MAX |MAXIMALE |NENN)?LEISTUNG(?: |$)|^SYSTEMLEISTUNG',l)),None)
    result=[]
    def add(variant,p,cc,kind,years,header,cch,notes=''):
        if t.foreign_market(' '.join([variant,p,notes])):return
        if re.search(r'48V|HYBRID|\bHEV\b|\bPHEV\b|\bMHEV\b|ALPINA|SCHNITZER|\bCRX\b|\bA 32K\b|\bA 38\b',variant+' '+kind,re.I):return
        variant=short_name(variant)
        if not variant:return
        out=t.engine(variant,p,cc,kind,context,source,number,header,cch,years)
        if out:
            if out['displacementCc'] is None and out['displacementLitresNominal'] is None:
                litre=re.fullmatch(r'([0-9][.,][0-9])\s*l',t.clean(cc),re.I)
                if litre:out['displacementLitresNominal']=float(litre[1].replace(',','.'))
            out['sourceScope']['rowNotes']=notes[:250] or None
            result.append(out)
    if pi is not None:
        ci=next((i for i,l in enumerate(labels) if 'HUBRAUM' in l or l=='DISPLACEMENT'),None)
        fi=[i for i,l in enumerate(labels) if l in ('MOTORTYP','MOTORART','KRAFTSTOFF','ANTRIEBSART','BAUART')]
        yi=next((i for i,l in enumerate(labels) if 'BAUZEIT' in l or 'PRODUKTION' in l),None)
        vi=next((i for i,r in enumerate(rows[:5]) if (not r[0] or re.match(r'KENNGRO|MODELL|MOTORISIERUNG',labels[i])) and sum(bool(x) for x in r)>1),None)
        ni=[i for i,l in enumerate(labels) if re.search(r'AUSFUHRUNG|MARKT|COUNTRY',l)]
        for j in range(1,len(cols)):
            v=rows[vi][j] if vi is not None else cols[j]
            if v.isdigit() and str(cols[0]).isdigit() and vi is None or v.startswith('Unnamed'):continue
            add(v,rows[pi][j],rows[ci][j] if ci is not None else '', ' '.join(rows[i][j] for i in fi),rows[yi][j] if yi is not None else '',rows[pi][0],rows[ci][0] if ci is not None else '', ' '.join(rows[i][j] for i in ni))
        return result
    # Some tables use a literal header row beneath a spanning body-type heading.
    if not any(re.search(r'POWER|LEISTUNG|VYKON|\bKW\b',t.fold(c)) for c in cols):
        hi=next((i for i,row in enumerate(rows[:4]) if any(re.search(r'POWER|LEISTUNG|VYKON|\bKW\b',t.fold(c)) for c in row)),None)
        if hi is not None:cols=rows[hi];rows=rows[hi+1:]
    pi=next((i for i,c in enumerate(cols) if re.search(r'POWER|LEISTUNG|VYKON|\bKW\b',t.fold(c)) and not re.search(r'WEIGHT|GEWICHT',t.fold(c))),None)
    if pi is None:return []
    ci=next((i for i,c in enumerate(cols) if re.search(r'DISPLACEMENT|HUBRAUM|CAPACITY|OBJEM',t.fold(c))),None)
    fi=next((i for i,c in enumerate(cols) if re.search(r'^FUEL|KRAFTSTOFF|MOTORART|MOTORTYP',t.fold(c))),None)
    vi=next((i for i,c in enumerate(cols) if re.search(r'^MOTORCODE$|^ENGINE CODE$',t.fold(c))),None)
    if vi is None:vi=next((i for i,c in enumerate(cols) if re.search(r'MODELL|MODEL|NAME|ENGINE DESIGNATION|MOTORISIERUNG|^ENGINE$|^MOTOR$',t.fold(c))),0)
    # Prefer a model's engine badge when present, rather than a shared factory code.
    badge=next((i for i,c in enumerate(cols) if t.fold(c) in ('MODELL','MODEL','MODEL NAME')),None)
    if badge is not None:vi=badge
    yi=next((i for i,c in enumerate(cols) if re.search(r'YEARS|PRODUCTION|BAUZEIT',t.fold(c))),None)
    ni=[i for i,c in enumerate(cols) if re.search(r'NOTES|MARKET|COUNTRY|ANMERKUNG|BEMERKUNG',t.fold(c))]
    # The lowest header tier can mark petrol, but a spanning Diesel row overrides it.
    category=' '.join(re.findall(r'Ottomotoren|Benzinmotoren|Dieselmotoren|Petrol|Diesel', ' '.join(cols), re.I))
    if re.search(r'DIESEL',category,re.I) and re.search(r'OTTO|BENZIN|PETROL',category,re.I):category=''
    for row in rows:
        distinct={x for x in row if x}
        if len(distinct)==1:
            v=next(iter(distinct))
            if t.fuel(v,''):category=v
            continue
        kind=(row[fi] if fi is not None else '')+' '+category
        add(row[vi],row[pi],row[ci] if ci is not None else '',kind,row[yi] if yi is not None else '',cols[pi],cols[ci] if ci is not None else '', ' '.join(row[i] for i in ni))
    return result

def page_rows(tree,source,card):
    title=t.clean(tree.xpath('string(//h1)'));production=None;default_fuel=''
    for tr in tree.xpath('(//table)[1]//tr'):
        text=t.clean(tr.text_content())
        if re.match(r'Production\b|Produktionszeitraum\b|Výroba\b',text,re.I) and production is None:production=t.year_span(text)
        if text.startswith('Motoren ') and re.search('Ottomotor',text,re.I) and not re.search('Diesel|Elektro|Hybrid',text,re.I):default_fuel='Ottomotoren'
    # Infobox years are source evidence; include them for date-based article attribution.
    anchor=title+(f' ({production[0]}–{production[1]})' if production else '')
    headings={};result=[];table_number=0
    for el in tree.iter():
        tag=el.tag if isinstance(el.tag,str) else ''
        if re.fullmatch('h[2345]',tag):
            level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=t.clean(el.text_content())
        if tag!='table':continue
        table_number+=1
        if el is tree.xpath('(//table)[1]')[0] or el.xpath('ancestor::table'):continue
        txt=el.text_content()
        if not re.search(r'\bkW\b',txt,re.I):continue
        context=list(headings.values())
        for row in table_rows(el,' / '.join(context)+(' / '+default_fuel if default_fuel else ''),source,table_number):
            attribution=t.generation_attribution(card,anchor,context,row,production)
            if attribution is None:
                # Mercedes article titles use a bare series number, while cards use W/C/A.
                m=re.search(r'Mercedes-Benz (?:Baureihe |[WRCAVXH] ?)(\d{3})\b',title)
                if m:
                    matches=[i for i,g in enumerate(card['generations']) if re.search(r'\b[WRCAVXH]'+m[1]+r'\b',g.get('code') or '')]
                    if len(matches)==1:
                        gi=matches[0];span=t.year_span(row['sourceScope'].get('variantYears') or '');g=card['generations'][gi]
                        if span and (span[0]<g['from'] or span[1]>(g.get('to') or 2026)):continue
                        attribution=(gi,{'method':'series-number-article','anchor':title,'seriesNumber':m[1],'fromYear':production[0] if production else None,'toYear':production[1] if production else None,'rowFromYear':span[0] if span else None,'rowToYear':span[1] if span else None,'generationIndex':gi})
            if attribution:
                gi,ev=attribution;row['sourceScope']['generationEvidence']=ev;result.append((gi,row))
    return result

def urls(item,card):
    key=item['make']+'/'+item['line'];gi=item['generationIndex']
    leads=LEADS.get(key,{}).get(gi,[])
    out=[('https://en.wikipedia.org/wiki/'+x[3:] if x.startswith('en:') else 'https://de.wikipedia.org/wiki/'+x) for x in leads]
    if key=='honda/civic':out.insert(0,f'https://de.wikipedia.org/wiki/Honda_Civic_{gi+1}._Generation')
    if key in FAMILIES:out.insert(1,'https://de.wikipedia.org/wiki/'+FAMILIES[key])
    # Family articles only contribute rows when the parser proves generation scope.
    for u in item['sources']+card.get('sources',[]):
        if re.match(r'https://(?:en|de|cs)\.wikipedia\.org/wiki/',u) and u not in out:out.append(u)
    return list(dict.fromkeys(out))[:6]

def research(item):
    make,line,gi=item['make'],item['line'],item['generationIndex']
    card=INDEX[make][line];g=card['generations'][gi]
    result={**item,'attempts':[],'engines':[],'status':'no-source'}
    if not g.get('from'):
        result['reason']='Generation is undated/unidentified; no engine attribution guessed.';return result
    for url in urls(item,card):
        tree,canonical,error=t.fetch(url)
        attempt={'url':url,'canonical':canonical,'error':error}
        result['attempts'].append(attempt)
        if tree is None:continue
        rows=[];seen=set()
        for target,row in page_rows(tree,canonical,card):
            if target!=gi or not row.get('displacementCc') and not row.get('displacementLitresNominal') and row['fuel']!='electric':continue
            v=t.fold(row['variant'])
            if make=='bmw' and line=='rada-5' and re.search(r'\bM5\b',v):continue
            if make=='audi' and line in ('a3','a6') and re.search(r'\bR?S'+line[1:]+r'\b',v):continue
            if len(row['variant'])>75:continue
            key=(row['variant'].lower(),row['powerKwMin'])
            if key in seen:continue
            seen.add(key);rows.append(row)
        attempt['usableRows']=len(rows)
        if rows:
            result['engines']=rows;result['status']='candidates';break
    if not result['engines']:result['reason']='No usable European engine table with explicit kW and unambiguous generation evidence; hybrid combined outputs and ambiguous rows skipped.'
    return result

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--batch',type=int,default=1);ap.add_argument('--offset',type=int,default=0);ap.add_argument('--size',type=int,default=100);args=ap.parse_args()
    INDEX=t.load('src/data/model-cards-index.json')
    queue=t.load('analysis/codex/badge-routing/wave-1-second-source-queue.json')['generations'][args.offset:args.offset+args.size]
    revision=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for r in pool.map(research,queue):
            results.append(r)
            print(json.dumps({'id':r['make']+'/'+r['line'],'generation':r['generationIndex'],'rows':len(r['engines']),'pages':len(r['attempts'])}),flush=True)
            t.write(OUT+f'/staged/candidates-{args.batch}.json',{'baselineRevision':revision,'offset':args.offset,'generations':results,'complete':False})
    t.write(OUT+f'/staged/candidates-{args.batch}.json',{'baselineRevision':revision,'offset':args.offset,'generations':results,'complete':True})
