import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='analysis/codex/letter-a',db=root+'/a-10-results.json',rows=JSON.parse(fs.readFileSync(db));
const times={"15":16.613,"90":26.57,"145":13.241,"146":17.219,"155":27.097,"164":16.963,"166":27.281,"1900":15.882,"2000":26.256,"2600":29.178,"20ES":13.999};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const r of rows){
 if(r.id==='alfa-romeo--20-30-hp--0'){
  Object.assign(r,{status:'no-reference',folder:null,referencePage:null,licence:null,evidence:[],variant:null,view:null,genSeconds:0,referenceGate:'reject',notes:'Searched Commons Alfa Romeo 20/30 HP category, 1914/1915/1920 HP/E photos, museum 20/30 ES history, ViaRetro Ramponi archive and early Alfa histories. Period Ramponi photograph is ambiguously captioned 24 HP (20-30 HP), has a cropped near front tyre and people obscuring the body; rejected. Modern red museum touring photos verified as later rounded-radiator ES, not HP/E. No complete-front photo with exact HP/E identity confirmed independently; no generation.',searchedUrls:['https://commons.wikimedia.org/wiki/Category:Alfa_Romeo_20/30_HP','https://commons.wikimedia.org/wiki/File:1919_A.L.F.A._24_HP_(20-30_HP)_Ramponi.jpg','https://viaretro.com/2014/03/giulio-ramponi-more-than-a-smiling-face/','https://www.museoalfaromeo.com/en-us/news/Pages/EventArchive2020/2030-ES.aspx']});continue;
 }
 if(r.status!=='done')throw Error('Incomplete '+r.id);
 r.referenceGate='pass';r.review='Codex reference and drawing visual checks passed; independent Claude review pending';
 r.promptSource='analysis/codex/abarth-drawings/prompt.txt';
 r.genSeconds=times[r.id==='alfa-romeo--20-30-hp--1'?'20ES':r.id==='alfa-romeo--15-20-hp--0'?'15':r.id==='alfa-romeo--2000-historic--0'?'2000':r.model];
 r.attempts=r.id==='alfa-romeo--2600--0'?2:1;
 r.notes='Built-in image_gen only; verbatim Abarth prompt followed by recorded generation suffix; unedited PNG. Front elevation, correct body/wheel layout, no readable text, wipers, antenna or major add-ons. Minor lamp/grille details accepted under batch policy.';
 if(r.id==='alfa-romeo--90--0')r.notes+=' First 1986 Super candidate rejected before generation: far headlight hidden. Replaced with complete-front 1986 V6 photograph.';
 if(r.id==='alfa-romeo--145--0')r.notes+=' First candidate rejected before generation: bumper corner cropped. Replacement source original is 1024px wide.';
 if(r.id==='alfa-romeo--2600--0'){r.notes+=' One visual regeneration because small auxiliary fog lamps were retained. Both attempts retain them; first kept for better proportions, marked done under the explicit acceptance threshold for small lamp deviations. Claude should inspect this detail.';r.alternateGeneratedSource='C:/Users/Sevedge Anywhere/.codex/generated_images/01a18a88-9705-7b71-8907-0fc0792399c0/exec-6f7f882c-219c-4ff8-b0ae-28835fd7af9d.png';}
 if(r.id==='alfa-romeo--15-20-hp--0')r.notes+=' Selected documented 1911 15 HP Corsa four-baquet member of unresolved family. No windscreen/bumper on source; cowl lanterns retained; small lighting details accepted.';
 if(r.id==='alfa-romeo--20-30-hp--1'){r.originalImage=r.image;const u=new URL(r.image),p=u.pathname.split('/');p.splice(3,0,'thumb');u.pathname=p.join('/')+'/1280px-'+p.at(-1);r.image=u.href;r.notes+=' Original HTTP 429; waited Retry-After once, then successfully downloaded 1280px thumbnail. Museum reference confirms ES rounded radiator, distinct from earlier HP/E.';}
 if(r.id==='alfa-romeo--2000-historic--0')r.notes+=' Selected common Berlina sedan body within Tipo 102 family. Thin show ribbon/placard omitted, bonnet closed in drawing.';
 const file=r.folder+'/'+r.id+'.png',m=await sharp(file).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.format!=='png'||m.width!==1536||m.height!==1024)throw Error('dimensions '+r.id);
 if(hash(file)!==hash(r.generatedSource))throw Error('modified image '+r.id);
 if(ref.width<1000)throw Error('small reference '+r.id);
 if(r.evidence.length!==2||r.evidence.some(x=>!x?.startsWith('https://')))throw Error('evidence '+r.id);
 r.referenceWidth=ref.width;
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
 console.log(r.id,'1536x1024 PNG','SHA256 match','reference '+ref.width+'px');
}
if(rows.length!==12||rows.filter(r=>r.status==='done').length!==11)throw Error('bad counts');
fs.writeFileSync(db,JSON.stringify(rows,null,2));
console.log('11 done; 1 no-reference. Image generation seconds:',rows.reduce((n,r)=>n+r.genSeconds,0).toFixed(3));
console.log('CHANGED FILES',JSON.stringify([db,...fs.readdirSync(root).filter(n=>n.startsWith('a10-')).map(n=>root+'/'+n),...fs.readdirSync(root+'/raw').filter(n=>n.startsWith('a10-')).map(n=>root+'/raw/'+n),...rows.filter(r=>r.folder).flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])],null,2));
