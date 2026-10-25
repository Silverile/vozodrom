// Final five makes. Historical and modern MG share one make, with distinct reused ZS lines.
export const batch4Order=['jeep','alfa-romeo','lancia','smart','mg'];
export const batch4Selection={
jeep:`Cherokee|Jeep Cherokee|u
Grand Cherokee|Jeep Grand Cherokee|u
Wrangler|Jeep Wrangler|u
Renegade|Jeep Renegade|u
Compass|Jeep Compass|u
Patriot|Jeep Patriot|u
Commander|Jeep Commander (XK)|u
Gladiator|Jeep Gladiator (JT)|p
Avenger|Jeep Avenger|u
Wagoneer|Jeep Wagoneer|u
Grand Wagoneer|Jeep Grand Wagoneer|u
Wagoneer S|Jeep Wagoneer S|u
Comanche|Jeep Comanche|p`,
'alfa-romeo':`33|Alfa Romeo 33|hk
75|Alfa Romeo 75|s
90|Alfa Romeo 90|s
145|Alfa Romeo 145 and 146|h
146|Alfa Romeo 145 and 146|h
147|Alfa Romeo 147|h
155|Alfa Romeo 155|s
156|Alfa Romeo 156|sk
159|Alfa Romeo 159|sk
164|Alfa Romeo 164|s
166|Alfa Romeo 166|s
GTV|Alfa Romeo GTV and Spider|c
Spider|Alfa Romeo GTV and Spider|r
Brera|Alfa Romeo Brera and Spider|c
GT|Alfa Romeo GT|c
MiTo|Alfa Romeo MiTo|h
Giulietta|Alfa Romeo Giulietta (2010)|h
Giulia|Alfa Romeo Giulia (2015)|s
Stelvio|Alfa Romeo Stelvio|u
Tonale|Alfa Romeo Tonale|u
Junior|Alfa Romeo Junior (2024)|u
4C|Alfa Romeo 4C|cr
8C Competizione|Alfa Romeo 8C Competizione|cr
SZ|Alfa Romeo SZ|c
RZ|Alfa Romeo RZ|r`,
lancia:`Delta|Lancia Delta|h
Dedra|Lancia Dedra|sk
Thema|Lancia Thema|sk
Kappa|Lancia Kappa|skc
Thesis|Lancia Thesis|s
Y10|Lancia Y10|h
Y|Lancia Ypsilon|h
Ypsilon|Lancia Ypsilon|h
Lybra|Lancia Lybra|sk
Musa|Lancia Musa|m
Phedra|Lancia Phedra|m
Zeta|Lancia Zeta|m
Flavia|Chrysler 200|r
Voyager|Lancia Voyager|m
Prisma|Lancia Prisma|s`,
smart:`Fortwo|Smart Fortwo|hr
Forfour|Smart Forfour|h
Roadster|Smart Roadster|r
#1|Smart 1|u|1
#3|Smart 3|u|3
#5|Smart 5|u|5`,
mg:`Metro|MG Metro|h
Maestro|MG Maestro|h
Montego|MG Montego|s
RV8|MG RV8|r
F|MG F|r
TF|MG F / MG TF|r
ZR|MG ZR|h
ZS (2001–2005)|MG ZS (2001)|hs|zs-2001
ZT|MG ZT|sk
XPower SV|MG XPower SV|c
MG3|MG 3|h
MG4|MG4 EV|h
MG5 EV|MG5 EV|k
MG6|MG 6|hs
ZS|MG ZS (crossover)|u|zs
HS|MG HS|u
GS|MG GS|u
Cyberster|MG Cyberster|r
Marvel R|Roewe Marvel X|u
MGS5 EV|MG S5 EV|u
MGS6 EV|MGS6 EV|u
MGS9 PHEV|Roewe RX9|u
IM5|IM L6|s
IM6|IM LS6|u
MG4 Urban|MG4 EV|h`};
export const batch4AdditionalPages={
 'jeep/cherokee':['Jeep Cherokee (XJ)','Jeep Cherokee (KJ)','Jeep Cherokee (KK)','Jeep Cherokee (KL)'],
 'jeep/grand-cherokee':['Jeep Grand Cherokee (ZJ)','Jeep Grand Cherokee (WJ)','Jeep Grand Cherokee (WK)','Jeep Grand Cherokee (WK2)','Jeep Grand Cherokee (WL)'],
 'jeep/wrangler':['Jeep Wrangler (YJ)','Jeep Wrangler (TJ)','Jeep Wrangler (JK)','Jeep Wrangler (JL)'],
 'jeep/wagoneer':['Jeep Wagoneer (SJ)','Jeep Wagoneer (WS)'],
 'jeep/grand-wagoneer':['Jeep Wagoneer (SJ)','Jeep Wagoneer (WS)'],
 'alfa-romeo/spider':['Alfa Romeo Spider','Alfa Romeo Brera and Spider'],
 'alfa-romeo/rz':['Alfa Romeo SZ'],
 'lancia/thema':['Lancia Thema (2011)'],
 'lancia/y':['Lancia Ypsilon'],
 'lancia/zeta':['Eurovans (PSA/Fiat joint venture)'],
 'lancia/phedra':['Eurovans (PSA/Fiat joint venture)'],
 'lancia/flavia':['Chrysler 200'],
 'lancia/voyager':['Chrysler Voyager'],
 'mg/metro':['Austin Metro'],
 'mg/maestro':['Austin Maestro'],
 'mg/montego':['Austin Montego'],
 'mg/rv8':['MG MGB'],
 'mg/f':['MG F / MG TF'],
 'mg/tf':['MG F / MG TF'],
 'mg/mg5-ev':['Roewe Ei5'],
 'mg/marvel-r':['Roewe Marvel R']
};
export const batch4Aliases={
 'jeep/cherokee':['Liberty'],'jeep/grand-cherokee':['Grand Cherokee L'],
 'alfa-romeo/156':['Sportwagon','Crosswagon'],'alfa-romeo/159':['Sportwagon'],
 'mg/f':['MGF'],'mg/tf':['MG TF'],'mg/zt':['ZT-T'],
 'mg/mg3':['MG3 Hybrid+'],'mg/mg4':['MG4 Electric','MG4 EV'],'mg/hs':['EHS'],'mg/zs':['ZS EV','ZS Hybrid+'],
 'mg/mg5-ev':['MG5','MG5 Electric'],'mg/marvel-r':['MG Marvel R'],
 'smart/fortwo':['City-Coupé','City Cabrio','EQ fortwo'],'smart/forfour':['EQ forfour']
};
export const batch4Exclusions={
 jeep:[['Rubicon / Sahara / SRT / Trackhawk / 4xe / Trailhawk','equipment/performance/powertrain derivatives'],['Liberty','regional Cherokee name retained as alias'],['Grand Cherokee L / Wagoneer L / Grand Wagoneer L','length derivatives'],['CJ / Forward Control / original Gladiator SJ','production ended before the target window; modern JT pickup retained'],['Meridian / Commander 2021 / Grand Commander / Compass China derivatives','regional programmes not conflated with European XK Commander'],['Recon / concepts','production and European-market availability need separate verification before admission']],
 'alfa-romeo':[['Quadrifoglio / GTA / GTAm / Veloce / Q4 / QV / Twin Spark','performance/equipment/engine/drive derivatives'],['Sportwagon / Crosswagon','body or drive derivatives under 156/159'],['90','production ended before the approximately 1990 window; removed from output selection'],['Alfasud / Alfetta / original Giulietta / old Giulia','production ended before the target window; modern name reuse is not assigned historic dates'],['Milano modern badge','withdrawn launch name for Junior; not a separate line'],['33 Stradale modern / concept cars / race cars','exceptional limited-production, concept or competition programmes outside ordinary-market selection'],['8C Spider','body derivative of 8C Competizione'],['Spider generations','historic 105/115, 916 and 939 sources are retained; they are not one continuously produced engineering generation']],
 lancia:[['Integrale / HF / HPE / Elefantino / S / MomoDesign','performance/equipment/body derivatives'],['Chrysler 300 / 200 / Voyager donor identities','Lancia badge phases retained separately; donor production ranges are not automatically inherited'],['Flavia historic / Fulvia / Beta / Gamma / Trevi / Stratos / 037','production ended before the target window; modern Flavia cabriolet is not the historic car'],['Prisma','production ended before 1990; removed from output selection'],['Y versus Ypsilon','1995–2003 Y badge and later Ypsilon badge remain distinct names with explicit chronology gaps'],['Rally / race cars / concepts','competition or concept vehicles']],
 smart:[['Brabus / EQ / electric drive / Pulse / Passion','performance/equipment/powertrain derivatives'],['City-Coupé / City Cabrio','historic Fortwo names retained as aliases'],['Roadster-Coupé','body derivative merged into Roadster'],['Crossblade','exceptional low-volume derivative outside ordinary-market selection'],['#2 / concepts / prototypes','not admitted without checked production-market evidence']],
 mg:[['XPower / Trophy / Trophy Long Range / SE / Exclusive / Hybrid+','performance/equipment/powertrain derivatives; standalone XPower SV retained'],['ZT-T / ZS EV / EHS / MG4 XPower','body/powertrain/performance derivatives under ZT/ZS/HS/MG4'],['MGB / Midget / earlier T-series / Magnette','production ended before the target window; RV8 retained as its distinct 1990s production line'],['MG ZS original versus modern SUV','distinct engineering families separated as zs-2001 and zs; not invented as generations of one car'],['MG5 Chinese saloon / MG7 / MG GT / MG ONE / Hector / Gloster / Extender / RX5 / Mulan regional name','regional programmes outside this Europe-focused pass; MG5 EV estate is not the Chinese MG5 saloon'],['EXE / E-motion / EX4 / EXE181 / concepts','concept or competition programmes'],['Historic MG versus SAIC-era MG','one existing mg make slug; corporate history and the 2005 production interruption do not imply continuous production of every nameplate']]
};
export const batch4UnknownDates=[
 'jeep/wagoneer','jeep/grand-wagoneer',
 'alfa-romeo/spider',
 'lancia/thema','lancia/ypsilon','lancia/zeta','lancia/phedra','lancia/flavia','lancia/voyager',
 'mg/metro','mg/im5','mg/im6','mg/mgs9-phev','mg/mg4-urban'
];
export const batch4DateChoices={
 'jeep/renegade':{ranges:[0]},
 'alfa-romeo/145':{ranges:[0]},'alfa-romeo/146':{ranges:[1]},
 'alfa-romeo/gtv':{ranges:[1]},'alfa-romeo/brera':{ranges:[0]},
 'alfa-romeo/4c':{combine:true},'alfa-romeo/8c-competizione':{combine:true},
 'alfa-romeo/sz':{ranges:[0]},'alfa-romeo/rz':{ranges:[1]},
 'lancia/delta':{combine:true},'lancia/kappa':{combine:true},'lancia/y':{box:'First generation'},
 'smart/fortwo':{combine:true},'smart/forfour':{combine:true},
 'mg/maestro':{ranges:[1]},'mg/montego':{ranges:[1]},'mg/rv8':{ranges:[1]},
 'mg/f':{boxIndex:1},'mg/tf':{boxIndex:2,combine:true},
 'mg/mg5-ev':{boxIndex:1,ranges:[1]},'mg/mg6':{box:'First generation'},'mg/gs':{ranges:[0]},
 'mg/mgs5-ev':{ranges:[1]},'mg/marvel-r':{ranges:[2]}
};
export const batch4GenerationFamilies=[
 'jeep/cherokee','jeep/grand-cherokee','jeep/wrangler','jeep/compass',
 'alfa-romeo/gtv','alfa-romeo/spider','alfa-romeo/brera',
 'lancia/delta','lancia/ypsilon',
 'smart/fortwo','smart/forfour',
 'mg/mg3','mg/mg4','mg/zs','mg/hs'
];
export const batch4GenerationSkip={
 'lancia/ypsilon':/First generation/i,
 'mg/mg4':/Second generation/i,
 'mg/mg3':/First generation/i
};
export const batch4GenerationDateChoices={
 'jeep/wrangler':{YJ:{ranges:[0]}},
 'jeep/grand-cherokee':{WJ:{ranges:[0]}},
 'jeep/cherokee':{XJ:{ranges:[0]},KK:{ranges:[0]}},
 'jeep/compass':{second:{ranges:[0]}},
 'smart/fortwo':{third:{combine:true}},'smart/forfour':{second:{combine:true}},
 'mg/mg4':{EH32:{ranges:[1]}},'mg/zs':{ZS11:{ranges:[1]}}
};
export const batch4ExactGenerationCodes={
 'alfa-romeo/159':'939','alfa-romeo/166':'936','alfa-romeo/gt':'937',
 'alfa-romeo/mito':'955','alfa-romeo/giulietta':'940','alfa-romeo/giulia':'952',
 'alfa-romeo/stelvio':'949','alfa-romeo/tonale':'965',
 'smart/3':'HC11','smart/5':'HY11','mg/gs':'AS21','mg/cyberster':'EC32'
};
export const batch4ReviewNotes={
 'alfa-romeo/mito':[['to','Retained Wikipedia production field ends in 2020, while the manufacturer describes a ten-year life. Exact factory end remains unresolved; 2020 is not silently treated as corroborated.']],
 'mg/zs-2001':[['scope','Historic MG Rover-era compact saloon/hatchback; distinct from modern SAIC-era ZS SUV.']],
 'mg/zs':[['scope','Modern SAIC-era ZS SUV; historical MG Rover ZS is a separate zs-2001 entry.']],
 'mg/mg5-ev':[['scope','European electric estate badge; not the unrelated regional MG5 saloon. The retained production field explicitly separates 2020 onward export from earlier Chinese Ei5 production; current Czech availability is not asserted.']],
 'mg/tf':[['productionPeriods','MG Rover-era production and later Nanjing/SAIC revival are separate retained runs, not continuous manufacturing through 2005–2007.']],
 'mg/im5':[['wikidataQid','MG IM5 European badge is corroborated by MG, but donor IM L6 identity/production is not substituted for this badge.']],
 'mg/im6':[['wikidataQid','MG IM6 European badge is corroborated by MG, but donor IM LS6 identity/production is not substituted for this badge.']],
 'mg/mgs9-phev':[['wikidataQid','European MGS9 badge is confirmed by MG; Roewe RX9 donor identity and production bounds do not establish MG-badge chronology.']],
 'mg/mg4-urban':[['wikidataQid','European MG4 Urban is a separately marketed hatchback alongside MG4 EV; original MG4 production dates and QID are not copied.']],
 'alfa-romeo/spider':[['productionPeriods','Spider is a reused body/name across 105/115, 916 and 939 families; the output must not assert one continuous engineering generation.']]
};
batch4ReviewNotes['smart/fortwo']=[['generations','Parent source describes MkI through 2006, while the generation field ends in 2007; production/model-year boundary requires reconciliation.']];
batch4Selection['alfa-romeo']=batch4Selection['alfa-romeo'].split('\n').filter(r=>!r.startsWith('90|')).join('\n');
batch4Selection.lancia=batch4Selection.lancia.split('\n').filter(r=>!r.startsWith('Prisma|')).join('\n');
