import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a-12-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const r of rows){
 r.credit=r.credit.replace(/&#160;/g,'').trim();
 r.referenceGate={status:'pass',identity:'Commons photograph description plus independent manufacturer/museum or exhibition-catalogue source',view:'Complete front three-quarter; both headlamp assemblies, bonnet and front corners visible',reviewedBeforeGeneration:true};
 if(r.id==='alfa-romeo--gt--0')r.notes+=' Initial Rudolf Stricker candidate rejected before generation because the far headlamp was concealed; replaced with M 93 photograph.';
 if(r.id==='alfa-romeo--junior--0')r.notes+=' Three rear-view candidates rejected before generation; selected DSC 7219. Reference downloaded as 1280px thumbnail. Leggenda grille emblem simplified to honour no-letters rule.';
 if(r.id==='alfa-romeo--rl--0')r.notes+=' Retains two small lower lamps; accepted as minor detail under batch acceptance. No large accessory, horn or side spare wheels in drawing.';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
console.log(JSON.stringify({count:rows.length,done:rows.filter(x=>x.status==='done').length,genSeconds:rows.reduce((s,x)=>s+x.genSeconds,0),files:rows.flatMap(r=>['reference.jpg',r.id+'.png','info.txt'].map(f=>r.folder+'/'+f))},null,2));
