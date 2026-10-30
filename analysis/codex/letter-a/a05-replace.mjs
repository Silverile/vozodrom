import fs from 'node:fs';
const out='analysis/codex/letter-a/a-05-results.json',rows=JSON.parse(fs.readFileSync(out));
const files={'acura--slx--0':'1997 Acura SLX in Satin Silver Metallic, front right, 08-06-2022.jpg','acura--tl--3':'2009 maroon Acura TL SH-AWD Tech front.JPG','acura--tlx--0':'2015 Acura TLX (front left).jpg','acura--tlx--1':'2021 Acura TLX SH-AWD, front 4.1.21.jpg'};
for(const r of rows)if(files[r.id]){r.file=files[r.id];r.referencePage='https://commons.wikimedia.org/wiki/File:'+r.file.replaceAll(' ','_');r.evidence[0]=r.referencePage;r.view='pending replacement visual gate';if(r.id==='acura--tl--3')r.variant='2009 SH-AWD Technology sedan, original shield front';if(r.id==='acura--tlx--0')r.variant='2015 2.4 sedan, original pre-facelift front';if(r.id==='acura--tlx--1')r.variant='2021 SH-AWD sedan, original second-generation front';}
fs.writeFileSync(out,JSON.stringify(rows,null,2));
