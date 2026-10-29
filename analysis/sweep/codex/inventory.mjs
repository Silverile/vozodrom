import fs from 'node:fs';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const base = 'src/data/catalog/';
const makes = read(base+'makes.json').filter(m => m.sections.includes('auto') && /^[a-l]/.test(m.slug));
const models = read(base+'models-auto.json');
const lines = read(base+'model-lines-auto.json');
const additions = read(base+'model-line-additions.json');
const bodies = new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
const fuels = new Set(['petrol','diesel','petrol-cng','petrol-lpg','petrol-mhev','petrol-hev','petrol-phev','electric']);
const results = makes.map(m => {
  const p=base+'model-cards/'+m.slug+'.json';
  const cards=fs.existsSync(p)?read(p):[];
  const issues=[];
  const inspect=(cs,file)=>{
    const seen=new Set();
    for(const c of cs){
      if(seen.has(c.lineSlug))issues.push({file,lineSlug:c.lineSlug,issue:'duplicate card lineSlug'});
      seen.add(c.lineSlug);
      for(const [i,g] of c.generations.entries()){
        const add=(path,issue,value)=>issues.push({file,lineSlug:c.lineSlug,path:`generations[${i}].${path}`,issue,value});
        if(g.from!==null && g.to!==null && g.from>g.to)add('from','start after end',[g.from,g.to]);
        if(g.productionStatus==='current'&&g.to!==null)add('productionStatus','current with end year',g.to);
        for(const b of g.bodyTypes??[])if(!bodies.has(b))add('bodyTypes','body outside types.ts enum',b);
        for(const e of g.engines??[])if(e.fuel!==null&&!fuels.has(e.fuel))add('engines','fuel outside types.ts enum',e.fuel);
        for(const [j,t] of (g.trims??[]).entries())if(t.engine?.fuel!=null&&!fuels.has(t.engine.fuel))add(`trims[${j}].engine.fuel`,'fuel outside types.ts enum',t.engine.fuel);
      }
    }
  };
  inspect(cards,p);
  const override='src/data/model-cards/'+m.slug+'.json';
  const overrideCards=['ford','hyundai'].includes(m.slug)&&fs.existsSync(override)?read(override):[];
  inspect(overrideCards,override);
  return {make:m.slug,rawModels:models.filter(x=>x.makeSlug===m.slug).length,modelLines:lines.filter(x=>x.makeSlug===m.slug).length,additions:additions.filter(x=>x.makeSlug===m.slug).length,catalogCards:cards.length,overrideCards:overrideCards.length,structuralIssues:issues,externalReview:fs.existsSync(`analysis/sweep/codex/${m.slug}.json`)?'see per-make report; may be partial':'not started'};
});
const report={checkedAt:'2026-10-29',scope:'Local structural inventory only; no external factual verification implied.',enumCaveat:'Enum findings compare catalog/types.ts. Runtime lib/modelCards.ts separately supports diesel-mhev, hydrogen and liftback; these findings indicate schema drift, not necessarily broken site rendering. TypeScript uses a cast for the generated JSON index, so a passing typecheck does not validate JSON enum membership.',makeCount:results.length,rawModelCount:results.reduce((n,x)=>n+x.rawModels,0),catalogCardCount:results.reduce((n,x)=>n+x.catalogCards,0),results};
fs.writeFileSync('analysis/sweep/codex/INVENTORY.json',JSON.stringify(report,null,2)+'\n');
const partialPassMakes=results.filter(x=>x.externalReview.startsWith('see ')).map(x=>x.make);
const untouchedMakes=results.filter(x=>x.externalReview==='not started').map(x=>x.make);
const priorityOrder=['ford','honda','alfa-romeo','chevrolet','jeep','land-rover','lexus','jaguar',...untouchedMakes];
fs.writeFileSync('analysis/sweep/codex/BACKLOG.json',JSON.stringify({checkedAt:'2026-10-29',scope:'All 125 a-l auto makes remain subject to full per-model external verification; these are partial passes only.',partialPassMakes,untouchedMakes,nextPriorities:[...new Set(priorityOrder.filter(m=>untouchedMakes.includes(m)))].slice(0,12),integrationRequired:'Apply reviewed shared-file proposals, conditional generation restructures and Ford/Hyundai winning-copy corrections, then rebuild shared model-cards-index.json; root did not have ownership of shared files/index.'},null,2)+'\n');
console.log(JSON.stringify({makes:report.makeCount,models:report.rawModelCount,cards:report.catalogCardCount,structuralIssues:results.reduce((n,x)=>n+x.structuralIssues.length,0)}));
