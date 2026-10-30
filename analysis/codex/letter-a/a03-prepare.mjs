import fs from 'node:fs';
const file='analysis/codex/letter-a/a-03-results.json',rows=JSON.parse(fs.readFileSync(file,'utf8'));
for(const r of rows){
 r.view='front three-quarter; grille, both headlights, both bumper corners and bonnet visible';
 r.referenceGate='passed; pending Claude independent review';
 r.notes='No visible front add-ons; remove wipers, antenna, lettering and interior per exact base prompt. Unedited generated output only.';
 r.promptBase='analysis/codex/abarth-drawings/prompt.txt';
 r.promptSuffix=`Acura ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
 if(r.id==='acura--el--0')r.variant='1997–1998 1.6EL sedan, original front with amber corner indicators';
 if(r.id==='acura--integra--0')r.variant='1988–1989 first-generation 3-door hatchback facelift; retractable headlights closed';
 if(r.id==='acura--integra--2')r.variant='1998–2001 US-spec 3-door hatchback facelift; four round headlights and wide amber bumper signals';
 if(r.id==='acura--legend--1')r.variant='1991–1993 KA7 sedan, pre-facelift';
 if(r.id==='acura--integra--3')r.notes='Reference has red tow-hook accessory: omit it. No other visible front add-ons; remove lettering and interior per exact base prompt.';
 if(r.id==='acura--ilx--0')r.evidence[1]='https://acuranews.com/en-US/releases/release-81698aa263284cb7a904125201f2b161-2016-acura-ilx-overview';
 if(r.id==='acura--mdx--0'){r.evidence[1]='https://acuranews.com/en-US/releases/release-813047add5dcb3f1713443004c34c6a8-2003-acura-introduction';r.licence='CC BY-SA 2.0';r.licenceUrl='https://creativecommons.org/licenses/by-sa/2.0/';}
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
}
fs.writeFileSync(file,JSON.stringify(rows,null,2));
console.log('Prepared '+rows.length+' reference records.');
