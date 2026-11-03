// Follow-up review of 48e36c3. Additional regressions are intentionally red.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { applyOps, identityOf, generationSummary } from '../src/lib/catalog-ops.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gen = (code = 'I', from = 1990) => ({ code, name: code, from, to: from + 5, current: false,
  engines: [{variant:'A',powerKwMin:50}, {variant:'B',powerKwMin:70}], bodyTypes: [], facelifts: [],
  drivetrains: [], transmissions: [], markets: [], trims: [], dimensionsMm: null, trunkL: null, photo: null });
const base = () => ({name:'Model', summary:'base', segment:null, generations:[gen()]});
const row = (op, i = 0) => ({id:`followup-${i}`,makeSlug:'make',lineSlug:'line',createdAt:'',op});
const replay = (b,...ops) => applyOps(b,ops.map(row));
const dataModule = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
let counter = 0;
async function isolated(file, replacements, suffix = '', transform = source => source) {
  let source = stripTypeScriptTypes(await readFile(path.join(root,file),'utf8'));
  source = transform(source);
  source = source.replace(/import\s+['"]server-only['"];?/g,'');
  source = source.replace(/from\s*(['"])([^'"]+)\1/g,(match,_q,spec)=>{
    assert.ok(spec in replacements,`Unmocked ${spec}`);
    return `from ${JSON.stringify(replacements[spec])}`;
  });
  return import(dataModule(source + '\n' + suffix + `\n// follow-up ${++counter}`));
}

test('follow-up: reset whole array must invalidate its previous item origins', () => {
  const r = replay(base(),
    {op:'remove',path:['generations',0,'engines',0]},
    {op:'reset',path:['generations',0,'engines']},
    {op:'set',path:['generations',0,'engines',0,'powerKwMin'],value:51,expect:50},
    {op:'reset',path:['generations',0,'engines',0,'powerKwMin']});
  assert.deepEqual(r.conflicts,[]);
  assert.equal(r.card.generations[0].engines[0].powerKwMin,50,'A must not get B\'s 70 kW after an array reset');
});

test('follow-up: whole generation reset must invalidate descendant item origins', () => {
  const r = replay(base(),
    {op:'remove',path:['generations',0,'engines',0]},
    {op:'reset',path:['generations',0]},
    {op:'set',path:['generations',0,'engines',1,'powerKwMin'],value:71,expect:70},
    {op:'reset',path:['generations',0,'engines',1,'powerKwMin']});
  assert.deepEqual(r.conflicts,[],'restored B should have its original slot again');
  assert.equal(r.card.generations[0].engines[1].powerKwMin,70);
});

test('follow-up: generation anchors survive an ordinary upstream reorder', () => {
  const b = base(); b.generations.push(gen('II',2000));
  const identity = identityOf(b.generations[0]); b.generations.reverse();
  const r = replay(b,{op:'set',path:['generations',0,'trunkL'],gen:identity,expect:null,value:500});
  assert.equal(r.card.generations.find(g=>g.code==='I').trunkL,500);
  assert.equal(r.card.generations.find(g=>g.code==='II').trunkL,null);
  assert.deepEqual(r.origins,[0,1]); assert.deepEqual(r.conflicts,[]);
});

test('follow-up: deleting one blank generation insertion must not reattach its drawing to another', () => {
  const blankA = {...gen(),code:null,name:'',from:null,trunkL:111};
  const blankB = {...gen(),code:null,name:'',from:null,trunkL:222};
  const b = base(), anchor = identityOf(b.generations[0]);
  // the editor gives every inserted generation a token and refers to it by it
  const insertA = row({op:'insert',path:['generations',0],value:blankA,gen:anchor,token:'tokenaaa'},0);
  const insertB = row({op:'insert',path:['generations',1],value:blankB,gen:anchor,token:'tokenbbb'},1);
  const drawingA = row({op:'drawing',index:0,src:'/foto/katalog/a.webp',expect:{...identityOf(blankA),token:'tokenaaa'}},2);
  const before = applyOps(b,[insertA,insertB,drawingA]);
  assert.equal(before.card.generations[0].trunkL,111);
  assert.equal(before.drawings[0],'/foto/katalog/a.webp');
  // The history UI deletes insertion A; B's insertion relocates correctly before I.
  const after = applyOps(b,[insertB,drawingA]);
  assert.equal(after.card.generations[0].trunkL,222);
  assert.equal(after.drawings[0],undefined,'a different inserted generation must not inherit A\'s drawing');
  assert.equal(after.conflicts.length,1);
});

test('follow-up: required generation arrays cannot be removed through the accepted API operation model', () => {
  const b = base();
  const r = replay(b,{op:'remove',path:['generations',0,'engines'],gen:identityOf(b.generations[0])});
  assert.ok(Array.isArray(r.card.generations[0].engines));
  assert.equal(r.conflicts.length,1);
});

// Obtain only the route's header parser; no auth, network or R2 activity.
async function webpParser() {
  const source = await readFile(path.join(root,'src/app/api/admin/katalog/nakres/route.ts'),'utf8');
  const start = source.indexOf('function webpSize('), end = source.indexOf('\nexport async function POST',start);
  return import(dataModule(stripTypeScriptTypes(source.slice(start,end))+'\nexport {webpSize};'));
}
test('follow-up: VP8X canvas metadata without an image chunk is not a complete WebP',async()=>{
  const {webpSize} = await webpParser();
  const bytes = new Uint8Array(30), view = new DataView(bytes.buffer);
  bytes.set(new TextEncoder().encode('RIFF'),0); view.setUint32(4,22,true);
  bytes.set(new TextEncoder().encode('WEBPVP8X'),8); view.setUint32(16,10,true);
  bytes[24]=959&255;bytes[25]=959>>8;bytes[27]=599&255;bytes[28]=599>>8;
  assert.equal(webpSize(bytes),null,'canvas dimensions alone are not image data');
});

test('follow-up: genuine lossy, lossless and alpha WebPs retain their canvas dimensions',async()=>{
  const sharp=(await import('sharp')).default, {webpSize}=await webpParser();
  const kinds=[];
  for(const [channels,alpha,lossless] of [[3,1,false],[4,.5,true],[4,.5,false]]) {
    const bytes=await sharp({create:{width:960,height:600,channels,background:{r:255,g:255,b:255,alpha}}})
      .webp({lossless}).toBuffer();
    kinds.push(bytes.toString('ascii',12,16));
    assert.deepEqual(webpSize(bytes),{width:960,height:600});
  }
  assert.deepEqual(new Set(kinds),new Set(['VP8 ','VP8L','VP8X']));
});

async function fixture(edits, review, inspect) {
  const dir = await mkdtemp(path.join(os.tmpdir(),'vozodrom-fixes-review-'));
  try {
    await mkdir(path.join(dir,'src/lib'),{recursive:true});await mkdir(path.join(dir,'src/data'),{recursive:true});
    await mkdir(path.join(dir,'scripts'),{recursive:true});
    for(const file of ['src/lib/catalog-ops.ts','scripts/app-model-cards.mjs'])
      await writeFile(path.join(dir,file),await readFile(path.join(root,file)));
    const rows = edits.map((op,i)=>({...row(op,i),genIndex:null,field:'op',value:JSON.stringify(op)}));
    for(const [name,value] of Object.entries({'model-cards-index.json':{make:{line:base()}},'catalog-edits.json':{edits:rows},
      'front-drawings.json':{'make--line':[[0,1990,1995]]},'front-drawing-review.json':review}))
      await writeFile(path.join(dir,'src/data',name),JSON.stringify(value));
    const child = spawnSync(process.execPath,[path.join(dir,'scripts/app-model-cards.mjs')],{cwd:dir,encoding:'utf8'});
    assert.equal(child.status,0,child.stderr);
    const built = JSON.parse(await readFile(path.join(dir,'src/data/catalog-built.json'),'utf8'));
    await inspect(built);
  } finally {
    const target=path.resolve(dir), temp=path.resolve(os.tmpdir())+path.sep;
    assert.ok(target.startsWith(temp)&&path.basename(target).startsWith('vozodrom-fixes-review-'));
    await rm(target,{recursive:true,force:true});
  }
}

test('follow-up: a text-only edit does not publish held source drawings',async()=>{
  for(const key of ['make--line','make--line--0']) await fixture([{op:'set',path:['summary'],expect:'base',value:'edited'}],{[key]:'held'},built=>{
    assert.deepEqual(built.lines['make--line'].drawings,[]);
    assert.deepEqual(built.lines['make--line'].origins,[0]);
  });
});

test('follow-up: text-only edits preserve the pending indicator of held drawings',async()=>{
  const review={'make--line--0':'held'};
  await fixture([{op:'set',path:['summary'],expect:'base',value:'edited'}],review,async built=>{
    let source=await readFile(path.join(root,'src/components/FrontDrawing.tsx'),'utf8');
    // Helpers precede the JSX rendering function and can be type-stripped on their own.
    source=source.slice(0,source.indexOf('export function FrontDrawing('));
    const imports={
      '@/data/front-drawings.json':dataModule('export default {"make--line":[[0,1990,1995]]};'),
      '@/data/front-drawing-review.json':dataModule(`export default ${JSON.stringify(review)};`),
      '@/lib/catalog-built':dataModule(`const B=${JSON.stringify(built)};export const builtLine=(m,l)=>B.lines[m+'--'+l];`),
      '@/lib/format':dataModule('export const asset=x=>x;'),
    };
    source=stripTypeScriptTypes(source).replace(/from\s*(['"])([^'"]+)\1/g,(_m,_q,s)=>`from ${JSON.stringify(imports[s])}`);
    const mod=await import(dataModule(source));
    assert.equal(mod.frontDrawingId('make','line',0),null);
    assert.equal(mod.drawingPending('make','line',0),true);
  });
});

test('follow-up: closing the last current generation updates the overlaid model line',async()=>{
  const line={slug:'line',name:'Model',from:1990,to:null,current:true,bodyTypes:[],generations:[{code:'I',from:1990,to:null}]};
  const current=base();current.generations[0].current=true;current.generations[0].to=null;
  const closed=replay(current,{op:'set',path:['generations',0,'current'],value:false,expect:true},
    {op:'set',path:['generations',0,'to'],value:2015,expect:null});
  const built={lines:{'make--line':{origins:closed.origins,drawings:[],generations:generationSummary(closed.card)}},conflicts:{}};
  const mod=await isolated('src/lib/makes.ts',{
    '@/data/makes-index.json':dataModule('export default [];'),
    '@/data/model-lines-index.json':dataModule(`export default {make:[${JSON.stringify(line)}]};`),
    './catalog-built':dataModule(`const B=${JSON.stringify(built)};export const builtLine=(m,l)=>B.lines[m+'--'+l];`),
  });
  const edited=mod.modelLinesOf('make')[0];
  assert.equal(edited.to,2015);
  assert.equal(edited.current,false);
});

// Unlike the earlier transaction mock, this does NOT serialize transaction(fn) by itself. Only a
// transaction that asks for SERIALIZABLE isolation is protected, as Postgres would abort one of two
// conflicting serializable transactions; the model runs them one after another instead.
async function lockAwareStore(removeLock = false) {
  const key=`__followupLock${++counter}`;
  const state={rows:[],tails:new Map(),calls:[],random:0};globalThis[key]=state;
  const ordered=()=>[...state.rows].sort((a,b)=>a.createdAt-b.createdAt||a.id.localeCompare(b.id));
  const select=(inTransaction,locked)=>{
    const q={from(){return q;},where(){return q;},async orderBy(){
      if(inTransaction&&!locked()) throw new Error('history read without lock');
      state.calls.push('read');return ordered();
    }};return q;
  };
  state.db={
    select:()=>select(false,()=>false),
    async transaction(fn,config){
      let locked=false;const releases=[];
      if(config?.isolationLevel==='serializable'){
        const previous=state.tails.get('tx')||Promise.resolve();
        let release;const next=new Promise(resolve=>{release=resolve;});
        state.tails.set('tx',previous.then(()=>next));
        await previous;locked=true;releases.push(release);state.calls.push('lock');
      }
      const tx={
        select:()=>select(true,()=>locked),
        insert(){return {async values(rows){assert.equal(locked,true);state.rows.push(...rows);}};},
      };
      try{return await fn(tx);}finally{for(const release of releases)release();}
    },
  };
  const ref=`globalThis[${JSON.stringify(key)}]`;
  const store=await isolated('src/lib/catalog-edit-store.ts',{
    '@opennextjs/cloudflare':dataModule('export const getCloudflareContext=()=>({env:{}});'),
    'better-auth/crypto':dataModule(`export const generateRandomString=()=>String(++${ref}.random).padStart(8,'0');`),
    'drizzle-orm':dataModule('export const and=(...v)=>v;export const eq=(...v)=>v;export const asc=v=>v;export const sql=(strings,...values)=>({strings,values});'),
    '@/db':dataModule(`export const getDb=()=>${ref}.db;`),
    '@/db/schema':dataModule('export const catalogEdit={};'),
    './auth':dataModule('export const hasRole=(s,roles)=>!!s&&roles.includes(s.user.role);'),
    './card-store':dataModule(`export const loadCard=async()=>(${JSON.stringify(base())});`),
    './catalog-ops':pathToFileURL(path.join(root,'src/lib/catalog-ops.ts')).href,
    './listing-store':dataModule('export class ListingError extends Error {constructor(status,message){super(message);this.status=status;}}'),
    './makes':dataModule('export const modelLinesOf=()=>[{slug:"line"}];'),
  },'',source=>removeLock?source.replace(/\{ isolationLevel: "serializable" \}/,'{}'):source);
  return {state,store,dispose(){delete globalThis[key];}};
}
const admin={user:{id:'test-admin',role:'admin'}};
test('follow-up: actual lock execution serializes stale writers in a lock-aware adapter',async()=>{
  const h=await lockAwareStore();
  try {
    const results=await Promise.allSettled(['a','b'].map(value=>h.store.saveOps(admin,'make','line',[
      {op:'set',path:['summary'],expect:'base',value},
    ])));
    assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
    assert.equal(results.find(r=>r.status==='rejected').reason.status,409);
    assert.equal(h.state.rows.length,1);
    assert.equal(h.state.calls[0],'lock');
  }finally{h.dispose();}
});
test('follow-up: lock-aware test rejects an in-memory mutant without serializable isolation',async()=>{
  const h=await lockAwareStore(true);
  try {
    await assert.rejects(h.store.saveOps(admin,'make','line',[{op:'set',path:['summary'],expect:'base',value:'changed'}]),/history read without lock/);
    assert.equal(h.state.rows.length,0);
  }finally{h.dispose();}
});
test('follow-up: constant/backward clocks and legacy random IDs do not interleave new batches',async()=>{
  const h=await lockAwareStore(), clock=Date.now;
  try {
    h.state.rows.push({id:'o-z-legacy',makeSlug:'make',lineSlug:'line',genIndex:null,field:'summary',value:'legacy',createdAt:new Date(1000)});
    Date.now=()=>900;
    await h.store.saveOps(admin,'make','line',Array.from({length:200},(_,i)=>({op:'set',path:['summary'],expect:i?`n${i-1}`:'legacy',value:`n${i}`})));
    const rows=await h.store.saveOps(admin,'make','line',[{op:'set',path:['summary'],expect:'n199',value:'final'}]);
    const {rowToOp}=await import('../src/lib/catalog-ops.ts');
    const r=applyOps(base(),rows.map(rowToOp));
    assert.deepEqual(r.conflicts,[]);assert.equal(r.card.summary,'final');
    assert.equal(rows[1].createdAt,'1970-01-01T00:00:01.001Z');
    assert.equal(rows.at(-1).createdAt,'1970-01-01T00:00:01.002Z');
  }finally{Date.now=clock;h.dispose();}
});
