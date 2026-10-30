import fs from 'node:fs';
const p='analysis/codex/letter-a/a-10-results.json',rs=JSON.parse(fs.readFileSync(p));
for(const r of rs){
 if(r.id==='alfa-romeo--2600--0'){r.view='Front three-quarter; entire bonnet, four headlamps and both bumper corners visible. Two yellow rectangular auxiliary fog lamps must be omitted; factory bonnet scoop retained.';r.credit='Herranderssvensson';}
 if(r.id==='alfa-romeo--2000-historic--0')r.view='Front three-quarter; both main headlamps, standard lower lamps, bonnet and bumper corners visible. Thin show ribbon runs in front of lower bumper/plate; omit ribbon, stake and adjacent cars. Bonnet slightly unlatched; draw closed.';
 if(r.id==='alfa-romeo--15-20-hp--0')r.view='Front three-quarter; complete radiator, bonnet, two main lamps, two cowl lanterns, both mudguards and full front axle/wheels visible. Factory four-baquet open body without windscreen or bumper. Omit racing number and radiator lettering; cowl lanterns are period fitted lighting.';
 if(r.folder)fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
}
fs.writeFileSync(p,JSON.stringify(rs,null,2));
