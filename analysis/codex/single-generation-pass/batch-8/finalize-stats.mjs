import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import cp from 'node:child_process';
const root='analysis/codex/single-generation-pass/batch-8',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),stage=root+'/final-rebuild';
const before=base['src/data/stats/mazda.json'],fresh=read(stage+'/stats/mazda.json'),after=structuredClone(before),index=base['src/data/stats/index.json'];
assert.equal(fresh._.fleet.n,before._.fleet.n);assert.equal(fresh._.stk.inspections,before._.stk.inspections);
const presentationHeld=[];
function compareHolding(a,b,path,fields=[]){const x=structuredClone(a),y=structuredClone(b);for(const field of fields){const parts=field.split('.');let ax=x,by=y;for(const key of parts.slice(0,-1)){ax=ax[key];by=by[key];}const key=parts.at(-1);presentationHeld.push({path:path+'.'+field,before:ax[key],rebuilt:by[key]});delete ax[key];delete by[key];}assert.deepEqual(x,y,'Unexpected change '+path);}
compareHolding(before._,fresh._,'mazda._',['fleet.countries']);
// Raw aggregate equivalence proves that these two older presentation snapshots
// have no population changes. Top-k compression and tied cutoffs can differ.
for(const kind of ['rsv','istp']){const previous=read('analysis/codex/single-generation-pass/batch-7/final-rebuild/aggregates/'+kind+'-agg.json').keys,current=read(stage+'/aggregates/'+kind+'-agg.json').keys;for(const key of new Set([...Object.keys(previous),...Object.keys(current)])){const[m,l]=key.split('|');if(m==='mazda'&&l&&l!=='b-series')assert.deepEqual(current[key],previous[key],'Unrelated raw aggregate '+kind+' '+key);}}
const unrelated=[];
for(const line of new Set([...Object.keys(before),...Object.keys(fresh)])){
 if(['meta','_','b-series'].includes(line))continue;
 compareHolding(before[line],fresh[line],'mazda.'+line,line==='cx-9'?['fleet.countries']:line==='929'?['fleet.colors']:[]);unrelated.push(line);
}
const measurement=read(root+'/mazda-measurement.json');assert.equal(fresh['b-series'].fleet.n,measurement.totals.bSeriesAfter);assert.equal(fresh['b-series'].fleet.n,98);
assert.equal(fresh['b-series'].gens[4].fleet.n,88);assert(!fresh['b-series'].gens[3]?.fleet,'UF fleet below 30 must remain suppressed');
after['b-series']=fresh['b-series'];fs.writeFileSync('src/data/stats/mazda.json',JSON.stringify(after));
const globalIndex=structuredClone(index);assert.equal(globalIndex.makes.mazda.n,fresh._.fleet.n);if(!globalIndex.makes.mazda.lines.includes('b-series'))globalIndex.makes.mazda.lines.push('b-series');
fs.writeFileSync('src/data/stats/index.json',JSON.stringify(globalIndex));cp.execFileSync('node',['scripts/listing-stats-index.mjs'],{stdio:'inherit'});
const listing=read('src/data/listing-stats.json'),oldListing=base['src/data/listing-stats.json'];for(const[make,data]of Object.entries(oldListing.makes))if(make!=='mazda')assert.deepEqual(listing.makes[make],data,make);for(const[line,data]of Object.entries(oldListing.makes.mazda))if(line!=='b-series')assert.deepEqual(listing.makes.mazda[line],data,line);
assert.deepEqual(after._,before._);for(const line of unrelated)assert.deepEqual(after[line],before[line]);
write(root+'/statistics.json',{status:'complete',fullVinHistory:true,days:read(root+'/full-history-selection.json').days,makeFleet:fresh._.fleet.n,makeInspections:fresh._.stk.inspections,makeSummaryPreserved:true,unrelatedMazdaLinesPreserved:unrelated.length,unrelatedRawAggregatesPreserved:true,presentationHeld,presentationHoldReason:'Retained existing published make country shares, CX-9 country shares and 929 tied color cutoff. Unrelated raw RSV/STK aggregates are byte-value equivalent to batch 7; only B-Series is promoted.',otherMakesPreserved:true,bSeriesBefore:before['b-series']??null,bSeriesAfter:fresh['b-series'],measurement:measurement.totals,publicationThreshold:30});
console.log(JSON.stringify({fleet:fresh['b-series'].fleet.n,inspections:fresh['b-series'].stk?.inspections,generations:Object.entries(fresh['b-series'].gens).map(([i,x])=>[i,x.fleet?.n??null,x.stk?.inspections??null]),unrelatedMazdaLinesPreserved:unrelated.length}));
