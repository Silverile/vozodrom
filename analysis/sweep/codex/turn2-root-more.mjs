import {sweep} from './sweep-lib.mjs';
{
 const s=sweep('alpina');
 const source='https://www.press.bmwgroup.com/netherlands/article/attachment/T0457885NL/649108';
 const launch='https://www.press.bmwgroup.com/global/article/detail/T0454624EN/bmw-alpina%3A-launch-of-the-new-exclusive-bmw-group-brand';
 const latest='https://www.bmwgroup.com/en/news/general/2026/bmw-alpina.html';
 s.checked.push({scope:'1965 Buchloe origin and transfer to BMW on1January2026',sources:[source,launch,latest]});
 s.report.conflicts.push({where:'Manufacturer legacy company vs continuing BMW ALPINA marque',values:{'Legacy foundingYear':1965,'New BMW brand activation':2026},kept:1965});
 s.report.openQuestions.push('Do not mark ALPINA defunct just because rights transferred to BMW; separate canonical company identity from the continuing marque.','BMW says first new-era model arrives2027; this does not prove exact termination dates of every old B4/B5/B8/XB7 family. Existing unknown statuses retained.','Three attempted manufacturer historical model pages were inaccessible via web tool; Roadster S and B5 exact year candidates remain unverified.','Raw list mixes B10 family, B10 Bi-Turbo and E39 generation entries. Reconcile identities using manufacturer archive before bulk merging.');
 s.finish('Partial Alpina breadth pass verifies1965 origin and2026 BMW brand continuity. No direct card changes: historic generation dates and per-family ends were not established by accessible primary evidence.');
}
{
 const s=sweep('lotus');
 const esprit='https://www.lotuscars.com/en-HU/lotus-story/road-cars/esprit';
 const about='https://www.lotuscars.com/en-GB/lotus-story/about-lotus?channel=app';
 const manual='https://manuals.plus/m/25bffa22123b35d1f6edcd5f27c055fec47f0e118bef6d975c205cb9f9b8939d.pdf';
 s.set('esprit','generations[4].to',2004,[esprit],'OEM explicitly dates final hand-built V8 cars2002–2004 and last departure2004.');
 s.set('esprit','generations[4].productionStatus','ended',[esprit],'Completed historical V8 production.');
 s.set('esprit','generations[1].productionStatus','ended',[esprit],'Historical pre-V8 iteration cannot be current; exact endpoint retained unknown.');
 for(const [i,field,to] of [[4,'to',2004],[4,'productionStatus','ended'],[1,'productionStatus','ended']])s.proposal('esprit',`generations[${i}].${field}`,to,[esprit],'Shared/card row identity requires preserved existing Esprit stage ordering.');
 s.checked.push({scope:'Esprit final V8 end and historic status; company1952 vs origins1948; Elise/Exige/Evora2021 ends retained',sources:[esprit,about]},{scope:'Original Evora June2009 first delivery from OEM service notes reproduced by host',sources:[manual]});
 s.report.conflicts.push({where:'Lotus founding date semantics',values:{'Brand/first car':1948,'Lotus Engineering Company formed':1952},kept:1952});
 s.report.openQuestions.push('Evora first deliveryJune2009 proves cars existed then but does not independently establish exact SOP; from remains null.','Esprit S2 exact end and Europa/Seven staged ends need factory range evidence.','Lotus raw list contains many race cars and duplicate type/marketing names; no blanket exclusions without inspecting homologation/road status.','Modern Eletre/Emeya/Emira/Evija production statuses need dated2026 industrial evidence; retained unknown.');
 s.finish('Partial Lotus breadth pass resolves final Esprit V8 end2004 and two historic statuses. Retains1952 legal-company foundation and existing2021 family ends; no launch-to-production inference for Evora.');
}
{
 const s=sweep('bugatti-automobiles');
 const divo='https://newsroom.bugatti.com/press-releases/bugatti-awards-hyper-sports-car-wins-readers-polls';
 const cent='https://newsroom.bugatti.com/press-releases/bugatti-centodieci-about-to-enter-production';
 const final='https://newsroom.bugatti.com/press-releases/bugatti-delivers-the-tenth-and-final-centodieci-hyper-sports-car';
 const tour='https://newsroom.bugatti.com/press-releases/la-manufacture-bugatti-inaugurates-the-new-home-of-the-tourbillon-era';
 s.set('divo','generations[0].from',2019,[divo],'Dated19December2019 release explicitly states Divo production started this year; deliveries2020 are distinct.');
 s.set('centodieci','generations[0].from',2022,[cent,final],'March2022 pre-SOP release plus December2022 all ten completed establish series production2022.');
 for(const [slug,to,src] of [['divo',2019,divo],['centodieci',2022,cent]]){s.proposal(slug,'from',to,[src],'Exact model manufacturing start, not premiere year.');s.proposal(slug,'generations[0].from',to,[src],'Match single-generation card chronology.');}
 s.makeFix('aliases',[],[divo],'Existing alias Q2308012 is the canonical opaque identifier, not a manufacturer name; qid field retains it.');
 s.checked.push({scope:'Divo2019 manufacturing start and Centodieci2022 production interval',sources:[divo,cent,final]},{scope:'Tourbillon July2026 factory preparation, not confirmed SOP',sources:[tour]});
 s.report.generationProposals=[{file:'model-lines-auto',slug:'tourbillon',action:'Add selected road-car family after identity review',from:null,to:null,productionStatus:'unknown',sources:[tour],reason:'Raw bugatti-tourbillon exists, curated line/card absent. July2026 factory inauguration still describes preparing SOP, not completed production.'}];
 s.report.openQuestions.push('Modern Bugatti Automobiles entity founded2000 vs1998 brand re-establishment requires company-register proof before changing foundedYear.','Historic Types and EB110 attribution span predecessor companies; current card make is commercial marque umbrella while canonical make QID is modern legal entity. Decide policy before moves.','W16 Mistral exact production start/end and2026 status remain unknown.','Tourbillon exists in raw list; proposed curated coverage gap must not duplicate that raw entity.');
 s.finish('Partial Bugatti breadth pass fills Divo manufacturing start2019 and Centodieci2022 from OEM chronology, proposes removal of opaque QID alias and a curated Tourbillon coverage gap. Legal-entity date semantics and Mistral status remain unresolved.');
}
{
 const s=sweep('bentley');
 const heritage='https://www.bentleymotors.com/en/about-bentley/history-and-heritage/bentley-story.html';
 const newSpur='https://www.bentleymedia.com/attachment/0e7e0f1e-6e8b-45c7-89ae-87c9e2010e09';
 const finalW12='https://www.bentleymedia.com/attachment/d618a35c-76a2-41ac-abee-4de883101c4c';
 const production='https://www.bentleymedia.com/attachment/032ecd23-1978-466d-902b-7bd405620568';
 s.checked.push({scope:'Official historic marque chronology and8Litre range',sources:[heritage]},{scope:'Fourth-generation Flying Spur launched2024; production-spec example2025; W12 cessation2024',sources:[newSpur,production,finalW12]});
 s.report.generationProposals=[{file:'model-lines-auto and model-cards',slug:'flying-spur',action:'Reconcile missing manufacturer-designated fourth generation',match:{existingStage:'Third family2019 onward'},from:null,to:null,productionStatus:'unknown',sources:[newSpur,production],reason:'OEM explicitly calls2024 car fourth generation; retained third-family row may be platform-level grouping. Exact SOP and schema policy required before splitting or overwriting its photo/specs.'}];
 s.report.conflicts.push({where:'8Litre production end',values:{[heritage]:'1930–1932','Common1931 endpoint':'Needs factory chassis vs final coachwork distinction'},kept:null});
 s.report.openQuestions.push('Flying Spur fourth generation absent from current three-stage card; exact factory start cannot be substituted with unveilingSeptember2024.','Final W12 engine/car2024 does not prove whole Bentayga/Flying Spur family ceased, since other powertrains continue.','8Litre end remains unknown pending chassis vs completed-car scope reconciliation.','Batur coupe/convertible and Bacalar starts/ends need manufacture-specific evidence; unknown fields retained.','Raw list includes Speed8 race car and several coachbuilt/private names; road-car eligibility requires separate evidence.');
 s.finish('Partial Bentley breadth pass identifies missing manufacturer-designated fourth Flying Spur generation and documents historic8Litre end conflict. No direct card changes; launch years and engine cessation were not substituted for whole-model production dates.');
}
{
 const s=sweep('ferrari');
 const annual='https://ferrari.scene7.com/is/content/ferrari/Ferrari_Annual_Report_2025_20F%20Form';
 const quarterly='https://www.publicnow.com/view/B1DACD5FEEF7E0AD7F9669D9C7ED048934F008A9';
 const history='https://www.ferrari.com/content/dam/ferrari-fcom/old/pdf/cos_ferrari_inizio_celebrazioni_70_anni_eng.pdf';
 for(const slug of ['f80','849-testarossa','amalfi']){
  s.set(slug,'generations[0].productionStatus','current',[quarterly],'Issuer Q1-2026 filing reports actual deliveries/ramp-up; announcement alone was not used.');
  s.proposal(slug,'productionStatus','current',[quarterly],'2026 actual customer distribution.');
  s.proposal(slug,'generations[0].productionStatus','current',[quarterly],'Single selected family actual customer distribution.');
 }
 s.checked.push({scope:'Foundation1947 retained and historic reveal chronology distinguished from production',sources:[history]},{scope:'F80 actual first shipmentsQ4-2025 and DaytonaSP3 final shipmentsQ3-2025',sources:[annual]},{scope:'Issuer Q1-2026 filing mirror: F80 ramp-up, first849Testarossa/Amalfi deliveries',sources:[quarterly]});
 s.report.openQuestions.push('F80 production start remains null: actual first shipmentsQ4-2025 are known, but manufacturing may precede delivery.','849Testarossa production start remains null: first deliveryQ1-2026 is not an exact SOP record.','GTO1984 reveal is verified, but both production bounds remain null without direct manufacturing-range evidence.','Ferrari raw list is dominated by race cars, variants and one-offs; full eligibility and family grouping unresolved.','Company identity should distinguish1947 Ferrari marque origin from later corporate incorporation.','Quarterly statement was checked as issuer-authored Form6-K text mirrored by PublicNow; original-host copy not retrieved in this pass.');
 s.finish('Partial Ferrari breadth pass verifies three2026 active model statuses using actual issuer-reported shipments and preserves unknown SOP years. Historic and raw-model normalization remains open; no reveal/delivery dates were relabeled as production starts.');
}
