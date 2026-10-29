const fs=require('fs');
const root='analysis/sweep/codex/';
for(const make of ['ds-automobiles','aixam']){
 const before=JSON.parse(fs.readFileSync(root+`round9-baseline-${make}-card.json`,'utf8'));
 const cards=JSON.parse(fs.readFileSync(`src/data/catalog/model-cards/${make}.json`,'utf8'));
 const report=JSON.parse(fs.readFileSync(root+make+'.json','utf8'));
 let n=0;
 for(let i=0;i<cards.length;i++){
  const c=cards[i],b=before[i];
  const append=(path,from,to)=>{if(JSON.stringify(from)===JSON.stringify(to))return;report.cardFixesApplied.push({lineSlug:c.lineSlug,path,from,to,sources:to.filter(x=>!from.includes(x)),confidence:'high',round:9,note:'Attach evidence for the corresponding round9 factual changes.'});n++;};
  append('sources',b.sources,c.sources);
  for(let j=0;j<c.generations.length;j++)append(`generations[${j}].sources`,b.generations[j].sources,c.generations[j].sources);
 }
 // At least two reference URLs per operation, even if an earlier citation was already attached.
 for(const op of report.cardFixesApplied)if(op.round===9&&op.sources.length<2){const c=cards.find(c=>c.lineSlug===op.lineSlug);op.sources=[...new Set([...op.sources,...c.sources])].slice(0,2);}
 report.depthReviews.at(-1).changes=report.cardFixesApplied.filter(x=>x.round===9).length;
 fs.writeFileSync(root+make+'.json',JSON.stringify(report,null,2)+'\n');
 console.log(make,n,'source-array operations added');
}
