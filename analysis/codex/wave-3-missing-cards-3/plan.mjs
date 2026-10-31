const eng=(fuel,variant,n,url)=>({fuel,variant,powerKwMin:n,powerKwMax:n,availablePowerKw:[n],powerRangeCoverage:'documented-versions-only',sources:[url]});
export const plans=[];
function add(id,name,url,entries,summaryCs=null,extra={}){plans.push({id,name,source:url,generations:entries.map(({proof,...g})=>({code:null,engines:[],sources:[url],...g})),evidence:entries.map((g,i)=>({generationIndex:i,url,production:g.proof,body:g.bodyTypes.join(', ')})),...(summaryCs?{summaryCs}:{}),...extra});}
const mos='https://ru.wikipedia.org/wiki/Москвич-2140';
add('moskvic/2315-pickup-on-2140-base','2315',mos,[{name:'2315',code:'2315',from:1984,to:1988,productionStatus:'ended',bodyTypes:['pickup'],proof:'Model-specific 2140 article explicitly states small batches of 2315 pickups assembled 1984–1988 from sedan/estate bodies. Earlier prototype dates are not series production.'}]);
const rocks='https://en.wikipedia.org/wiki/Citroën_Ami_(electric_vehicle)';
add('opel/rocks-e-rocks-electric-model-line-l6e-quadricycle-decide-whether-it-belongs-in-auto','Rocks-e / Rocks Electric',rocks,[{name:'Rocks-e / Rocks Electric',from:2021,to:null,productionStatus:'current',bodyTypes:[],engines:[eng('electric','Elektromotor',6,rocks)],proof:'Opel badge presented August 2021, on sale November 2021; renamed Rocks Electric in 2023. Ami/Rocks drivetrain 6 kW. Body is a two-door L6e quadricycle, not asserted to be a hatchback or coupe.'}],'Lehká elektrická čtyřkolka kategorie L6e, příbuzná Citroënu Ami. Označení Rocks-e bylo v roce 2023 změněno na Rocks Electric.',{vehicleCategory:'L6e'});
const pac='https://en.wikipedia.org/wiki/1957_and_1958_Packards';
add('packard/packard-1958-sedan-hardtop-station-wagon-packardbaker','Packard (1958)',pac,[{name:'Packard (MY 1958)',from:null,to:1958,productionStatus:'ended',bodyTypes:['sedan','kupe','kombi'],proof:'Exact calendar production start unconfirmed; three standard 1958 models were sedan, hardtop and station wagon. Last Packard left South Bend on 25 July 1958. Separately catalogued Hawk is excluded.'}],'Poslední osobní Packardy odvozené ze Studebakeru: sedan, hardtop a kombi. Modelový rok 1958 není vydáván za přesný začátek výroby; výroba skončila v červenci 1958.');
const sub='https://en.wikipedia.org/wiki/Plymouth_Suburban';
add('plymouth/suburban','Suburban',sub,[
 {name:'Suburban',from:1949,to:1955,productionStatus:'ended',bodyTypes:['kombi'],dateBasis:'production',specificationScope:{noteCs:'První pojmenované období podle článku; úplné členění jednotlivých podvozkových generací zatím není doloženo.'},proof:'Article production history heading 1949 to 1955; station wagon originally in ordinary Plymouth trim families.'},
 {name:'Suburban (samostatná řada)',from:1956,to:1961,productionStatus:'ended',bodyTypes:['kombi'],dateBasis:'production',specificationScope:{noteCs:'Samostatná obchodní řada kombi; jemnější přechody karoserií uvnitř období zůstávají neúplné.'},proof:'Article expressly identifies 1956–1961 separate series of Suburban wagons.'},
 {name:'Fury Suburban',from:1968,to:1978,productionStatus:'ended',bodyTypes:['kombi'],dateBasis:'production',specificationScope:{noteCs:'Pozdější pojmenované období Fury Suburban; ne tvrzení o jediném podvozku po celé období.'},proof:'Article production history heading 1968–1978: Fury Suburban, revived after Suburban name had been absent.'},
],'Historická řada kombi Plymouth. Zachycena jsou tři pojmenovaná období; úplné rozlišení všech karoserií a podvozkových generací se ještě doplňuje.');
const str='https://journal.classiccars.com/2026/01/15/pick-of-the-day-1964-pontiac-strato-chief/';
add('pontiac/strato-chief-canada','Strato-Chief',str,[{name:'Strato-Chief',from:1958,to:1970,productionStatus:'ended',bodyTypes:['sedan'],dateBasis:'production',specificationScope:{noteCs:'Kanadská modelová rodina. Úplné podvozkové a karosářské generace zatím nejsou rozlišeny.'},proof:'Canadian-specific history: introduced 1958 as replacement for Pathfinder Deluxe, range continued through 1970; documented 1964 four-door sedan. US Star Chief 1954–1966 dates were not copied.'}],'Kanadský Pontiac s technikou Chevroletu, odlišný od amerického Star Chiefu. Karta zatím shrnuje období celé řady, nikoli úplný seznam podvozkových generací.');
const wave='https://en.wikipedia.org/wiki/Daewoo_Kalos';
add('pontiac/wave-canada-rebadged-chevrolet-aveo-t200','Wave / G3 Wave',wave,[{name:'Wave / G3 Wave',code:'T200/T250',from:2004,to:2009,productionStatus:'ended',bodyTypes:['sedan','hatchback'],proof:'Pontiac Wave Canadian badge from 2004; article confirms final G3 Wave built December 2009, despite MY2010 marketing. T250 is the restyled T200 family, not a separate full generation.'}]);
const al='https://www.blockleytyre.com/make/salmson/salmson-al-al3';
add('salmson/al','AL / AL3',al,[{name:'AL / AL3',code:'AL',from:1921,to:null,productionStatus:'unknown',bodyTypes:['kabriolet'],proof:'Model-specific technical history explicitly says AL built from 1921 with Emile Petit four-cylinder engine. Exact end and complete evolution to AL3 remain unconfirmed; not asserted current.'}]);
const caj='https://www.santiagoramonycajal.org/articulos/santana-cajal-todoterreno-linares/';
add('santana-motor/santana-cajal','Cajal',caj,[{name:'Cajal',from:2026,to:null,productionStatus:'announced',dateBasis:'announcement',specificationScope:{noteCs:'Představeno 15. července 2026; datum skutečného zahájení sériové výroby zde není potvrzeno.'},bodyTypes:['suv'],proof:'Presentation organiser/family source documents Santana Cajal public presentation on 15 July 2026, based on BAIC; series-production start not established by presentation alone.'}]);
const san='https://es.wikipedia.org/wiki/Land_Rover_Santana';
add('santana-motor/santana-series-ii-iia-iii-88-109-licensed-land-rover','Land Rover Santana',san,[
 {name:'Series II / IIA (88 / 109)',code:'II/IIA',from:1958,to:1974,productionStatus:'ended',bodyTypes:['suv','pickup'],proof:'Spanish licensed assembly began 1958; Santana II/IIA continued until Series III arrival 1974. II/IIA exact internal boundary not split without clear Spanish production evidence.'},
 {name:'Series III (88 / 109)',code:'III',from:1974,to:1984,productionStatus:'ended',bodyTypes:['suv','pickup'],proof:'Spanish-model article expressly states Series III produced 1974–1984, three years later than Solihull. Independent 2500/Super/Cazorla family is already separate.'},
]);
export const duplicateTargets={
 'microcar/m-go-models-auto-has-0-microcar-rows':['microcar/m-go'],
 'omoda/omoda-9-c9':['omoda/9'],
 'studebaker/lark-cruiser-cruiser':['studebaker/cruiser'],
 'studebaker/lark-daytona-daytona':['studebaker/daytona'],
 'venturi/atlantique-260-300-300-biturbo':['venturi/atlantique'],
};
export const nonModelProposals=['mazda/cx-5e'];
export const exclusionEvidence={
 'mazda/cx-5e':{kind:'unconfirmed-vehicle-name',reason:'The identified primary source establishes only Mazda CX-5e trademark registration, not an announced or produced vehicle. Exclude the unsupported model proposal pending vehicle identification; do not alias it to CX-6e.',sources:['https://tramites.inapi.cl/TrademarkNewGazette/DownloadFile?date=08%2F29%2F2025+00%3A00%3A00&stream_id=b05f461a-e984-f011-8948-040973dcfef1']},
};
