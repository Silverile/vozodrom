import fs from 'node:fs';
import {generation,markUnknowns,saveCards} from './night-card-helpers.mjs';
const cs=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/mg.json'));
const C=s=>cs.find(c=>c.lineSlug===s),W=n=>'https://en.wikipedia.org/wiki/'+n;
C('mg5').generations=[generation('MG5 I',2012,2018,[W('MG_5')],{bodyTypes:['hatchback','sedan']}),generation('MG5 II / GT',2020,null,[W('MG_5')],{bodyTypes:['sedan']}),generation('MG5 – regionální větev Roewe i5',null,null,['https://en.wikipedia.org/wiki/List_of_MG_vehicles'],{bodyTypes:['sedan'],marketNotesCs:'Regionální větev; data původního Roewe i5 nejsou ověřeným výrobním obdobím značky MG.'})];
C('magnette').generations[3].to=null;
C('magnette').generations[3].productionStatus='unknown';
for(const s of ['mga','mgb','mgc'])C(s).generations[0].bodyTypes=['kabriolet','kupe'];
C('t-type').generations[0].bodyTypes=['kabriolet','kupe'];
for(const s of ['sa','va','wa'])C(s).generations[0].bodyTypes=['sedan','kabriolet'];
C('mg3').summaryCs='MG3 zahrnuje raný MG3 SW příbuzný Roveru Streetwise i pozdější samostatné generace hatchbacku. Hybrid+ třetí generace používá hybridní soustavu, jejíž systémový výkon se nesčítá prostým součtem výkonů motorů.';
C('mg4').summaryCs='První MG4 EV je elektrický hatchback se zadním pohonem a také verzí XPOWER s pohonem obou náprav. Čínská pozdější generace a evropské označení Urban se bez přesného vymezení nekopírují do této generace.';
C('mg5-ev').summaryCs='Evropský MG5 EV je elektrické kombi příbuzné Roewe Ei5. Od spalovacích sedanů a hatchbacků stejného jména MG5 je v katalogu odděleno.';
C('mg5').summaryCs='Označení MG5 zahrnuje spalovací hatchback a pozdější sedanové rodiny pro různé trhy, včetně regionálního jména GT. Evropské elektrické kombi se vede na samostatné kartě a nepřebírá jejich výrobní data.';
C('t-type').summaryCs='Rodina T-Type sdružuje roadstery TA, TB, TC, TD a historický TF vyráběné před válkou a po ní. Nejde o stejný vůz jako novodobý MG TF uvedený roku 2002.';
for(const c of cs){c.needsReview=[];markUnknowns(c);}
C('magnette').needsReview.find(r=>r.field==='generations[3].to').reason='Přehled modelů uvádí1968, detailní článek MarkIV1969; výrobní a prodejní období nejsou sladěna.';
saveCards('mg',cs);
fs.writeFileSync('analysis/codex/mg-evidence/history-facts.json',JSON.stringify({checkedAt:'2026-10-27',facts:[{model:'MG6 II',from:2016,source:W('MG_6')},{model:'MG7 II',from:2022,source:W('MG_7')},{model:'MG5 I',from:2012,to:2018,source:W('MG_5')},{model:'MG5 II',from:2020,to:null,source:W('MG_5')},{model:'SA',from:1936,to:1939,source:W('MG_SA')},{model:'VA',from:1937,to:1939,source:W('MG_VA')},{model:'MagnetteIV',to:null,conflictingEndYears:[1968,1969],source:W('MG_Magnette')}]},null,2));
