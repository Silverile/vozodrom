import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='analysis/codex/revenue';
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sample=load(`${root}/sample-vykupni-prehled.json`);
const cards=load('src/data/model-cards-index.json');
let generations=0,ageRows=0,mileageRows=0,defects=0;
for(const source of sample.provenance.sourceFiles)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source.path)).digest('hex'),source.sha256,'Source changed; rebuild sample');
for(const line of sample.lines){
 const stats=load(`src/data/stats/${line.makeSlug}.json`)[line.lineSlug];
 assert.equal(line.generations.length,cards[line.makeSlug][line.lineSlug].generations.length);
 for(const g of line.generations){
  generations++;
  const s=stats.gens[g.index];
  assert.equal(g.fleetCount,s.fleet.n);
  assert.equal(g.inspectionCount,s.stk.inspections);
  assert.deepEqual(g.failureByExactAge.map(x=>[x.age,x.inspectionCount,x.failureShare]),s.stk.byAge);
  assert.deepEqual(g.mileageByExactAge.map(x=>[x.age,x.p25Km,x.medianKm,x.p75Km]),s.stk.km);
  const covered=new Set();
  for(const b of g.ageBuckets){
   const rows=g.failureByExactAge.filter(x=>x.age>=b.fromAge&&(b.toAge==null||x.age<=b.toAge));
   const n=rows.reduce((sum,x)=>sum+x.inspectionCount,0);
   assert.equal(b.inspectionCount,n||null);
   if(!n){assert.equal(b.failureShareApprox,null);continue;}
   const weighted=rows.reduce((sum,x)=>sum+x.inspectionCount*x.failureShare,0)/n;
   assert(Math.abs(weighted-b.failureShareApprox)<=0.00000051);
   // A weighted group must remain within its constituent age rates.
   assert(b.failureShareApprox>=Math.min(...rows.map(x=>x.failureShare))-0.00000051);
   assert(b.failureShareApprox<=Math.max(...rows.map(x=>x.failureShare))+0.00000051);
   for(const row of rows){assert(!covered.has(row.age));covered.add(row.age);}
  }
  assert.equal(covered.size,g.failureByExactAge.length);
  assert(g.ageBuckets.reduce((sum,b)=>sum+(b.inspectionCount??0),0)<=g.inspectionCount);
  for(const x of g.mileageByExactAge){assert(x.p25Km<=x.medianKm&&x.medianKm<=x.p75Km);assert.equal(x.validOdometerReadingCount,null);mileageRows++;}
  assert.equal(g.topDefects.length,Math.min(5,s.stk.defects.length));
  assert.deepEqual(g.topDefects.map(x=>[x.code,x.occurrencesPerInspection]),s.stk.defects.slice(0,5).map(x=>[x.code,x.share]));
  ageRows+=g.failureByExactAge.length;defects+=g.topDefects.length;
 }
}
assert.equal(generations,16);
const partners=load(`${root}/affiliate-programmes.json`);
const prospects=load(`${root}/b2b-targets.json`);
assert.equal(prospects.targets.length,40);
assert.equal(new Set(prospects.targets.map(x=>x.name)).size,40);
for(const t of prospects.targets){assert(t.contactUrl.startsWith('https://'));assert(t.sources.length);assert.equal(t.purchaseIntent,'unknown-not-contacted');}
for(const p of partners.programmes){assert(p.sources.length);assert(p.applicationUrl.startsWith('https://'));assert(p.unverified);}
// Only generic company mailboxes may appear; there are deliberately no personal phone numbers.
const allowed=new Set(['info@davocar.cz','info@autokoutek.cz','info@havex.cz','info@autobond.cz','info@automato.cz','info@autorevize.cz','info@aaaauto.cz','autojarov@autojarov.cz','info@caraukce.cz','info@defendinsurance.eu']);
const emails=new Set();
for(const name of fs.readdirSync(root).filter(x=>/\.(json|md|csv)$/.test(x)&&x!=='validation.json')){
 const text=fs.readFileSync(`${root}/${name}`,'utf8');
 assert(!text.includes('\uFFFD'),`Encoding replacement ${name}`);
 assert(!text.includes('poji??'),`Encoding corruption ${name}`);
 for(const email of text.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi)??[]){assert(allowed.has(email),`Unapproved mailbox ${email}`);emails.add(email);}
 assert(!/\+420[ -]?\d/.test(text),`Phone number in ${name}`);
}
const result={result:'PASS',sourceHashes:sample.provenance.sourceFiles.length,lines:sample.lines.length,generations,exactAgeRows:ageRows,mileageRows,topDefects:defects,partnerCandidates:partners.programmes.length,b2bProspects:prospects.targets.length,genericMailboxes:emails.size,privacy:'No individual VINs, employee contacts or telephone numbers included; mailbox allowlist checked.'};
fs.writeFileSync(`${root}/validation.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
