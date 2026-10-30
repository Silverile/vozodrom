import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='analysis/codex/letter-a',out=root+'/a-06-results.json',rows=JSON.parse(fs.readFileSync(out)),decisions=JSON.parse(fs.readFileSync(root+'/a06-decisions.json'));
const gallery='https://vorkriegs-klassiker-rundschau.blog/bildergalerie-nach-marken-3/adler-automobile/';
const gaps={
4:{notes:'Searched Commons, historical Adler gallery, 2021 Saubere Arbeit article and Klasika registration article. Inspected two postwar 9/24–9/30 photographs: far headlamp/fender cropped. Other search hit is 1914, wrong prewar generation. No inspected reference passes full-front gate.',evidence:[gallery,'https://vorkriegs-klassiker-rundschau.blog/2021/07/14/saubere-arbeit-adler-9-24-und-9-30-ps/','https://klubasklasika.lt/2022/03/28/autovezimiai-birzu-apskrityje/']},
5:{notes:'Searched Commons Diplomat category and historical Adler gallery for 1934 original body. Inspected dated 1934 saloon and cabriolet photographs: both essentially side-on, far front hidden. Commons Papler 1935 has revised grille; woodgas 3GS has obstructing conversion. No early-generation full-front reference confirmed.',evidence:[gallery,'https://commons.wikimedia.org/wiki/Category:Adler_Diplomat','https://de.wikipedia.org/wiki/Adler_Diplomat']},
8:{notes:'Searched Commons Favorit category, 2U-specific web search, original manual listing and historic gallery. Available Commons photos identify 1930 8J or 1929–1933 8/35 taxi, not 1933–1934 2U. No full-front photograph confidently assigned to 2U.',evidence:['https://commons.wikimedia.org/wiki/Category:Adler_Favorit','https://verwuester.net/collections/adler/products/favorit-8-40-ps-standard-6-12-60-ps-mit-schwingachse-vorn',gallery]},
10:{notes:'Searched Commons Primus category, Primus E/1937/1938 web queries, historical gallery and catalogue data. Photographs located identify 1932 or 1934 A. 1937-dated auction snapshot does not establish the car as E rather than an older A. No generation-confirmed E full-front reference.',evidence:['https://commons.wikimedia.org/wiki/Category:Adler_Primus','https://de.wikipedia.org/wiki/Adler_Primus',gallery]},
11:{notes:'Searched Commons Standard 6 category and historical gallery. Commons museum car explicitly 6S (neighbour generation); DEFA vehicle described as 1929–1933 with uncertain engine; Standard 6.jpg is an illustration, not photograph. Historic early-1927–1930 labels do not distinguish 10N from 6A/6S in overlapping years. No exact 10N reference confirmed by two sources.',evidence:['https://commons.wikimedia.org/wiki/Category:Adler_Standard_6','https://commons.wikimedia.org/wiki/File:MHV_Adler_Standard_6S_1928_01.jpg',gallery]}
};
fs.mkdirSync(root+'/rejected',{recursive:true});
for(const [i,r] of rows.entries()){
 if(gaps[i]){Object.assign(r,gaps[i],{searches:gaps[i].evidence,status:'no-reference'});continue;}
 const d=decisions[i];Object.assign(r,{status:d.status,notes:d.notes,genSeconds:d.genSeconds,review:'pending Claude independent review',attempts:[]});
 if(i===3)r.licenceUrl='https://vorkriegs-klassiker-rundschau.blog/copyright-note/';
 if(i===6)r.view='Near head-on; complete front. Auxiliary lamps, rally badges and later indicators to omit. Side spare wheels are period equipment; factory status not established.';
 for(const [n,p] of d.outputs.entries()){
  const selected=d.status==='done'&&n===d.outputs.length-1;
  const dest=selected?r.folder+'/'+r.id+'.png':root+'/rejected/a06-'+r.id+'-'+(n+1)+'.png';
  fs.copyFileSync(p,dest);if(selected)r.originalOutput=p;else r.attempts.push(dest);
 }
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: Adler\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
}
fs.writeFileSync(out,JSON.stringify(rows,null,2));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const r of rows){
 if(r.folder){const info=fs.readFileSync(r.folder+'/info.txt','utf8');if(!info.includes('Generace: '+r.generation)||r.evidence.length<2||!r.licence)throw Error('Metadata '+r.id);r.referenceWidth=(await sharp(r.folder+'/reference.jpg').metadata()).width;if(r.referenceWidth<1000)throw Error('Reference resolution '+r.id);}
 if(r.status==='done'){const p=r.folder+'/'+r.id+'.png',m=await sharp(p).metadata();if(m.width!==1536||m.height!==1024||hash(p)!==hash(r.originalOutput))throw Error('Drawing '+r.id);}
 console.log(r.id,r.status,r.referenceWidth||'-');
}
fs.writeFileSync(out,JSON.stringify(rows,null,2));
