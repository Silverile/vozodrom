import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a07-sources.json'));
const specs=[
['standard-6--1','Standard 6','Standard 6A / 6S','1928–1934','Standard 6S','MHV Adler Standard 6S 1928 01.jpg','1928 Standard 6S saloon, tall original radiator and twin-bar bumper','https://www.deutsches-museum.de/verkehrszentrum/ausstellungen/stadtverkehr','Public domain','https://commons.wikimedia.org/wiki/Commons:Public_domain','Front three-quarter; complete front, both headlights and bumper ends visible. Remove exhibition chain, later indicators and interior. Source original is only 751px wide.'],
['standard-6--2','Standard 6','Standard 6','1933–1934','Standard 6 3U'],
['standard-8--0','Standard 8 / Achtzylinder','Standard 8 15/70 PS','1928–1930','Standard 8 15-70'],
['standard-8--1','Standard 8 / Achtzylinder','Standard 8 15/80 PS','1931–1933','Standard 8 15-80'],
['standard-8--2','Standard 8 / Achtzylinder','Achtzylinder','1933–1934','Achtzylinder'],
['trumpf--0','Trumpf','Trumpf 1,5 / 1,7 AV','1932–1936','Trumpf AV','Adler AV 1.7 1934 (6957567823).jpg','1934 1.7 AV Karmann cabriolet, lowered roof','https://traumautoarchiv.de/html/2333.html','CC BY 2.0','https://creativecommons.org/licenses/by/2.0/','Front three-quarter; grille, bonnet, both lamps and bumper corners visible. Display poles, rope, signs and interior to omit.'],
['trumpf--1','Trumpf','Trumpf Sport','1933–1935','Trumpf Sport'],
['trumpf--2','Trumpf','Trumpf 1,7 EV','1936–1938','Trumpf EV'],
['trumpf-junior--0','Trumpf Junior','Trumpf Junior','1934–1935','Trumpf Junior 1G','Adler Trumpf Junior 1934 im Museum Knittlingen (1).JPG','1934 1G two-door cabrio-limousine, closed fabric roof','https://www.museum.de/museen/walters-oldtimer-knittlingen','CC BY-SA 3.0 DE','https://creativecommons.org/licenses/by-sa/3.0/de/','Front three-quarter; complete grille, both headlights, bonnet and bumper ends visible. Thin display rope below bumper, foreground sign outside car; omit later indicators and windscreen placard.'],
['trumpf-junior--1','Trumpf Junior','Trumpf Junior Sport','1935–1937','Trumpf Junior Sport','1935 Adler Trumpf Junior Sport (16330167578).jpg','1935 two-seat Sport roadster with cycle front wings, roof lowered','https://traumautoarchiv.de/html/2332.html','CC BY 2.0','https://creativecommons.org/licenses/by/2.0/','Front three-quarter; full radiator, both headlights, bonnet and cycle wings visible. Factory bumperless roadster; omit later indicators, plate characters, display placard and interior.'],
['trumpf-junior--2','Trumpf Junior','Trumpf Junior','1936–1941','Trumpf Junior 1E','Adler Trumpf Junior 1939.jpg','1939 1E Ambi-Budd cabrio-limousine, closed fabric roof','https://www.classic-trader.com/uk/cars/search/adler/trumpf','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Near head-on; complete front, both lamps and bumper corners. Omit later indicators, characters and interior.'],
['vis-a-vis--0','Vis-à-Vis','Vis-à-Vis 3,5 PS','1900–?','Vis-a-Vis 3.5']
];
const reasons={
'standard-6--2':'Searched Commons Standard 6 category and web Adler Standard 6 3U 1933 front. Commons photos identify older tall-frame cars; Bridgeman 1933 image is explicitly a side view. No complete-front photo independently confirmed as 3U.',
'standard-8--0':'Searched Standard 8 1929 photograph and 15/70. Schlenger historical photo has tentative identity (Indizienbeweis) and no exact model-year confirmation; cannot distinguish 15/70 from 15/80 with two independent sources.',
'standard-8--1':'Searched Standard 8 1931 photo, Commons and Gropius/Buhne examples. Found licensed stock listings and all-rights-reserved Flickr photo but no independently confirmed full-front reference inspected. No qualifying reference selected.',
'standard-8--2':'Searched Adler Achtzylinder 1933 foto, Standard 8 sources and car.info generation page (no user images). No complete-front photograph independently identified as 1933–1934 low-frame Achtzylinder.',
'trumpf--1':'Searched Adler Trumpf Sport 1933/1934/1935, Commons Trumpf category and car.info. Most results are Junior Sport or later Super Trumpf racing cars. No complete-front photo independently identified as 1933–1935 1.7 Sport.',
'trumpf--2':'Downloaded and visually checked Commons Adler Trumpf 1.7 EV.jpg and EV Karmann 1937.jpg: both are side views, rejected. Searched 1937 EV Karmann and film-autos; no qualifying replacement selected.',
'vis-a-vis--0':'Searched Adler Vis a vis 1900 3.5 / 3,5, Commons and museum sources. Available museum cars are later 4.5 PS steering-wheel model; Auta5P and Traumautoarchiv distinguish it from 3.5 PS tiller model. No exact early-model front photo found.'};
const rows=specs.map(([slug,model,generation,years,short,file,variant,ev,licence,licenceUrl,view])=>{
 const r={id:'adler--'+slug,make:'Adler',model,generation,years,status:file?'failed':'no-reference',folder:file?root+'/staged/adler/adler--'+slug+' '+short:null,referencePage:null,licence:licence||null,evidence:[],variant:variant||null,view:view||null,genSeconds:0,notes:reasons[slug]||'Reference passed visual and identity gate; generation pending.'};
 if(file){const s=sources.find(x=>x.file===file);Object.assign(r,{referencePage:s.referencePage,image:s.image,credit:s.credit,referenceWidth:s.width,licenceUrl,evidence:[s.referencePage,ev],promptSuffix:`Adler ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});fs.mkdirSync(r.folder,{recursive:true});fs.copyFileSync(s.local,r.folder+'/reference.jpg');fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: Adler\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${licence}\nLicence URL: ${licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${view}\nVariant: ${variant}\n`);}
 return r;
});
fs.writeFileSync(root+'/a-07-results.json',JSON.stringify(rows,null,2));
