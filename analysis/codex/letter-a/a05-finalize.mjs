import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='analysis/codex/letter-a',out=root+'/a-05-results.json',rows=JSON.parse(fs.readFileSync(out));
const decisions=JSON.parse(fs.readFileSync(root+'/a05-decisions.json'));
const failed=(outputs,genSeconds,notes='Both allowed attempts retain Acura A/caliper detail inside badge; hard rule 4. Regeneration exhausted.')=>({status:'failed',outputs,genSeconds,notes});
Object.assign(decisions,{
 'acura--slx--0':{status:'done',output:'exec-2d2a0f31-1957-4fd1-af3e-6309788ccda8.png',outputs:['exec-9f8a424d-1152-452f-99e8-b4d1c81758bb.png'],genSeconds:37.469,notes:'One regeneration: first retained A badge; selected retry has empty oval. Factory fog lamps retained. Claude independent review pending.'},
 'acura--tlx--0':failed(['exec-2e42b3cc-7df6-4382-83d4-b9df7cf56e35.png','exec-bb4efe32-1f1e-4d9e-9153-8e996c799f86.png'],27.385),
 'acura--tsx--1':failed(['exec-be2dd999-ea6e-4d23-a786-9f369aef6eed.png','exec-8277b6ba-1cf1-4e16-a891-0914ecfc3165.png'],36.745),
 'acura--zdx--0':failed(['exec-f8444dc4-151a-4626-a678-7baee86af909.png','exec-c2bceb04-575b-4691-ad82-01fc95e20322.png'],26.437),
 'acura--zdx--1':failed(['exec-c49ca044-8844-4994-903c-c7013959696e.png','exec-7dc478be-45c8-4c27-a500-e93c14a89bf1.png'],31.608)
});
fs.writeFileSync(root+'/a05-decisions.json',JSON.stringify(decisions,null,2));
const base='C:/Users/Sevedge Anywhere/.codex/generated_images/01a18a49-b0e3-77e1-8511-9b763adcab81/';
fs.mkdirSync(root+'/rejected',{recursive:true});
for(const r of rows){
 const d=decisions[r.id];Object.assign(r,{status:d.status,genSeconds:d.genSeconds,notes:d.notes,review:'pending Claude independent review',referenceGate:'passed visual gate; independent review pending',view:r.id==='acura--tl--3'?'near head-on; full front visible, doors open':'front three-quarter; grille, both headlights, both bumper corners and bonnet visible',promptBase:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`Acura ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});
 r.attempts=[];
 for(const [i,name] of (d.outputs||[]).entries()){const dest=root+'/rejected/a05-'+r.id+'-'+(i+1)+'.png';fs.copyFileSync(base+name,dest);r.attempts.push(dest);}
 const dest=r.folder+'/'+r.id+'.png';
 if(d.status==='done'){r.originalOutput=base+d.output;fs.copyFileSync(r.originalOutput,dest);}else if(fs.existsSync(dest)){fs.unlinkSync(dest);}
 if(r.credit.startsWith('Bull-Doser'))r.licenceUrl='https://commons.wikimedia.org/wiki/Template:PD-user-en';
 if(r.credit.includes('National Highway'))r.licenceUrl='https://commons.wikimedia.org/wiki/Template:PD-USGov';
 const ref=await sharp(r.folder+'/reference.jpg').metadata();r.referenceWidth=ref.width;
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
}
fs.writeFileSync(out,JSON.stringify(rows,null,2));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const r of rows){const info=fs.readFileSync(r.folder+'/info.txt','utf8');if(!info.includes('Generace: '+r.generation)||r.evidence.length<2||r.referenceWidth<1000||!r.licence)throw Error('Metadata failure '+r.id);if(r.status==='done'){const dest=r.folder+'/'+r.id+'.png',m=await sharp(dest).metadata();if(m.width!==1536||m.height!==1024||hash(dest)!==hash(r.originalOutput))throw Error('Drawing verification failure '+r.id);}console.log(JSON.stringify({id:r.id,status:r.status,referenceWidth:r.referenceWidth,licence:r.licence,exactGeneration:true,unedited:r.status==='done'?true:null}));}
