"""Bulk Wikipedia engine-table enrichment. Never edits generation identities, years or assets.
Usage: python -B analysis/codex/engine-throughput.py --batch 2 --size 50 [--preview]
Dependencies available in the local FreeCAD Python: pandas + lxml. No raw HTML is saved.
"""
import argparse, concurrent.futures, hashlib, io, json, os, re, subprocess, sys, threading, unicodedata
import urllib.parse, urllib.request
import lxml.html
import pandas as pd

sys.stdout.reconfigure(encoding='utf8')
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
OUT='analysis/codex/engine-throughput'
os.makedirs(OUT,exist_ok=True)
def load(p):
    with open(p,encoding='utf8') as f:return json.load(f)
def write(p,obj):
    with open(p,'w',encoding='utf8',newline='\n') as f:json.dump(obj,f,ensure_ascii=False,indent=2);f.write('\n')
def git_json(p,revision):return json.loads(subprocess.check_output(['git','show',f'{revision}:{p}']))
def normalized(v):
    if isinstance(v,float) and v.is_integer():return int(v)
    if isinstance(v,list):return [normalized(x) for x in v]
    if isinstance(v,dict):return {k:normalized(x) for k,x in v.items()}
    return v
def sha(v):return hashlib.sha256(json.dumps(normalized(v),ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
def clean(s):
    s='' if pd.isna(s) else str(s)
    s=re.sub(r'\[[^\]]*\]','',s)
    return ' '.join(s.split())

def variant_name(value):
    value=clean(value)
    # pandas appends .1/.2 to duplicate labels; Mercedes M102.922 is a real code.
    if not re.fullmatch(r'(?:\d+\.\d+|[A-Za-z]{1,4}\d{2,4}\.\d{2,4})',value):value=re.sub(r'\.\d{1,2}$','',value)
    value=re.sub(r'^(?:(?:Benzin|Diesel|Petrol|Gasoline|Otto)(?:motor(?:en)?| engines?)?)[\s:–-]+','',value,flags=re.I)
    value=re.sub(r'\s*\((?:petrol|diesel|gasoline|benzin)\)','',value,flags=re.I)
    value=re.sub(r'\s+[-–]\s+(?:Van\b|Saloon\b|Estate\b|Hatchback\b|Sedan\b|\d{2}/\d{2}).*$','',value,flags=re.I)
    value=re.sub(r'\binline[- ](?:four|six|three)\b','',value,flags=re.I)
    value=' '.join(value.split()).strip(' ,;-')
    if re.fullmatch(r'motor(?:en)?|engine(?:s)?|benzin|diesel|petrol|gasoline|ottomotor(?:en)?|unnamed(?::.*)?',value,re.I):return None
    return value or None

NON_EUROPE=r'\b(?:Thailand|China|Chinese|Japan|Japanese.market|India|Indian.market|Indonesia|Malaysia|Taiwan|Brazil|Argentina|Mexico|Pakistan|Iran|Australia|New.Zealand|South.Africa|North.America|USA|US|United.States|Canada|US.spec|Nordamerika|Südamerika|Australien|Indien|Neuseeland|Kanada|Südafrika|Japonsko|Indie|Čína|Brazílie)\b'
def foreign_market(text):
    # An explicit exclusion of that market does not make a European row foreign.
    text=re.sub(r'(?:not (?:offered |sold |available )?in|except|excluding)\s+'+NON_EUROPE,'',text,flags=re.I)
    return bool(re.search(NON_EUROPE,text,re.I))

def year_span(text):
    years=[int(x) for x in re.findall(r'\b(?:18|19|20)\d{2}\b',str(text))]
    if not years:return None
    return [min(years),2026 if re.search(r'present|current|seit|dosud|současnost',str(text),re.I) else max(years)]

def generation_attribution(card,title,context,row,production):
    """A generation heading/article or an unambiguous row interval; never endpoint scoring."""
    gs=card['generations'];eligible=[i for i,g in enumerate(gs) if g.get('from') and g.get('dateBasis')!='announcement']
    own=len(fold(card['name']))>=3 and fold(card['name']) in fold(title)
    # Outer generation headings outrank inner headings such as Engines (1995–2010).
    anchors=[('generation-heading',x) for x in context if re.search(r'generation|generace',x,re.I)]
    if not anchors:
        anchors=[('generation-article',title)]+[('generation-heading',x) for x in context if any((codes(g)&token(x))&set(re.findall(r'\b[A-Z]+\d+[A-Z0-9]*\b',fold(x))) for g in gs) and not re.search(r'engine|motor|diesel|petrol|leistung',x,re.I)]
    selected=None;ev=None
    for method,anchor in anchors:
        ts=token(anchor);span=year_span(anchor);start=span[0] if span else None
        ords={ORDINALS[w] for w in ts if w in ORDINALS};scores=[]
        for i in eligible:
            g=gs[i];ct=codes(g);common=set.intersection(*(codes(gs[j]) for j in eligible)) if len(eligible)>1 else set()
            strong={c for c in ct-common if re.fullmatch(r'[A-Z]+\d+[A-Z0-9]*|\d+[A-Z]+[A-Z0-9]*',c)}
            score=20*len(strong&ts)
            if own and (ct&{'I','II','III','IV','V','VI','VII','VIII','IX','X'})&(ts|ords):score+=12
            if method=='generation-article' and own and ct&ts&set('ABCDEFGHIJKL'):score+=12
            if start is not None and abs(g['from']-start)<=1:score+=15
            if score:scores.append((score,i))
        if not scores:continue
        best=max(s for s,i in scores);hits=[i for s,i in scores if s==best]
        if len(hits)!=1:continue
        selected=hits[0]
        if span is None and method=='generation-article':span=production
        ev={'method':method,'anchor':anchor[:180],'fromYear':span[0] if span else None,'toYear':span[1] if span and span[1]!=span[0] else None}
        break
    rowspan=year_span(row['sourceScope'].get('variantYears') or '')
    def contained(i,span):return gs[i]['from']<=span[0] and span[1]<=(gs[i].get('to') or 2026)
    if selected is not None:
        g=gs[selected]
        # An article may combine catalogue stages (e.g. Caddy 2003–2020).
        broad=ev['fromYear'] is not None and ev['toYear'] is not None and any(ev['fromYear']<gs[i]['from']<ev['toYear'] for i in eligible if i!=selected)
        if rowspan:
            if ev['fromYear'] is not None and rowspan[1]<ev['fromYear']:return None
            if ev['toYear'] is not None and rowspan[0]>ev['toYear']:return None
            if broad:
                hits=[i for i in eligible if contained(i,rowspan)]
                if len(hits)!=1:return None
                selected=hits[0];ev['method']='row-years-within-table-envelope'
            elif not contained(selected,rowspan):return None
        elif broad:return None
        if ev['fromYear'] is not None and ev['fromYear']>(gs[selected].get('to') or 2026):return None
        if ev['toYear'] is not None and ev['toYear']<gs[selected]['from']:return None
    elif rowspan:
        hits=[i for i in eligible if contained(i,rowspan)]
        if len(hits)!=1:return None
        selected=hits[0];ev={'method':'row-years','anchor':title[:180],'fromYear':rowspan[0],'toYear':rowspan[1]}
    elif len(gs)==1 and len(eligible)==1 and own and production and abs(production[0]-gs[0]['from'])<=1:
        selected=0;ev={'method':'single-generation-production','anchor':title[:180],'fromYear':production[0],'toYear':production[1]}
    else:return None
    ev.update({'generationIndex':selected,'rowFromYear':rowspan[0] if rowspan else None,'rowToYear':rowspan[1] if rowspan else None})
    return selected,ev
def fold(s):return re.sub(r'[^A-Z0-9]+',' ',unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().upper()).strip()
def token(s):return set(fold(s).split())
ORDINALS={'FIRST':'I','SECOND':'II','THIRD':'III','FOURTH':'IV','FIFTH':'V','SIXTH':'VI','SEVENTH':'VII','EIGHTH':'VIII','NINTH':'IX','TENTH':'X',
 'ERSTE':'I','ZWEITE':'II','DRITTE':'III','VIERTE':'IV','FUNFTE':'V','SECHSTE':'VI','SIEBTE':'VII','ACHTE':'VIII'}

cache={}; lock=threading.Lock()
def fetch(url):
    with lock:
        if url in cache:return cache[url]
    try:
        # Wikipedia URLs in the catalogue are already source leads. Unicode paths need quoting.
        u=urllib.parse.urlsplit(url);safe=urllib.parse.urlunsplit((u.scheme,u.netloc,urllib.parse.quote(urllib.parse.unquote(u.path),safe='/()_,-'),u.query,''))
        req=urllib.request.Request(safe,headers={'User-Agent':'VozodromCatalogueResearch/1.0'})
        with urllib.request.urlopen(req,timeout=18) as r:html=r.read(6000000)
        tree=lxml.html.fromstring(html)
        canonical=tree.xpath('//link[@rel="canonical"]/@href')
        result=(tree,canonical[0] if canonical else safe,None)
    except Exception as e:result=(None,url,f'{type(e).__name__}: {str(e)[:140]}')
    with lock:cache[url]=result
    return result

def codes(g):
    text=f"{g.get('code') or ''} {g.get('name') or ''}"
    return token(text)-{'TYP','TYPE','MK','MODEL','GENERATION','GENERACE','RADA','TRIDA','STANDARDNI','KAROSERIE'}
def choose_gen(card,title,context,url):
    gs=card['generations'];eligible=[i for i,g in enumerate(gs) if g.get('from') and g.get('dateBasis')!='announcement']
    if not eligible:return None
    # The nearest containing generation heading wins; engine/fuel subheadings cannot
    # cause the preceding generation to bleed into the next one.
    candidates=[]
    own_model=len(fold(card['name']))>=3 and fold(card['name']) in fold(title)
    for item in [*reversed(context),title]:
        t=token(item);normalized=fold(item)
        ords={ORDINALS[w] for w in t if w in ORDINALS}
        years={int(y) for y in re.findall(r'\b(?:18|19|20)\d{2}\b',item)}
        for i in eligible:
            g=gs[i];ct=codes(g)
            strong={c for c in ct if re.fullmatch(r'[A-Z]+\d+[A-Z0-9]*|\d+[A-Z]+[A-Z0-9]*',c)}
            score=12*len(strong&t)
            # A clear roman generation or body/chassis code in the title/heading.
            romans={'I','II','III','IV','V','VI','VII','VIII','IX','X'}
            if own_model and (ct&romans)&(t|ords):score+=8
            # Letter generations (Astra F, Corsa B) only count in a model title.
            if item==title and len(ct&t&set('ABCDEFGHIJKL')):score+=8
            if g['from'] in years:score+=10
            elif any(abs(g['from']-y)==1 for y in years):score+=3
            if score:candidates.append((score,i))
        if candidates:
            best=max(s for s,_ in candidates);hits={i for s,i in candidates if s==best}
            return next(iter(hits)) if len(hits)==1 else None
    # Single-generation pages only; ambiguous undivided families stay untouched.
    explicit_generation=any(re.search(r'generation|generace',x,re.I) for x in context)
    if len(eligible)==1 and len(gs)==1 and own_model and not explicit_generation:return eligible[0]
    return None

def power(s,header=''):
    s=clean(s).replace('\u202f',' ').replace('\xa0',' ')
    # Explicit kW only, or a numeric cell under a kW-labelled power column.
    if re.search(r'\d[\d.,]*\s*[-–−/]\s*\d[\d.,]*\s*kW\b',s,re.I):return None
    vals=re.findall(r'(?<![\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*kW\b',s,re.I)
    if not vals and re.search(r'\bkW\b',header,re.I):
        m=re.match(r'^(\d{1,4}(?:[.,]\d{1,2})?)\b',s)
        if m:vals=[m[1]]
    nums=sorted({float(v.replace(',','.')) for v in vals})
    # Ranges, combined ICE/electric columns and alternative figures need manual scope.
    if len(nums)!=1 or not 5<=nums[0]<=1500:return None
    return int(nums[0]) if nums[0].is_integer() else nums[0]

def displacement(s,header=''):
    s=clean(s)
    m=re.search(r'(\d[\d,.\s]{1,8})\s*(?:cc\b|cm[³3]|cm\^3)',s,re.I)
    if m:
        v=int(re.sub(r'\D','',m[1]));return v if 400<=v<=10000 else None
    if re.search(r'displacement|hubraum|objem|capacity',header,re.I):
        if re.fullmatch(r'\d[\d, .]*',s):
            v=int(re.sub(r'\D','',s));return v if 400<=v<=10000 else None
    return None

def fuel(text,context):
    s=fold(text);c=fold(context)
    # Row-specific evidence first, then the enclosing fuel section.
    for v in [s,c]:
        if re.search(r'\bPHEV\b|PLUG IN',v):return 'petrol-phev'
        if re.search(r'\bMHEV\b|MILD HYBRID',v):return 'petrol-mhev'
        if re.search(r'\bCNG\b|\bTGI\b|G TEC|ERDGAS',v):return 'petrol-cng'
        if re.search(r'\bLPG\b|ECO G|AUTOGAS',v):return 'petrol-lpg'
        if re.search(r'DIESEL|DIESELMOTOR|TURBODIESEL|\bTDI\b|\bH?DCI\b|\bH?D[IY]\b|\bD4D\b|\bDDIS\b|\bCDTI\b|\bCRDI\b|\bTDCI\b|\bDTEC\b|\bDIESEL\b',v):return 'diesel'
        if re.search(r'PETROL|GASOLINE|BENZIN|OTTOMOTOR|\bTSI\b|\bFSI\b|\bMPI\b|\bTCB?E\b|PURETECH|VTI|\bTHP\b',v):return 'petrol'
        if re.search(r'ELECTRIC|ELEKTROMOTOR|ELEKTROANTRIEB|BATTERY ELECTRIC',v):return 'electric'
    return None

def engine(variant,powcell,cccell,fuels,context,source,table,header='',ccheader='',years=''):
    original=clean(variant)
    if foreign_market(original+' '+clean(years)+' '+context):return None
    variant=variant_name(original)
    if not variant or len(variant)>150 or re.search(r'concept|prototype|prototyp|renn|racing|experimental|impuls',variant+' '+context,re.I):return None
    if re.search(r'hybrid|\b[PM]HEV\b|petrol\s*(?:&|and|/)\s*electric',variant+' '+clean(fuels)+' '+context.split('/')[-1],re.I):return None
    kw=power(powcell,header)
    if kw is None:return None
    kind=fuel(' '.join([clean(fuels),variant]),context)
    if not kind:return None
    # Combined hybrid outputs require an explicit combined/system label.
    if kind in ('petrol-phev','petrol-mhev') and not re.search(r'system|combined|gesamt',header+' '+clean(powcell),re.I):return None
    cc=None if kind=='electric' else displacement(cccell,ccheader)
    nominal=None
    if kind!='electric':
        m=re.search(r'(?<![\w])([0-9][.,][0-9])(?:\s*L)?\b',variant)
        if m:nominal=float(m[1].replace(',','.'))
        elif cc is not None:nominal=round(cc/1000,1)
    return {'fuel':kind,'displacementCc':cc,'displacementLitresNominal':nominal,
      'powerKwMin':kw,'powerKwMax':kw,'availablePowerKw':[kw],
      'powerRangeCoverage':'documented-versions-only','variant':variant,'sources':[source],
      'sourceScope':{'tableIndex':table,'tableSection':context[:250],'variantYears':clean(years)[:150] or None,'originalVariant':original[:200],
       'noteCs':'Vybraná doložená motorizace z tabulky; dostupnost se liší podle trhu a roku. Nejde o úplný český ceník.'}}

def parse_table(table,context,source,number):
    # Clean style/reference nodes before pandas expands rowspan/colspan.
    table=lxml.html.fromstring(lxml.html.tostring(table,encoding='unicode'))
    for el in table.xpath('.//style|.//script|.//sup|.//table'):el.drop_tree()
    try:df=pd.read_html(io.StringIO(lxml.html.tostring(table,encoding='unicode')),flavor='lxml')[0].fillna('')
    except Exception:return []
    if df.shape[1]<2 or df.shape[0]>250:return []
    cols=[' '.join(clean(c) for c in x) if isinstance(x,tuple) else clean(x) for x in df.columns]
    rows=[[clean(x) for x in row] for row in df.values.tolist()]
    result=[]
    # German transposed specification tables: each column is a variant.
    labels=[fold(r[0]) for r in rows]
    pi=next((i for i,l in enumerate(labels) if re.search(r'^(MAX |MAXIMALE |NENN)?LEISTUNG(?: |$)|^SYSTEMLEISTUNG',l)),None)
    if pi is not None:
        ci=next((i for i,l in enumerate(labels) if 'HUBRAUM' in l or l=='DISPLACEMENT'),None)
        fi=next((i for i,l in enumerate(labels) if l in ('MOTORTYP','MOTORART','KRAFTSTOFF','ANTRIEBSART')),None)
        yi=next((i for i,l in enumerate(labels) if 'BAUZEIT' in l or 'PRODUKTION' in l),None)
        vi=next((i for i,r in enumerate(rows[:5]) if (not r[0] or fold(r[0]) in ('MODELL','KENNGROSSEN','MOTORISIERUNG')) and sum(bool(x) for x in r)>1),None)
        for j in range(1,len(cols)):
            variant=rows[vi][j] if vi is not None else cols[j]
            if variant.isdigit() or variant.startswith('Unnamed'):continue
            out=engine(variant,rows[pi][j],rows[ci][j] if ci is not None else '',rows[fi][j] if fi is not None else '',context,source,number,rows[pi][0],rows[ci][0] if ci is not None else '',rows[yi][j] if yi is not None else '')
            if out:result.append(out)
        return result
    # Conventional row-per-engine tables.
    pi=next((i for i,c in enumerate(cols) if re.search(r'power|leistung|vykon',fold(c),re.I) and not re.search(r'weight|gewicht',c,re.I)),None)
    if pi is None:return []
    ci=next((i for i,c in enumerate(cols) if re.search(r'displacement|hubraum|capacity|objem',c,re.I)),None)
    fi=next((i for i,c in enumerate(cols) if re.search(r'^fuel(?: type)?$|kraftstoff|motorart|motortyp',c,re.I)),None)
    vi=next((i for i,c in enumerate(cols) if re.search(r'^model|^modell|^name|^engine designation|^motorisierung|^engine$|^motor$',c,re.I)),0)
    yi=next((i for i,c in enumerate(cols) if re.search(r'^years|production|bauzeit',c,re.I)),None)
    ni=[i for i,c in enumerate(cols) if re.search(r'notes?|market|country|anmerkung',c,re.I)]
    category=context
    for row in rows:
        if re.search(r'concept|prototype|prototyp|experimental|impuls',' '.join(row),re.I):continue
        if foreign_market(' '.join(row[i] for i in ni)):continue
        # Repeated spanning headers separate petrol and diesel rows in a single table.
        distinct={x for x in row if x}
        if len(distinct)==1:
            cat=next(iter(distinct));
            if fuel(cat,''):category=context+' / '+cat
            continue
        fuels=row[fi] if fi is not None else ''
        # Some English tables put petrol/diesel in a second header tier.
        header_fuel=' '.join(dict.fromkeys(re.findall(r'petrol|diesel|gasoline',' '.join(cols),re.I)))
        out=engine(row[vi],row[pi],row[ci] if ci is not None else '',fuels,category+' '+header_fuel,source,number,cols[pi],cols[ci] if ci is not None else '',row[yi] if yi is not None else '')
        if out:
            out['sourceScope']['rowNotes']=' '.join(row[i] for i in ni)[:250] or None
            result.append(out)
    return result

def page_rows(tree,source,card):
    title=clean(tree.xpath('string(//h1)'))
    headings={};result=[];table_number=0;production=None
    for tr in tree.xpath('//table[contains(@class,"infobox")][1]//tr'):
        text=clean(tr.text_content())
        if re.match(r'Production\b|Produktionszeitraum\b|Výroba\b',text,re.I):production=year_span(text);break
    for el in tree.iter():
        tag=el.tag if isinstance(el.tag,str) else ''
        if re.fullmatch('h[2345]',tag):
            level=int(tag[1]);headings={k:v for k,v in headings.items() if k<level};headings[level]=clean(el.text_content())
        if tag!='table':continue
        table_number+=1
        if 'infobox' in el.get('class','') or el.xpath('ancestor::table'):continue
        txt=el.text_content()
        if not re.search(r'\bkW\b',txt,re.I) or not re.search(r'power|leistung|vykon',txt,re.I):continue
        context=list(headings.values())
        for row in parse_table(el,' / '.join(context),source,table_number):
            attribution=generation_attribution(card,title,context,row,production)
            if attribution is None:continue
            gi,evidence=attribution;row['sourceScope']['generationEvidence']=evidence;result.append((gi,row))
    return result

def wiki_urls(card):
    sources=[u for g in card['generations'] for u in g.get('sources',[])]+card.get('sources',[])
    sources=list(dict.fromkeys(u for u in sources if re.match(r'https://(?:en|de|cs)\.wikipedia\.org/',u) and not re.search(r'List_of_|Liste_|Seznam_',u)))
    # Model/generation articles before list pages; prefer tables in German when supplied.
    return sorted(sources,key=lambda u:(0 if '//de.' in u else 1 if '//en.' in u else 2))[:14]

def research_line(item):
    make,line,card=item;attempts=[];found=[];seen=set();urls=wiki_urls(card)
    for url in urls:
        tree,canonical,error=fetch(url)
        attempts.append({'url':url,'canonical':canonical,'error':error})
        if error or canonical in seen:continue
        seen.add(canonical);found.extend(page_rows(tree,url,card))
        # Follow generation articles linked from a generic family/disambiguation article.
        children=[]
        page_name=re.sub(r'\([^)]*\)','',clean(tree.xpath('string(//h1)')))
        models=[fold(card['name']),fold(page_name)]
        for link in tree.xpath('//a[@href]'):
            href=link.get('href','');label=clean(link.text_content())
            child=urllib.parse.urljoin(canonical,href).split('#')[0]
            child_parts=urllib.parse.urlsplit(child)
            if child_parts.netloc!=urllib.parse.urlsplit(canonical).netloc or not child_parts.path.startswith('/wiki/') or ':' in child_parts.path or len(label)>100:continue
            child_title=urllib.parse.unquote(child_parts.path[6:]).replace('_',' ')
            # Exact line name as a phrase prevents engine/platform and cousin-model links.
            if not any(len(model)>=3 and model in fold(child_title) for model in models) or child in seen or child==canonical:continue
            gi=choose_gen(card,child_title,[],child)
            if gi is not None and len(token(child_title))>min(len(token(m)) for m in models):children.append(child)
        for child in list(dict.fromkeys(children))[:8]:
            ct,cc,ce=fetch(child)
            if cc in seen:continue
            seen.add(cc);attempts.append({'url':child,'canonical':cc,'error':ce})
            if ct is not None:found.extend(page_rows(ct,child,card))
    # Dedupe gearbox/body repeats and repeated source tables.
    unique={}
    for gi,row in found:
        # Explicit sibling badges in a family article are not this catalogue line.
        v=fold(row['variant'])
        if make=='audi' and re.fullmatch(r'a[3468]',line) and re.search(r'\bR?S'+line[1:]+r'\b',v):continue
        if make=='bmw' and line in ('rada-3','rada-5') and re.search(r'\bM'+line[-1]+r'\b',v):continue
        if make=='mercedes-benz' and line=='vito' and re.search(r'\bEQV\b',v):continue
        if make=='peugeot' and line=='partner' and 'BERLINGO' in v:continue
        # Mainstream petrol/diesel engines require at least a sourced size.
        if row['fuel']!='electric' and row['displacementCc'] is None and row['displacementLitresNominal'] is None:continue
        key=(gi,row['fuel'],row['displacementCc'] or row['displacementLitresNominal'],row['powerKwMin'])
        unique.setdefault(key,row)
    return {'make':make,'line':line,'attempts':attempts,'rows':[{'generation':k[0],'engine':v} for k,v in unique.items()]}

def covered(existing,row):
    for e in existing:
        if variant_name(e.get('variant'))==row['variant'] and row['powerKwMin'] in (e.get('availablePowerKw') or [e.get('powerKwMin'),e.get('powerKwMax')]):return True
        if e.get('fuel')!=row['fuel']:continue
        samecc=e.get('displacementCc') is not None and row['displacementCc'] is not None and e['displacementCc']==row['displacementCc']
        samenom=e.get('displacementLitresNominal') is not None and row['displacementLitresNominal'] is not None and abs(e['displacementLitresNominal']-row['displacementLitresNominal'])<0.051
        if not(samecc or samenom or row['fuel']=='electric'):continue
        values=e.get('availablePowerKw') or [e.get('powerKwMin'),e.get('powerKwMax')]
        if row['powerKwMin'] in values:return True
    return False

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--batch',type=int,required=True);ap.add_argument('--size',type=int,default=50);ap.add_argument('--preview',action='store_true');ap.add_argument('--workers',type=int,default=5);ap.add_argument('--repair',action='store_true');args=ap.parse_args()
    audit=load('analysis/codex/catalog-completeness-audit.json');index=load('src/data/model-cards-index.json');progress=load('analysis/codex/catalog-sweep-progress.json')
    done={(r['makeSlug'],r['lineSlug']) for r in progress['rows'] if r.get('batch')}
    for file in os.listdir(OUT):
        if re.fullmatch(r'batch-\d+\.json',file):
            done.update((r['make'],r['line']) for r in load(OUT+'/'+file)['lines'])
    prior_report=load(OUT+f'/batch-{args.batch}.json') if args.repair else None
    repair_keys={(r['make'],r['line']) for r in prior_report['lines']} if prior_report else set()
    def wave_of(row):
        fleet=row['fleetN']
        return 1 if fleet is not None and fleet>=1000 else 2 if fleet is not None and fleet>0 else 3
    if args.repair:
        wave=prior_report['wave']
        queue=[r for r in audit['lines'] if (r['makeSlug'],r['lineSlug']) in repair_keys]
    else:
        remaining=[r for r in audit['lines'] if (r['makeSlug'],r['lineSlug']) not in done]
        wave=min((wave_of(r) for r in remaining),default=3)
        queue=[r for r in remaining if wave_of(r)==wave][:args.size]
    items=[(r['makeSlug'],r['lineSlug'],index[r['makeSlug']][r['lineSlug']]) for r in queue if r['cardPresent']]
    base_revision=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    # The first run's git revision is a compact, immutable baseline for subsequent batches.
    session_path=OUT+'/session.json'
    if not os.path.exists(session_path):write(session_path,{'baselineRevision':base_revision,'policy':'engine-only; no generation/year/facelift/body/asset/statistics changes'})
    session=load(session_path)
    print(f'batch {args.batch}: researching {len(items)} fleet-ranked lines',flush=True)
    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for result in pool.map(research_line,items):
            results.append(result)
            print(json.dumps({'line':result['make']+'/'+result['line'],'candidateRows':len(result['rows']),'pages':len(result['attempts'])}),flush=True)
    if args.preview:
        os.makedirs(OUT+'/staged',exist_ok=True);write(OUT+f'/staged/preview-{args.batch}.json',results);return
    target=OUT+f'/batch-{args.batch}.json';assert args.repair or not os.path.exists(target),'Batch already exists'
    source_files={};locations={}
    for directory in ['src/data/catalog/model-cards','src/data/model-cards']:
        for name in os.listdir(directory):
            if not name.endswith('.json'):continue
            file=directory+'/'+name;data=load(file)
            for card in data:locations[(card['makeSlug'],card['lineSlug'])]=(file,card)
            source_files[file]=data
    changed_files=set();report=[]
    if args.repair:
        old_by_file={}
        for previous in prior_report['lines']:
            file,card=locations[(previous['make'],previous['line'])]
            assert sha(card)==previous['afterHash'],'Concurrent source edit; repair refused'
            if file not in old_by_file:old_by_file[file]=git_json(file,session['baselineRevision'])
            original=next(c for c in old_by_file[file] if c['makeSlug']==previous['make'] and c['lineSlug']==previous['line'])
            card.clear();card.update(original)
            if previous['enginesAdded']:changed_files.add(file)
    for item in results:
        file,card=locations[(item['make'],item['line'])];before=sha(card);added=[]
        for parsed in item['rows']:
            gi=parsed['generation'];g=card['generations'][gi];row=parsed['engine'];existing=g.get('engines') or []
            if covered(existing,row):continue
            g['engines']=[*existing,row];g['engineCoverage']='representative-documented-versions'
            g['sources']=list(dict.fromkeys([*g.get('sources',[]),*row['sources']]))
            card['sources']=list(dict.fromkeys([*card.get('sources',[]),*row['sources']]))
            card['needsReview']=[r for r in card.get('needsReview',[]) if r.get('field')!=f'generations[{gi}].engines']
            added.append({'generation':gi,'fuel':row['fuel'],'cc':row['displacementCc'],'litres':row['displacementLitresNominal'],'kw':row['powerKwMin'],'variant':row['variant'],'sources':row['sources']})
        if added:changed_files.add(file)
        report.append({'make':item['make'],'line':item['line'],'status':'engines-added' if added else 'already-covered' if item['rows'] else 'no-source',
          'reason':None if added else 'No new distinct documented engine/power rows.' if item['rows'] else 'No usable table with unambiguous generation, fuel, size and explicit kW.',
          'beforeHash':before,'afterHash':sha(card),'sourceFile':file,'enginesAdded':len(added),'added':added,
          'generationStructureChanged':False,'parsedGenerations':sorted({r['generation'] for r in item['rows']}),
          'remainingGaps':'Structure, chronology, facelifts, body types and equipment unchanged; missing or ambiguous engine tables remain unfilled.',
          'sources':item['attempts']})
    for file in changed_files:write(file,source_files[file])
    batch={'schemaVersion':1,'batch':args.batch,'wave':wave,'baselineRevision':session['baselineRevision'],'countsBefore':prior_report['countsBefore'] if prior_report else audit['counts'],'lines':report,
      'summary':{'attempted':len(report),'touched':sum(bool(r['enginesAdded']) for r in report),'enginesAdded':sum(r['enginesAdded'] for r in report),'noSource':sum(r['status']=='no-source' for r in report),'alreadyCovered':sum(r['status']=='already-covered' for r in report),
      'generationsAdded':0,'generationsRemoved':0,'faceliftsAdded':0,'listingIdChanges':0,'statsRebuildRequired':False},'validation':'pending'}
    if args.repair:batch['qaRevision']='Excluded experimental/concept tables; badge-aware generation attribution; nominal litre parser rejects embedded model badges.'
    write(target,batch)
    print(json.dumps(batch['summary']),flush=True)

if __name__=='__main__':main()
