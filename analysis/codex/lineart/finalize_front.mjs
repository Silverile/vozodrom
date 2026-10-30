// Audit an interrupted pilot with the current matcher and normalize local JPEGs.
// Run only after the collector exits; this rewrites the index atomically.
import fs from 'node:fs';
import path from 'node:path';
import {scoreCategory, frontRank, generations, counts, saveThumbnail} from './find_front.mjs';

const out=path.resolve(process.argv[2] || 'analysis/codex/lineart/front-output');
const index=path.join(out,'candidates.json');
const rows=JSON.parse(fs.readFileSync(index));
const current=new Map(generations().map(g=>[g.id,g]));
const audit=[];
for(const row of rows){
  const g=current.get(row.id);
  if(!g)throw Error('Generation no longer exists: '+row.id);
  row.reviewRequired=true;
  row.rejectedFiles ||= [];
  if(row.rejectedCategory){row.status='retry';audit.push({id:row.id,reason:'Category rejected by current identity rules',category:row.rejectedCategory.title});}
  const score=row.category && scoreCategory(row.category.title,g);
  if(row.category && !score){
    row.rejectedCategory=row.category;
    row.category=null;
    row.status='retry';
    row.rejectedFiles.push(...row.files.map(f=>({...f,rejection:'Current category matcher rejects identity'})));
    row.files=[];
    audit.push({id:row.id,reason:'Category rejected by current identity rules',category:row.rejectedCategory.title});
  }else if(score){
    row.category=score;
  }
  const keep=[];
  for(const f of row.files){
    const rank=frontRank(f.title,f.description,f.category);
    if(rank<0){row.rejectedFiles.push({...f,rejection:'Excluded view text'});audit.push({id:row.id,title:f.title,reason:'Excluded view text'});}
    else {f.rank=rank;f.frontTitled=frontRank(f.title)>=100;keep.push(f);}
  }
  row.files=keep;
  // Preserve every attribution, including rejected candidates, for auditability.
  for(const f of [...row.files,...row.rejectedFiles]){
    if(f.localWidth && f.localWidth<=1600 && f.localFormat==='jpeg')continue;
    const original=path.resolve(out,f.local);
    const rel=path.relative(out,original);
    if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('Local path outside output');
    const target=original.replace(/\.(png|jpe?g)$/i,'.jpg');
    if(!/\.jpg$/i.test(target))throw Error('Unexpected image extension');
    const tmp=target+'.normalizing.jpg';
    Object.assign(f,await saveThumbnail(fs.readFileSync(original),tmp));
    fs.renameSync(tmp,target);
    if(original!==target)fs.unlinkSync(original);
    f.local=path.relative(out,target).replaceAll(path.sep,'/');
  }
  row.matcherAuditAt=new Date().toISOString();
}
fs.writeFileSync(index+'.tmp',JSON.stringify(rows,null,2)+'\n');fs.renameSync(index+'.tmp',index);
const concerns={
  'byd--tang--0':'Da Tang may be a different model; the old run chose it over the exact BYD Tang category. No images retained for this match. Re-query with the final scorer.',
  'caterham--seven--4':'Suzuki-engined family contains 160, 170 and Super Seven 600 files; confirm Seven 170 rather than accepting the whole family.',
  'chevrolet--cruze--2':'China-specific J300 category: verify regional body and exact generation against this catalog record.',
  'chrysler--voyager--1':'Grand Voyager RT category: confirm Grand/standard model and generation scope.',
  'ferrari--400-412--1':'1978 400 GT serial-number category selected for 1979–1985 400 GT i; the inherited one-year tolerance may hide a variant mismatch. No images retained.',
  'ferrari--400-412--0':'Individual 1978 400 GT, not a generation-level collection; distinguish GT and Automatic. No images retained.',
  'ferrari--456--0':'1995 456 GT individual car cannot cover 456M styling; match the intended stage.',
  'ferrari--288-gto--0':'Individual 1983 example selected; this catalog record has unknown dates. Confirm prototype/production identity.',
  'adler--2-liter--0':'Broad 2 liter category needs EV/version and production-year confirmation.',
  'brilliance--bs6--0':'Broad BS6 family spans multiple model names and styling stages during 2002–2016.'
};
const unsure=Object.entries(concerns).map(([id,reason])=>{const r=rows.find(r=>r.id===id);return r&&{id,gen:r.gen,years:[r.from,r.to],category:r.category,reason};}).filter(Boolean);
const report={counts:counts(rows),rejectedFileCount:rows.reduce((s,r)=>s+r.rejectedFiles.length,0),audit,unsure,reviewRequired:'All remaining files require head-on symmetry, generation, and variant review. Text ranking is not visual certification.',stop:'Commons cirrussearch-too-busy-error while starting ferrari--enzo--0; no retry after this stop.'};
fs.writeFileSync(path.join(out,'checkpoint.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
