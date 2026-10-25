// European/common-import model-line selection; no marketplace databases used.
export const batch2Order=['subaru','suzuki','lexus','chevrolet','daewoo'];
export const batch2Selection={
subaru:`Legacy|Subaru Legacy|sk
Outback|Subaru Outback|ku
Impreza|Subaru Impreza|hskc
Crosstrek|Subaru Crosstrek|u
Forester|Subaru Forester|u
Justy|Subaru Justy|h
Vivio|Subaru Vivio|h
Libero|Subaru Sumo|vm
Leone|Subaru Leone|sk
SVX|Subaru Alcyone SVX|c
BRZ|Subaru BRZ|c
WRX|Subaru WRX|s
Levorg|Subaru Levorg|k
Tribeca|Subaru Tribeca|u
Trezia|Subaru Trezia|m
Solterra|Subaru Solterra|u
Uncharted|Subaru Uncharted|u
E-Outback|Subaru Trailseeker|u
Rex|Subaru Rex|h`,
suzuki:`Swift|Suzuki Swift|hs
Baleno|Suzuki Baleno|hsk
Ignis|Suzuki Ignis|hu
Splash|Suzuki Splash|h
Alto|Suzuki Alto|h
Celerio|Suzuki Celerio|h
Wagon R+|Suzuki Wagon R+|m
Vitara|Suzuki Vitara|u
Grand Vitara|Suzuki Grand Vitara|u
SX4|Suzuki SX4|h
S-Cross|Suzuki SX4 S-Cross|u
Jimny|Suzuki Jimny|u
Samurai|Suzuki Samurai|u
Kizashi|Suzuki Kizashi|s
Liana|Suzuki Aerio|hs
Across|Suzuki Across|u
Swace|Suzuki Swace|k
Carry|Suzuki Carry|vm
X-90|Suzuki X-90|ur
Cappuccino|Suzuki Cappuccino|r
e Vitara|Suzuki e Vitara|u`,
lexus:`CT|Lexus CT|h
IS|Lexus IS|skr
GS|Lexus GS|s
LS|Lexus LS|s
ES|Lexus ES|s
LC|Lexus LC|cr
UX|Lexus UX|u
NX|Lexus NX|u
RX|Lexus RX|u
GX|Lexus GX|u
LX|Lexus LX|u
LBX|Lexus LBX|u
RZ|Lexus RZ|u
RC|Lexus RC|c
SC|Lexus SC|cr
LFA|Lexus LFA|c
LM|Lexus LM|m`,
chevrolet:`Aveo|Chevrolet Aveo|hs
Spark|Chevrolet Spark|h
Lacetti|Chevrolet Lacetti|hsk
Epica|Chevrolet Epica|s
Evanda|Daewoo Magnus|s
Cruze|Chevrolet Cruze|hsk
Orlando|Chevrolet Orlando|m
Captiva|Chevrolet Captiva|u
Trax|Chevrolet Trax|u
Tracker|Chevrolet Tracker|u
Alero|Oldsmobile Alero|s
HHR|Chevrolet HHR|k
Rezzo|Daewoo Tacuma|m
Malibu|Chevrolet Malibu|s
Volt|Chevrolet Volt|h
Camaro|Chevrolet Camaro|cr
Corvette|Chevrolet Corvette|cr
Blazer|Chevrolet Blazer|u
TrailBlazer|Chevrolet TrailBlazer|u
Tahoe|Chevrolet Tahoe|u
Suburban|Chevrolet Suburban|u
Silverado|Chevrolet Silverado|p
Avalanche|Chevrolet Avalanche|p
S-10|Chevrolet S-10|p
Colorado|Chevrolet Colorado|p
Astro|Chevrolet Astro|vm
Trans Sport|Chevrolet Trans Sport|m
Express|Chevrolet Express|v
Lumina|Chevrolet Lumina|s
Equinox|Chevrolet Equinox|u
Bolt|Chevrolet Bolt|h`,
daewoo:`Matiz|Daewoo Matiz|h
Tico|Daewoo Tico|h
Espero|Daewoo Espero|s
Nexia|Daewoo LeMans|hs
Lanos|Daewoo Lanos|hs
Nubira|Daewoo Nubira|hsk
Leganza|Daewoo Leganza|s
Kalos|Daewoo Kalos|hs
Lacetti|Chevrolet Lacetti|hs
Tacuma|Daewoo Tacuma|m
Evanda|Daewoo Magnus|s
Musso|SsangYong Musso|u
Korando|SsangYong Korando|u
Lublin|FS Lublin|v`};
export const batch2AdditionalPages={
 'subaru/brz':['Toyota 86'],
 'subaru/legacy':['Subaru Legacy (first generation)','Subaru Legacy (second generation)','Subaru Legacy (third generation)','Subaru Legacy (fourth generation)','Subaru Legacy (fifth generation)'],
 'suzuki/alto':['Suzuki Alto (Europe)'],
 'suzuki/across':['Toyota RAV4 (XA50)'],
 'suzuki/baleno':['Suzuki Cultus Crescent','Suzuki Baleno (2015)'],
 'suzuki/swift':['Suzuki Cultus'],
 'suzuki/vitara':['Suzuki Vitara (1988)'],
 'suzuki/grand-vitara':['Suzuki Vitara'],
 'suzuki/s-cross':['Suzuki SX4 (S-Cross)'],
 'suzuki/samurai':['Suzuki Jimny'],
 'chevrolet/blazer':['Chevrolet S-10 Blazer','Chevrolet Blazer (crossover)'],
 'chevrolet/tracker':['Geo Tracker','Chevrolet Trax'],
 'chevrolet/camaro':['Chevrolet Camaro (fourth generation)','Chevrolet Camaro (fifth generation)','Chevrolet Camaro (sixth generation)'],
 'chevrolet/corvette':['Chevrolet Corvette (C4)','Chevrolet Corvette (C5)','Chevrolet Corvette (C6)','Chevrolet Corvette (C7)','Chevrolet Corvette (C8)'],
 'chevrolet/volt':['Chevrolet Volt (first generation)','Chevrolet Volt (second generation)'],
 'chevrolet/trailblazer':['Chevrolet TrailBlazer (SUV)','Chevrolet Trailblazer (crossover)'],
 'chevrolet/bolt':['Chevrolet Bolt EUV'],
 'daewoo/nubira':['Chevrolet Lacetti']
};
export const batch2Aliases={
 'subaru/crosstrek':['XV'],'subaru/wrx':['WRX STI'],'subaru/libero':['Sumo','E12'],
 'chevrolet/spark':['Matiz'],'chevrolet/aveo':['Sonic','Kalos'],'chevrolet/lacetti':['Nubira'],
 'suzuki/carry':['Super Carry'],'suzuki/samurai':['SJ410','SJ413'],
 'suzuki/liana':['Aerio'],'suzuki/s-cross':['SX4 S-Cross'],'suzuki/wagon-r':['Wagon R+'],
 'chevrolet/volt':['Volt II'],
 'chevrolet/tacuma':['Rezzo'],'chevrolet/rezzo':['Tacuma'],
 'daewoo/nexia':['Cielo','LeMans'],'daewoo/tacuma':['Rezzo'],'daewoo/evanda':['Magnus']
};
export const batch2Exclusions={
 subaru:[['STI / Spec B / turbo / special editions','performance/equipment derivatives merged into base lines; standalone WRX retained'],['XV','rename retained as Crosstrek alias'],['Baja / Ascent / Exiga / Sambar / Pleo / R1 / R2 / Stella','regional-market programmes outside this European/common-import selection'],['Rex modern SUV','regional name reuse not conflated with the historic European hatchback'],['Performance-B STI concepts','concept vehicles'],['Uncharted / E-Outback production chronology','European programmes included following manufacturer announcement; exact badge production dates remain deferred']],
 suzuki:[['Sport / GTi / Boosterjet / AllGrip','performance, engine or drive variants'],['SJ410 / SJ413 / Santana','Samurai-related codes/manufacturing variants retained under Samurai, not extra lines'],['Maruti / Indian Dzire / Ertiga / XL6 / Fronx / Invicto / Jimny 5-door','regional badges/body programmes not silently promoted into the European line list'],['Vitara Brezza / Grand Vitara 2022 India','regional programmes outside this European-name selection; e Vitara is independently included as a distinct BEV'],['Twin / Lapin / Hustler / Spacia / Every','regional kei programmes'],['Cervo / Cara','regional low-volume programmes outside this pass']],
 lexus:[['F / F Sport / hybrid powertrain suffixes','performance, equipment or engine derivatives merged into their parent lines'],['HS / TX','regional programmes outside this European/common-import selection'],['GX / LX','retained as common import/global SUV lines; current Czech official availability not asserted'],['LF / UX concept / Electrified Sport concepts','concept vehicles'],['IS SportCross / RX L','body/length derivatives under IS/RX']],
 chevrolet:[['SS / ZL1 / Z06 / ZR1 / LT / RS / engine suffixes','performance/equipment derivatives merged into parent lines'],['GMC / Cadillac / Buick / Opel / Holden badges','separate makes, not extra Chevrolet lines'],['Sonic / Kalos','alternate names merged into Aveo'],['Matiz / Nubira','Chevrolet badge phases merged as Spark/Lacetti aliases; Daewoo lines remain separate by make'],['Rezzo / Tacuma','same European model family; consolidated under Rezzo with Tacuma alias'],['Bolt EUV','body derivative under Bolt; exact body/generation chronology remains reviewable'],['Silverado HD / Silverado EV / Suburban special lengths','truck derivatives; kept lean under parent family'],['Traverse / Impala / Monte Carlo / Cavalier / Cobalt / Caprice / City Express / N-series','regional/import or historical ranges omitted from this lean European/common-import pass; not a complete global inventory'],['Onix / Sail / Spin / Montana / Agile / Celta / Corsa / Niva','regional programmes outside this pass'],['Chevrolet concept cars','concepts']],
 daewoo:[['SX / CDX / SE / engine suffixes','equipment/engine derivatives'],['Chevrolet successor badge phases','separate make; not treated as continuing Daewoo production'],['LeMans / Cielo / Magnus / Rezzo','regional names retained as Nexia/Evanda/Tacuma aliases'],['Musso / Korando','short Daewoo badge phases retained with unresolved dates; SsangYong donor production is not inherited'],['Polonez','deferred: Daewoo corporate ownership alone does not establish a unique Daewoo make/model identity; FSO badge needs review'],['Lublin','Daewoo badge phase retained with unresolved chronology; later FSC/Intrall/DZT production not inherited'],['Damas / Labo / Prince / Super Salon / Chairman / Winstorm / Tosca / Gentra','regional badge/production programmes outside this European selection']]
};
// Donor articles, non-European successors and historic badge windows cannot establish these dates.
export const batch2UnknownDates=[
 'subaru/rex','subaru/justy','subaru/libero','subaru/brz','subaru/crosstrek','subaru/uncharted','subaru/e-outback',
 'suzuki/swift','suzuki/celerio','suzuki/baleno','suzuki/alto','suzuki/wagon-r','suzuki/vitara','suzuki/grand-vitara','suzuki/sx4','suzuki/s-cross','suzuki/samurai','suzuki/across','suzuki/swace','suzuki/carry',
 'lexus/is','lexus/gx','lexus/lx','lexus/lm',
 'chevrolet/aveo','chevrolet/spark','chevrolet/matiz','chevrolet/lacetti','chevrolet/nubira','chevrolet/evanda','chevrolet/kalos','chevrolet/rezzo','chevrolet/alero','chevrolet/trans-sport','chevrolet/lumina','chevrolet/captiva','chevrolet/trax','chevrolet/tracker','chevrolet/orlando','chevrolet/blazer','chevrolet/trailblazer',
 'daewoo/matiz','daewoo/nexia','daewoo/lanos','daewoo/nubira','daewoo/kalos','daewoo/lacetti','daewoo/evanda','daewoo/musso','daewoo/korando','daewoo/lublin','daewoo/polonez'
];
export const batch2DateChoices={
 'subaru/legacy':{ranges:[0]},'subaru/wrx':{ranges:[1]},
 'subaru/rex':{ranges:[0]},'suzuki/splash':{ranges:[0],scope:'europe'},
 'lexus/rx':{from:1998},
 'suzuki/liana':{ranges:[0]},'suzuki/ignis':{combine:true},
 'chevrolet/camaro':{combine:true},'chevrolet/tahoe':{ranges:[1]},
 'chevrolet/epica':{ranges:[0]},'chevrolet/s-10':{ranges:[0]},
 'daewoo/lanos':{ranges:[0]},'daewoo/leganza':{ranges:[0]},
 'daewoo/espero':{ranges:[1]},'daewoo/tico':{combine:true}
};
export const batch2GenerationFamilies=[
 'subaru/legacy','subaru/outback','subaru/impreza','subaru/forester','subaru/crosstrek',
 'suzuki/swift','suzuki/ignis','suzuki/jimny',
 'lexus/ct','lexus/is','lexus/gs','lexus/ls','lexus/es','lexus/lc','lexus/ux','lexus/nx','lexus/rx','lexus/rc','lexus/sc','lexus/lbx','lexus/rz',
 'chevrolet/cruze','chevrolet/camaro','chevrolet/corvette','chevrolet/volt','chevrolet/tahoe',
 'daewoo/espero','daewoo/tico','daewoo/leganza'
];
export const batch2GenerationSkip={
 'subaru/outback':/Seventh generation/i,
 'suzuki/swift':/Cultus|First generation \(1983|Second generation \(1988|Third generation \(1995/i,
 'suzuki/jimny':/Second generation/i,
 'lexus/es':/First generation|Second generation|Third generation|Fourth generation|Fifth generation|Sixth generation/i,
 'chevrolet/cruze':/Second generation|D2SC/i
};
export const batch2GenerationDateChoices={
 'subaru/impreza':{third:{ranges:[0]}},
 'suzuki/swift':{RS:{ranges:[1]},A2L:{ranges:[0]}},
 'suzuki/jimny':{third:{ranges:[0]}},
 'lexus/is':{XE10:{ranges:[1]},XE20:{ranges:[0,2],combine:true}},
 'lexus/rx':{XU10:{ranges:[1]},XU30:{ranges:[0]}},
 'lexus/es':{XZ10:{ranges:[0]}}
};
export const batch2ExactGenerationCodes={
 'lexus/ct':'A10','lexus/lc':'Z100','lexus/ux':'ZA10','lexus/rc':'XC10','lexus/lbx':'AY10','lexus/lfa':'LFA10',
 'suzuki/kizashi':'RE/RF91S'
};
export const batch2ReviewNotes={
 'subaru/crosstrek':[['from,to','Subaru Europe dates the original XV launch to 2011, while retained global production fields begin in 2012. Production, launch and rename phases require reconciliation.']],
 'subaru/uncharted':[['scope','Manufacturer announcement establishes a European programme with planned Q1 2026 sales; exact Subaru-badge production/current local availability is unresolved.']],
 'subaru/e-outback':[['scope','European E-Outback and global Trailseeker names share a programme. Planned Q1 2026 European launch is not used as a production date.']],
 'lexus/gs':[['from,to','Retained production fields contain an unexpanded snd separator from source-template extraction; chronology stays null pending source/parser reconciliation.']],
 'lexus/rx':[['from','1998 is the explicit Lexus RX first-generation production start; the parent 1997 start includes Toyota Harrier and is not substituted.']],
 'suzuki/jimny':[['scope','Suzuki 2026 European results report discontinued European sales. Global continuing production does not indicate current Czech official availability.']],
 'suzuki/ignis':[['scope','Suzuki 2026 European results report discontinued European sales; retained global production bounds are separate.']],
 'chevrolet/cruze':[['generations','Only the first Europe-relevant generation is reviewed; later global/Chinese successors are not asserted European.']],
 'chevrolet/spark':[['aliases','Matiz is consolidated as a Chevrolet badge-phase alias; Daewoo Matiz remains a separate make entry.']],
 'chevrolet/lacetti':[['aliases','Chevrolet Nubira naming is consolidated into Lacetti; the older Daewoo Nubira line remains separate.']]
};
