import fs from 'node:fs';
import sharp from 'sharp';
import {Client,sha} from './front_source_client.mjs';
const root='analysis/codex/lineart/test-out/angle-research',urls=JSON.parse(fs.readFileSync(root+'/skoda-frames.txt')).src;
const indices=process.argv.slice(2).map(Number),chosen=indices.length?indices:Array.from({length:9},(_,i)=>i);
if(chosen.some(i=>!Number.isInteger(i)||i<0||i>=urls.length)||chosen.length>20)throw Error('Invalid published frame selection');
const c=new Client({hosts:[new URL(urls[0]).hostname],maxMinutes:2,maxRequests:22,maxResponseBytes:128e6}),files=[];
try{for(const i of chosen){
 const p=await c.get(urls[i]),local='cand/skoda--fabia--3/frame-'+String(i).padStart(2,'0')+'.jpg';fs.mkdirSync(root+'/cand/skoda--fabia--3',{recursive:true});const info=await sharp(p.data).resize({width:1600,withoutEnlargement:true}).jpeg({quality:92}).toFile(root+'/'+local);
 files.push({title:'Fabia IV visualizer frame '+i,url:p.url,local,source:'manufacturer-skoda-visualizer',sourcePage:'https://www.skoda-auto.cz/modely/fabia/fabia',frontTitled:false,frame:i,licence:'unknown/all-rights-reserved',width:info.width,height:info.height,sha256:sha(fs.readFileSync(root+'/'+local))});
}}finally{fs.writeFileSync(root+'/candidates.json',JSON.stringify([{id:'skoda--fabia--3',files}],null,2)+'\n');fs.writeFileSync('analysis/codex/lineart/frame-sample-report.json',JSON.stringify({requests:c.requests,files:files.length,policies:c.evidence},null,2)+'\n');}
const thumbs=await Promise.all(files.map(f=>sharp(root+'/'+f.local).resize(360,220,{fit:'contain',background:'#fff'}).toBuffer()));
if(thumbs.length)await sharp({create:{width:1080,height:Math.ceil(thumbs.length/3)*220,channels:3,background:'#fff'}}).composite(thumbs.map((input,i)=>({input,left:i%3*360,top:Math.floor(i/3)*220}))).png().toFile(root+'/frames-contact.png');
console.log(JSON.stringify({files:files.length,requests:c.requests}));
