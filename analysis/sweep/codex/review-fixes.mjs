import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reportFile='analysis/sweep/codex/aston-martin.json';
const file='src/data/catalog/model-cards/aston-martin.json';
const r=read(reportFile),cards=read(file),c=cards.find(c=>c.lineSlug==='vantage');
const bad=r.cardFixesApplied.find(x=>x.lineSlug==='vantage'&&x.path==='generations[1].to');
if(bad){
 c.generations[1].to=bad.from;
 r.cardFixesApplied=r.cardFixesApplied.filter(x=>x!==bad);
 const review=r.cardFixesApplied.find(x=>x.lineSlug==='vantage'&&x.path==='needsReview');
 const oldFlag=review?.from.find(x=>x.field==='generations[1].to');
 if(oldFlag&&!c.needsReview.some(x=>x.field===oldFlag.field))c.needsReview.push(oldFlag);
 if(review)review.to=c.needsReview;
 r.modelFixes=r.modelFixes.filter(x=>!(x.slug==='vantage'&&x.field==='generations[1].to'&&x.to===2017));
 r.conflicts.push({where:'Aggregate VH V8/V12 Vantage endpoint',values:{'Works V8 range':'2005–2017','Works V12 range':'2009–2018'},kept:null,reason:'Independent review rejected truncating the combined family at the V8-only endpoint.'});
 r.openQuestions.push('Vantage VH card includes both V8 and V12; exact aggregate final production date still needs manufacture evidence. Independent review restored endpointnull and removed2017 shared proposals.');
 r.summary='Partial Aston Martin breadth pass proposes founding1913 and corrects DB9 production2004–2016, DB6 end1970 and DB11 end2023. Combined VH V8/V12 Vantage is ended but exact endpoint remains null after independent scope review.';
 fs.writeFileSync(file,JSON.stringify(cards,null,2)+'\n');
 fs.writeFileSync(reportFile,JSON.stringify(r,null,2)+'\n');
 console.log('Restored aggregate VH Vantage endpointnull and removed V8-only2017 proposals.');
}
{
 const file='src/data/catalog/model-cards/alpine.json',reportFile='analysis/sweep/codex/alpine.json';
 const cards=read(file),r=read(reportFile);
 const bad=r.cardFixesApplied.find(x=>x.lineSlug==='a106'&&x.path==='generations[0].to');
 if(bad){
  const c=cards.find(c=>c.lineSlug==='a106');c.generations[0].to=bad.from;
  r.cardFixesApplied=r.cardFixesApplied.filter(x=>x!==bad);
  const review=r.cardFixesApplied.find(x=>x.lineSlug==='a106'&&x.path==='needsReview');
  const oldFlag=review?.from.find(x=>x.field==='generations[0].to');
  if(oldFlag&&!c.needsReview.some(x=>x.field===oldFlag.field))c.needsReview.push(oldFlag);
  if(review)review.to=c.needsReview;
  r.modelFixes=r.modelFixes.filter(x=>!(x.slug==='a106'&&['to','generations[0].to'].includes(x.field)&&x.to===1960));
  r.conflicts.push({where:'A106 OEM production endpoint',values:{'2025 Lyon OEM release':1959,'2016 OEM production table':1960},kept:null,sources:['https://media.alpinecars.com/alpine-at-the-lyon-motor-show-from-24-to-28-september/?lang=eng','https://mb.cision.com/Public/5113/9915702/9434b7137259e429.pdf'],reason:'Independent review found a later contradictory OEM production range; restore unknown endpoint.'});
 }
 const update=(slug,i,text,sources)=>{
  const c=cards.find(c=>c.lineSlug===slug),path=`generations[${i}].specificationScope.noteCs`;
  if(c.generations[i].specificationScope.noteCs===text)return;
  r.cardFixesApplied.push({lineSlug:slug,path,from:c.generations[i].specificationScope.noteCs,to:text,sources,reason:'Refresh stale chronology note after independent review.'});
  c.generations[i].specificationScope.noteCs=text;
 };
 update('a310',1,'Výrobní tabulka Alpine z roku 2016 uvádí francouzskou výrobu A310 V6 v letech 1976–1984. Dřívější poznámka tvrdila přesah do roku 1985; ten nebyl v ověřené tabulce nalezen a zůstává otázkou pro další revizi.',['https://mb.cision.com/Public/5113/9915702/9434b7137259e429.pdf']);
 update('a110',1,'Výrobce potvrdil dokončení posledního vozu druhé generace zprávou z 1. července 2026. Výroba této generace je ukončena; budoucí třetí elektrická generace do této etapy nepatří. Omezené série R/S/GTS nejsou všechny rozpracovány.',['https://media.alpinecars.com/over-35000-alpine-a110-produced-at-the-alpine-dieppe-manufacture-which-is-gearing-up-to-welcome-the-3rd-generation/?lang=eng']);
 r.summary='Partial Alpine breadth pass proposes founding1955, verifies historical A106 ended with unresolved1959/1960 OEM endpoint conflict, A310V6 end1984 from production table, A110II end2026 and A290/A390 factory production. Independent review restored A106 endnull and refreshed chronology notes.';
 fs.writeFileSync(file,JSON.stringify(cards,null,2)+'\n');fs.writeFileSync(reportFile,JSON.stringify(r,null,2)+'\n');
 console.log('Alpine: preserved A106 endpoint conflict as null; refreshed A310/A110 notes.');
}
