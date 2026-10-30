import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {markUnknowns} from './night-card-helpers.mjs';
const files=['analysis/codex/photo-credit-audit-44.json','analysis/codex/photo-credit-rest-audit-44.json'];
const normalize=url=>decodeURIComponent(url).replace(/^http:/,'https:');
const evidence=new Map();
for(const p of files){if(!fs.existsSync(p))continue;const r=JSON.parse(fs.readFileSync(p,'utf8'));for(const e of [...(r.corrections||[]),...(r.bmwSupplement?.corrections||[])])if(e.actual){const key=normalize(e.url);if(evidence.has(key)&&JSON.stringify(evidence.get(key))!==JSON.stringify(e.actual))throw Error('Conflicting exact-file credit evidence '+key);evidence.set(key,e.actual);}}
export function correctPhotoCredit(photo){if(!photo?.url)return false;const actual=evidence.get(normalize(photo.url));if(!actual)return false;const fields={...actual,credit:`${actual.author} / Wikimedia Commons / ${actual.licence}`};let changed=false;for(const[k,v]of Object.entries(fields))if(photo[k]!==v){photo[k]=v;changed=true;}return changed;}
export function applyPhotoCreditEvidence(cards){let count=0;for(const c of cards){let changed=false;for(const[i,g]of c.generations.entries())if(correctPhotoCredit(g.photo)){count++;changed=true;const prefix=`generations[${i}].photo.licenceUrl`;c.needsReview=c.needsReview.filter(r=>r.field!==prefix);}if(changed)markUnknowns(c);}return count;}
export function nonCreditHash(card){const c=structuredClone(card);for(const g of c.generations)if(g.photo)for(const k of['author','licence','licenceUrl','credit'])delete g.photo[k];c.needsReview=c.needsReview.filter(r=>!/^generations\[\d+\]\.photo\.licenceUrl$/.test(r.field));return createHash('sha256').update(JSON.stringify(c)).digest('hex');}
