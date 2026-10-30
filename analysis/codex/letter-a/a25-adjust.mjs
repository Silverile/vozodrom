import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a-25-results.json',rows=JSON.parse(fs.readFileSync(db));
const r=rows.find(x=>x.id==='aston-martin--v8--0');
const s=JSON.parse(fs.readFileSync(root+'/a25-sources.json')).find(x=>x.file==='Aston_Martin_V8-front.jpg');
fs.copyFileSync(s.local,r.folder+'/reference.jpg');
Object.assign(r,{referencePage:s.referencePage,image:s.image,credit:s.credit,licence:'CC BY-SA 4.0',licenceUrl:'https://creativecommons.org/licenses/by-sa/4.0/',evidence:[s.referencePage,'https://www.astonmartin.com/en-gb/models/past-models/amv8'],variant:'Series 3 standard carburettor saloon/coupe, US specification; open bonnet scoop, mesh grille, single main lamps and chrome bumper',notes:'Reference visually inspected. Original 1977 candidate rejected before generation because it showed Vantage styling. Club badge and show plaque excluded. Generation pending.'});
fs.writeFileSync(db,JSON.stringify(rows,null,2));
fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
console.log('V8 reference replaced with visually verified standard Series 3 front');
