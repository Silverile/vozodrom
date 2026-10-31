import {readFileSync,writeFileSync} from 'node:fs';
const read = p => JSON.parse(readFileSync(p,'utf8'));
const periods=read('src/data/catalog/brand-production-periods.json');
const makes=read('src/data/makes-index.json').filter(m=>m.defunct&&m.sections.includes('auto'));
const rows=makes.map(({slug})=>({slug,cars:periods[slug]?.carsFrom!=null&&periods[slug]?.carsTo!=null?'complete':periods[slug]?.carsFrom!=null||periods[slug]?.carsTo!=null?'partial':'unknown',
  motorcycles:periods[slug]?.motorcyclesFrom!=null&&periods[slug]?.motorcyclesTo!=null?'complete':periods[slug]?.motorcyclesFrom!=null||periods[slug]?.motorcyclesTo!=null?'partial':'not-verified',
  reviewed:!!periods[slug],...(periods[slug]??{})}));
const counts={total:rows.length,reviewed:rows.filter(r=>r.reviewed).length,complete:rows.filter(r=>r.cars==='complete').length,partial:rows.filter(r=>r.cars==='partial').length,unknown:rows.filter(r=>r.cars==='unknown').length};
writeFileSync('analysis/codex/brand-production-period-coverage.json',JSON.stringify({reviewedAt:'2026-10-31',scope:'Defunct auto makes; unknown includes researched but unresolved bounds. Source quality varies; notes identify production scope.',counts,makes:rows},null,2)+'\n');
console.log(counts);
