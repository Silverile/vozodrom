import {attrs} from './crawl_front_carswp.mjs';
import {links,sha,Stop} from './front_source_client.mjs';
import {modelScore} from './front_catalog.mjs';

const decode=s=>s.replaceAll('&quot;','"').replaceAll('&#34;','"').replaceAll('&#39;',"'").replaceAll('&amp;','&');
const cache=new WeakMap();
async function published(client,url){client.hosts.add(new URL(url).hostname);return client.get(url);}
async function script(client,url){let store=cache.get(client);if(!store){store=new Map();cache.set(client,store);}if(!store.has(url))store.set(url,await published(client,url));return store.get(url);}
export function toyotaState(html){
 for(const m of html.matchAll(/<div\b[^>]*id="[^"]+-data"[^>]*>([\s\S]*?)<\/div>/g)){
  try{const o=JSON.parse(decode(m[1]));if(o.commonSettings&&o.car?.model)return o;}catch{}
 }return null;
}
export function toyotaFrameUrls(state,js){
 if(!js.includes('t.getCarImage=(e,t,n,r={},a={},l=o.ImageMode.Exterior)')||!js.includes('n,r=36,o)'))throw new Stop('Toyota published frame builder changed; review required');
 const {commonSettings:s,car:c}=state,entry=Object.values(s.modelMap||{}).find(x=>x.id===c.model.id);
 if(!entry?.token||!s.enableTokens||s.query?.disableTokens||!c.id||!c.colour?.code)return [];
 // Reproduce the published SDK default options and integer 0..35 spin range.
 // No downloaded JavaScript is executed. No unpublished path/angle is probed.
 const base=new URL(s.ccisPath.startsWith('//')?'https:'+s.ccisPath:s.ccisPath).href.replace(/\/$/,'');
 return Array.from({length:36},(_,frame)=>({frame,url:`${base}/${s.country}/product-token/${entry.token}/vehicle/${c.id}/width/1140/height/426/scale-mode/1/padding/0/image-quality/75/day-exterior-${frame}_${c.colour.code}.jpg`}));
}
export async function configuratorFrames(html,page,g,client){
 if(g.makeSlug==='skoda'){
  const tag=html.match(/<div\b[^>]*data-module="vizualizer2-module"[^>]*>/)?.[0];if(!tag)return [];
  const config=JSON.parse(decode(attrs(tag)['data-props'])).viewModel;
  const cc=links(html,page).find(l=>new URL(l.url).hostname==='clg.skoda-auto.com'&&new URL(l.url).searchParams.get('tool')==='CC3');if(!cc)return [];
  const parameters=new URL(cc.url).searchParams,bid=parameters.get('bid'),culture=parameters.get('culture');
  if(!/^\d+$/.test(bid)||!/^[-a-zA-Z]+$/.test(culture)||!/^[-a-z0-9]+$/.test(config.slug))return [];
  const jsUrl=new URL(config.sourceUrl,config.baseUrl).href,js=await script(client,jsUrl);
  if(!js.body.includes('this.target,this.baseName,"api"')||!js.body.includes('uf("data",{slug:e})')||!js.body.includes('uf("exteriorImages",e)'))throw new Stop('Skoda published visualizer builder changed; review required');
  const api=new URL(`${bid}/${culture}/api/`,config.baseUrl.endsWith('/')?config.baseUrl:config.baseUrl+'/');
  const dataUrl=new URL('data',api);dataUrl.searchParams.set('slug',config.slug);
  const dataResponse=await published(client,dataUrl.href),d=JSON.parse(dataResponse.body);
  if(!d.active||!modelScore(d.carName,g,g.makeSlug)||!d.colors?.length||!d.wheels?.length)return [];
  const frameUrl=new URL('exteriorImages',api);
  for(const [k,v]of Object.entries({device:'desktop',scene:d.scene,salesGroup:d.salesgroup,mbvCode:d.mbvCode,colorPrCode:d.colors[0].prCode,wheelPrCode:d.wheels[0].prCode}))frameUrl.searchParams.set(k,v);
  const response=await published(client,frameUrl.href),frames=JSON.parse(response.body).src;
  if(!Array.isArray(frames)||frames.length!==d.frames||frames.some(u=>typeof u!=='string'||!u.startsWith('https://')))throw new Stop('Unrecognized published Skoda frame list');
  const preferred=[33,32,34,31,35,0,30,1,29,2,28,3,27,4,26,5,25,6,24,7];
  return frames.map((url,frame)=>({url,frame,title:`${g.line} visualizer frame ${frame}`,rank:500-Math.max(0,preferred.indexOf(frame)>=0?preferred.indexOf(frame):30+frame),width:null,extraction:'published-360-frame-list',configurator:true,frontTitled:false,
   angleEvidence:'Frame 33 visually frontal in Fabia IV sample; camera height and other models require selection',configurationPage:page,frameListPage:response.url,frameListSha256:response.sha256,builderPage:jsUrl,builderSha256:js.sha256,modelYear:d.modelYear})).sort((a,b)=>b.rank-a.rank);
 }
 if(g.makeSlug==='toyota'){
  const cc=links(html,page).find(l=>new URL(l.url).hostname===new URL(page).hostname&&/\/konfigurator$/.test(new URL(l.url).pathname));
  if(!cc)return [];
  const config=await published(client,cc.url),state=toyotaState(config.body);
  if(!state||!modelScore(state.car.model.name,g,g.makeSlug))return [];
  const jsUrl=config.body.match(/require\(\["(https:\/\/[^"\s]+car-config-toyota[^"\s]+\.js)"\]/)?.[1];if(!jsUrl)return [];
  const js=await script(client,jsUrl),frames=toyotaFrameUrls(state,js.body);
  const preferred=[0,1,35,2,34,3,33,4,32,5,31,6,30,7,29,8,28,9,27,10];
  return frames.map(f=>({...f,title:`${g.line} configurator frame ${f.frame}`,rank:500-(preferred.indexOf(f.frame)>=0?preferred.indexOf(f.frame):40+f.frame),width:1140,extraction:'published-sdk-frame-builder',configurator:true,frontTitled:false,angleEvidence:'Published 36-frame SDK range; viewing angle requires selection',configurationPage:config.url,builderPage:jsUrl,builderSha256:js.sha256,stateSha256:sha(JSON.stringify(state))})).sort((a,b)=>b.rank-a.rank);
 }
 return [];
}
