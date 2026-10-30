// Front candidate collection adapted from Claude's find3.mjs category matcher.
// Car photos on Commons sit in per-generation categories ("Toyota Crown (S40)", "Jaguar XF (X250)
// Saloon"). For each generation without a photo this finds the category
// that names the make, the model and this generation, then ranks freely licensed front candidates.
// node analysis/codex/lineart/find_front.mjs --out <folder> --max-minutes 20
// Text ranking requires subsequent visual review for strictly head-on alignment.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {catalog,DEFAULT_TARGETS,chassisTokens,ordinal} from './front_catalog.mjs';
import {Client as SourceClient,Budget as SourceBudget,Missing,sha,links as htmlLinks,text as htmlText} from './front_source_client.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const UA = 'VozodromFrontCandidates/1.0 (https://vozodrom.cz; contact via github.com/Silverile)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const BODY = {
  sedan: /sedan|saloon|limousine|berline/, kupe: /coupe|coupé/, kabriolet: /convertible|cabrio|spider|spyder|roadster|volante/,
  kombi: /estate|wagon|touring|sportbrake|sport brake|break|kombi|avant|variant/, hatchback: /hatchback|liftback/,
  suv: /suv|crossover/, mpv: /mpv|minivan|monovolume/, pickup: /pickup|pick-up/, van: /\bvan\b/,
};

const words = (s) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length > 0);
const lineNames = s => /^\d+\s*\/\s*\d+$/.test(s) ? s.split(/\s*\/\s*/) : s.split(/\s+\/\s+/);
function codes(g) {
  return chassisTokens(g);
}
function years(s) {
  return (s.match(/\b(19[0-9]{2}|20[0-4][0-9])\b/g) || []).map(Number);
}
function bodyClash(text, body) {
  const t = norm(text);
  const mine = Object.keys(BODY).filter((b) => body.includes(b));
  const said = Object.keys(BODY).filter((b) => BODY[b].test(t));
  return mine.length > 0 && said.length > 0 && !said.some((b) => mine.includes(b));
}
function yearClash(ys, g) {
  if (!ys.length || !g.from) return false;
  const lo = g.from - 1, hi = (g.to || 2026) + 1;
  return ys.every((y) => y < lo || y > hi);
}

// older Toyotas were sold as Toyopet
const MAKE_ALIAS = { toyota: ['toyopet'] };
// words in our generation names that say nothing about which car it is
const GENERIC = new Set(('i ii iii iv v vi vii viii ix generace generation gen provedeni karoserie rada ceska ceske cesky verze ' +
  'facelift modernizace kratsi delsi dlouhy rozvor standardni puvodni prodlouzena nabidka evropska specifikace vybrana se ' +
  'zdrojovymi konflikty na the first prvni druha model serie series silnicni benzinove unique phev hev ev hybrid trirade ' +
  'triradove dvere petidverova tridverova ctyrdverova oznaceni cinska exportni modernizovana rodina').split(' '));
function genWords(g) {
  const skip = new Set([...words(g.line), ...words(g.make), ...codes(g)]);
  return words(g.gen).filter((w) => (w.length > 1 || /^[0-9]$/.test(w)) && !/^(?:19|20)\d{2}$/.test(w) && !skip.has(w) && !GENERIC.has(w) && !Object.values(BODY).some((re) => re.test(w)));
}
// chassis code family: Toyota RS46G and MS50 belong to the Commons generations "S40" and "S50"
function codeFamily(g) {
  return (norm(g.make) === 'toyota' ? codes(g) : []).map((c) => c.match(/([a-z])([0-9])[0-9]/)).filter(Boolean).map((m) => m[1] + m[2] + '0');
}

export function scoreCategory(title, g) {
  const t = norm(title.replace(/^Category:/, ''));
  const makeW = words(g.make);
  const makeOk = makeW.every((w) => words(t).includes(w)) || (g.makeAliases || []).some(a => words(a).every(w => words(t).includes(w))) || makeW.some((w) => (MAKE_ALIAS[w] || []).some((a) => words(t).includes(a)));
  if (!makeOk) return null;
  // All model words must match within one slash-separated alias. A shared word
  // such as Daytona cannot identify the SP3, nor can Type identify an E-Type.
  const modelGroups = lineNames(g.line).map(alias => words(alias).filter(w => !makeW.includes(w)));
  const genAlias = lineNames(g.line).find(alias => norm(alias.trim()) === norm(g.gen.trim()));
  if (genAlias && !words(genAlias).every(w => words(t).includes(w))) return null;
  const cs = codes(g);
  if ((g.otherCodes || []).some(c => words(t).includes(c)) && !cs.some(c => words(t).includes(c))) return null;
  if (!(modelGroups.some(ws => ws.length && ws.every(w => words(t).includes(w))) || cs.some(c => words(t).includes(c)))) return null;
  if (/\b(interior|engine|badge|logo|dashboard|wheel|model car|scale model|toy|museum|in .+ museum|racing|rally)\b/.test(t)) return null;
  let s = 0;
  const ev = [];
  if (t === norm(`${g.make} ${g.line.split(' / ')[0]}`)) { s += 1; ev.push('model-exact'); }
  if (cs.some((c) => new RegExp(`\\b${c}\\b`).test(t))) { s += 3; ev.push('code'); }
  else if (codeFamily(g).some((c) => new RegExp(`\\b${c}\\b`).test(t))) { s += 2; ev.push('code-family'); }
  const gw = genWords(g);
  const roman=ordinal(g);
  if(roman&&new RegExp('\\b'+roman.toLowerCase()+'\\b').test(t)){s+=4;ev.push('generation-ordinal');}
  if((g.otherOrdinals||[]).some(n=>new RegExp('\\b'+n.toLowerCase()+'\\b').test(t))&&!ev.includes('generation-ordinal')&&!ev.includes('code'))return null;
  if (gw.some((w) => new RegExp(`\\b${w}\\b`).test(t))) { s += 3; ev.push('gen-name'); }
  else if (g.line.includes('/') && words(g.gen).length && words(g.gen).every(w => words(t).includes(w))) { s += 3; ev.push('gen-name'); }
  const ys = years(t);
  if (ys.length) { if (yearClash(ys, g)) return null; s += 2; ev.push('years'); }
  // VIN/serial-number collections contain one example, not the whole generation.
  if (/\bs\/n\b|\bchassis\b|\bserial\b/.test(t)) { s -= 2; ev.push('individual-car'); }
  if (bodyClash(t, g.body)) return null;
  if (g.body.some((b) => BODY[b]?.test(t))) { s += 1; ev.push('body'); }
  // a line with one generation can use the model's own category; otherwise it needs evidence that
  // names this generation. Matching years alone is not enough when the generation has a name of its
  // own ("365 GT 2+2" is not the "365 California" of the same years).
  const named = ev.includes('code') || ev.includes('code-family') || ev.includes('gen-name') || ev.includes('generation-ordinal');
  if (g.siblings > 1 && !named && !(ev.includes('years') && gw.length === 0)) return null;
  return { title, score: s, evidence: ev };
}

const FRONT = /\b(?:front|frontal|frontansicht|front-draufsicht|vue de face|avant|anteriore|predni)\b|вид спереди/i;
const EXCLUDE = /\b(?:rear|back view|rearview|heck|hinten|arriere|posteriore|zadni|interior|interieur|engine|motorraum|side|profil|profile|seite|lateral|three[ -]quarter|detail|badge|logo|dashboard|headlight|taillight|air bag|airbag|passenger seat|carport|garages)\b|3\s*[\/-]\s*4|вид сзади|интерьер/i;
const strip = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export function frontRank(title, description = '', category = '') {
  const t = norm(title.replace(/_/g, ' ')), d = norm(description);
  const angled = /\b(?:front[ -](?:left|right)|(?:left|right)[ -]front)\b/;
  if (EXCLUDE.test(t) || EXCLUDE.test(d) || angled.test(t) || angled.test(d)) return -1;
  // Audi's Avant is a body name, not evidence for a front view.
  const clean = s => s.replace(/\baudi\b.*?\bavant\b/g, '');
  return (FRONT.test(clean(t)) ? 100 : 0) + (FRONT.test(clean(d)) ? 30 : 0) + (FRONT.test(norm(category)) ? 10 : 0);
}
export function freeLicence(lic) {
  return /^(?:public domain|pd(?:-\S+)?|cc0(?: 1\.0)?|cc by(?:-sa)? \d+(?:\.\d+)?)$/i.test(strip(lic));
}
export function generations(repo = REPO,options={}) {
  const all=catalog({repo,...options});
  return all.filter(g=>g.eligible).map(g=>{
    const siblings=all.filter(s=>s.makeSlug===g.makeSlug&&s.lineSlug===g.lineSlug&&s.id!==g.id);
    return {...g,priority:g.rank,otherCodes:[...new Set(siblings.flatMap(codes))].filter(c=>!codes(g).includes(c)),otherOrdinals:[...new Set(siblings.map(ordinal).filter(Boolean))].filter(n=>n!==ordinal(g))};
  });
}
class Checkpoint extends Error {}
export class Client {
  constructor(deadline,maxRequests=Infinity) { this.deadline=deadline;this.requests=0;this.transport=new SourceClient({hosts:['commons.wikimedia.org','upload.wikimedia.org','thumb.wikimedia.org'],maxMinutes:Infinity,maxRequests});this.transport.deadline=deadline; }
  async get(url, binary = false) {
    let r;try{r=await this.transport.get(url);}catch(e){if(e instanceof SourceBudget)throw new Checkpoint(e.message);throw e;}finally{this.requests=this.transport.requests;}
    if(binary){if(!/^image\/(?:jpeg|png)\b/i.test(r.headers['content-type']||''))throw Error('Non-image response');return r.data;}
    const j = JSON.parse(r.body||r.data.toString('utf8'));
    if (j.error) throw new Error('Commons API ' + JSON.stringify(j.error));
    return j;
  }
  async api(params) {
    const u = new URL('https://commons.wikimedia.org/w/api.php');
    u.search = new URLSearchParams({action:'query', format:'json', maxlag:'5', ...params});
    return this.get(u);
  }
  async html(url){try{return await this.transport.get(url);}catch(e){if(e instanceof SourceBudget)throw new Checkpoint(e.message);throw e;}finally{this.requests=this.transport.requests;}}
  async *pages(params) {
    let next = {};
    do {
      const j = await this.api({...params, ...next});
      yield j; next = j.continue;
    } while (next);
  }
}
export function categoryLinks(body,url){return [...new Map(htmlLinks(body,url).filter(l=>new URL(l.url).hostname==='commons.wikimedia.org'&&/^\/wiki\/Category:/.test(decodeURIComponent(new URL(l.url).pathname))).map(l=>{const title=decodeURIComponent(new URL(l.url).pathname.slice('/wiki/'.length)).replaceAll('_',' ');return[title,{title,url:l.url}];})).values()];}
export async function collectHtml(g,client,{perGeneration=20,maxCategories=12}={}){
 const found=new Map();
 const add=(title,url)=>{const score=scoreCategory(title,g);if(score)found.set(title,{...score,url});};
 if(g.catalogPhotoPage&&new URL(g.catalogPhotoPage).hostname==='commons.wikimedia.org'){
  try{const seed=await client.html(g.catalogPhotoPage);for(const cat of categoryLinks(seed.body,seed.url))add(cat.title,cat.url);}catch(e){if(!(e instanceof Missing))throw e;}
 }
 {
  const base=`${g.make} ${g.line.split(' / ')[0]}`,guesses=[`${g.make} ${g.gen}`,`${base} ${ordinal(g)||''}`.trim(),...codes(g).slice(0,2).map(c=>`${base} (${c.toUpperCase()})`),base];
  for(const title of [...new Set(guesses)]){
   const url='https://commons.wikimedia.org/wiki/Category:'+encodeURIComponent(title.replaceAll(' ','_'));
   try{const page=await client.html(url);add('Category:'+title,page.url);for(const cat of categoryLinks(page.body,page.url))add(cat.title,cat.url);}catch(e){if(!(e instanceof Missing))throw e;}
   if(found.size)break;
  }
 }
 const ranked=[...found.values()].sort((a,b)=>b.score-a.score||a.title.length-b.title.length),category=ranked[0]||null;
 if(!category)return{...g,source:'commons',category:null,files:[],scannedCategories:[]};
 const queue=ranked.slice(0,2),seen=new Set(),pages=new Map();
 for(let i=0;i<queue.length&&seen.size<maxCategories;i++){
  const cat=queue[i];if(seen.has(cat.title))continue;seen.add(cat.title);
  const p=await client.html(cat.url);
  for(const l of htmlLinks(p.body,p.url)){
   const u=new URL(l.url),pathname=decodeURIComponent(u.pathname);if(u.hostname!=='commons.wikimedia.org')continue;
   if(pathname.startsWith('/wiki/File:')){
    const title=pathname.slice('/wiki/'.length).replaceAll('_',' '),rank=frontRank(title);
    if(rank>=0&&/\.(?:jpe?g|png)$/i.test(title)&&!yearClash(years(title),g)&&!bodyClash(title,g.body))pages.set(title,{title,sourcePage:u.origin+u.pathname,rank,category:cat.title});
   }
  }
  if((cat.depth||0)<2)for(const child of categoryLinks(p.body,p.url)){
   const sc=scoreCategory(child.title,g);
   if(sc&&!seen.has(child.title)&&/front|facelift|combi|estate|wagon|sedan|saloon|hatchback|coupe|convertible|kombi|\b(?:19|20)\d{2}\b/i.test(child.title))queue.push({...child,...sc,depth:(cat.depth||0)+1});
  }
  // Pagination links on /w/index.php remain disallowed; never follow them.
 }
 const files=[];
 for(const candidate of [...pages.values()].sort((a,b)=>b.rank-a.rank||a.title.localeCompare(b.title)).slice(0,Math.max(40,perGeneration*3))){
  const p=await client.html(candidate.sourcePage);
  const full=p.body.match(/<div\b[^>]*class=["'][^"']*fullImageLink[^"']*["'][^>]*>[\s\S]*?<a\b[^>]*href=["']([^"']+)/i)?.[1];
  if(!full)continue;
  const width=Number(p.body.match(/data-file-width=["'](\d+)/)?.[1]);if(width&&width<1000)continue;
  const thumb=p.body.match(/<div\b[^>]*class=["'][^"']*fullImageLink[^"']*["'][^>]*>[\s\S]*?<img\b[^>]*src=["']([^"']+)/i)?.[1];
  // Use the file page's published original. The thumbnail host's robots URL
  // redirects to the Commons home page rather than a robots policy.
  const url=new URL(full.replaceAll('&amp;','&'),p.url).href;
  if(!['upload.wikimedia.org','thumb.wikimedia.org'].includes(new URL(url).hostname))continue;
  const licenseSection=p.body.slice(p.body.indexOf('id="Licensing"'),p.body.indexOf('id="Licensing"')+16000);
  const licenceUrl=licenseSection.match(/https?:\/\/creativecommons\.org\/(?:licenses|publicdomain)\/[^"'<>\s]+/)?.[0]||null;
  files.push({...candidate,url,source:'commons',page:p.url,licence:'unknown/all-rights-reserved',licenceUrl,author:null,width:width||null,frontTitled:candidate.rank>=100,evidence:[...category.evidence,'public-category-html','file-original-link'],viewStatus:'unverified'});
  if(files.length>=perGeneration)break;
 }
 return{...g,source:'commons',category,categories:ranked,scannedCategories:[...seen],files};
}
export async function collect(g, client,{perGeneration=20,maxCategories=30}={}) {
  const base = `${g.make} ${g.line.split(' / ')[0]}`;
  const queries = [...new Set([`${base} ${codes(g).join(' ')}`.trim(), ...(codes(g).length ? [`${g.make} ${codes(g)[0]}`] : []), g.from ? `${base} ${g.from}` : base, base])];
  const cats = new Map();
  for (const q of queries) {
    const j = await client.api({list:'search', srnamespace:'14', srlimit:'30', srsearch:q});
    for (const x of j.query?.search || []) {
      const score = scoreCategory(x.title, g);
      if (score) cats.set(x.title, score);
    }
  }
  const categories = [...cats.values()].sort((a,b) => b.score - a.score || a.title.length - b.title.length || a.title.localeCompare(b.title));
  const category = categories[0] || null;
  if (!category) return {...g, category, categories:[], files:[]};
  const sources = [category],seen=new Set([category.title]);
  for(let cursor=0;cursor<sources.length&&sources.length<maxCategories;cursor++){
  const parent=sources[cursor];if((parent.depth||0)>=3)continue;
  for await (const j of client.pages({list:'categorymembers', cmtitle:parent.title, cmtype:'subcat', cmlimit:'500'})) {
    for (const sub of j.query?.categorymembers || []) {
      if(seen.has(sub.title)||sources.length>=maxCategories||EXCLUDE.test(norm(sub.title))||bodyClash(sub.title,g.body))continue;
      if((g.otherCodes||[]).some(c=>words(norm(sub.title)).includes(c))&&!codes(g).some(c=>words(norm(sub.title)).includes(c)))continue;
      if((g.otherOrdinals||[]).some(c=>words(norm(sub.title)).includes(c.toLowerCase()))&&!words(norm(sub.title)).includes(ordinal(g)?.toLowerCase()))continue;
      const sc=scoreCategory(sub.title,g),special=FRONT.test(norm(sub.title))||/facelift|pre-facelift|post-facelift|combi|estate|wagon|sedan|saloon|hatchback|coupe|convertible|kombi|\b(?:19|20)\d{2}\b/i.test(sub.title);
      if(special&&(sc||FRONT.test(norm(sub.title)))){seen.add(sub.title);sources.push({title:sub.title,score:sc?.score??parent.score,evidence:sc?.evidence||[...parent.evidence,'inherited-front-subcategory'],depth:(parent.depth||0)+1});}
    }
  }
  }
  sources.sort((a,b)=>Number(FRONT.test(norm(b.title)))-Number(FRONT.test(norm(a.title))));
  const files = new Map();
  for (const cat of sources) {
    for await (const j of client.pages({generator:'categorymembers', gcmtitle:cat.title, gcmtype:'file', gcmlimit:'100', prop:'imageinfo', iiprop:'url|size|mime|extmetadata', iiurlwidth:'1600'})) {
      for (const p of Object.values(j.query?.pages || {})) {
        const ii = p.imageinfo?.[0], m = ii?.extmetadata || {}, licence = strip(m.LicenseShortName?.value);
        if (!ii || !/\.(?:jpe?g|png)$/i.test(p.title) || !freeLicence(licence) || ii.width < 1000) continue;
        const description = strip(m.ImageDescription?.value);
        const rank = frontRank(p.title, description, cat.title);
        if (rank < 0 || yearClash(years(p.title), g) || bodyClash(p.title, g.body)) continue;
        const item = {title:p.title, page:ii.descriptionurl, source:'commons',sourcePage:ii.descriptionurl, url:ii.thumburl || ii.url, licence, licenceUrl:strip(m.LicenseUrl?.value) || null, author:strip(m.Artist?.value), category:cat.title, evidence:cat.evidence, description, width:ii.width, height:ii.height, mime:ii.mime, rank, frontTitled:frontRank(p.title) >= 100};
        if (!files.has(p.title) || files.get(p.title).rank < rank) files.set(p.title, item);
      }
    }
  }
  return {...g, source:'commons',category, categories:categories.slice(0,10), scannedCategories:sources, files:[...files.values()].sort((a,b) => b.rank - a.rank || a.title.localeCompare(b.title)).slice(0,perGeneration)};
}
export function counts(rows) {
  return {tried:rows.length, withCategory:rows.filter(r => r.category).length, withFrontTitledFile:rows.filter(r => r.files.some(f => f.frontTitled)).length, files:rows.reduce((s,r) => s+r.files.length, 0)};
}
export async function saveThumbnail(data, filename) {
  const {default: sharp} = await import('sharp');
  const image = sharp(data).rotate().resize({width:1600, withoutEnlargement:true}).jpeg({quality:92});
  const info = await image.toFile(filename);
  return {localWidth:info.width, localHeight:info.height, localFormat:'jpeg'};
}
async function main() {
  const args = process.argv.slice(2), options = {out:'C:/Workspace/Projects/CF/vozodrom-data/front-collect/commons', minutes:20, limit:Infinity,perGeneration:20,maxImages:Infinity,targets:DEFAULT_TARGETS,maxRequests:Infinity,maxCategories:12,mode:'html'};
  for (let i=0; i<args.length; i++) {
    if (args[i] === '--out') options.out = args[++i];
    else if (args[i] === '--max-minutes') options.minutes = Number(args[++i]);
    else if (args[i] === '--limit') options.limit = Number(args[++i]);
    else if (args[i] === '--only') options.only = new RegExp(args[++i]);
    else if (args[i] === '--list') options.list = true;
    else if (args[i] === '--dry-run') options.dryRun = true;
    else if (args[i] === '--targets') options.targets = args[++i];
    else if (args[i] === '--wave') options.wave = Number(args[++i]);
    else if (args[i] === '--per-generation') options.perGeneration = Number(args[++i]);
    else if (args[i] === '--max-images') options.maxImages = Number(args[++i]);
    else if (args[i] === '--max-requests') options.maxRequests = Number(args[++i]);
    else if (args[i] === '--max-categories') options.maxCategories = Number(args[++i]);
    else if (args[i] === '--mode') options.mode = args[++i];
    else throw new Error('Unknown argument: ' + args[i]);
  }
  if (!(options.minutes > 0) || !(options.limit > 0)||!(options.perGeneration>0&&options.perGeneration<=20)||!(options.maxImages>0)||!(options.maxRequests>0)||options.wave&&![1,2,3].includes(options.wave)) throw new Error('Invalid time/limit/wave');
  const queue = generations(REPO,{targets:options.targets,wave:options.wave}).filter(g => !options.only || options.only.test(g.id));
  if (options.list) {console.log(JSON.stringify({total:queue.length,withCatalogPhotos:queue.filter(g=>g.hasCatalogPhoto).length,index:'src/data/model-cards-index.json',targets:options.targets,sample:queue.slice(0,10).map(({id,rank,wave,code})=>({id,rank,wave,code}))},null,2)); return;}
  const out = path.resolve(options.out), indexPath = path.join(out, options.dryRun?'dry-run-candidates.json':'candidates.json');
  fs.mkdirSync(out, {recursive:true});
  const testRoot=path.resolve('analysis/codex/lineart/test-out');
  if(out===testRoot||out.startsWith(testRoot+path.sep)){fs.writeFileSync(path.join(testRoot,'.gitignore'),'*\n!.gitignore\n');options.maxImages=Math.min(30,options.maxImages);}
  const rows = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : [];
  if (!Array.isArray(rows) || new Set(rows.map(r => r.id)).size !== rows.length) throw new Error('Invalid/duplicate resume IDs');
  const ids=new Set(queue.map(g=>g.id));if(rows.some(r=>!ids.has(r.id)))throw Error('Output contains IDs outside this target/filter selection; use a fresh --out');
  const done = new Set(rows.filter(r => r.status === 'done'&&r.collectorVersion===2&&r.candidateLimit>=options.perGeneration&&r.files.every(f=>options.dryRun||f.local&&fs.existsSync(path.join(out,f.local)))).map(r => r.id));
  const client = new Client(Date.now() + options.minutes * 60000,options.maxRequests);
  const lock=path.join(out,'.crawl.lock'),fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));
  const save = () => {fs.writeFileSync(indexPath+'.tmp', JSON.stringify(rows,null,2)+'\n'); fs.renameSync(indexPath+'.tmp', indexPath);};
  let tried = 0,saved=0,stop='complete';
  const existingImages=options.dryRun?0:rows.reduce((n,r)=>n+r.files.filter(f=>f.local&&fs.existsSync(path.join(out,f.local))).length,0);
  try {
    for (const g of queue) {
      if (done.has(g.id)) continue;
      if (tried >= options.limit) break;
      console.log('START ' + g.id);
      if(!options.dryRun&&saved+existingImages>=options.maxImages){stop='image budget';break;}
      const result = await (options.mode==='html'?collectHtml:collect)(g, client,options);
      const dir = path.join(out, 'cand', g.id);
      if (result.files.length&&!options.dryRun) fs.mkdirSync(dir, {recursive:true});
      const planned=result.files;result.files=[];
      result.status='partial';result.collectorVersion=2;result.candidateLimit=options.perGeneration;
      const previous=rows.findIndex(r=>r.id===g.id);if(previous<0)rows.push(result);else rows[previous]=result;save();
      for (let n=0; n<planned.length; n++) {
        const f = planned[n];
        if(options.dryRun){result.files.push({...f,local:null,status:'planned'});continue;}
        if(saved+existingImages>=options.maxImages){stop='image budget';break;}
        f.local = `cand/${g.id}/${sha(f.url).slice(0,16)}.jpg`;
        if(fs.existsSync(path.join(out,f.local))){result.files.push(f);continue;}
        const data = await client.get(f.url, true);
        Object.assign(f, await saveThumbnail(data, path.join(out, f.local)));
        result.files.push(f);saved++;save();
      }
      result.status = result.files.length<planned.length?'partial':'done';result.collectorVersion=2;result.candidateLimit=options.perGeneration; result.completedAt = new Date().toISOString();
      const old = rows.findIndex(r => r.id === g.id);
      if (old < 0) rows.push(result); else rows[old] = result;
      if(result.status==='done')done.add(g.id); tried++; save();
      console.log(JSON.stringify({id:g.id, category:result.category, files:result.files.length, ...counts(rows)}));
    }
  } catch (e) {
    stop=e.message;
    if (!(e instanceof Checkpoint)) {console.error(e.stack); process.exitCode = 1;}
    else console.log(e.message);
  } finally { save();const report={...counts(rows),completedThisRun:tried,saved,dryRun:!!options.dryRun,targets:options.targets,wave:options.wave||null,eligible:queue.length,stop,requests:client.requests,output:indexPath,policies:client.transport.evidence};fs.writeFileSync(path.join(out,options.dryRun?'dry-run-report.json':'report.json'),JSON.stringify(report,null,2)+'\n');fs.closeSync(fd);fs.unlinkSync(lock);console.log(JSON.stringify(report)); }
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) await main();

