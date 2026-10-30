import {anchors,text,passenger}from'./crawl_shared.mjs';
const IMAGE=/\.(?:gif|jpe?g|png|bmp|webp)$/i;
const COMMERCIAL=/^(?:kamaz|hino|bedford|international|ifa|daf|steyr|tempo|raf|gr_rus|voen|tr)$/i;
function makeOf(url,bakk){const name=new URL(url).pathname.split('/').at(-1).replace(/\.html?$/i,'');if(!bakk)return name.toLowerCase().replace(/_/g,'-');const m=name.match(/^Draw_(?:inomarki_)?(.+)$/i);if(m)return m[1].toLowerCase().replace(/_/g,'-');return name.match(/^(vaz|gaz|zaz|uaz|azlk|moskvich)/i)?.[1].toLowerCase()||'unknown';}
function model(url){return decodeURIComponent(new URL(url).pathname.split('/').at(-1)).replace(/\.(gif|jpe?g|png|bmp|webp)$/i,'');}
function actualMake(title,fallback){
 const groups=[['chevrolet',/chevrolet|шевроле/i],['luaz',/luaz|луаз/i],['kim',/\bkim\b|ким\s*[-\d]/i],['ford',/\bford\b|форд/i],['opel',/\bopel\b|опель/i],['volkswagen',/volkswagen|фольксваген/i],['vaz',/\bvaz\b|ваз|\blada\b|лада/i],['gaz',/\bgaz\b|газ/i],['zaz',/\bzaz\b|заз/i],['uaz',/\buaz\b|уаз/i],['moskvich',/moskvich|москвич|азлк|\bazlk\b/i],['bmw',/\bbmw\b/i],['mercedes-benz',/mercedes|мерседес/i],['toyota',/toyota|тойота/i],['volvo',/\bvolvo\b|вольво/i],['audi',/\baudi\b|ауди/i],['renault',/renault|рено/i],['citroen',/citroen|ситроен/i],['peugeot',/peugeot|пежо/i],['fiat',/\bfiat\b|фиат/i],['skoda',/skoda|шкода/i],['tatra',/tatra|татра/i],['zil',/\bzil\b|зил/i],['zis',/\bzis\b|зис/i]];
 for(const [make,re]of groups)if(re.test(title))return make;
 return /^(unknown|inomarki|dr|draw)$/i.test(fallback)?null:fallback;
}
export function narod(id){
 const bakk=id==='bakkirill',origin=`https://${bakk?'bakkirill':'carblueprints'}.narod.ru`;
 return {id,origin,start:origin+(bakk?'/Draw.html':'/'),defaultLimit:100000,allowedHost:h=>h===new URL(origin).hostname,
 parse:async page=>{
  const make=makeOf(page.url,bakk),all=anchors(page.body,page.url),pages=[],images=[];
  for(const link of all){let u=new URL(link.url);if(u.hostname!==new URL(origin).hostname||u.search)continue;u.protocol='https:';const p=u.pathname;
   if(IMAGE.test(p)){
    const title=link.title||model(u.href);
    if(/(?:thumb|banner|avatar|counter|logo|button|hotlog|spylog|rambler)/i.test(p))continue;
    const specific=actualMake(title,make);if(specific&&passenger(title+' '+model(u.href),specific))images.push({url:u.href,sourcePage:page.url,make:specific,model:model(u.href),title});
    continue;
   }
   if(!/\.html?$/i.test(p))continue;
   const name=p.split('/').at(-1).replace(/\.html?$/i,'');
   if(!bakk){if(/^(?:index|other_cars)$/i.test(name)||COMMERCIAL.test(name))continue;if(/^\/[a-z0-9_-]+\.htm$/i.test(p))pages.push(u.href);}
   else{
    if(/^Draw_(?:vaz|gaz|zaz|moskvich|uaz|zil|dr|inomarki(?:_[a-z0-9_-]+)?)$/i.test(name))pages.push(u.href);
    else if(/^(?:VAZ|GAZ|ZAZ|UAZ|AZLK|Moskvich)[-_]?\d/i.test(name)&&passenger(link.title+' '+name,make))pages.push(u.href);
   }
  }
  if(!bakk&&make){
   for(const m of page.body.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)){
    const u=new URL(m[1],page.url);if(u.hostname!==new URL(origin).hostname||!u.pathname.toLowerCase().startsWith('/images/'+make.replace(/-/g,'_')+'/')||!IMAGE.test(u.pathname)||u.search||/thumb|small|banner|logo/i.test(u.pathname))continue;
    const title=model(u.href),specific=actualMake(title,make);if(specific&&passenger(title,specific)){u.protocol='https:';images.push({url:u.href,sourcePage:page.url,make:specific,model:title,title});}
   }
  }
  // Some Bakkirill car detail pages embed their original without an enclosing link.
  if(bakk&&!/^Draw/i.test(new URL(page.url).pathname.split('/').at(-1))&&!images.length){
   for(const m of page.body.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)){
    const u=new URL(m[1],page.url);if(u.hostname!==new URL(origin).hostname||!IMAGE.test(u.pathname)||u.search)continue;
    if(!/(?:vaz|gaz|zaz|uaz|azlk|moskv|210\d|211\d)/i.test(u.pathname)||/thumb|small|banner|logo|counter/i.test(u.pathname))continue;
    u.protocol='https:';images.push({url:u.href,sourcePage:page.url,make,model:model(u.href),title:text(page.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||model(u.href))});
   }
  }
  return {pages:[...new Set(pages)],images:[...new Map(images.map(i=>[i.url,i])).values()]};
 }};
}
