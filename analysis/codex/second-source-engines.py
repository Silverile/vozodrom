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
LEADS.update({
 'kia/rio':{2:['Kia_Rio'],3:['Kia_Rio'],4:['Kia_Rio'],5:['Kia_Rio']},
 'fiat/panda':{0:['Fiat_Panda_(Typ_141)'],2:['Fiat_Panda_(Typ_312)']},
 'mazda/cx-5':{i:['Mazda_CX-5'] for i in range(3)},
 'mercedes-benz/trida-v':{0:['Mercedes-Benz_W_638'],1:['Mercedes-Benz_W_639']},
 'peugeot/3008':{1:['Peugeot_3008_II','Peugeot_3008'],2:['Peugeot_3008_III','Peugeot_3008']},
 'bmw/rada-1':{0:['BMW_E87'],1:['BMW_F20'],2:['BMW_F40'],3:['BMW_F70']},
 'opel/vectra':{0:['Opel_Vectra_A'],1:['Opel_Vectra_B'],2:['Opel_Vectra_C']},
 'citroen/c5':{1:['Citroën_C5','Citroën_C5_(2008)']},
 'citroen/xsara-picasso':{0:['Citroën_Xsara_Picasso']},
 'mercedes-benz/glc':{1:['Mercedes-Benz_Baureihe_254']},
 'mg/zs':{0:['MG_ZS_(2017)'],1:['MG_ZS_(2024)','MG_ZS_(2017)']},
 'skoda/octavia-1959':{0:['Škoda_Octavia_(1959–1971)']},
 'jeep/grand-cherokee':{i:['Jeep_Grand_Cherokee'] for i in range(1,5)},
 'dacia/jogger':{0:['Dacia_Jogger']},
 'mercedes-benz/trida-b':{0:['Mercedes-Benz_Baureihe_245']},
 'mitsubishi/outlander':{i:['Mitsubishi_Outlander'] for i in range(4)},
 'opel/crossland':{0:['Opel_Crossland']},
 'mini/cooper':{0:['Mini_(R50)'],1:['Mini_(R56)'],3:['Mini_(J01)'],4:['Mini_(F66)','Mini_(F65)']},
 'opel/movano':{0:['Opel_Movano']},
 'audi/q5':{1:['Audi_Q5_FY'],2:['Audi_Q5_GU']},
 'kia/picanto':{i:['Kia_Picanto'] for i in range(3)},
 'peugeot/306':{0:['Peugeot_306']},
 'nissan/x-trail':{i:['Nissan_X-Trail'] for i in range(4)},
 'skoda/1203':{0:['Škoda_1203']},
 'opel/combo':{0:['Opel_Combo']},
 'fiat/500':{0:['Fiat_Nuova_500'],2:['Fiat_500_(2020)']},
 'fiat/tipo':{0:['Fiat_Tipo_(Typ_160)']},
 'mercedes-benz/trida-s':{0:['Mercedes-Benz_Baureihe_116'],1:['Mercedes-Benz_Baureihe_126'],3:['Mercedes-Benz_Baureihe_220'],4:['Mercedes-Benz_Baureihe_221']},
 'kia/stonic':{0:['Kia_Stonic']},
 'kia/sorento':{i:['Kia_Sorento'] for i in range(4)},
 'peugeot/rifter':{0:['Peugeot_Rifter']},
 'audi/a5':{1:['Audi_A5_F5']},
 'dacia/lodgy':{0:['Dacia_Lodgy']},
 'cupra/formentor':{0:['Cupra_Formentor']},
 'mercedes-benz/gls':{0:['Mercedes-Benz_X_164'],1:['Mercedes-Benz_X_166']},
 'nissan/micra':{i:['Nissan_Micra'] for i in range(5)},
 'fiat/bravo':{0:['Fiat_Bravo/Brava']},
 'bmw/rada-7':{0:['BMW_E23']},
 'kia/venga':{0:['Kia_Venga']},
 'citroen/xsara':{0:['Citroën_Xsara']},
 'mazda/cx-3':{0:['Mazda_CX-3']},
 'honda/jazz':{i:['Honda_Jazz'] for i in range(4)},
 'audi/q3':{1:['Audi_Q3_F3'],2:['Audi_Q3_FJ']},
 'bmw/x6':{0:['BMW_E71']},
 'peugeot/106':{0:['Peugeot_106']},
 'nissan/juke':{0:['Nissan_Juke'],1:['Nissan_Juke']},
 'mitsubishi/l200':{0:['Mitsubishi_L200'],1:['Mitsubishi_L200']},
})
LEADS.update({
 'bmw/x5':{4:['BMW_G65']},'bmw/x3':{3:['BMW_G45']},
 'mitsubishi/l200':{i:['Mitsubishi_L200'] for i in range(6)},
 'dacia/1300':{0:['Dacia_1300'],1:['Dacia_1310','Dacia_1300']},
 'opel/kadett':{0:['Opel_Kadett_(1936–1940)'],1:['Opel_Kadett_A'],2:['Opel_Kadett_B'],3:['Opel_Kadett_C'],4:['Opel_Kadett_D']},
 'peugeot/508':{0:['Peugeot_508_I','Peugeot_508']},
 'mitsubishi/colt':{i:['Mitsubishi_Colt'] for i in range(7)},
 'honda/accord':{i:[f'Honda_Accord_{i+1}._Generation','Honda_Accord'] for i in range(11)},
 'mercedes-benz/cla':{2:['Mercedes-Benz_Baureihe_174']},
 'land-rover/freelander':{i:['Land_Rover_Freelander'] for i in range(3)},
 'bmw/rada-4':{0:['BMW_F32']},
 'land-rover/discovery':{i:['Land_Rover_Discovery'] for i in range(5)},
 'fiat/stilo':{0:['Fiat_Stilo']},
 'mazda/5':{0:['Mazda5'],1:['Mazda5']},
 'fiat/uno':{1:['Fiat_Uno']},
 'porsche/911':{0:['Porsche_911_(Urmodell)'],1:['Porsche_911_(G-Modell)'],2:['Porsche_964'],3:['Porsche_993'],4:['Porsche_996'],5:['Porsche_997'],6:['Porsche_991'],7:['Porsche_992']},
 'mazda/mx-5':{i:['Mazda_MX-5'] for i in range(4)},
 'mazda/323':{i:['Mazda_323'] for i in range(7)},
 'honda/hr-v':{i:['Honda_HR-V'] for i in range(3)},
 'citroen/saxo':{0:['Citroën_Saxo']},
 'seat/arona':{0:['Seat_Arona']},
 'mitsubishi/lancer':{i:['Mitsubishi_Lancer'] for i in range(9)},
 'porsche/cayenne':{0:['Porsche_Cayenne_(Typ_9PA)'],1:['Porsche_Cayenne_(Typ_92A)'],2:['Porsche_Cayenne_(Typ_PO536)'],3:['Porsche_Cayenne_Electric']},
 'mitsubishi/pajero':{i:['Mitsubishi_Pajero'] for i in range(4)},
 'opel/omega':{0:['Opel_Omega']},
 'mercedes-benz/gla':{2:['Mercedes-Benz_GLA']},
 'opel/agila':{0:['Opel_Agila']},
 'peugeot/107':{0:['Peugeot_107']},
 'mazda/cx-30':{0:['Mazda_CX-30']},
 'audi/q8':{0:['Audi_Q8']},
 'dacia/bigster':{0:['Dacia_Bigster']},
 'audi/a8':{0:['Audi_A8_D2'],1:['Audi_A8_D3'],2:['Audi_A8_D4']},
 'peugeot/205':{0:['Peugeot_205']},
 'peugeot/405':{0:['Peugeot_405']},
 'jeep/cherokee':{0:['Jeep_Cherokee_(SJ)'],2:['Jeep_Cherokee_(KJ)'],3:['Jeep_Cherokee_(KK)']},
})
LEADS.update({
 'jeep/cherokee':{4:['Jeep_Cherokee_(KL)'],5:['Jeep_Cherokee_(KM)','Jeep_Cherokee']},
 'nissan/almera':{0:['Nissan_Almera'],1:['Nissan_Almera']},
 'moskvic/408':{0:['Moskwitsch-408']},
 'audi/80':{0:['Audi_80_B1'],1:['Audi_80_B2'],2:['Audi_80_B3']},
 'mercedes-benz/glb':{1:['Mercedes-Benz_GLB']},
 'mazda/626':{i:['Mazda_626'] for i in range(6)},
 'fiat/freemont':{0:['Fiat_Freemont']},
 'fiat/600':{0:['Fiat_600'],1:['Fiat_600_(2023)']},
 'land-rover/defender':{i:['Land_Rover_Defender'] for i in range(4)},
 'kia/carens':{i:['Kia_Carens'] for i in range(3)},
 'lada/niva':{0:['Lada_Niva']},
 'jeep/compass':{i:['Jeep_Compass'] for i in range(3)},
 'mitsubishi/space-star':{0:['Mitsubishi_Space_Star_(1998)'],1:['Mitsubishi_Space_Star_(2012)']},
 'nissan/note':{0:['Nissan_Note'],1:['Nissan_Note']},
 'nissan/navara':{0:['Nissan_Navara'],1:['Nissan_Navara'],2:['Nissan_Navara']},
 'jeep/wrangler':{i:['Jeep_Wrangler'] for i in range(4)},
 'peugeot/807':{0:['Peugeot_807']},
 'bmw/x7':{0:['BMW_G07']},
 'bmw/i3':{0:['BMW_i3']},
 'fiat/croma':{0:['Fiat_Croma_(Typ_154)']},
 'land-rover/range-rover-sport':{1:['Range_Rover_Sport']},
 'chevrolet/cruze':{0:['Chevrolet_Cruze'],1:['Chevrolet_Cruze']},
 'hyundai/elantra':{0:['Hyundai_Elantra']},
 'alfa-romeo/156':{0:['Alfa_Romeo_156']},
 'mercedes-benz/slk':{0:['Mercedes-Benz_Baureihe_170'],1:['Mercedes-Benz_Baureihe_171'],2:['Mercedes-Benz_Baureihe_172']},
 'bmw/z4':{0:['BMW_E85']},
 'land-rover/range-rover-evoque':{i:['Range_Rover_Evoque'] for i in range(3)},
 'opel/grandland':{0:['Opel_Grandland'],1:['Opel_Grandland']},
 'fiat/fiorino':{i:['Fiat_Fiorino'] for i in range(4)},
 'nissan/primera':{i:['Nissan_Primera'] for i in range(3)},
 'audi/tt':{2:['Audi_TT_FV']},
 'mg/hs':{0:['MG_HS'],1:['MG_HS']},
 'bmw/rada-6':{0:['BMW_E24']},
 'land-rover/range-rover':{0:['Range_Rover_Classic'],1:['Range_Rover_P38A'],4:['Range_Rover_L460']},
 'cupra/leon':{0:['Cupra_Leon']},
 'citroen/c4-cactus':{0:['Citroën_C4_Cactus']},
 'citroen/c8':{0:['Citroën_C8']},
 'bmw/rada-2':{0:['BMW_F22']},
 'mercedes-benz/trida-g':{2:['Mercedes-Benz_Baureihe_463'],4:['Mercedes-Benz_Baureihe_465']},
 'moskvic/2140':{0:['Moskwitsch-2140']},
 'mercedes-benz/cls':{1:['Mercedes-Benz_Baureihe_218'],2:['Mercedes-Benz_Baureihe_257']},
 'mercedes-benz/glk':{0:['Mercedes-Benz_Baureihe_204_(GLK)']},
 'citroen/c2':{0:['Citroën_C2']},
 'peugeot/309':{0:['Peugeot_309']},
 'mercedes-benz/clk':{0:['Mercedes-Benz_Baureihe_208']},
 'peugeot/301':{0:['Peugeot_301_(1932–1936)'],1:['Peugeot_301_(2012)']},
 'mercedes-benz/sl':{0:['Mercedes-Benz_W_113'],1:['Mercedes-Benz_Baureihe_107'],2:['Mercedes-Benz_Baureihe_129'],3:['Mercedes-Benz_Baureihe_230'],4:['Mercedes-Benz_Baureihe_231']},
})

def bmw_hybrid_rows(tree,source,card,gi):
    """Explicit system outputs only; never add ICE and electric power together."""
    code=card['generations'][gi].get('code')
    if code not in ('G45','G65'):return []
    if not re.search(r'\b'+code+r'\b',t.clean(tree.xpath('string(//h1)'))):return []
    out=[]
    for number,table in enumerate(tree.xpath('//table'),1):
        if 'Systemleistung' not in table.text_content():continue
        copy=t.lxml.html.fromstring(t.lxml.html.tostring(table,encoding='unicode'))
        for el in copy.xpath('.//style|.//script'):el.drop_tree()
        try:df=t.pd.read_html(io.StringIO(t.lxml.html.tostring(copy,encoding='unicode')),flavor='lxml')[0].fillna('')
        except Exception:continue
        rows=[[t.clean(v) for v in row] for row in df.values.tolist()];labels=[t.fold(row[0]) for row in rows];cols=[t.clean(c) for c in df.columns]
        def ri(name):return next((i for i,l in enumerate(labels) if l==name),None)
        pi,ci,fi,yi=ri('SYSTEMLEISTUNG'),ri('HUBRAUM'),ri('MOTORART'),ri('BAUZEITRAUM')
        if None in (pi,ci,fi,yi):continue
        for j in range(1,len(cols)):
            name=cols[j];kind=rows[fi][j];years=rows[yi][j]
            # Footnoted regional variants, future scheduled revisions, and iX5 siblings stay out.
            if re.search(r'\(\d+\)|^iX5',name,re.I):continue
            starts=re.match(r'(?:ab|seit)\s+(\d{2})/(20\d{2})',years)
            if starts and (int(starts[2]),int(starts[1]))>(2026,10):continue
            fuel='diesel-mhev' if 'Dieselmotor' in kind and 'Mild' in kind else 'petrol-mhev' if 'Ottomotor' in kind and 'Mild' in kind else 'petrol-phev' if 'Ottomotor + Elektromotor' in kind else None
            if fuel is None:continue
            kw=t.power(rows[pi][j]);cc=t.displacement(rows[ci][j],'Hubraum')
            if kw is None or cc is None:continue
            name=short_name(name)
            g=card['generations'][gi];span=t.year_span(years)
            scope={'tableIndex':number,'tableSection':f'BMW {code} / Systemleistung','variantYears':years,'originalVariant':cols[j], 'powerBasis':'explicit system output; not summed components','generationEvidence':{'method':'generation-article','anchor':f'BMW {code}','fromYear':g['from'],'toYear':g.get('to'),'generationIndex':gi,'rowFromYear':span[0] if span else None,'rowToYear':span[1] if span else None}}
            out.append({'fuel':fuel,'displacementCc':cc,'displacementLitresNominal':round(cc/1000,1),'variant':name,'powerKwMin':kw,'powerKwMax':kw,'availablePowerKw':[kw],'powerRangeCoverage':'documented-versions-only','sources':[source],'sourceScope':scope})
    return out

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
        text=' '.join(t.clean(cell.text_content()) for cell in tr.xpath('./th|./td')) or t.clean(tr.text_content())
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
                # Explicit numeric chassis articles remain unambiguous when production
                # overlaps the successor (e.g. Porsche 993 and 996 in 1997–1998).
                explicit=[i for i,g in enumerate(card['generations']) if re.fullmatch(r'\d{3}',g.get('code') or '') and re.search(r'\b'+re.escape(g['code'])+r'\b',title)]
                if len(explicit)==1 and production:
                    gi=explicit[0];g=card['generations'][gi];span=t.year_span(row['sourceScope'].get('variantYears') or '')
                    if abs(production[0]-g['from'])<=1 and (not span or g['from']<=span[0] and span[1]<=(g.get('to') or 2026)):
                        attribution=(gi,{'method':'generation-article','anchor':anchor,'fromYear':production[0],'toYear':production[1],'generationIndex':gi,'rowFromYear':span[0] if span else None,'rowToYear':span[1] if span else None})
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
    if item['make']=='mercedes-benz':
        # German roadster/GLK articles use R_170/X_204 rather than Baureihe_170.
        chassis=re.findall(r'\b([WRCAXVH])(\d{3})\b',card['generations'][gi].get('code') or '')
        out=[f'https://de.wikipedia.org/wiki/Mercedes-Benz_{letter}_{number}' for letter,number in chassis]+out
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
        if make=='bmw' and g.get('code') in ('G45','G65'):
            rows=bmw_hybrid_rows(tree,canonical,card,gi)
            attempt['usableRows']=len(rows)
            if rows:result['engines']=rows;result['status']='candidates';break
            result['reason']='No currently started, non-regional variant with explicit system power; future month-dated revisions and iX5 siblings skipped.'
            continue
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
    if not result['engines'] and not result.get('reason'):result['reason']='No usable European engine table with explicit kW and unambiguous generation evidence; hybrid combined outputs and ambiguous rows skipped.'
    return result

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--batch',type=int,default=1);ap.add_argument('--offset',type=int,default=0);ap.add_argument('--size',type=int,default=100);ap.add_argument('--queue',default='analysis/codex/badge-routing/wave-1-second-source-queue.json');args=ap.parse_args()
    INDEX=t.load('src/data/model-cards-index.json')
    queue=t.load(args.queue)['generations'][args.offset:args.offset+args.size]
    revision=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for r in pool.map(research,queue):
            results.append(r)
            print(json.dumps({'id':r['make']+'/'+r['line'],'generation':r['generationIndex'],'rows':len(r['engines']),'pages':len(r['attempts'])}),flush=True)
            t.write(OUT+f'/staged/candidates-{args.batch}.json',{'baselineRevision':revision,'queueSource':args.queue,'offset':args.offset,'generations':results,'complete':False})
    t.write(OUT+f'/staged/candidates-{args.batch}.json',{'baselineRevision':revision,'queueSource':args.queue,'offset':args.offset,'generations':results,'complete':True})
