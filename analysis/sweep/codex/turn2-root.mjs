import {sweep} from './sweep-lib.mjs';
{
 const s=sweep('alpine');
 const history='https://www.media.alpinecars.com/history-of-the-alpine-brand/?lang=eng';
 const kit='https://mb.cision.com/Public/5113/9915702/9434b7137259e429.pdf';
 const end='https://media.alpinecars.com/over-35000-alpine-a110-produced-at-the-alpine-dieppe-manufacture-which-is-gearing-up-to-welcome-the-3rd-generation/?lang=eng';
 const dieppe='https://www.renaultgroup.com/groupe/implantations/usine-dieppe/';
 const douai='https://www.renaultgroup.com/groupe/implantations/usine-douai/';
 s.makeFix('foundedYear',1955,[history],'Alpine marque foundation, not factory inauguration.');
 for(const [slug,i,field,to,src] of [['a106',0,'productionStatus','ended',kit],['a310',1,'to',1984,kit],['a310',1,'productionStatus','ended',kit],['a110',1,'to',2026,end],['a110',1,'productionStatus','ended',end],['a390',0,'productionStatus','current',dieppe],['a290',0,'productionStatus','current',douai]]){
  const path=`generations[${i}].${field}`;s.set(slug,path,to,[src],'Explicit production history/factory product evidence.');s.proposal(slug,path,to,[src],'Reconcile with verified card field.');
 }
 for(const [slug,field,to,src] of [['a106','productionStatus','ended',kit],['a310','to',1984,kit],['a310','productionStatus','ended',kit],['a290','productionStatus','current',douai],['a390','productionStatus','current',dieppe]])s.proposal(slug,field,to,[src],'Whole-family reconciliation where applicable.');
 const concept='https://media.alpinecars.com/alpine-presents-alpenglow-hy6-with-the-brands-first-6-cylinder-hydrogen-engine/?lang=eng';
 s.report.removeModels.push({file:'models-auto',slug:'alpenglow-hy6',reason:'Manufacturer identifies a hydrogen rolling-prototype/concept, not a series-production car.',sources:[concept]});
 s.checked.push({scope:'Make foundation and eight card date/status fields',sources:[history,kit,end,dieppe,douai]},{scope:'Alpenglow Hy6 concept classification',sources:[concept]});
 s.report.conflicts.push({where:'A110 second-generation final date within 2026',values:{'Renault factory timeline':'June 2026','Alpine final-car release':'1 July 2026'},kept:2026},{where:'A108 / A610 historical start scope',values:{'Existing A108/A610':'1958 / 1991','2016 manufacturer French-production table':'1960 / 1990'},kept:'Existing starts retained; verify launch vs French series production before changing.'});
 s.report.openQuestions.push('A110 line combines historic and modern generations; line-wide end cannot be changed to 2026 without deciding future-generation handling.','A390 curated card already exists although raw Wikidata-derived model list lacks it. Do not duplicate the line.','Historical A108/A610 and license-built models need scoped generation reconciliation; racing A210 raw entry not classified in this pass.');
 s.finish('Partial Alpine breadth pass proposes founding year 1955, resolves historical A106/A310 ends and modern A110 end2026, and verifies A290/A390 factory production. Excludes Alpenglow Hy6 concept by proposal; unresolved historical scope conflicts retained.');
}
{
 const s=sweep('lamborghini');
 const company='https://www.lamborghini.com/company';
 const profile='https://www.audi.com/en/automobili-lamborghini-spa-5567/profile-of-lamborghini-14562';
 s.makeFix('foundedYear',1963,[company,profile],'1948 is the tractor-business origin, not Automobili Lamborghini.');
 for(const slug of ['revuelto','temerario','urus']){s.set(slug,'generations[0].productionStatus','current',[profile,company],'2026 parent-company profile explicitly lists current production models.');s.proposal(slug,'productionStatus','current',[profile,company],'Current production lineup.');s.proposal(slug,'generations[0].productionStatus','current',[profile,company],'Current production lineup.');}
 const jarama='https://www.lamborghini.com/en-en/history/jarama';
 const jaramaKit='https://preview.thenewsmarket.com/Previews/lamb/DocumentAssets/571995.pdf';
 s.set('jarama','generations[0].productionStatus','ended',[jarama,jaramaKit],'Both manufacturer histories describe completed historical production, although end years conflict.');
 s.proposal('jarama','productionStatus','ended',[jarama,jaramaKit],'Historical family ended; exact year unresolved.');
 s.proposal('jarama','generations[0].productionStatus','ended',[jarama,jaramaKit],'Historical family ended; exact year unresolved.');
 const countach='https://www.lamborghini.com/es-en/noticias/50-years-ago-the-first-countach-in-santagata-bolognese';
 const milestones='https://www.lamborghini.com/en-en/history/milestones';
 const huracan='https://www.lamborghini.com/es-en/noticias/lamborghini-celebrates-a-record-year-with-10687-cars-delivered';
 s.checked.push({scope:'Automobili foundation1963 and 2026 current production lineup',sources:[company,profile]},{scope:'Jarama historic status and disputed end',sources:[jarama,jaramaKit]},{scope:'Countach series start conflict',sources:[countach,milestones]},{scope:'Huracan existing end2024 contradiction',sources:[huracan]});
 s.set('huracan','generations[0].to',null,[huracan],'January2025 OEM release says final cars still in production. End2024 cannot stand; exact final-production date not established here.');
 s.set('huracan','needsReview',[...s.cards.find(c=>c.lineSlug==='huracan').needsReview,{field:'generations[0].to',reason:'Výrobce ještě v lednu 2025 potvrzoval výrobu posledních kusů; konec 2024 byl odstraněn a přesný konec je nutné ověřit.'}],[huracan],'Record unknown final production date.');
 s.proposal('huracan','to',null,[huracan],'OEM release rules out 2024 final production; exact end remains unverified.');
 s.proposal('huracan','generations[0].to',null,[huracan],'OEM release rules out 2024 final production.');
 s.report.conflicts.push({where:'Jarama production end',values:{[jarama]:1978,[jaramaKit]:1976},kept:null},{where:'Countach LP400 production start',values:{[milestones]:'1973 in one section,1974 in another',[countach]:1974},kept:null});
 s.report.openQuestions.push('Fenomeno limited-production identity exists in cards, but its exact SOP is not established by the 2026 model profile.','Countach start and Jarama end require factory-led reconciliation because manufacturer publications conflict.','Many raw Gallardo/Diablo variants and apparent concepts remain unclassified; do not bulk-remove variant entries without identity policy.');
 s.finish('Partial Lamborghini breadth pass corrects the proposed automotive founding year from1948 to1963, verifies three current production families, marks historical Jarama ended, and clears disproved Huracan2024 end. Conflicting exact dates remain null.');
}
{
 const s=sweep('aston-martin');
 const history='https://www.astonmartin.com/en/our-world/113-years-in-the-making';
 const db9='https://www.astonmartin.com/en/models/past-models/db9';
 const heritage='https://www.astonmartin.com/en/models/past-models';
 const works='https://amwparts.com/models/';
 s.makeFix('foundedYear',1913,[history],'Manufacturer dates foundation15January1913.');
 for(const [slug,i,field,to,src] of [['db9',0,'from',2004,db9],['db9',0,'to',2016,db9],['db9',0,'productionStatus','ended',db9],['db6',0,'to',1970,heritage],['db6',0,'productionStatus','ended',heritage],['db11',0,'to',2023,works],['db11',0,'productionStatus','ended',works],['vantage',1,'productionStatus','ended',works]]){
  const path=`generations[${i}].${field}`;s.set(slug,path,to,[src],'Official model-specific heritage or factory Works parts chronology.');s.proposal(slug,path,to,[src],'Reconcile generation chronology.');
  if(i===0)s.proposal(slug,field,to,[src],'Reconcile whole-line chronology when line matches this single generation.');
 }
 s.checked.push({scope:'Foundation1913',sources:[history]},{scope:'DB9/DB6/DB11 and 2005 V8 Vantage chronology',sources:[db9,heritage,works]});
 s.report.conflicts.push({where:'DB9 introduction vs production interval',values:{'Official heritage index':'2003–2012 (early version)','Model-specific page and Works parts':'2004–2016'},kept:'2004–2016 production interval; Frankfurt reveal2003 is not SOP'},{where:'Rapide aggregate scope',values:{'Heritage index':'2010–2013, Rapide S2013–2018','Works parts':'2009–2019'},kept:null});
 s.report.openQuestions.push('Works parts model ranges are corroborative chronology, not exact individual factory SOP dates.','Current Vantage and DBS generation splitting needs reconciliation with 2024/2025 refresh names; no broad current-status assumptions applied.','Valiant, Valour, Victor, Vulcan and racing/raw variants need road-legality and missing-line review; no unsupported removals made.');
 s.finish('Partial Aston Martin breadth pass proposes founding1913 and corrects DB9 production2004–2016, DB6 end1970 and DB11 end2023. Earlier aggregate V8/V12 Vantage is ended but exact endpoint remains unknown; V8-only2017 must not truncate V12 production through2018. Full raw identity normalization remains open.');
}
