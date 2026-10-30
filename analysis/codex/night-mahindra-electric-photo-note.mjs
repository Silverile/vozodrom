import fs from'node:fs';
const note='Prohlédnut celý vůz s okolním prostorem. Jasný boční profil jako výslovná náhrada za preferovaný přední tříčtvrteční pohled; poměr stran1.43. Jde o čtyřdveřový e2oPlus. Snímek je vCommons již publikován jako ořez; žádný další ořez se neprovádí.';
const p='src/data/catalog/model-cards/mahindra-electric.json',cs=JSON.parse(fs.readFileSync(p));cs.find(c=>c.lineSlug==='e2o-plus').generations[0].photo.reviewNoteCs=note;fs.writeFileSync(p,JSON.stringify(cs,null,2)+'\n');
const f='analysis/codex/night-mahindra-electric-finish.mjs',s=fs.readFileSync(f,'utf8');fs.writeFileSync(f,s.replace(/c\.generations\[0\]\.photo\.reviewNoteCs='[^']*'/,'c.generations[0].photo.reviewNoteCs='+JSON.stringify(note)));
