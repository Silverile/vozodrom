// Provisional B: local research only. Caption-selected drawings still require QA.
import {entry,text,passenger} from './crawl_shared.mjs';
const origin='https://modelist-konstruktor.com';
const examples=['vozvrashhenie-mini','mashina-dlya-nomenklatury'];
const attr=(tag,key)=>text(tag.match(new RegExp('\\s'+key+'=["\\\']([^"\\\']*)["\\\']','i'))?.[1]||'');
const DRAWING=/(?:геометрическ[а-я]*\s+схема\s+(?:легкового\s+)?автомобил|геометрическ[а-я]*\s+схема\s+пятидверного\s+автомобил|габаритн[а-я]*\s+черт[её]ж|черт[её]ж\s+автомобил|автомобил[^.]{0,90}габаритн[а-я]*\s+черт[её]ж)/i;
const BAD=/(?:двигател|шасси|подвеск|ходов[а-я]*\s+част|мотоцикл|автобус|грузов|трамва|троллейбус|трактор|броне|танк|разрез|сечени|компоновк|интерьер|салон|прибор|пикап|pick.?up|racing|formula)/i;
function makeOf(title){
 const names=[['mini',/\bmini\b/i],['gaz',/\bgaz\b|газ[-\sм]/i],['moskvich',/moskvich|москвич/i],['lada',/\blada\b|ваз[-\s]|лада/i],['zaz',/\bzaz\b|заз[-\s]|запорож/i],['uaz',/\buaz\b|уаз[-\s]/i],['zil',/\bzil\b|зил[-\s]/i],['zis',/\bzis\b|зис[-\s]/i],['peugeot',/peugeot|пежо/i],['mercedes-benz',/mercedes|мерседес/i],['bmw',/\bbmw\b|бмв/i],['volkswagen',/volkswagen|фольксваген/i],['renault',/renault|рено/i],['citroen',/citro[eë]n|ситроен/i],['fiat',/\bfiat\b|фиат/i],['ford',/\bford\b|форд/i],['opel',/\bopel\b|опель/i],['toyota',/toyota|тойота/i],['honda',/honda|хонда/i],['nissan',/nissan|ниссан/i],['skoda',/skoda|škoda|шкода/i],['tatra',/tatra|татра/i],['wartburg',/wartburg|вартбург/i],['audi',/\baudi\b|ауди/i],['porsche',/porsche|порше/i],['volvo',/volvo|вольво/i],['kia',/\bkia\b|киа/i],['hyundai',/hyundai|хёнд|хенд/i],['izh',/иж[-\s]/i],['saab',/\bsaab\b/i]];
 return names.find(([,re])=>re.test(title))?.[0]||'unknown';
}
export const source={id:'modelist-konstruktor',origin,start:origin+'/o_proekte',defaultLimit:1000,maxLimit:2500,allowedHost:h=>h==='modelist-konstruktor.com',
 parse:async page=>{
  const u=new URL(page.url),pages=[],images=[];
  if(u.pathname==='/o_proekte')return{pages:[...examples.map(x=>origin+'/avtosalon/'+x),origin+'/sitemap.xml'],images};
  if(/\.xml$/.test(u.pathname)){
   for(const m of page.body.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/loc>/g)){
    let x;try{x=new URL(text(m[1].replace(/^<!\[CDATA\[|\]\]>$/g,'')),origin);}catch{continue;}
    if(x.origin!==origin||x.search)continue;
    if(/^\/post-sitemap\d*\.xml$/.test(x.pathname)||/^\/avtosalon\/[^/]+\/?$/.test(x.pathname))pages.push(x.href);
   }
   return{pages:[...new Set(pages)],images};
  }
  if(!/^\/avtosalon\/[^/]+\/?$/.test(u.pathname))return{pages,images};
  const body=page.body.match(/<article\b[\s\S]*?<\/article>/i)?.[0]||'';
  for(const match of body.matchAll(/<img\b[^>]*>/gi)){
   const tag=match[0],title=attr(tag,'alt');
   if(!DRAWING.test(title)||BAD.test(title))continue;
   let image;try{image=new URL(attr(tag,'src'),page.url);}catch{continue;}
   if(image.origin!==origin||image.search||!/^\/(?:img\/|wp-content\/uploads\/)/.test(image.pathname)||! /\.(?:jpe?g|png|gif|webp)$/i.test(image.pathname)||/-\d+x\d+\.[a-z]+$/i.test(image.pathname))continue;
   const make=makeOf(title);if(!passenger(title,make))continue;
   images.push({url:image.href,sourcePage:page.url,make,model:title,title});
  }
  return{pages,images:[...new Map(images.map(i=>[i.url,i])).values()]};
 }};
entry(source,import.meta.url);
