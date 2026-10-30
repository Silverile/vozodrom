import fs from 'node:fs';
import {cars} from './batch.mjs';
const [id,page,credit,licence,licenceUrl,second,variant,view,accessories]=process.argv.slice(2);
const c=cars.find(c=>c.id===id);const html=fs.readFileSync(c.folder+'/source-page.html','utf8');
const image=fs.existsSync(c.folder+'/download.json')?JSON.parse(fs.readFileSync(c.folder+'/download.json','utf8')).url:html.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)[1].replaceAll('&amp;','&');
const a={...c,referencePage:page,image,credit,licence,licenceUrl,evidence:[page,second],variant,view,accessories,gate:'pass; second reviewer required'};
fs.writeFileSync(c.folder+'/reference-audit.json',JSON.stringify(a,null,2));
fs.writeFileSync(c.folder+'/info.txt',`ID: ${id}\nZnačka: AC Cars\nModel: ${c.model}\nGenerace: ${c.generation}\nRoky: ${c.years}\nPage: ${page}\nImage: ${image}\nCredit: ${credit}\nLicence: ${licence}\nLicence URL: ${licenceUrl}\nEvidence: ${page}\nEvidence: ${second}\nView: ${view}\nVariant: ${variant}\nAccessories: ${accessories}\nDrawing: AI-generated transformation; unchanged built-in ImageGen output.\n`);
