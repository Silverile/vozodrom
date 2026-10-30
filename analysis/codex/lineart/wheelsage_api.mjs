// Minimal protobuf wire reader for the public, read-only WheelsAge Pictures API.
// Field numbers: https://github.com/autowp/autowp/blob/master/spec.proto
import {Stop} from './front_source_client.mjs';
const vari=n=>{let x=BigInt(n),a=[];do{a.push(Number(x&127n)|(x>127n?128:0));x>>=7n;}while(x);return Buffer.from(a);};
export const num=(field,n)=>Buffer.concat([vari(field*8),vari(n)]);
export const bytes=(field,b)=>{b=Buffer.isBuffer(b)?b:Buffer.from(b);return Buffer.concat([vari(field*8+2),vari(b.length),b]);};
export function decode(b){
 let p=0;const fields=new Map();
 const v=()=>{let n=0n,shift=0n;for(let i=0;i<10;i++){if(p>=b.length)throw new Stop('Truncated protobuf');const x=b[p++];n|=BigInt(x&127)<<shift;if(!(x&128))return Number(n);shift+=7n;}throw new Stop('Invalid varint');};
 while(p<b.length){const tag=v(),id=Math.floor(tag/8),wire=tag%8;let value;
  if(wire===0)value=v();else if(wire===2){const len=v();if(p+len>b.length)throw new Stop('Truncated field');value=b.subarray(p,p+len);p+=len;}
  else if(wire===1){value=b.subarray(p,p+8);p+=8;}else if(wire===5){value=b.subarray(p,p+4);p+=4;}else throw new Stop('Unsupported wire type');
  if(!fields.has(id))fields.set(id,[]);fields.get(id).push(value);
 }return fields;
}
const first=(fields,n)=>fields.get(n)?.[0];
const str=(fields,n)=>first(fields,n)?.toString('utf8')||'';
const image=b=>{if(!b)return null;const f=decode(b);return{url:str(f,2),width:first(f,3),height:first(f,4)};};
export function unframe(base64){
 const b=Buffer.from(base64,'base64'),messages=[];let p=0,trailers='';
 while(p<b.length){if(p+5>b.length)throw new Stop('Truncated gRPC frame');const flag=b[p],len=b.readUInt32BE(p+1);p+=5;if(p+len>b.length)throw new Stop('Truncated gRPC payload');const data=b.subarray(p,p+len);p+=len;if(flag&128)trailers+=data.toString();else if(flag===0)messages.push(data);else throw new Stop('Unsupported compressed gRPC frame');}
 if(!/grpc-status:\s*0\b/i.test(trailers))throw new Stop('gRPC failure '+trailers.trim());
 return messages;
}
export async function pictures(client,itemId,{limit=12,page=1,perspective=null}={}){
 const item=Buffer.concat([num(4,itemId),...(perspective===null?[]:[num(3,perspective)])]);
 const options=Buffer.concat([num(1,1),bytes(2,item)]);
 const fields=Buffer.concat([num(1,1),num(2,1),num(12,1),num(15,1),num(23,1)]);
 const message=Buffer.concat([bytes(1,options),num(2,limit),num(3,page),bytes(5,fields),bytes(6,'en'),num(7,17)]);
 const header=Buffer.alloc(5);header.writeUInt32BE(message.length,1);
 const body=Buffer.concat([header,message]).toString('base64');
 const r=await client.get('https://en.wheelsage.org/goautowp.Pictures/GetPictures',{method:'POST',headers:{'Content-Type':'application/grpc-web-text','Accept':'application/grpc-web-text','X-Grpc-Web':'1'},body});
 if(r.headers['grpc-status']&&r.headers['grpc-status']!=='0'){client.stopped=true;throw new Stop('gRPC status '+r.headers['grpc-status']+': '+r.headers['grpc-message']+'; no retry');}
 let frames;try{frames=unframe(r.data.toString('utf8'));}catch(e){throw new Stop(e.message+'; content-type='+r.headers['content-type']+'; grpc-status='+r.headers['grpc-status']+'; grpc-message='+r.headers['grpc-message']+'; bytes='+r.data.length);}
 const result=decode(frames[0]);
 return (result.get(1)||[]).map(b=>{const f=decode(b);return{id:first(f,1),identity:str(f,8),title:str(f,9),width:first(f,2),height:first(f,3),image:image(first(f,25))||image(first(f,4)),copyrights:str(f,29),specialName:str(f,37),sourceUrl:str(f,51),licenseCode:first(f,50)||0};});
}
