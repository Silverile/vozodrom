import fs from 'node:fs';import crypto from 'node:crypto';import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-11-results.json',a=JSON.parse(fs.readFileSync(db));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const r of a){if(r.status==='no-reference')continue;if(r.status!=='done')throw Error('Incomplete '+r.id);const d=r.folder+'/'+r.id+'.png',m=await sharp(d).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('dimensions '+r.id);if(hash(d)!==hash(r.generatedSource))throw Error('modified '+r.id);if(ref.width<1000)throw Error('small reference '+r.id);
 r.referenceWidth=ref.width;r.referenceGate='pass';r.review='Codex reference and output visual review passed; Claude independent review pending';r.promptSource='analysis/codex/abarth-drawings/prompt.txt';r.notes='Built-in image_gen only, verbatim prompt plus recorded generation suffix; unedited PNG. Complete front reference; no readable text, wipers, antenna or major add-ons in selected drawing. Minor lamp and grille deviations accepted under batch policy.';
 if(r.id==='alfa-romeo--6c--0')r.genSeconds=25.897;
 if(r.id==='alfa-romeo--6c--1'){r.attempts=2;r.notes+=' One visual regeneration for faint grille lettering in attempt 1; second retained.';}
 if(r.id==='alfa-romeo--24-hp--0')r.notes+=' Original side-on candidate rejected. Selected Castagna Torpedo with brass main and cowl lamps; horn and museum surroundings omitted.';
 if(r.id==='alfa-romeo--6c--2')r.notes+=' Rejected blue 255 YUB reference before generation: known modern Touring-style rebody. Selected Castagna cabriolet instead.';
 if(r.id==='alfa-romeo--6c--3')r.notes+=' Tight front detail candidate rejected; selected complete-front factory 1935 Berlina.';
 if(r.id==='alfa-romeo--8c-competizione--0'){r.view='Head-on; full front and both bumper corners visible. Windshield event placards and stickers omitted.';r.notes+=' First angled source rejected: far bumper corner hidden.';}
 if(r.id==='alfa-romeo--alfasud--0'){r.variant='1974 four-door Berlina, original rectangular-headlamp fascia';r.licence='Public domain';}
 if(r.id==='alfa-romeo--alfetta--0')r.variant='Early four-round-headlamp Berlina, chrome bumper';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: Alfa Romeo\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);console.log(r.id,'PASS 1536x1024 PNG; original SHA256 matches; reference '+ref.width+'px');
}
fs.writeFileSync(db,JSON.stringify(a,null,2));console.log('11 done; 1 no-reference; generation seconds',a.reduce((n,r)=>n+r.genSeconds,0).toFixed(3));
console.log('FILES',JSON.stringify([db,...fs.readdirSync(root).filter(n=>n.startsWith('a11-')).map(n=>root+'/'+n),...fs.readdirSync(root+'/raw').filter(n=>n.startsWith('a11-')).map(n=>root+'/raw/'+n),...a.filter(r=>r.folder).flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/info.txt',r.folder+'/'+r.id+'.png'])]));

