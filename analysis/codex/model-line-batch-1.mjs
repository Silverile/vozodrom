// Editorial Europe-focused selection. Facts are verified against retained source fields.
export const batchOrder=['saab','honda','mazda','nissan','mitsubishi'];
export const batchSelection={
saab:`900|Saab 900|hsr
9000|Saab 9000|hs
9-3|Saab 9-3|hskr
9-5|Saab 9-5|sk
9-4X|Saab 9-4X|u`,
honda:`Accord|Honda Accord|skc
Civic|Honda Civic|hsck
CR-V|Honda CR-V|u
HR-V|Honda HR-V|u
Jazz|Honda Fit|h
Prelude|Honda Prelude|c
Integra|Honda Integra|c
CRX|Honda CR-X|c
CRX del Sol|Honda CR-X del Sol|r
Legend|Honda Legend|sc
NSX|Honda NSX|cr
S2000|Honda S2000|r
Insight|Honda Insight|h
Stream|Honda Stream|m
Shuttle|Honda Shuttle|m
FR-V|Honda FR-V|m
Logo|Honda Logo|h
Concerto|Honda Concerto|hs
CR-Z|Honda CR-Z|c
e|Honda e|h
e:Ny1|Honda e:Ny1|u
ZR-V|Honda ZR-V|u
City|Honda City|s`,
mazda:`121|Mazda 121|hs
323|Mazda Familia|hsk
626|Mazda Capella|hskc
929|Mazda Luce|s
MX-3|Mazda MX-3|c
MX-5|Mazda MX-5|r
MX-6|Mazda MX-6|c
RX-7|Mazda RX-7|cr
RX-8|Mazda RX-8|c
Xedos 6|Mazda Xedos 6|s
Xedos 9|Mazda Millenia|s
Tribute|Mazda Tribute|u
Premacy|Mazda Premacy|m
MPV|Mazda MPV|m
Demio|Mazda Demio|h
2|Mazda2|h
2 Hybrid|Toyota Yaris (XP210)|h
3|Mazda3|hs
5|Mazda Premacy|m
6|Mazda6|hsk
CX-3|Mazda CX-3|u
CX-5|Mazda CX-5|u
CX-7|Mazda CX-7|u
CX-30|Mazda CX-30|u
CX-60|Mazda CX-60|u
CX-80|Mazda CX-80|u
MX-30|Mazda MX-30|u
6e|Mazda EZ-6|h
B-Series|Mazda B series|p
BT-50|Mazda BT-50|p
E-Series|Mazda Bongo|v`,
nissan:`Micra|Nissan Micra|hr
Almera|Nissan Almera|hs
Almera Tino|Nissan Almera Tino|m
Bluebird|Nissan Bluebird|hsk
Prairie|Nissan Prairie|m
Primera|Nissan Primera|hsk
Sunny|Nissan Sunny|hsk
Note|Nissan Note|m
Tiida|Nissan Tiida|hs
Pulsar|Nissan Pulsar|h
Maxima|Nissan Maxima|s
Pixo|Nissan Pixo|h
100 NX|Nissan NX|c
200 SX|Nissan Silvia|c
300 ZX|Nissan 300ZX|c
350 Z|Nissan 350Z|cr
370 Z|Nissan 370Z|cr
GT-R|Nissan GT-R|c
Leaf|Nissan Leaf|h
Ariya|Nissan Ariya|u
Juke|Nissan Juke|u
Qashqai|Nissan Qashqai|u
X-Trail|Nissan X-Trail|u
Terrano|Nissan Terrano II|u
Patrol|Nissan Patrol|u
Pathfinder|Nissan Pathfinder|u
Murano|Nissan Murano|u
Navara|Nissan Navara|p
Pick Up|Datsun truck|p
NV200|Nissan NV200|vm
NV250|Nissan NV250|v
NV300|Nissan NV300|v
NV400|Nissan NV400|v
Primastar|Nissan Primastar|vm
Interstar|Nissan Interstar|v
Townstar|Nissan Townstar|vm
Kubistar|Nissan Kubistar|v
Vanette|Nissan Vanette|vm
Serena|Nissan Serena|m
Trade|Nissan Trade|v
Cabstar|Nissan Cabstar|v
Atleon|Nissan Atleon|v
Cube|Nissan Cube|m`,
mitsubishi:`Colt|Mitsubishi Colt|h
Lancer|Mitsubishi Lancer|hsk
Galant|Mitsubishi Galant|hsk
Carisma|Mitsubishi Carisma|hs
Sigma|Mitsubishi Diamante|sk
Space Star|Mitsubishi Space Star|hm
Space Runner|Mitsubishi RVR|m
Space Wagon|Mitsubishi Chariot|m
Space Gear|Mitsubishi Delica|vm
L300|Mitsubishi Delica|vm
Pajero|Mitsubishi Pajero|u
Pajero Sport|Mitsubishi Pajero Sport|u
Pajero Pinin|Mitsubishi Pajero iO|u
Outlander|Mitsubishi Outlander|u
ASX|Mitsubishi ASX|u
Eclipse|Mitsubishi Eclipse|cr
Eclipse Cross|Mitsubishi Eclipse Cross|u
3000 GT|Mitsubishi GTO|cr
i-MiEV|Mitsubishi i-MiEV|h
L200|Mitsubishi Triton|p
Grandis|Mitsubishi Grandis|mu
Sapporo|Mitsubishi Galant|s`};
export const batchAdditionalPages={
 'honda/shuttle':['Honda Odyssey (international)'],
 'mazda/929':['Mazda Sentia'],
 'mitsubishi/space-star':['Mitsubishi Mirage'],
 'mazda/121':['Ford Festiva','Autozam Revue','Ford Fiesta (fourth generation)'],
 'mazda/mx-5':['Mazda MX-5 (NA)','Mazda MX-5 (NB)','Mazda MX-5 (NC)','Mazda MX-5 (ND)'],
 'honda/cr-v':['Honda CR-V (third generation)','Honda CR-V (fourth generation)','Honda CR-V (fifth generation)','Honda CR-V (sixth generation)'],
 'honda/jazz':['Honda Fit (first generation)','Honda Fit (second generation)'],
 'mitsubishi/grandis':['Renault Symbioz'],
 'mitsubishi/asx':['Renault Captur'],
 'mitsubishi/colt':['Mitsubishi Colt (2023)','Renault Clio']
};
export const batchAliases={
 'honda/jazz':['Fit'],'honda/crx':['CR-X'],'honda/crx-del-sol':['del Sol'],
 'mazda/323':['Familia'],'mazda/626':['Capella'],'mazda/xedos-9':['Millenia'],
 'nissan/maxima':['Maxima QX'],'nissan/nv200':['Evalia','e-NV200'],
 'nissan/qashqai':['Qashqai+2'],'nissan/pick-up':['D21','D22','NP300 Pick Up'],
 'mitsubishi/space-star':['Mirage'],'mitsubishi/space-gear':['L400'],
 'mitsubishi/pajero':['Montero','Shogun'],'mitsubishi/pajero-pinin':['Pinin','Pajero iO'],
 'mitsubishi/l200':['Triton'],'mitsubishi/3000-gt':['GTO']
};
export const batchExclusions={
 saab:[['Aero / Viggen / Griffin / Turbo X','equipment/performance derivatives merged into their parent lines'],['9-2X / 9-7X','North-American badge programmes outside this ordinary European-market selection'],['92 / 93 / 95 / 96 / 99 / Sonett / 90','production ended before the approximately 1990 target window'],['9-X / Aero X / PhoeniX','concept vehicles']],
 honda:[['Type R / Type S / Mugen / Si','performance/equipment variants merged into base model lines'],['Fit','regional name retained as Jazz alias'],['Civic Aerodeck / Accord Tourer','body variants under Civic/Accord'],['Pilot / Passport / Ridgeline / Crosstour / Element / Acura badges','regional or separate-marque programmes outside this ordinary European-market selection'],['N-Box / N-One / Beat / S660','regional kei-car programmes outside this pass'],['Quintet','production ended before the target period'],['Prologue / 0 Series / concepts','European production-market presence not established in this pass']],
 mazda:[['MPS / Mazdaspeed / GT / Sport','performance/equipment derivatives'],['Axela / Atenza / Familia / Capella','regional names; corresponding European lines retained'],['CX-9 / CX-8 / CX-50 / CX-70 / CX-90','regional-market programmes outside this Europe-focused pass; private imports can exist'],['CX-6e / Iconic SP / concepts','not admitted without checked European production evidence'],['RX-9 / MX-5 special editions','unverified future programmes or edition derivatives'],['MPV third generation / late Japanese Bongo successors','regional-only successors not asserted to be European'],['Cosmo / Autozam AZ-1 / Carol / Scrum','regional low-volume or kei programmes outside this pass']],
 nissan:[['Nismo / Tekna / DIG-T / dCi','performance, equipment and engine variants'],['Qashqai+2 / Evalia / e-NV200','length, passenger or powertrain derivatives merged into corresponding families'],['Rogue / Sentra / Altima / Armada / Titan / Kicks / Quest / Elgrand','regional programmes outside this ordinary European-market pass'],['Skyline / Silvia Japanese badge / Figaro / Pao / Z RZ34','regional badges or grey-import lines outside the European-name selection; European 200 SX retained'],['Terrano D10','regional Duster-based badge, not the European Terrano II'],['Primastar / NV300 and Interstar / NV400 badge phases','separately listed European sales names; exact phase dates need badge-specific evidence'],['Nissan Z Proto / IDx / concepts','concept or future programmes']],
 mitsubishi:[['Evolution / Ralliart / GT / special editions','performance/equipment derivatives of base lines'],['Mirage / Shogun / Montero / Triton / GTO','regional names retained as aliases of European lines'],['L400','commercial derivative retained under Space Gear family'],['Starion / Cordia / Tredia','production ended before the target window'],['Fuso Canter','separate commercial marque identity; not added under Mitsubishi passenger make'],['Xpander / Xforce / Attrage / Delica D:5 / Minicab / regional Pajero Mini','regional-market programmes outside this ordinary European-market pass'],['Engelberg / eX / Mi-Tech','concept vehicles'],['Grandis revived crossover / regional ASX successors','name reuse acknowledged; exact European production phases remain needsReview rather than inheriting Renault donor dates']]
};
export const batchUnknownDates=[
 'honda/accord','honda/integra','honda/legend','honda/insight','honda/shuttle','honda/city','honda/e-ny1',
 'mazda/121','mazda/929','mazda/2-hybrid','mazda/5','mazda/6e','mazda/e-series','mazda/bt-50',
 'nissan/almera','nissan/sunny','nissan/note','nissan/pulsar','nissan/maxima','nissan/200-sx','nissan/patrol','nissan/pathfinder','nissan/murano','nissan/navara','nissan/pick-up','nissan/serena','nissan/cabstar','nissan/cube','nissan/bluebird','nissan/prairie',
 'mitsubishi/sigma','mitsubishi/sapporo','mitsubishi/asx','mitsubishi/grandis','mitsubishi/l300','mitsubishi/space-gear','mitsubishi/space-star'
];
export const batchDateChoices={
 'honda/prelude':{combine:true},'honda/nsx':{combine:true},'honda/hr-v':{combine:true},
 'honda/concerto':{ranges:[1],scope:'europe'},
 'mazda/demio':{box:'First generation'},'mazda/premacy':{box:'First generation',ranges:[0]},
 'mitsubishi/colt':{ranges:[1,2],combine:true},
 'mitsubishi/space-runner':{ranges:[0]},'mitsubishi/pajero':{ranges:[0]},
 'mitsubishi/lancer':{ranges:[0]},'mitsubishi/pajero-pinin':{ranges:[0]},
 'mitsubishi/3000-gt':{ranges:[0]},'mitsubishi/i-miev':{ranges:[1],scope:'europe'},
 'nissan/trade':{ranges:[2]}
 ,'nissan/almera-tino':{ranges:[1],scope:'europe'}
};
// Only selected Europe-relevant families/eras; this is not a complete generation inventory.
export const batchGenerationFamilies=[
 'saab/900','saab/9-3','saab/9-5',
 'honda/cr-v','honda/hr-v','honda/jazz','honda/prelude','honda/crx',
 'mazda/3','mazda/6','mazda/mx-5','mazda/mx-6','mazda/rx-7','mazda/cx-5',
 'nissan/micra','nissan/primera','nissan/qashqai','nissan/x-trail','nissan/juke',
 'mitsubishi/pajero','mitsubishi/outlander','mitsubishi/space-runner','mitsubishi/space-wagon'
];
export const batchGenerationSkip={
 'mitsubishi/pajero':/Fifth generation/i,
 'mitsubishi/space-wagon':/Third generation.*UG/i
};
export const batchGenerationDateChoices={
 'saab/9-3':{second:{combine:true}},'saab/9-5':{YS3E:{combine:true}},
 'mazda/3':{BK:{ranges:[0]}},
 'mazda/6':{'GG1':{ranges:[0]},'GH1/GH2':{ranges:[0]}},
 'mazda/rx-7':{FC:{combine:true}},
 'nissan/micra':{K11:{ranges:[0]},K13:{ranges:[0]}},
 'mitsubishi/pajero':{second:{ranges:[0]},third:{ranges:[0]}},
 'mitsubishi/outlander':{first:{ranges:[1]},third:{ranges:[0]}}
};
