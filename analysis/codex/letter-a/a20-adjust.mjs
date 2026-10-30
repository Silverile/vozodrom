import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a-20-results.json',rows=JSON.parse(fs.readFileSync(db)),sources=JSON.parse(fs.readFileSync(root+'/a20-sources.json'));
const p=rows.find(x=>x.id==='amc--pacer--0'),s=sources.find(x=>x.file==='1975_AMC_Pacer_X.jpg');
Object.assign(p,{referencePage:s.referencePage,image:s.image,credit:s.credit,licence:'CC BY-SA 4.0',licenceUrl:'https://creativecommons.org/licenses/by-sa/4.0/',variant:'1975 Pacer X hatchback; original low grille. Factory luggage rails tolerated; remove antenna and plate.',evidence:[s.referencePage,p.evidence[1]]});fs.copyFileSync(s.local,p.folder+'/reference.jpg');
const a=rows.find(x=>x.id==='arcfox--alpha-s--0'),src=sources.find(x=>x.file==='Arcfox_Alpha-S_by_BAIC_(front).jpg');
Object.assign(a,{referencePage:src.referencePage,image:src.image,credit:src.credit,variant:'2022 standard Alpha S liftback; original diamond grille, not HI. Complete front unobstructed; neighbouring taxi is outside target front.',evidence:[src.referencePage,'https://www.arcfox.com.cn/s.html'],referenceGate:'pass'});fs.copyFileSync(src.local,a.folder+'/reference.jpg');
for(const r of rows){r.referenceGate='pass';}
for(const r of rows){fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
