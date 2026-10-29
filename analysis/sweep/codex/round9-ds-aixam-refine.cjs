const fs=require('fs');
const path='src/data/catalog/model-cards/ds-automobiles.json',rp='analysis/sweep/codex/ds-automobiles.json';
const cards=JSON.parse(fs.readFileSync(path,'utf8')),r=JSON.parse(fs.readFileSync(rp,'utf8'));
for(const [slug,i]of [['ds-4',1],['ds-7',0]]){
 const c=cards.find(x=>x.lineSlug===slug),g=c.generations[i];
 const before=structuredClone(g.facelift);
 g.facelift[0].productionYear=null;
 if(slug==='ds-4')g.facelift[0].note+=' Rok přechodu sériové výroby není samostatně ověřen.';
 else g.facelift[0].note+=' Přesný přechod sériové výroby není potvrzen.';
 r.cardFixesApplied.push({lineSlug:slug,path:`generations[${i}].facelift`,from:before,to:structuredClone(g.facelift),sources:g.facelift[0].sources,confidence:'high',round:9,note:'Conservative distinction: reveal and customer-delivery year do not prove factory switchover. Appended adjustment preserves initial audit sequence.'});
}
r.depthReviews.at(-1).changes=r.cardFixesApplied.filter(x=>x.round===9).length;
r.depthReviews.at(-1).limitations.push('DS3 facelift and name change has two OEM URLs, not two independent provenances. DS4/DS7 facelift productionYear kept null because reveal/delivery chronology does not establish factory switchover.');
fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');fs.writeFileSync(rp,JSON.stringify(r,null,2)+'\n');
console.log('Appended 2 conservative facelift-productionYear adjustments; DS audit total26.');
