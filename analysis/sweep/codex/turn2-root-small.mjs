import {sweep} from './sweep-lib.mjs';
{
 const s=sweep('bertone');
 const x19='https://www.stellantisheritage.com/it-it/heritage/storie/fiat-x1-9';
 const club='https://www.x1-9ownersclub.org.uk/x19-info/model-types.html';
 const runabout='https://bertone.it/bertone-unveils-the-new-runabout/';
 const later='https://bertone.it/bertone-runabout-joins-tutto-bene-hillclimb-2026-slow-down-togo-fast-the-bertone-way/';
 for(const [field,to] of [['from',1982],['to',1989],['productionStatus','ended']]){s.set('x1-9',`generations[0].${field}`,to,[x19],'OEM Heritage explicitly distinguishes Bertone-branded export production1982–1989 from Fiat badge.');s.proposal('x1-9',field,to,[x19],'Bertone-specific production scope.');s.proposal('x1-9',`generations[0].${field}`,to,[x19],'Match Bertone single-family card.');}
 s.report.missingModels.push({name:'Runabout',slug:'runabout',from:null,to:null,bodyTypes:['kabriolet'],sources:[runabout,later],note:'2026 limited-production recreation, distinct from1969 Autobianchi concept. Exact series SOP not established by these releases.'});
 s.report.generationProposals=[{file:'model-lines-auto',slug:'gb110',action:'Add curated road-car line after production evidence review',sources:[runabout],reason:'Raw gb110 exists; current press release presents it alongside Runabout, but no exact SOP verified.'}];
 s.report.conflicts.push({where:'X1/9 production vs final sales',values:{'Stellantis Heritage':'Bertone1982–1989','Club history candidates':'June/July1988 manufacturing stop;1989 final market models'},kept:'1982–1989 manufacturer export-production wording; exact factory cutoff still needs reconciliation'});
 s.checked.push({scope:'X1/9 Bertone chronology and model branding',sources:[x19,club]},{scope:'Bertone1912 heritage and2026 modern production identities',sources:[runabout,later]});
 s.report.openQuestions.push('Freeclimber and FreeclimberII exact manufacturing ends remain unknown.','Runabout2026 and GB110 need curated coverage; do not treat1969 concept as the new production model.','Historical coachbuilder vs current rights-holder country/legal identity needs explicit policy; existing Italian marque origin retained.');
 s.finish('Partial Bertone breadth pass fills Bertone-badge X1/9 chronology1982–1989/ended from OEM Heritage and proposes modern Runabout coverage. Exact factory cutoff conflict and other model ends remain documented.');
}
{
 const s=sweep('brabus');
 const history='https://www.brabus.com/en-sk/brand/brabus-history/firstSteps.html';
 const rocket='https://www.brabus.com/en-it/cars/supercars/brabus-rocket-gts.html';
 const supplier='https://www.continental.com/en/press/press-releases/-20241028-brabus-supercar-rocket/';
 s.checked.push({scope:'1977 corporate foundation and Rocket GTS bespoke shooting-brake production',sources:[history,rocket,supplier]});
 s.set('rocket-gts','generations[0].productionStatus','current',[rocket],'Manufacturer currently describes a limited-production built-to-order vehicle. Exact SOP remains unknown.');
 s.proposal('rocket-gts','productionStatus','current',[rocket],'Manufacturer built-to-order production.');
 s.proposal('rocket-gts','generations[0].productionStatus','current',[rocket],'Single selected Rocket GTS family.');
 s.report.openQuestions.push('Rocket GTS October2024 unveiling and Collection2025 label are not exact manufacturing start evidence; from remains null.','BRABUS is a tuner and coachbuilder with bespoke vehicles; do not remove the whole make just because many models derive from Mercedes-Benz.','Shared body taxonomy needs a consistent shooting-brake classification; no forced coupe/kombi conversion here.','Historic donor generation code and kit availability do not establish start/end of a BRABUS-built vehicle series.');
 s.finish('Partial BRABUS breadth pass confirms1977 identity and current built-to-order Rocket GTS production. Retains all unknown manufacturing bounds and avoids substituting Mercedes donor dates or model-year labels.');
}
{
 const s=sweep('bristol-cars');
 const trust='https://bristolownersht.com/type-404/';
 const club='https://www.bristolownersclubofaustralia.com.au/bristol-models/';
 const continuity='https://bristol-cars.co.uk/about/ownership-and-continuity';
 const four='https://bristolownersht.com/type-400/';
 const five='https://bristolownersht.com/type-405/';
 const owners='https://www.boc.net/cars/bristol-engine';
 s.set('404','generations[0].to',1955,[trust,club],'Owners Heritage Trust gives actual build range1953–1955; owners club corroborates.');
 s.set('404','generations[0].productionStatus','ended',[trust,club],'Historical completed model range.');
 s.proposal('404','to',1955,[trust,club],'Bristol404 model-specific build range.');
 s.proposal('404','productionStatus','ended',[trust,club],'Historical production completed.');
 s.proposal('404','generations[0].to',1955,[trust,club],'Match404 card chronology.');
 s.proposal('404','generations[0].productionStatus','ended',[trust,club],'Match404 historical status.');
 s.checked.push({scope:'404 actual manufacturing interval and400/405 conflicts',sources:[trust,club,four,five,owners]},{scope:'Brand continuity vs1947/2011 companies and2020 liquidation',sources:[continuity]});
 s.report.conflicts.push({where:'400 start',values:{'Current marque history':'First car1946','Trust model page':'Built1949–1950'},kept:null},{where:'405 start',values:{[five]:1954,[owners]:1955},kept:null},{where:'Company origin and liquidation dates',values:{'Car Division':1945,'First car':1946,'Original Bristol Cars Ltd incorporation':1947,'Later company liquidation':2020},kept:'Existing make fields retained pending canonical entity mapping.'});
 s.report.openQuestions.push('Dissolved2020 describes later company liquidation, not necessarily canonical-company dissolution or lasting marque end; verify company register and current rights-holder.','Bullet unveiled2016 did not enter series production per current rights-holder history; raw entry should be reviewed for concept/preproduction classification.','400/405 unknown starts retained because accessible primary histories disagree; model launch and actual first manufacture must be distinguished.','408/410/411 Trust pages inaccessible via web tool in this pass.');
 s.finish('Partial Bristol breadth pass resolves404 end1955/ended using primary heritage custodians. Company/brand continuity and400/405 date conflicts remain explicit; no guessed endpoints or corporate changes.');
}
{
 const s=sweep('borgward');
 const municipal='https://www.ortsamt-hemelingen.bremen.de/stadtteil/geschichte-1657';
 const archive='https://www.ardmediathek.de/video/aktuelle-kamera/insolvenz-der-borgward-werke-in-bremen/ard/YnJpZDovL2RyYS5kZS9tZWRpYXRoZWsvcHVibGljYXRpb24vODI1NjI';
 const history='https://www.verwaltungsschule.bremen.de/sixcms/media.php/13/Die%20Geschichte%20Bremens.pdf';
 s.set('isabella','generations[0].productionStatus','ended',[history,municipal],'Historical Isabella manufacturing is completed; no inference of modern Borgward continuity.');
 s.proposal('isabella','productionStatus','ended',[history,municipal],'Completed historic production, exact aggregate endpoint unresolved.');
 s.proposal('isabella','generations[0].productionStatus','ended',[history,municipal],'Match single historical model generation.');
 s.checked.push({scope:'1961 industrial bankruptcy from city authority and contemporary archive; historic Isabella1954 introduction/end context',sources:[municipal,archive,history]});
 s.report.conflicts.push({where:'1961 bankruptcy vs make dissolvedYear1963',values:{'Bremen authority':1961,'Existing canonical entity dissolution':1963},kept:1963,reason:'Bankruptcy does not itself establish legal dissolution; founder also died1963.'});
 s.report.openQuestions.push('Isabella exact end may include post-bankruptcy completions and overseas assembly; global end kept null rather than forced to German factory1961.','Canonical old-company QID and related modern Chinese-company QID must remain distinguished; no blanket defunct/status propagation.','Modern BXi7 unknown end requires Chinese production/legal sources; bankruptcy is not identical to last build date.','Raw Goliath brand attribution and historic truck B611 eligibility require explicit make/section policy review.');
 s.finish('Partial Borgward breadth pass marks historical Isabella ended while preserving unknown aggregate end. Original-company bankruptcy, founder death, later brand revival and modern production are not conflated.');
}
{
 const s=sweep('brilliance');
 const source='https://www.brillianceauto.com/en/index.html';
 s.checked.push({scope:'Current holding-company identity,1992 Bermuda incorporation and China manufacturing activities',sources:[source]});
 s.report.conflicts.push({where:'Country semantics',values:{'Corporate incorporation':'Bermuda','Make/manufacturing origin':'China'},kept:'China; legal domicile alone does not establish make origin.'});
 s.report.openQuestions.push('Canonical Q917192 must be mapped to holding company vs Brilliance vehicle marque before changing foundation/status or model attribution.','Raw Jinbei Haise/Haixing records are corporate-subsidiary models; confirm brand-specific source and introduce Jinbei identity before any reassignment.','No independently retrieved factory SOP records support filling V3/V7 null starts.','Group2025 annual-report activity and BMW joint venture do not establish current production of discontinued Brilliance-badged sedans.');
 s.finish('Partial Brilliance identity/list pass corroborates1992 holding-company origin and documents corporate/brand attribution risks. No direct card edits; exact vehicle-production dates remain unverified.');
}
{
 const s=sweep('avions-voisin');
 const museum='https://s7abe6bda7f063e33.jimcontent.com/download/version/1671878221/module/13261860449/name/Voisin%20Type-C30S%20Specs.pdf';
 const air='https://www.museeairespace.fr/en/wp-content/uploads/sites/3/2023/05/Carnet-de-vol-musee-air-espace-05-2023-UK.pdf';
 s.checked.push({scope:'Mullin museum primary1939C30S record and Air/Space Museum primary1919 Voisin factory context',sources:[museum,air]});
 s.report.openQuestions.push('1905 aircraft-business foundation vs1919 automobile marque requires canonical company evidence; no foundation correction established.','Museum1939C30S matches existing aggregate C30 end1939 but does not prove whole-family SOP or subtype chronology.','C1/C3/C4/C7 and many later historical endpoints remain null; no full make/model chronology verification achieved.','Museum document was recovered via indexed extraction on a mirror; original closed museum host was not retrieved.');
 s.finish('Limited partial Avions Voisin evidence pass inventories all card/model identities and checks two primary museum records. No supported correction established; most generation dates and exact make identity remain unresolved.');
}
