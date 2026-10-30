import fs from 'node:fs';
const dir='analysis/codex/lincoln-evidence/photos';fs.mkdirSync(dir,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const ua='VozodromCatalogResearch/0.1 (+https://vozodrom.cz; factual catalogue curation)';
const targets=read(dir+'/'+(process.argv[2]||'targets-001.json'));
let candidates=fs.existsSync(dir+'/candidates.json')?read(dir+'/candidates.json'):[],log=[];
const metadata=fs.existsSync(dir+'/metadata-groups.json')?read(dir+'/metadata-groups.json'):[];
const offset=Number(process.argv[3]||0);
let last=0;
async function request(url){const ms=1100-(Date.now()-last);if(ms>0)await new Promise(r=>setTimeout(r,ms));last=Date.now();return fetch(url,{headers:{'User-Agent':ua}});}
outer:for(const [makeSlug,lineSlug,generationIndex,category]of targets){
 const p=new URLSearchParams({action:'query',format:'json',maxlag:'5',generator:'categorymembers',gcmtitle:'Category:'+category,gcmtype:'file',gcmlimit:'50',prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'640'});
 const url='https://commons.wikimedia.org/w/api.php?'+p,r=await request(url);log.push({category,url,status:r.status});console.log(category,r.status);
 if(!r.ok){if(r.status===429)break;continue;}
 const body=await r.json();if(body.error){log.push({category,error:body.error});if(body.error.code==='maxlag')break;continue;}
 const pages=Object.values(body.query?.pages||{}).filter(x=>{const i=x.imageinfo?.[0];return i&&i.width/i.height>=1.4&&i.width/i.height<=1.7&&/\.jpe?g$/i.test(x.title)&&!/rear|heck|interior|engine|detail|rally|tuning|badge|logo/i.test(x.title);});
 metadata.push({makeSlug,lineSlug,generationIndex,category,pages});fs.writeFileSync(dir+'/metadata-groups.json',JSON.stringify(metadata,null,2)+'\n');
 pages.sort((a,b)=>Number(/front|avant|vorne/i.test(b.title))-Number(/front|avant|vorne/i.test(a.title)));
 for(const page of pages.slice(offset,offset+3)){
  if(candidates.some(c=>c.title===page.title&&c.lineSlug===lineSlug&&c.generationIndex===generationIndex))continue;
  const ii=page.imageinfo[0],id=candidates.length;
  candidates.push({id,makeSlug,lineSlug,generationIndex,title:page.title,ii,metadataMethod:'Commons imageinfo API, 50-file category batch, maxlag5 and descriptive User-Agent.'});
  fs.writeFileSync(dir+'/candidates.json',JSON.stringify(candidates,null,2)+'\n');
  const im=await request(ii.thumburl.split('?')[0]);log.push({id,imageStatus:im.status});if(im.status===429)break outer;
  if(im.ok)fs.writeFileSync(dir+'/candidate-'+id+'.jpg',Buffer.from(await im.arrayBuffer()));
 }
}
fs.writeFileSync(dir+'/api-log-'+(process.argv[2]||'targets-001.json'),JSON.stringify(log,null,2)+'\n');if(!fs.existsSync(dir+'/candidates.json'))fs.writeFileSync(dir+'/candidates.json','[]\n');
