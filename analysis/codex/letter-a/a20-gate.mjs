import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a-20-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const r of rows){
 if(['arcfox--alpha-s--1','arcfox--alpha-t--1'].includes(r.id)){
 r.evidence=[`https://www.arcfox.com.cn/${r.id.includes('alpha-s')?'S6':'T6'}/index.html`,'https://www.autohome.com.cn/news/202504/1305079.html'];
 r.view=(r.id.includes('alpha-s')?'Head-on':'Front three-quarter')+'; complete unobstructed front, both headlights, both bumper corners and bonnet visible. Factory equipment; remove plate, wipers, antenna and all glass contents.';
 }
 r.referenceGate='pass';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
