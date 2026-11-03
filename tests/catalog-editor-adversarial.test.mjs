// Server dependencies are isolated in memory: no database, R2, GitHub or live
// route is contacted. Build tests execute the unchanged script in a temp tree.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stripTypeScriptTypes } from 'node:module';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { applyOps, rowToOp } from '../src/lib/catalog-ops.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const opsUrl = pathToFileURL(path.join(root, 'src/lib/catalog-ops.ts')).href;
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
let moduleId = 0;
async function isolated(file, imports) {
  let source = stripTypeScriptTypes(await readFile(path.join(root, file), 'utf8'));
  source = source.replace(/import\s+['"]server-only['"];?/g, '');
  source = source.replace(/from\s*(['"])([^'"]+)\1/g, (whole, _quote, spec) => {
    if (!(spec in imports)) throw new Error(`Unmocked import ${spec} in ${file}`);
    return `from ${JSON.stringify(imports[spec])}`;
  });
  return import(moduleUrl(source + `\n// isolated ${++moduleId}`));
}
const generation = (code, from) => ({ code, name: code, from, to: from + 5, current: false,
  engines: [], bodyTypes: [], facelifts: [], drivetrains: [], transmissions: [], markets: [], trims: [],
  dimensionsMm: null, trunkL: null, photo: null });
const base = () => ({ name: 'Model', summary: 'original', segment: null, generations: [generation('I', 1990), generation('II', 2000)] });
const admin = { user: { id: 'test-admin', role: 'admin' } };

async function serverHarness() {
  const key = `__catalogReview${++moduleId}`;
  const state = { session: null, rows: [], puts: [], dbCalls: 0, random: 0, snapshot: undefined };
  globalThis[key] = state;
  // transactions run one at a time, as the store's per-line advisory lock makes them in Postgres
  state.queue = Promise.resolve();
  state.getDb = () => {
    state.dbCalls++;
    const db = {
      execute: async () => [],
      transaction(fn) {
        const run = state.queue.then(() => fn(db));
        state.queue = run.catch(() => {});
        return run;
      },
      select() {
        const query = { from() { return query; }, where() { return query; },
          async orderBy() {
            if (state.snapshot) return state.snapshot();
            return [...state.rows].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
          } };
        return query;
      },
      insert() { return { async values(rows) { state.rows.push(...(Array.isArray(rows) ? rows : [rows])); } }; },
      delete() { return { where() { return { async returning() { return [{ id: 'deleted' }]; } }; } }; },
    };
    return db;
  };
  const access = await readFile(path.join(root, 'src/lib/auth.ts'), 'utf8');
  const hasRole = access.slice(access.indexOf('export function hasRole('));
  const auth = moduleUrl(stripTypeScriptTypes(`export const getSession = async () => globalThis[${JSON.stringify(key)}].session;\n${hasRole}`));
  const error = moduleUrl(`export class ListingError extends Error { constructor(status, message) { super(message); this.status = status; } }
    export function errorResponse(e) { return Response.json({error:e.message}, {status:e.status || 500}); }`);
  const cloudflare = moduleUrl(`export function getCloudflareContext() { return {env:{PHOTOS:{ async put(...args) {
    globalThis[${JSON.stringify(key)}].puts.push(args);
  } }}}; }`);
  const crypto = moduleUrl(`export const generateRandomString = () => String(++globalThis[${JSON.stringify(key)}].random).padStart(12,'0');`);
  const makes = moduleUrl(`export const modelLinesOf = m => m === 'make' ? [{slug:'line'}] : [];`);
  const db = moduleUrl(`export const getDb = () => globalThis[${JSON.stringify(key)}].getDb();`);
  const schema = moduleUrl(`export const catalogEdit = {};`);
  const drizzle = moduleUrl(`export const and = (...x) => x; export const asc = x => x; export const eq = (...x) => x; export const sql = (...x) => x;`);
  const cards = moduleUrl(`export async function loadCard() { return ${JSON.stringify(base())}; }`);
  const store = await isolated('src/lib/catalog-edit-store.ts', {
    '@opennextjs/cloudflare': cloudflare, 'better-auth/crypto': crypto, 'drizzle-orm': drizzle,
    '@/db': db, '@/db/schema': schema, './auth': auth, './card-store': cards,
    './catalog-ops': opsUrl, './listing-store': error, './makes': makes,
  });
  const storeUrl = moduleUrl(`export const editorState = globalThis[${JSON.stringify(key)}].store.editorState;
    export const saveOps = globalThis[${JSON.stringify(key)}].store.saveOps;
    export const deleteOp = globalThis[${JSON.stringify(key)}].store.deleteOp;
    export const publishEdits = globalThis[${JSON.stringify(key)}].store.publishEdits;
    export const allEdits = globalThis[${JSON.stringify(key)}].store.allEdits;`);
  state.store = store;
  const route = await isolated('src/app/api/admin/katalog/route.ts', {
    '@/lib/auth': auth, '@/lib/catalog-edit-store': storeUrl, '@/lib/listing-store': error,
  });
  const upload = await isolated('src/app/api/admin/katalog/nakres/route.ts', {
    '@opennextjs/cloudflare': cloudflare, 'better-auth/crypto': crypto, '@/lib/auth': auth, '@/lib/makes': makes,
  });
  const publish = await isolated('src/app/api/admin/katalog/publikovat/route.ts', {
    '@/lib/auth': auth, '@/lib/catalog-edit-store': storeUrl, '@/lib/listing-store': error,
  });
  return { state, store, route, upload, publish, dispose() { delete globalThis[key]; } };
}

test('routes: anonymous/user/moderator cannot read, save, delete, upload or publish edits', async () => {
  const h = await serverHarness();
  try {
    for (const role of [null, 'user', 'dealer', 'moderator']) {
      h.state.session = role ? { user: { id: 'test-user', role } } : null;
      const read = await h.route.GET(new Request('http://local/api/admin/katalog/?znacka=make&model=line'));
      assert.equal(read.status, 403);
      const save = await h.route.POST(new Request('http://local/api/admin/katalog/', { method: 'POST', body: JSON.stringify({makeSlug:'make',lineSlug:'line',ops:[{op:'set',path:['summary'],value:'x'}]}) }));
      assert.equal(save.status, 403);
      const remove = await h.route.DELETE(new Request('http://local/api/admin/katalog/?id=test', {method:'DELETE'}));
      assert.equal(remove.status, 403);
      const upload = await h.upload.POST(new Request('http://local/api/admin/katalog/nakres/?znacka=make&model=line', {method:'POST',body:'not an image'}));
      assert.equal(upload.status, 403);
      assert.equal((await h.publish.POST()).status, role ? 403 : 401);
    }
    assert.equal(h.state.dbCalls, 0); assert.equal(h.state.puts.length, 0);
  } finally { h.dispose(); }
});

test('routes: an admin can read, while invalid slugs, missing ops and foreign drawing paths are refused', async () => {
  const h = await serverHarness(); h.state.session = admin;
  try {
    assert.equal((await h.route.GET(new Request('http://local/api/admin/katalog/?znacka=make&model=line'))).status, 200);
    assert.equal((await h.route.GET(new Request('http://local/api/admin/katalog/?znacka=../make&model=line'))).status, 404);
    for (const ops of [[], [{op:'set',path:['__proto__','polluted'],value:true}], [{op:'drawing',index:0,src:'https://invalid.example/x.webp'}]]) {
      assert.equal((await h.route.POST(new Request('http://local/api/admin/katalog/', { method: 'POST', body: JSON.stringify({makeSlug:'make',lineSlug:'line',ops}) }))).status, 400);
    }
    assert.equal(h.state.rows.length, 0);
  } finally { h.dispose(); }
});

test('uploads: empty/oversized/non-WebP files and traversal models are rejected before R2', async () => {
  const h = await serverHarness(); h.state.session = admin;
  try {
    for (const [body, status] of [[new Uint8Array(),413], [new Uint8Array(2*1024*1024+1),413], [new TextEncoder().encode('not webp'),415]]) {
      assert.equal((await h.upload.POST(new Request('http://local/upload?znacka=make&model=line',{method:'POST',body}))).status,status);
    }
    assert.equal((await h.upload.POST(new Request('http://local/upload?znacka=make&model=../line',{method:'POST',body:'x'}))).status,404);
    assert.equal(h.state.puts.length, 0);
  } finally { h.dispose(); }
});

test('REGRESSION: a twelve-byte RIFF/WEBP header is not a decodable 960x600 WebP', async () => {
  const h = await serverHarness(); h.state.session = admin;
  try {
    const bad = new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80]);
    const response = await h.upload.POST(new Request('http://local/upload?znacka=make&model=line',{method:'POST',body:bad}));
    assert.equal(response.status,415);
    assert.equal(h.state.puts.length,0);
  } finally { h.dispose(); }
});

test('REGRESSION: a later sequential save must sort after the preceding multi-op batch', async () => {
  const h = await serverHarness(), clock = Date.now; h.state.session = admin;
  try {
    Date.now = () => 1000;
    await h.store.saveOps(admin,'make','line',Array.from({length:200},(_,i)=>({
      op:'set',path:['summary'],expect:i?`batch-${i-1}`:'original',value:`batch-${i}`,
    })));
    Date.now = () => 1050;
    const rows = await h.store.saveOps(admin,'make','line',[{op:'set',path:['summary'],expect:'batch-199',value:'four'}]);
    const r = applyOps(base(),rows.map(rowToOp));
    assert.deepEqual(r.conflicts,[],'an accepted save must replay without a new conflict');
    assert.equal(r.card.summary,'four');
  } finally { Date.now = clock; h.dispose(); }
});

test('REGRESSION: two concurrent stale writers must not both report a successful save', async () => {
  const h = await serverHarness(); h.state.session = admin;
  try {
    // both editors saw the original summary; the lock makes the second one see the first one's row
    const results = await Promise.allSettled(['left','right'].map(value => h.store.saveOps(admin,'make','line',[
      {op:'set',path:['summary'],expect:'original',value},
    ])));
    assert.equal(results.filter(r => r.status === 'fulfilled').length,1,
      'stale writer should receive 409 instead of persisting a conflicting operation');
    assert.equal(results.find(r => r.status === 'rejected').reason.status, 409);
    assert.equal(h.state.rows.length, 1);
  } finally { h.dispose(); }
});

async function buildFixture(edits, inspect) {
  const dir = await mkdtemp(path.join(os.tmpdir(),'vozodrom-catalog-review-'));
  try {
    await mkdir(path.join(dir,'src/lib'),{recursive:true});
    await mkdir(path.join(dir,'src/data'),{recursive:true});
    await mkdir(path.join(dir,'scripts'),{recursive:true});
    await writeFile(path.join(dir,'src/lib/catalog-ops.ts'),await readFile(path.join(root,'src/lib/catalog-ops.ts')));
    await writeFile(path.join(dir,'scripts/app-model-cards.mjs'),await readFile(path.join(root,'scripts/app-model-cards.mjs')));
    for (const [file,data] of Object.entries({
      'model-cards-index.json': {make:{line:base()}}, 'catalog-edits.json':{edits},
      'front-drawings.json':{'make--line':[[0,1990,1995],[1,2000,2005]]}, 'front-drawing-review.json':{},
    })) await writeFile(path.join(dir,'src/data',file),JSON.stringify(data));
    const child = spawnSync(process.execPath,[path.join(dir,'scripts/app-model-cards.mjs')],{encoding:'utf8',cwd:dir});
    assert.equal(child.status,0,child.stderr);
    const built = JSON.parse(await readFile(path.join(dir,'src/data/catalog-built.json'),'utf8'));
    const output = JSON.parse(await readFile(path.join(dir,'public/katalog-data/make/line.json'),'utf8'));
    const original = JSON.parse(await readFile(path.join(dir,'public/katalog-data/make/line.base.json'),'utf8'));
    await inspect({built,output,original});
  } finally {
    const target = path.resolve(dir), temp = path.resolve(os.tmpdir()) + path.sep;
    assert.ok(target.startsWith(temp) && path.basename(target).startsWith('vozodrom-catalog-review-'));
    await rm(target,{recursive:true,force:true});
  }
}
const row = (op, i = 0) => ({id:`build-${i}`,makeSlug:'make',lineSlug:'line',genIndex:null,field:'op',value:JSON.stringify(op)});

test('build: moved/inserted generations map default and uploaded drawings to the correct origins', async () => {
  await buildFixture([
    row({op:'drawing',index:0,src:'/foto/katalog/upload.webp'},0),
    row({op:'move',path:['generations'],from:0,to:1},1),
    row({op:'insert',path:['generations',0],value:generation('new',1980)},2),
  ],({built,output,original}) => {
    assert.deepEqual(built.lines['make--line'].origins,[null,1,0]);
    assert.deepEqual(output.generations.map(g=>g.code),['new','II','I']);
    assert.deepEqual(built.lines['make--line'].drawings,[
      [1,2000,2005,'/front/make--line--1.webp'],[2,1990,1995,'/foto/katalog/upload.webp'],
    ]);
    assert.deepEqual(original,base());
  });
});

test('build: the old live API legacy-only response survives the first deployment', async () => {
  await buildFixture([
    {makeSlug:'make',lineSlug:'line',genIndex:null,field:'summary',value:'legacy summary'},
    {makeSlug:'make',lineSlug:'line',genIndex:1,field:'name',value:'legacy name'},
  ],({built,output,original})=>{
    assert.equal(output.summary,'legacy summary');assert.equal(output.generations[1].name,'legacy name');
    assert.deepEqual(original,base());assert.deepEqual(built.conflicts,{});
  });
});

test('REGRESSION: a year-only correction must update the runtime drawing year ranges', async () => {
  await buildFixture([row({op:'set',path:['generations',0,'from'],expect:1990,value:1989})],({built,output})=>{
    assert.equal(output.generations[0].from,1989);
    assert.equal(built.lines['make--line']?.drawings[0][1],1989,
      'otherwise FrontDrawing.shownOf falls back to unchanged 1990 metadata');
  });
});

// The listing form's checks with the real lib/makes over a one-line catalogue and the fixture
// build's catalog-built.json, so the edited generations reach them the way they do on the site.
async function listingModule(built) {
  const line = {slug:'line',name:'Model',from:1990,to:2005,current:false,bodyTypes:[],
    generations:base().generations.map(g=>({code:g.code,from:g.from,to:g.to}))};
  const builtUrl = moduleUrl(`const B = ${JSON.stringify(built)}; export const builtLine = (m, l) => B.lines[m + '--' + l];`);
  const makes = await isolated('src/lib/makes.ts', {
    '@/data/makes-index.json': moduleUrl(`export default {auto:[{slug:'make',name:'Make',sections:['auto']}]};`),
    '@/data/model-lines-index.json': moduleUrl(`export default {make:[${JSON.stringify(line)}]};`),
    './catalog-built': builtUrl,
  });
  globalThis.__makesUnderTest = makes;
  return isolated('src/lib/listing-draft.ts', {
    '@/data/catalog/generation-id-aliases.json': moduleUrl('export default {aliases:[]};'),
    './catalog': moduleUrl('export const REGIONS = ["Praha"];'),
    './equipment': moduleUrl('export const cleanEquipment = x => x || [];'),
    './geo': moduleUrl('export const getCity = () => undefined;'),
    './listing-catalog': pathToFileURL(path.join(root,'src/lib/listing-catalog.ts')).href,
    // unique source per call: an identical data: URL would be served from the module cache
    './makes': moduleUrl(`// ${++moduleId}
      const M = globalThis.__makesUnderTest; export const modelLinesOf = M.modelLinesOf;
      export const makesIn = () => [{slug:'make'}]; export const getMake = () => ({name:'Make'});`),
  });
}

test('REGRESSION: deleting a generation from the published card must remove it from listing choices', async () => {
  await buildFixture([row({op:'remove',path:['generations',0]})],async ({output,built})=>{
    const listing = await listingModule(built);
    assert.equal(output.generations.some(g=>g.code==='I'),false);
    const choices = listing.generationsForYear({brand:'make',model:'line',year:1992});
    assert.equal(choices.matching.some(g=>g.code==='I'),false,
      'the listing form must not offer a generation the catalogue no longer has');
  });
});

test('REGRESSION: a newly published generation must not be rejected by old line year limits', async () => {
  await buildFixture([row({op:'insert',path:['generations',2],value:generation('III',2020)})],async ({output,built})=>{
    const listing = await listingModule(built);
    assert.equal(output.generations[2].code,'III');
    const problems = listing.draftFieldProblems({...listing.EMPTY_DRAFT,brand:'make',model:'line',year:2021,
      generation:'III',body:'sedan',engine:'test',fuel:'benzin',powerKw:100,transmission:'manuál',
      mileageKm:1000,price:100000,region:'Praha'});
    assert.equal(problems.year,undefined);
    assert.equal(problems.generation,undefined);
  });
});

// Execute the actual async handler body with controlled fetch/state callbacks.
// This tests race/error handling without claiming a browser/React event test.
async function uiFunction(file, name, state) {
  const source = await readFile(path.join(root,file),'utf8');
  const start = source.indexOf(`async function ${name}(`);
  assert.ok(start >= 0);
  let depth = 0, end = source.indexOf('{',start);
  for (let i = end; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}' && --depth === 0) { end = i + 1; break; }
  }
  const key = `__catalogUiReview${++moduleId}`;
  globalThis[key] = state;
  const bindings = Object.keys(state).join(',');
  const mod = await import(moduleUrl(stripTypeScriptTypes(`const {${bindings}} = globalThis[${JSON.stringify(key)}];\n${source.slice(start,end)}\nexport {${name}};`)));
  return { run: mod[name], dispose() { delete globalThis[key]; } };
}

test('REGRESSION: edits entered while a save is in flight must not be discarded by its response', async () => {
  let release;
  const first = {op:'set',path:['summary'],value:'first'}, second = {op:'set',path:['segment'],value:'B'};
  const state = {pending:[first],makeSlug:'make',lineSlug:'line',
    setBusy(){},setError(){},setRows(){},setNotice(){},
    setPending(value){state.pending=typeof value==='function'?value(state.pending):value;},
    fetch:()=>new Promise(resolve=>{release=resolve;}),
  };
  const fn = await uiFunction('src/components/catalog-editor/CatalogEditorPanel.tsx','save',state);
  try {
    const saving = fn.run();
    state.pending = [...state.pending,second]; // fields remain enabled during the request
    release(Response.json({rows:[]})); await saving;
    assert.deepEqual(state.pending,[second]);
  } finally { fn.dispose(); }
});

test('REGRESSION: a failed drawing upload must clear busy state and show a retryable error', async () => {
  const state = {preview:{blob:new Blob(['test'])},makeSlug:'make',lineSlug:'line',
    currentState:'',error:'',setState(value){state.currentState=value;},setError(value){state.error=value;},
    setPreview(){},onUploaded(){},fetch:async()=>{throw new TypeError('Network unavailable');},
  };
  const fn = await uiFunction('src/components/catalog-editor/DrawingField.tsx','upload',state);
  try {
    await assert.doesNotReject(fn.run());
    assert.equal(state.currentState,''); assert.notEqual(state.error,'');
  } finally { fn.dispose(); }
});
