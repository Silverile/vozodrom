import fs from 'node:fs';
const d='analysis/codex/photo-backfill-68';
const title="File:'09 Kia Sorento LX.JPG",u=new URL('https://commons.wikimedia.org/w/api.php');
u.search=new URLSearchParams({action:'query',format:'json',prop:'revisions',rvprop:'ids|content',rvslots:'main',titles:title,maxlag:'5'});
const response=await fetch(u,{headers:{'User-Agent':'VozodromCatalogResearch/1.0 (Commons metadata research)'}});
if(!response.ok)throw Error(response.status);
const j=await response.json(),page=Object.values(j.query.pages)[0],rev=page.revisions[0],text=rev.slots.main['*'];
fs.writeFileSync(d+'/permission-sorento.json',JSON.stringify({title,revision:rev.revid,text},null,2)+'\n');
console.log(text);
