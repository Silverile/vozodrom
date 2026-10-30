import {entry,passenger,Stop}from'./crawl_shared.mjs';import{nuxt}from'./nuxt_literal.mjs';
export const source={id:'findblueprints',origin:'https://findblueprints.com',start:'https://findblueprints.com/catalog/cars',defaultLimit:2500,maxLimit:2500,
 allowedHost:h=>h==='findblueprints.com'||h==='findblueprints-79346592784.s3.us-west-1.amazonaws.com',
 parse:async page=>{
  if(new URL(page.url).pathname==='/catalog/cars')return{pages:['https://findblueprints.com/sitemap.xml']};
  if(new URL(page.url).pathname==='/sitemap.xml'){
   const pages=[...page.body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m=>m[1].replace(/&amp;/g,'&')).filter(u=>{const p=new URL(u).pathname;return /^\/catalog\/cars\/[^/]+\/[^/]+$/.test(p)&&passenger(decodeURIComponent(p).replace(/\//g,' '));});
   return{pages};
  }
  const data=nuxt(page.body),m=data.state?.model?.model;
  if(!m||!m.name||!Array.isArray(m.files))throw new Stop('Unrecognized model metadata');
  if(m.typeUrl!=='cars'||!passenger(m.name,m.manufacturerUrl)||Number(m.price)!==0)return{images:[]};
  const images=m.files.filter(f=>/^image\/(png|jpeg|gif|webp|bmp)$/i.test(f.type)).filter(f=>passenger(f.name,m.manufacturerUrl)).map(f=>{
   if(!Number.isInteger(f.id)||f.id<1)throw new Stop('Invalid file ID');
   // Published public Download handler in /_nuxt/20d7ee419466308c2bc0.js.
   return{url:`https://findblueprints.com/api/files/${f.id}/download`,sourcePage:page.url,make:m.manufacturerUrl,model:m.friendly_url,title:m.name,originalName:f.name};
  });return{images};
 }};
// All discovery comes from the public sitemap and model state. No previews,
// guessed S3 keys, auth/admin API calls or price-bearing files are acquired.
entry(source,import.meta.url);
