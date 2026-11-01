import fs from 'node:fs';
const root='analysis/codex/rare-engines-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),q=read(root+'/queue.json'),index=read('src/data/model-cards-index.json'),dated=[],undated=[];
const candidates=[...new Map([...q.zeroModernCandidates,...(q.zeroDateUnconfirmed??[])].map(r=>[r.make+'/'+r.line+'/'+r.index,r])).values()];
for(const r of candidates){const g=index[r.make][r.line].generations[r.index];
 const overlaps=(g.from!=null&&g.from>=1990&&g.from<=2026)||(g.to!=null&&g.to>=1990)||(g.current===true&&g.from!=null&&g.from<=2026);
 (overlaps?dated:undated).push({...r,dateEligibility:overlaps?'dated-production-overlaps-post-1990':'modern-production-not-established'});
}
q.zeroModernCandidates=dated;q.zeroDateUnconfirmed=undated;q.counts.zeroMatchedFleetPost1990Candidates=dated.length;q.counts.zeroMatchedFleetCandidateLines=new Set(dated.map(r=>r.make+'/'+r.line)).size;q.counts.zeroMatchedFleetDateUnconfirmed=undated.length;q.rules.zero='No published matched line fleet; explicit production dates overlap 1990–2026. European-market eligibility requires a generation-specific source. Undated cases are separate.';
fs.writeFileSync(root+'/queue.json',JSON.stringify(q,null,2)+'\n');console.log(q.counts);
