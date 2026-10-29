import fs from 'node:fs';
const d='analysis/sweep/codex/',p=d+'bentley.json',r=JSON.parse(fs.readFileSync(p,'utf8'));
const rows=[
 {lineSlug:'arnage',path:'generations[0].photo',result:'retain-generation-illustration',sources:['https://commons.wikimedia.org/w/index.php?title=File:2003_Bentley_Arnage_T_in_Jupiter,_FL_(front_right).jpg&oldid=1279645060'],evidence:'Description explicitly identifies2003 Arnage T old face; categories Arnage(1998) and2003 Bentley automobiles fit1998–2009 generation. Author Jagvar public-domain release matches existing credit. No new image inspection.'},
 {lineSlug:'continental-gt',path:'generations[2].photo',result:'retain-generation-illustration',sources:['https://commons.wikimedia.org/w/index.php?title=File:Bentley_Continental_GT_(3rd_gen.)_IMG_2929.jpg&oldid=1084616474'],evidence:'Description explicitly identifies third-generation Continental GT; current category narrows to GT V8(2019–2024), consistent with2018–2024 broad third-family row. Author Alexander Migl and CC BY-SA4.0 match credit. Does not independently prove exact photographed trim or2018 start.'},
 ...[
 ['continental-gt','generations[0].photo','https://commons.wikimedia.org/wiki/File:2005_Bentley_Continental_GT_(6238387241).jpg'],
 ['continental-gt','generations[1].photo','https://commons.wikimedia.org/wiki/File:Bentley-continental-gt-v8s-mulliner-driving-spec-vat-qualifying-234224106-1.jpg'],
 ['flying-spur','generations[2].photo','https://commons.wikimedia.org/wiki/File:Bentley_Flying_Spur_(2019)_Retro_Classics_2020_IMG_0141.jpg'],
 ['mulsanne','generations[1].photo','https://commons.wikimedia.org/wiki/File:2015_Bentley_Mulsanne_Speed_V8_Auto.jpg'],
 ['turbo-r','generations[0].photo','https://commons.wikimedia.org/wiki/File:Bentley_Turbo_R_at_Legendy_2018_in_Prague.jpg']
 ].map(([lineSlug,path,url])=>({lineSlug,path,result:'unverified-retrieval-failed',sources:[url],evidence:'Direct web opening returned cache miss or inaccessible URL. Filename alone is insufficient for identity certification; card photo and historical visual review preserved.'}))
];
r.photoReviews.push(...rows.map(row=>({round:8,checkedAt:'2026-10-29',method:'Commons file-description/category/credit audit; no new visual inspection',...row})));
fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n');
console.log('Bentley: 3 metadata-supported photo identities in total, 5 retrieval failures; no newly visual-certified photos.');
