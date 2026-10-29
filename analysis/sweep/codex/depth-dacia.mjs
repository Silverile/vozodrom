import fs from 'node:fs';
import assert from 'node:assert/strict';
const base='analysis/sweep/codex/',p='src/data/catalog/model-cards/dacia.json';
const cards=JSON.parse(fs.readFileSync(p,'utf8')),r=JSON.parse(fs.readFileSync(base+'dacia.json','utf8'));
assert(!fs.existsSync(base+'DACIA-DEPTH-BASELINE.json'));
fs.writeFileSync(base+'DACIA-DEPTH-BASELINE.json',JSON.stringify({cards,report:r},null,2)+'\n');
const c=cards.find(c=>c.lineSlug==='duster');
const adac='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/dacia/duster/?redirectId=quer.autokatalog';
const first='https://presse.dacia.de/dacia-prasentiert-aktualisierten-duster-auf-der-iaa/?lang=deu';
const second='https://presse.dacia.de/dacia-duster-mit-neuem-look-und-neuem-multimedia-angebot/?lang=deu';
let count=0;
function change(path,to,sources,reason){
 const keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');let a=c;
 for(const k of keys.slice(0,-1))a=a[k];const key=keys.at(-1),from=a[key]??null;
 if(JSON.stringify(from)===JSON.stringify(to))return;
 r.cardFixesApplied.push({lineSlug:'duster',path,from:structuredClone(from),to:structuredClone(to),sources,reason,pass:'DEPTH-2026-10-29'});a[key]=structuredClone(to);count++;
}
for(const [i,year,source,note] of [[0,2013,first,'Modernizace přední části, světel, masky a střešních ližin představená na IAA 2013.'],[1,2021,second,'Nová světelná grafika a maska, modernizovaný interiér a infotainment; evropské uvedení od září 2021.']]){
 const sources=[source,adac];
 change(`generations[${i}].facelift`,[{year,productionYear:null,note,sources}],sources,'OEM dated release and ADAC generation catalogue independently agree; productionYear left null because release/sales timing is not SOP.');
 change(`generations[${i}].fieldSources`,{...c.generations[i].fieldSources,facelift:sources},sources,'Field provenance for added partial facelift chronology.');
 change(`generations[${i}].sources`,[...new Set([...c.generations[i].sources,...sources])],sources,'Append checked sources.');
}
change('sources',[...new Set([...c.sources,adac,first,second])],[adac,first,second],'Append checked facelift sources.');
const reviews=c.needsReview.filter(x=>!['generations[0].facelift','generations[1].facelift'].includes(x.field));
reviews.push({field:'generations[1].facelift',reason:'Doložena modernizace 2021; změna firemní identity 2022 a další úpravy vyžadují doplnění. Přehled modernizací zůstává částečný.'});
change('needsReview',reviews,[adac,first,second],'Resolve null review tasks while retaining partial-facelift expansion task.');
r.conflicts.push({where:'duster generations[2].from',values:{'existing source-production card':2023,'ADAC market generation':2024,'Dacia Romanian history':'2023 unveiling to international press','Renault Mioveni timeline':'2023 launch wording'},kept:2023,sources:[adac,'https://www.dacia.ro/despre-dacia/istoric.html','https://www.renaultgroup.com/en/group/locations/mioveni-plant/','https://cdn.group.renault.com/dac/ro/noutati/2023/Dosar-de-presa_Dacia-Duster-29.11.2023.pdf.asset.pdf/e78743877c.pdf'],reason:'Series production, pre-series production, unveiling and sales are not the same event; exact SOP not independently reconciled. Date left unchanged rather than treating ADAC sales date as worldwide factory date.',pass:'DEPTH-2026-10-29'});
r.depthPasses??=[];r.depthPasses.push({checkedAt:'2026-10-29',status:'partial',lines:['duster'],generationRowsInScope:3,loggedChanges:count,substantiveChanges:2,remaining:'Full dates/codes/status, complete facelifts including2022 identity update, engines/trims and photos; all other Dacia lines.'});
r.openQuestions.push('DEPTH: Global Dacia media page returned429; respected rate limit, no bypass. German OEM releases and ADAC used for2013/2021 facelift cross-check.','DEPTH: Duster II first production2017 versus German sales2018 remains a scope distinction; no change. Third-generation2023/2024 SOP requires more evidence.');
fs.writeFileSync(p,JSON.stringify(cards,null,2)+'\n');fs.writeFileSync(base+'dacia.json',JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({make:'dacia',loggedChanges:count,substantiveChanges:2}));
