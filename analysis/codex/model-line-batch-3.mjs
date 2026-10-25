export const batch3Order=['daihatsu','ssangyong-kgm','land-rover','jaguar','porsche'];
// European names; body proposals are admitted only when retained factual fields support them.
export const batch3Selection={
daihatsu:`Charade|Daihatsu Charade|hs
Sirion|Daihatsu Sirion|h
Cuore|Daihatsu Mira|h
Terios|Daihatsu Terios|u
Feroza|Daihatsu Rocky (F300)|u
Rocky|Daihatsu Rugger|u
Applause|Daihatsu Applause|h
YRV|Daihatsu YRV|m
Grand Move|Daihatsu Pyzar|m
Materia|Daihatsu Coo|m
Copen|Daihatsu Copen|r
Move|Daihatsu Move|h
Hijet|Daihatsu Hijet|vp
Trevis|Daihatsu Mira Gino|h`,
'ssangyong-kgm':`Actyon|SsangYong Actyon|u
Actyon Sports|SsangYong Actyon Sports|p
Musso|SsangYong Musso|up
Rexton|SsangYong Rexton|u
Korando|SsangYong Korando|u
Kyron|SsangYong Kyron|u
Rodius|SsangYong Rodius|m
Tivoli|SsangYong Tivoli|u
Torres|KGM Torres|u
Musso EV|KGM Musso EV|p`,
'land-rover':`Defender|Land Rover Defender|up
Discovery|Land Rover Discovery|u
Discovery Sport|Land Rover Discovery Sport|u
Freelander|Land Rover Freelander|u
Range Rover|Range Rover|u
Range Rover Sport|Range Rover Sport|u
Range Rover Evoque|Range Rover Evoque|ur
Range Rover Velar|Range Rover Velar|u`,
jaguar:`XJ|Jaguar XJ|s
XJS|Jaguar XJS|cr
XK|Jaguar XK|cr
S-Type|Jaguar S-Type (1999)|s
X-Type|Jaguar X-Type|sk
XF|Jaguar XF|sk
XE|Jaguar XE|s
F-Type|Jaguar F-Type|cr
F-Pace|Jaguar F-Pace|u
E-Pace|Jaguar E-Pace|u
I-Pace|Jaguar I-Pace|u`,
porsche:`911|Porsche 911|cr
928|Porsche 928|c
944|Porsche 944|cr
968|Porsche 968|cr
Boxster|Porsche Boxster and Cayman|r
Cayman|Porsche Boxster and Cayman|c
Cayenne|Porsche Cayenne|u
Panamera|Porsche Panamera|hk
Macan|Porsche Macan|u
Taycan|Porsche Taycan|sk
Carrera GT|Porsche Carrera GT|r
918 Spyder|Porsche 918 Spyder|r`};
export const batch3AdditionalPages={
 'daihatsu/feroza':['Daihatsu Rocky (F300)'],
 'daihatsu/rocky':['Daihatsu Rocky (F70)'],
 'daihatsu/sirion':['Daihatsu Storia','Daihatsu Boon'],
 'daihatsu/charade':['Toyota Vitz'],
 'ssangyong-kgm/actyon':['KGM Actyon'],
 'land-rover/defender':['Land Rover Defender (L663)'],
 'land-rover/discovery':['Land Rover Discovery (L462)'],
 'jaguar/xj':['Jaguar XJ (XJ40)','Jaguar XJ (X300)','Jaguar XJ (X308)','Jaguar XJ (X350)','Jaguar XJ (X351)'],
 'jaguar/s-type':['Jaguar S-Type (1999)'],
 'jaguar/xk':['Jaguar XK (X100)','Jaguar XK (X150)'],
 'jaguar/xf':['Jaguar XF (X250)','Jaguar XF (X260)'],
 'porsche/911':['Porsche 964','Porsche 993','Porsche 996','Porsche 997','Porsche 991','Porsche 992'],
 'porsche/boxster':['Porsche 986','Porsche 987','Porsche 981','Porsche 982'],
 'porsche/cayman':['Porsche 987','Porsche 981','Porsche 982'],
 'porsche/macan':['Porsche Macan (Type 95B)','Porsche Macan (electric)']
};
export const batch3Aliases={
 'daihatsu/cuore':['Mira'],'daihatsu/feroza':['Sportrak'],'daihatsu/rocky':['Fourtrak','Rugger'],
 'daihatsu/grand-move':['Gran Move','Pyzar'],'daihatsu/materia':['Coo'],'daihatsu/trevis':['Mira Gino'],
 'ssangyong-kgm/rodius':['Stavic'],'ssangyong-kgm/actyon-sports':['Korando Sports'],
 'ssangyong-kgm/torres':['Torres EVX'],'ssangyong-kgm/tivoli':['XLV','Tivoli Grand'],
 'land-rover/defender':['90','110','130'],'land-rover/discovery':['Discovery 3','Discovery 4'],
 'jaguar/xjs':['XJ-S'],'porsche/boxster':['718 Boxster'],'porsche/cayman':['718 Cayman'],
 'porsche/taycan':['Cross Turismo','Sport Turismo'],'porsche/panamera':['Sport Turismo']
};
export const batch3Exclusions={
 daihatsu:[['De Tomaso / GTti / equipment grades','performance/equipment derivatives'],['Gran Move / Pyzar / Coo / Mira / Sportrak / Fourtrak','alternate names retained as aliases of corresponding European lines'],['Atrai / Tanto / Wake / Cast / Thor / Move Canbus / Taft 2020 / Rocky A200','regional programmes not conflated with European historic names'],['Taft original / Charmant / Consorte','production ended before the target window'],['Boon Luminas / Xenia / Luxio / Gran Max / Ayla / Sigra','regional programmes outside this European selection'],['Charade late Toyota-based name reuse','line retained with unresolved badge-specific chronology; Vitz donor dates are not assigned']],
 'ssangyong-kgm':[['KGM corporate rename','one make identity under existing ssangyong-kgm slug; no duplicate renamed make created'],['Torres EVX / Tivoli XLV / Tivoli Grand','powertrain/length derivatives merged into base lines'],['Korando Sports / Stavic','alternate names retained as Actyon Sports/Rodius aliases'],['Musso Sports / Rexton Sports','reused/regional pickup names require European badge review; not invented as generations'],['Actyon revived SUV','retained under Actyon name with explicitly unresolved old/new production windows'],['Musso EV','distinct electric pickup programme retained following checked European manufacturer line-up; not a guessed diesel Musso generation'],['Chairman / Kallista / Istana','regional or exceptional low-volume ranges outside the ordinary-market selection'],['KR10 / O100 / concepts','concept or pre-production programmes']],
 'land-rover':[['SV / SVR / Autobiography / HSE / engine suffixes','equipment/performance/powertrain derivatives'],['Defender 90 / 110 / 130 / Discovery 3 / Discovery 4','length or generation names under the parent line'],['Range Rover brand positioning','Range Rover models remain grouped under existing land-rover make identity for this catalogue'],['Land Rover Series','production ended before the approximately 1990 window; old Defender production and Series naming are not conflated'],['DC100 / Range Stormer / concepts','concept vehicles']],
 jaguar:[['R / SVR / R-Dynamic / Supercharged / Portfolio','performance/equipment/engine derivatives'],['XJ6 / XJ8 / XJR / Sovereign','engine/equipment names under XJ'],['XK8 / XKR','engine/performance derivatives under XK'],['XJ220','exceptional limited-production supercar omitted from ordinary-market selection'],['E-Type / Mark 2 / original S-Type / older XK sports cars','production ended before the target window; modern S-Type/XK names are not those historic production runs'],['C-X75 / Type 00 / C-X16 / concepts','concepts or programmes without checked production-market evidence']],
 porsche:[['Carrera / Turbo / GT2 / GT3 / GT4 / RS / GTS / Targa / Spyder','performance, equipment or body derivatives under parent lines; 918 Spyder is a separately named production family'],['718 Boxster / 718 Cayman','renamed families retained as Boxster/Cayman aliases'],['Panamera Sport Turismo / Taycan Cross Turismo and Sport Turismo / Cayenne Coupe','body derivatives merged into parent lines'],['924 / 959 / original 356 / 914','production ended before the target window'],['Mission concepts / race cars / one-offs','concept, competition or one-off vehicles'],['Carrera GT / 918 Spyder','limited series retained as independently named production lines; no trims or test statistics added']]
};
export const batch3UnknownDates=[
 'daihatsu/charade','daihatsu/sirion','daihatsu/cuore','daihatsu/move','daihatsu/trevis','daihatsu/terios','daihatsu/hijet',
 'ssangyong-kgm/actyon','ssangyong-kgm/musso',
 'land-rover/defender',
 'porsche/macan'
];
export const batch3DateChoices={
 'daihatsu/rocky':{ranges:[0]},'daihatsu/copen':{box:'First generation'},
 'daihatsu/materia':{box:'Second generation',ranges:[2]},
 'ssangyong-kgm/actyon-sports':{ranges:[1]},'ssangyong-kgm/korando':{combine:true},
 'ssangyong-kgm/tivoli':{ranges:[0]},
 'porsche/boxster':{ranges:[0]},'porsche/cayman':{ranges:[1]}
};
export const batch3GenerationFamilies=[
 'ssangyong-kgm/rexton','ssangyong-kgm/korando','ssangyong-kgm/rodius',
 'land-rover/defender','land-rover/discovery','land-rover/freelander','land-rover/range-rover','land-rover/range-rover-sport','land-rover/range-rover-evoque',
 'jaguar/xj','jaguar/xk','jaguar/xf',
 'porsche/911','porsche/cayenne','porsche/panamera','porsche/boxster','porsche/cayman','porsche/macan','daihatsu/copen'
];
export const batch3GenerationSkip={'daihatsu/copen':/Second generation/i};
export const batch3GenerationDateChoices={
 'ssangyong-kgm/rexton':{Y400:{ranges:[0]}},
 'ssangyong-kgm/korando':{first:{ranges:[2]},second:{ranges:[0]}},
 'land-rover/range-rover-evoque':{L551:{ranges:[0]}},
 'porsche/boxster':{'987':{ranges:[0]}},'porsche/cayman':{'987':{ranges:[1]},'981':{unresolved:true}}
};
export const batch3ExactGenerationCodes={
 'land-rover/discovery-sport':'L550','land-rover/range-rover-velar':'L560',
 'jaguar/x-type':'X400','jaguar/xe':'X760','jaguar/f-type':'X152','jaguar/f-pace':'X761','jaguar/e-pace':'X540',
 'porsche/carrera-gt':'980'
};
export const batch3ReviewNotes={
 'ssangyong-kgm/musso':[['productionPeriods','Historic Musso SUV and later Musso pickup are different engineering families sharing a sales name; chronology is unresolved, not continuous.']],
 'land-rover/defender':[['from,to','Historic body-on-frame Defender and modern L663 require explicit separate source windows; Series predecessors are not assigned as Defender production.']],
 'porsche/boxster':[['from,to','Selected explicit Boxster production range from combined article; manufacturer corroborates October 2025 end. 718 is an alias, not a new guessed generation.']],
 'porsche/cayman':[['from,to','Selected explicit Cayman production range; manufacturer corroborates October 2025 end. Combined 981 dates do not establish a Cayman-specific start.']],
 'jaguar/s-type':[['scope','Modern X200 S-Type is distinct from the historic 1960s S-Type; the dedicated 1999-model article is used.']]
};
for(const row of batch3Selection['ssangyong-kgm'].split('\n')){
 const slug=row.split('|')[0].toLowerCase().replaceAll(' ','-');
 const key='ssangyong-kgm/'+slug;
 batch3AdditionalPages[key]=[...(batch3AdditionalPages[key]||[]),'KG Mobility'];
 batch3ReviewNotes[key]=[...(batch3ReviewNotes[key]||[]),['scope','One ssangyong-kgm make across the March 2023 corporate rename. Consumer rebranding varied by market; the UK manufacturer timeline has a conflicting 2022 corporate date, so it is not treated as an exact rename-date authority.']];
}
